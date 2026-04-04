---
title: "Kubernetes Gratuito na Nuvem: Um Guia para Devs que Não São de Infra"
date: "2026-03-27"
description: "Como montar um cluster Kubernetes gratuito na Oracle Cloud usando Terraform, e por que todo desenvolvedor deveria entender um pouco de infraestrutura"
featuredImage: feature.png
featured: true
---

## O Projeto Fênix e a Terceira Via

Em 2013, Gene Kim, Kevin Behr e George Spafford publicaram _O Projeto Fênix_[^1], um romance sobre TI que mudou a forma como muita gente enxerga a relação entre desenvolvimento e operações. No livro, acompanhamos Bill Palmer, um gerente de TI que herda um projeto caótico onde desenvolvedores jogam código por cima do muro para uma equipe de operações que mal consegue manter os sistemas de pé.

A lição central do livro é que **o trabalho de TI é trabalho de manufatura**. Assim como numa fábrica, gargalos invisíveis, falta de automação e silos entre equipes destroem a capacidade de entregar valor. A solução? Derrubar os muros. Fazer com que quem constrói o software entenda como ele roda, e quem opera entenda o que está sendo construído.

Essa é a essência do DevOps: não é um cargo, não é uma ferramenta, é uma **disciplina**. E como toda disciplina, ela deveria ser entendida por todos os envolvidos no processo — inclusive, e talvez principalmente, por quem escreve código.

Neste artigo, vou mostrar como montei um cluster Kubernetes gratuito na Oracle Cloud Infrastructure (OCI), usando Terraform para automatizar tudo. Mas o objetivo não é apenas o tutorial técnico. Quero usar esse projeto como pretexto para explicar conceitos de infraestrutura que todo desenvolvedor deveria conhecer: redes, IPs, subnets, arquiteturas de processador e containers.

Se você nunca configurou um servidor, nunca ouviu falar de CIDR e acha que "a nuvem" é problema de outra pessoa — este artigo é para você.

## O que é a Oracle Cloud Infrastructure (OCI)

Quando pensamos em nuvem, os nomes que vêm à cabeça são AWS, Azure e GCP. A Oracle Cloud Infrastructure (OCI) é menos conhecida entre desenvolvedores, mas tem uma vantagem difícil de ignorar: o **Always Free Tier**.

Enquanto a AWS oferece 1 vCPU e 1GB de RAM por 12 meses, a OCI oferece **4 CPUs ARM e 24GB de RAM para sempre**. Não é promoção. Não expira. É o suficiente para rodar um cluster Kubernetes real com sobra.

| Provedor | CPU Free | RAM Free | Duração |
|---|---|---|---|
| **OCI Always Free** | **4 ARM OCPUs** | **24 GB** | **Para sempre** |
| AWS Free Tier | 1 vCPU | 1 GB | 12 meses |
| GCP Free Tier | 0.25 vCPU | 1 GB | Para sempre |
| Azure Free | 1 vCPU | 1 GB | 12 meses |

A OCI é a plataforma de nuvem da Oracle. Assim como a AWS tem EC2 para máquinas virtuais, a OCI tem o **Compute**. Assim como a AWS tem VPC para redes, a OCI tem **VCN** (Virtual Cloud Network). Os conceitos são os mesmos, os nomes mudam.

## Antes da nuvem: conceitos que todo dev precisa conhecer

Antes de subir qualquer recurso, precisamos falar sobre coisas que normalmente ficam escondidas atrás de abstrações: redes, IPs e arquiteturas de processador.

### Arquitetura de processador: x86 vs ARM

Seu notebook provavelmente usa um processador x86 (Intel ou AMD). Se você tem um Mac com Apple Silicon, ele usa ARM. São duas arquiteturas de processador diferentes, e isso importa quando falamos de servidores e containers.

- **x86 (amd64)**: a arquitetura tradicional de PCs e servidores. Compatível com praticamente tudo.
- **ARM (aarch64)**: arquitetura usada em celulares, Raspberry Pi e, cada vez mais, em servidores. Consome menos energia e, no caso da OCI, é o que está disponível no free tier com mais recursos.

Na prática, isso significa que a imagem Docker que você builda no seu Mac Intel pode não rodar num servidor ARM. Quando formos fazer o deploy da nossa API, vamos precisar buildar a imagem para a arquitetura correta. Voltaremos a isso.

### Redes: o básico que ninguém te ensinou

Quando você acessa `google.com`, seu computador precisa saber o endereço IP do servidor do Google. Um IP é como um endereço postal: identifica uma máquina na rede.

Existem IPs **públicos** (acessíveis pela internet) e **privados** (acessíveis apenas dentro de uma rede local). Os ranges de IPs privados são definidos pela RFC 1918[^2]:

- `10.0.0.0` a `10.255.255.255` (10.0.0.0/8)
- `172.16.0.0` a `172.31.255.255` (172.16.0.0/12)
- `192.168.0.0` a `192.168.255.255` (192.168.0.0/16)

Se você já configurou um roteador Wi-Fi, provavelmente viu IPs como `192.168.1.x`. Esses são IPs privados. Ninguém na internet consegue acessá-los diretamente.

### CIDR: o que significa /16 e /24

A notação CIDR (Classless Inter-Domain Routing) define o tamanho de uma rede. O número depois da barra indica quantos bits do endereço são fixos:

- `10.0.0.0/16` → os primeiros 16 bits são fixos (`10.0`), sobrando 16 bits para endereços. Isso dá **65.536 IPs** possíveis (de `10.0.0.0` a `10.0.255.255`).
- `10.0.1.0/24` → os primeiros 24 bits são fixos (`10.0.1`), sobrando 8 bits. Isso dá **256 IPs** (de `10.0.1.0` a `10.0.1.255`).

Quanto menor o número depois da barra, maior a rede. `/16` é uma rede grande. `/24` é uma sub-rede dentro dela.

### Subnet: dividindo a rede

Uma **subnet** (sub-rede) é uma divisão lógica de uma rede maior. Pense assim: a VCN `10.0.0.0/16` é o bairro inteiro. A subnet `10.0.1.0/24` é uma rua dentro desse bairro.

Na nuvem, criamos subnets para organizar e isolar recursos. Nossos nodes Kubernetes vão ficar todos na mesma subnet, se comunicando por IPs privados (sem custo de tráfego) e acessíveis via SSH pelo IP público.

## A arquitetura do cluster

Com esses conceitos em mente, aqui está o que vamos construir:

```
┌──────────────────────────────────────────────────────────────┐
│                    OCI VCN (10.0.0.0/16)                     │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │              Subnet (10.0.1.0/24)                      │  │
│  │                                                        │  │
│  │  ┌────────────────┐ ┌──────────────┐ ┌──────────────┐ │  │
│  │  │ Control Plane  │ │ Worker ARM 0 │ │ Worker ARM 1 │ │  │
│  │  │ A1.Flex (ARM)  │ │ A1.Flex      │ │ A1.Flex      │ │  │
│  │  │ 1 OCPU / 6GB   │ │ 1.5 OCPU/9GB │ │ 1.5 OCPU/9GB│ │  │
│  │  │ Ubuntu 24.04   │ │ Ubuntu 24.04 │ │ Ubuntu 24.04 │ │  │
│  │  │ K3s server     │ │ K3s agent    │ │ K3s agent    │ │  │
│  │  └────────────────┘ └──────────────┘ └──────────────┘ │  │
│  │                                                        │  │
│  │  TOTAL: 4 OCPU + 24GB = limite Always Free ✅          │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  Security: SSH(22) + todo tráfego intra-subnet               │
│  Boot Volume: 3 × 50GB = 150GB (free até 200GB) ✅          │
└──────────────────────────────────────────────────────────────┘
```

Três nodes ARM, todos Ubuntu 24.04 LTS, rodando K3s (uma distribuição leve de Kubernetes). O control plane gerencia o cluster. Os workers executam as cargas de trabalho. Tudo dentro do free tier.

### Por que K3s e não Kubernetes "normal"?

O Kubernetes padrão (via `kubeadm`) consome 2-3GB de RAM só para o control plane. O K3s, criado pela Rancher, é uma distribuição certificada que roda com ~512MB. Num ambiente com recursos limitados, essa diferença é o que separa "funciona" de "não cabe".

## Infraestrutura como Código com Terraform

Aqui é onde o Projeto Fênix entra de novo. No livro, um dos problemas centrais é que ninguém sabe como os ambientes são configurados. Quando algo quebra, o conhecimento está na cabeça de uma pessoa. Quando essa pessoa sai, o conhecimento vai junto.

**Infraestrutura como Código (IaC)** resolve isso. Em vez de clicar em consoles web e configurar servidores manualmente, descrevemos tudo em arquivos de código. Esses arquivos são versionados no Git, revisados em pull requests e reproduzíveis por qualquer pessoa do time.

O Terraform é a ferramenta mais popular para IaC. Você descreve o estado desejado da infraestrutura em arquivos `.tf`, e o Terraform se encarrega de criar, atualizar ou destruir os recursos necessários.

O projeto completo está em [github.com/vagnerclementino/clementino-iac](https://github.com/vagnerclementino/clementino-iac), na pasta `infra/oci/k8s/`. Vou destacar as partes mais importantes.

### A rede (network.tf)

```hcl
# VCN — a rede virtual (equivalente a VPC na AWS)
resource "oci_core_vcn" "k3s_vcn" {
  cidr_block     = "10.0.0.0/16"    # 65k IPs disponíveis
  compartment_id = var.compartment_ocid
  display_name   = "k3s-vcn"
}

# Subnet — onde os nodes vão ficar
resource "oci_core_subnet" "k3s_subnet" {
  cidr_block     = "10.0.1.0/24"    # 254 IPs — mais que suficiente
  vcn_id         = oci_core_vcn.k3s_vcn.id
  display_name   = "k3s-subnet"
}
```

Lembra do `/16` e `/24`? Aqui estão eles na prática. A VCN é o bairro, a subnet é a rua.

### Os servidores (compute.tf)

```hcl
# Control Plane — 1 OCPU, 6GB RAM
resource "oci_core_instance" "k3s_control_plane" {
  shape = "VM.Standard.A1.Flex"   # ARM — Always Free
  shape_config {
    ocpus         = 1             # ⚠️ Conta no limite de 4 OCPUs
    memory_in_gbs = 6             # ⚠️ Conta no limite de 24GB
  }
  # ...
}

# Workers — 1.5 OCPU, 9GB RAM cada
resource "oci_core_instance" "k3s_worker_arm" {
  for_each = { for idx in range(2) : idx => idx }
  shape    = "VM.Standard.A1.Flex"
  shape_config {
    ocpus         = 1.5           # 2 × 1.5 = 3 OCPUs
    memory_in_gbs = 9             # 2 × 9 = 18GB
  }
  # ...
}
# TOTAL: 1 + 3 = 4 OCPUs | 6 + 18 = 24GB ✅
```

Cada propriedade com ⚠️ pode gerar custo se o total exceder o free tier. O Terraform do projeto inclui um output que calcula automaticamente se você está dentro do limite.

### Cloud-init: configuração automática

Quando uma máquina virtual é criada na nuvem, ela é apenas um Ubuntu vazio. O **cloud-init** é o mecanismo que executa comandos na primeira inicialização. No nosso caso, ele instala o K3s automaticamente:

```yaml
# control-plane-init.tftpl
#cloud-config
runcmd:
  - curl -sfL https://get.k3s.io | sh -
  - until sudo k3s kubectl get node | grep Ready; do sleep 5; done
  # Abre portas para comunicação entre nodes
  - iptables -I INPUT -p tcp --dport 6443 -j ACCEPT
```

Os workers copiam o token do control plane via SCP e se juntam ao cluster automaticamente. Zero intervenção manual.

## Deploy real: a API Holiday no cluster

Teoria é importante, mas vamos colocar algo real para rodar. O projeto [api-holiday](https://github.com/vagnerclementino/api-holiday) é uma API que retorna feriados. Vamos fazer o deploy dela no nosso cluster.

### Container Registry: onde guardar as imagens

Para fazer deploy no Kubernetes, precisamos de uma imagem Docker armazenada em um **container registry**. A OCI oferece o **Oracle Cloud Container Registry (OCIR)** gratuitamente no Always Free tier.

```bash
# Login no OCIR (substitua <region> e <namespace>)
docker login <region>.ocir.io -u '<namespace>/oracleidentitycloudservice/<email>'

# Build da imagem para ARM (importante!)
docker buildx build --platform linux/arm64 \
  -t <region>.ocir.io/<namespace>/api-holiday:latest .

# Push para o registry
docker push <region>.ocir.io/<namespace>/api-holiday:latest
```

O `--platform linux/arm64` é crucial. Lembra que nossos nodes são ARM? Se você buildar sem essa flag num Mac Intel ou PC, a imagem não vai rodar no cluster.

### O manifesto Kubernetes

```yaml
# api-holiday.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-holiday
spec:
  replicas: 2
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
        image: <region>.ocir.io/<namespace>/api-holiday:latest
        ports:
        - containerPort: 8080
        resources:
          requests:
            cpu: 50m
            memory: 64Mi
          limits:
            cpu: 200m
            memory: 128Mi
---
apiVersion: v1
kind: Service
metadata:
  name: api-holiday
spec:
  selector:
    app: api-holiday
  ports:
  - port: 80
    targetPort: 8080
  type: NodePort
```

```bash
# No control plane
kubectl apply -f api-holiday.yaml
kubectl get pods
# NAME                           READY   STATUS    RESTARTS   AGE
# api-holiday-6d9f7c8b4-abc12   1/1     Running   0          10s
# api-holiday-6d9f7c8b4-def34   1/1     Running   0          10s
```

Duas réplicas da API rodando no cluster. Gratuito.

## O que esse exercício ensina

Voltando ao Projeto Fênix: o problema nunca foi a tecnologia. O problema era o muro entre quem constrói e quem opera. Quando um desenvolvedor entende o que acontece depois do `git push` — como o código vira container, como o container roda num servidor, como o servidor se conecta à rede — as decisões de design melhoram.

Entender infraestrutura não significa virar DevOps. Significa ser um desenvolvedor mais completo. Significa saber por que aquele `Dockerfile` precisa de multi-stage build, por que a aplicação precisa de health checks, por que o limite de memória do container importa.

Como Gene Kim escreveu: _"qualquer melhoria feita depois do gargalo é uma ilusão"_[^1]. Se o gargalo é a falta de entendimento sobre onde e como o código roda, nenhuma melhoria no código vai resolver.

## O elefante no free tier: "Out of Host Capacity"

Se você seguiu até aqui e tentou criar as instâncias ARM, existe uma boa chance de ter encontrado este erro:

> **500-InternalError, Out of host capacity.**

Não é um bug. Não é um problema na sua configuração. É a realidade do free tier: as instâncias ARM Ampere A1 são extremamente populares e a capacidade é limitada. Quando não há máquinas físicas disponíveis na região, o OCI simplesmente recusa a criação.

Isso é frustrante, mas faz parte do jogo. Você está competindo com milhares de outros desenvolvedores pelo mesmo pool de recursos gratuitos. Algumas regiões são mais concorridas que outras — regiões menores como `sa-vinhedo-1` tendem a ter menos capacidade que `us-ashburn-1` ou `eu-frankfurt-1`.

### O que não funciona

- Reduzir os recursos (1 OCPU em vez de 4) — o erro é sobre disponibilidade de hosts, não de tamanho
- Trocar o Availability Domain — algumas regiões têm apenas 1 AD
- Tentar pelo Console em vez do Terraform — o erro é do lado da OCI, não da ferramenta

### O que funciona

A abordagem da comunidade é um script de retry que fica tentando até conseguir[^3]. A capacidade flutua — quando alguém deleta uma instância, a vaga abre. Pode levar minutos ou horas.

```bash
#!/bin/bash
# Retry até conseguir criar a instância
while true; do
  echo "$(date '+%H:%M:%S') - Tentando..."
  oci compute instance launch \
    --availability-domain "$AD" \
    --compartment-id "$COMPARTMENT" \
    --shape "VM.Standard.A1.Flex" \
    --subnet-id "$SUBNET" \
    --shape-config '{"ocpus": 1, "memoryInGBs": 6}' \
    --image-id "$IMAGE" \
    --ssh-authorized-keys-file ./key.pub 2>&1

  if [ $? -eq 0 ]; then
    echo "✅ Criado!"
    break
  fi
  echo "❌ Sem capacidade. Tentando em 30s..."
  sleep 30
done
```

Uma dica: rode esse script no **Cloud Shell da OCI** (disponível no Console). Ele já vem com o OCI CLI configurado, não depende da sua máquina local e não tem problemas de SSL ou autenticação.

### Verificando a capacidade antes de tentar

Você pode consultar a API de Capacity Report para saber se há disponibilidade antes de tentar criar:

```bash
oci compute compute-capacity-report create \
  --compartment-id "$COMPARTMENT" \
  --availability-domain "$AD" \
  --shape-availabilities '[{"instanceShape": "VM.Standard.A1.Flex", "instanceShapeConfig": {"ocpus": 1, "memoryInGBs": 6}}]'
```

O campo `availabilityStatus` retorna `AVAILABLE` ou `OUT_OF_HOST_CAPACITY`.

### A lição para desenvolvedores

Esse tipo de limitação é algo que você só descobre quando sai do `localhost`. No mundo real, infraestrutura tem restrições: capacidade, cotas, latência, custos. Entender essas restrições — mesmo que não seja seu trabalho resolvê-las — faz de você um desenvolvedor melhor. É a diferença entre projetar um sistema que "funciona na minha máquina" e um que funciona no mundo.

## Próximos passos

O cluster está rodando, a API está no ar. A partir daqui, as possibilidades são:

- Configurar **Traefik Ingress** para roteamento HTTP/HTTPS
- Adicionar **TLS com Let's Encrypt** via cert-manager
- Montar um stack de **monitoramento com Prometheus + Grafana**
- Configurar **CI/CD** para deploy automático a cada push

Tudo isso cabe nos 24GB de RAM do free tier. O código completo está em [github.com/vagnerclementino/clementino-iac](https://github.com/vagnerclementino/clementino-iac).

---

[^1]: Kim, G., Behr, K., & Spafford, G. (2013). *The Phoenix Project: A Novel about IT, DevOps, and Helping Your Business Win*. IT Revolution Press.
[^2]: RFC 1918 — Address Allocation for Private Internets. https://datatracker.ietf.org/doc/html/rfc1918
[^3]: Ehteshum, M. *Get Always Free VM Instance in Oracle Cloud and Solve "Out of Host Capacity" Issue*. https://medium.com/@me69oshan/get-always-free-vm-instance-in-oracle-cloud-and-solve-out-of-host-capacity-issue-the-easy-way-88babae4eae5
