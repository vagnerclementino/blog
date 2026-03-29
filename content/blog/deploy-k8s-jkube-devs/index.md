---
title: "Deploy no Kubernetes para quem escreve código, não YAML"
date: "2026-03-29"
description: "Pods, Services, Ingress e as formas de fazer deploy no K8s — do YAML manual ao JKube — explicados para desenvolvedores"
featuredImage: feature.png
featured: true
---

## O elefante na sala

Existe um momento na carreira de todo desenvolvedor em que alguém diz: _"agora você precisa fazer deploy no Kubernetes"_. E de repente, aquele profissional que domina Spring Boot, sabe escrever testes, entende de design patterns e lê código como quem lê prosa, se vê diante de um arquivo YAML de 80 linhas que parece ter sido escrito por uma civilização alienígena.

Não deveria ser assim.

O Kubernetes não é um mistério reservado a engenheiros de plataforma. É uma ferramenta. E como toda ferramenta, ela faz mais sentido quando você entende o problema que ela resolve. Neste artigo, vou explicar os conceitos fundamentais do Kubernetes — Pod, Service, Deployment, Ingress — usando uma API REST real como exemplo. Depois, vou mostrar as diferentes formas de fazer deploy, do YAML manual até o Eclipse JKube, que permite fazer tudo sem sair do Maven.

O projeto de exemplo é o [api-holiday](https://github.com/vagnerclementino/api-holiday), uma API de feriados escrita em Spring Boot 3 com Java 25, rodando em um cluster K3s no meu homelab.

## O que o Kubernetes resolve

Antes do Kubernetes, fazer deploy de uma aplicação significava: copiar um JAR para um servidor, configurar o Java, rodar `java -jar`, torcer para não dar conflito de porta e rezar para o processo não morrer de madrugada.

O Kubernetes automatiza isso. Ele garante que:

- Sua aplicação está **sempre rodando** (se o processo morre, ele reinicia)
- Você pode ter **múltiplas réplicas** sem configuração manual
- O **tráfego é distribuído** entre as réplicas
- Atualizações acontecem **sem downtime** (rolling update)
- A configuração é **declarativa** — você descreve o estado desejado e o K8s se encarrega

Mas para usar isso, você precisa falar a língua dele. E a língua do Kubernetes são os **recursos**.

## Os 4 recursos que todo dev precisa conhecer

### Pod: a menor unidade

Um Pod é um ou mais containers rodando juntos. Na prática, para uma API REST, um Pod = um container = uma instância da sua aplicação.

```yaml
# Você raramente cria Pods diretamente.
# O Deployment faz isso por você.
apiVersion: v1
kind: Pod
metadata:
  name: api-holiday
spec:
  containers:
  - name: api-holiday
    image: vagnerclementino/api-holiday:latest
    ports:
    - containerPort: 8080
```

Pense no Pod como um processo rodando no servidor. Ele tem um IP interno, pode acessar a rede do cluster, e morre se o container falhar. Sozinho, ele não tem resiliência.

### Deployment: quem gerencia os Pods

O Deployment é o recurso que você realmente usa. Ele define quantas réplicas do Pod devem existir e garante que esse número seja mantido. Se um Pod morre, o Deployment cria outro.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-holiday
spec:
  replicas: 1
  selector:
    matchLabels:
      app: api-holiday
  template:
    metadata:
      labels:
        app: api-holiday
    spec:
      containers:
      - name: api-holiday
        image: vagnerclementino/api-holiday:e51785b
        ports:
        - containerPort: 8080
        env:
        - name: SPRING_PROFILES_ACTIVE
          value: homelab
        - name: MONGODB_DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: holiday-api-secrets
              key: MONGODB_DATABASE_URL
        resources:
          requests:
            memory: "256Mi"
            cpu: "100m"
          limits:
            memory: "384Mi"
            cpu: "500m"
```

Alguns pontos importantes:

- `replicas: 1` — quantas instâncias da API rodam simultaneamente
- `labels` — etiquetas que conectam o Deployment ao Service (veremos a seguir)
- `env` — variáveis de ambiente. O `MONGODB_DATABASE_URL` vem de um **Secret** do Kubernetes, não do código
- `resources` — limites de CPU e memória. Sem isso, um Pod pode consumir todos os recursos do node
- A tag da imagem é um **hash do git** (`e51785b`), não `latest`. Isso garante que cada deploy use uma imagem específica

### Service: como acessar os Pods

Pods têm IPs internos que mudam toda vez que são recriados. O Service resolve isso: ele cria um endereço fixo (DNS interno) que roteia tráfego para os Pods corretos usando os `labels`.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: api-holiday
spec:
  type: NodePort
  selector:
    app: api-holiday    # Conecta com os Pods que têm esse label
  ports:
  - port: 8080          # Porta do Service dentro do cluster
    targetPort: 8080    # Porta do container
    nodePort: 30080     # Porta exposta no IP do node
```

Tipos de Service:

- **ClusterIP** (padrão) — acessível apenas dentro do cluster. Outros Pods acessam via `api-holiday:8080`
- **NodePort** — expõe uma porta no IP do node (ex: `clementino:30080`). Simples, bom para homelab
- **LoadBalancer** — cria um load balancer externo (na nuvem). Custo adicional

No nosso caso, usamos NodePort porque o cluster é local. Um nginx na frente faz o proxy reverso de `clementino/holiday/` para a porta 30080.

### Ingress: roteamento HTTP

O Ingress é a camada de roteamento HTTP. Em vez de expor cada Service em uma porta diferente, o Ingress roteia por path ou hostname:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: api-holiday
spec:
  rules:
  - host: clementino
    http:
      paths:
      - path: /holiday
        pathType: Prefix
        backend:
          service:
            name: api-holiday
            port:
              number: 8080
```

O K3s já vem com o Traefik como Ingress Controller. No nosso homelab, optamos por usar nginx + NodePort por simplicidade, mas o Ingress é a abordagem recomendada para múltiplos serviços.

### Secret: variáveis sensíveis

Credenciais de banco, tokens de API e outras informações sensíveis não devem estar no código nem nas variáveis de ambiente do Deployment. O Kubernetes tem o recurso **Secret** para isso:

```bash
# Criar o secret via CLI (não versionar o valor!)
kubectl create secret generic holiday-api-secrets \
  --from-literal=MONGODB_DATABASE_URL='mongodb://user:pass@host:27017/db'
```

O Deployment referencia o Secret pelo nome, e o Kubernetes injeta o valor como variável de ambiente no container. O valor nunca aparece no manifesto YAML.

## As formas de fazer deploy

Agora que você entende os recursos, a pergunta é: como criar e aplicar esses YAMLs? Existem 4 abordagens principais, cada uma com trade-offs diferentes.

### 1. YAML manual + kubectl apply

A forma mais direta. Você escreve os arquivos YAML e aplica com `kubectl`:

```bash
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
```

**Prós**: controle total, sem dependências extras
**Contras**: verboso, repetitivo, sem histórico de releases, fácil errar

### 2. Helm Charts

Helm é o "gerenciador de pacotes" do Kubernetes. Um chart é um template de manifesto com variáveis:

```bash
helm install api-holiday ./chart --set image.tag=e51785b
```

**Prós**: `helm history`, `helm rollback`, templates reutilizáveis
**Contras**: curva de aprendizado, precisa manter o chart, complexidade adicional para apps simples

### 3. Helmfile

Helmfile é uma camada acima do Helm. Permite declarar múltiplos charts em um arquivo:

```yaml
releases:
  - name: mongodb
    chart: bitnami/mongodb
  - name: api-holiday
    chart: ./chart
```

**Prós**: gerencia múltiplos serviços, bom para ambientes completos
**Contras**: mais uma ferramenta para aprender, overhead para projetos simples

### 4. Eclipse JKube — a abordagem para desenvolvedores

O JKube é um plugin Maven/Gradle que gera manifestos Kubernetes automaticamente a partir do seu projeto Spring Boot. Ele detecta portas, health checks e cria Deployment + Service sem você escrever YAML.

```xml
<!-- pom.xml -->
<plugin>
    <groupId>org.eclipse.jkube</groupId>
    <artifactId>kubernetes-maven-plugin</artifactId>
    <version>1.18.1</version>
</plugin>
```

```bash
# Gerar manifestos
mvn k8s:resource -Pk8s

# Aplicar no cluster
kubectl apply -f target/classes/META-INF/jkube/kubernetes.yml
```

**Prós**: zero YAML para começar, integrado ao build, detecta Spring Boot Actuator automaticamente
**Contras**: menos flexível que Helm para cenários complexos

O JKube é a abordagem que usamos no api-holiday. Ele gera os manifestos e o `kubectl` aplica. O melhor dos dois mundos: automação na geração, controle na aplicação.

## JKube na prática: o api-holiday

### Configuração mínima no pom.xml

```xml
<profile>
    <id>k8s</id>
    <build>
        <plugins>
            <plugin>
                <groupId>org.eclipse.jkube</groupId>
                <artifactId>kubernetes-maven-plugin</artifactId>
                <version>${jkube.version}</version>
                <configuration>
                    <namespace>${env.K8S_NAMESPACE}</namespace>
                    <resources>
                        <controller>
                            <env>
                                <SPRING_PROFILES_ACTIVE>
                                    ${env.ACTIVE_PROFILE}
                                </SPRING_PROFILES_ACTIVE>
                            </env>
                        </controller>
                    </resources>
                    <images>
                        <image>
                            <name>
                                docker.io/${env.DOCKER_REGISTRY}/${env.APP_NAME}:${env.IMAGE_TAG}
                            </name>
                        </image>
                    </images>
                </configuration>
            </plugin>
        </plugins>
    </build>
</profile>
```

Tudo vem de variáveis de ambiente. O mesmo `pom.xml` funciona no homelab e na pipeline de produção.

### Resource Fragments: customizando sem reescrever

O JKube gera um Deployment básico, mas você pode customizar com _resource fragments_ — arquivos YAML parciais em `src/main/jkube/`:

```yaml
# src/main/jkube/deployment.yml
spec:
  template:
    spec:
      containers:
        - imagePullPolicy: Always
          env:
            - name: MONGODB_DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: holiday-api-secrets
                  key: MONGODB_DATABASE_URL
          resources:
            requests:
              memory: "256Mi"
              cpu: "100m"
            limits:
              memory: "384Mi"
              cpu: "500m"
```

O JKube faz merge desse fragmento com o manifesto gerado. Você só escreve o que é diferente do padrão.

### O Makefile: um comando para tudo

```makefile
k8s-deploy: push-image k8s-apply
	@echo "✅ Deploy complete!"
	@kubectl --context=$(K8S_CONTEXT) -n $(K8S_NAMESPACE) get pods
```

O fluxo completo com `make k8s-deploy`:

1. `build-artifact` — compila o JAR com Maven
2. `build-image` — builda a imagem Docker com tag do git SHA
3. `push-image` — envia para o Docker Hub
4. `k8s-resource` — JKube gera os manifestos
5. `k8s-apply` — kubectl aplica no cluster

Um comando. Do código ao deploy.

## O que muda na sua cabeça

Depois de entender Pod, Service, Deployment e Secret, o Kubernetes deixa de ser um bicho de sete cabeças. São 4 conceitos. O resto é variação.

E com o JKube, a distância entre `git commit` e `kubectl get pods` é um `make k8s-deploy`. Você não precisa virar especialista em Kubernetes para fazer deploy. Precisa entender o suficiente para tomar boas decisões — e isso é o que separa um desenvolvedor que "joga código por cima do muro" de um que entende o ciclo completo.

Como diria Gene Kim no Projeto Fênix: o trabalho não termina quando o código compila. Termina quando o cliente usa.

---

O código completo está em [github.com/vagnerclementino/api-holiday](https://github.com/vagnerclementino/api-holiday), branch `feature/k3s-homelab`.
