---
title: "Construindo meu Jarvis: minhas impressões sobre o uso do OpenClaw"
date: "2026-02-22"
description: "Como transformei um notebook antigo no meu assistente pessoal usando Docker, Ubuntu e boas práticas de segurança"
featuredImage: feature.png
---

## Introdução: quando a ficção encontra a realidade

Todo fã de Homem de Ferro já quis um Jarvis.

Aquele assistente que entende comandos, antecipa necessidades, gerencia sua casa digital e ainda te avisa quando você está sendo idiota. Em 2026, isso deixou de ser exclusivo do Tony Stark.

O que eu construí não é um Jarvis completo.
Mas é um começo.

E o melhor: rodando num notebook antigo que eu ia descartar, com Ubuntu 24.04, Docker e muito cuidado com segurança.

Este artigo não é um tutorial de instalação.
É um relato honesto sobre o que funcionou, o que me assustou e como arquitetei tudo pra dormir tranquilo.

---

## O que é OpenClaw (sem misticismo)

OpenClaw é um framework de agente de IA auto-hospedado.

Pense nele como um "funcionário digital" que tem:

- **Mãos:** acesso a terminal e execução de comandos
- **Olhos:** capacidade de navegar na web e ler conteúdo
- **Julgamento:** loops de auto-correção e verificação de tarefas

Diferente de chatbots convencionais, OpenClaw não só responde.
Ele **faz**.

E isso é tanto incrível quanto aterrorizante.

### Breve história (porque nomes importam)

O projeto nasceu como **Clawdbot** em janeiro de 2026.
Recebeu uma notificação de marca registrada (soava como "Claude").
Virou **Moltbot** (referência a lagostas que trocam de casca).
Finalmente, estabilizou como **OpenClaw**.

Em menos de duas semanas, tornou-se um dos repositórios mais populares do GitHub.

O motivo? Resolveu o "Loop da Morte" que afligia agentes anteriores:
ficar preso em tarefas infinitas, gastando créditos de API sem entregar resultado.

---

## Por que Docker e não uma VM

Essa pergunta apareceu cedo.
E a resposta tem três camadas: isolamento, portabilidade e sanidade mental.

### Comparação direta

| Aspecto | Docker | VM Tradicional |
|---------|--------|----------------|
| **Isolamento** | Sandbox de processos e filesystem | Sistema operacional completo |
| **Overhead** | Mínimo (compartilha kernel) | Alto (SO convidado inteiro) |
| **Inicialização** | Segundos | Minutos |
| **Portabilidade** | Mesma imagem em qualquer lugar | Dependente de hypervisor |
| **Recursos** | MBs de RAM | GBs de RAM |
| **Destruição** | `docker rm -f` | Deletar VM inteira |

### O que isso significa na prática

Com Docker:

- O agente vive numa caixa isolada
- Se algo der errado, você deleta e recria em segundos
- Seu host permanece intocado
- Consome fração dos recursos

Com VM:

- Isolamento mais forte (nível de kernel separado)
- Overhead significativo num notebook antigo
- Mais complexo de gerenciar

Para meu caso de uso (notebook velho, recursos limitados), Docker foi a escolha óbvia.

---

## Meu setup: notebook antigo + Ubuntu 24.04

### Hardware

- Notebook de 2015 (aquele que ia pro descarte)
- 8GB RAM
- SSD 240GB
- Processador dual-core

### Por que não usar na máquina principal

Aqui vai o primeiro alerta sério:

> **Não rode OpenClaw na sua máquina pessoal de produção.**

Explico abaixo os riscos. Mas adianto: o custo de um VPS básico (R$ 25-50/mês) é barato demais comparado ao risco de expor seu computador principal.

### Sistema operacional

Ubuntu 24.04 LTS.

Escolhi por:

- Suporte de longo prazo (5 anos)
- Documentação abundante
- Familiaridade da equipe
- Pacotes atualizados mas estáveis

### Configuração de rede

**IP fixo na rede local:**

```bash
# /etc/netplan/01-netcfg.yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    eth0:
      addresses: [192.168.1.100/24]
      gateway4: 192.168.1.1
      nameservers:
        addresses: [8.8.8.8, 1.1.1.1]
```

Por que IP fixo?

- Docker precisa de consistência pra rede interna
- Facilita acesso via SSH tunnel
- Evita dor de cabeça com DNS dinâmico

### Systemd como supervisor

Criei um serviço systemd pra gerenciar o Docker Compose:

```ini
# /etc/systemd/system/openclaw.service
[Unit]
Description=OpenClaw (Docker Compose)
Requires=docker.service
After=docker.service network-online.target

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/home/vagner/openclaw
ExecStart=/usr/bin/docker compose up -d
ExecStop=/usr/bin/docker compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
```

Ativação:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now openclaw.service
```

---

## Arquitetura: como tudo se conecta

```
┌─────────────────────────────────────────────────────────────┐
│                    INTERNET                                 │
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │  Telegram   │    │  GitHub     │    │  Modelos    │     │
│  │    Bot      │    │  Repository │    │   (OAuth)   │     │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘     │
│         │                  │                  │             │
└─────────┼──────────────────┼──────────────────┼─────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────┐
│              HOST (Ubuntu 24.04)                            │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Docker Container                        │   │
│  │  ┌───────────────────────────────────────────────┐  │   │
│  │  │           OpenClaw Gateway                     │  │   │
│  │  │  - WebSocket (18789)                           │  │   │
│  │  │  - HTTP API (18790)                            │  │   │
│  │  │  - Agentic Loop                                │  │   │
│  │  └───────────────────────────────────────────────┘  │   │
│  │                                                      │   │
│  │  ┌───────────────────────────────────────────────┐  │   │
│  │  │              Volumes                           │  │   │
│  │  │  - ~/.openclaw (config, memória)              │  │   │
│  │  │  - ./workspace (arquivos do agente)           │  │   │
│  │  └───────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  SSH Tunnel (port forwarding)                               │
└─────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│                    SEU NOTEBOOK                             │
│                                                             │
│  Browser → http://127.0.0.1:18789 (via SSH tunnel)         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Fluxo de dados

1. **Telegram** → Webhook → OpenClaw Gateway
2. **Gateway** processa → executa ações → responde
3. **GitHub** → backup de memória e SOPs
4. **Modelos** → Qwen/Codex via OAuth
5. **Dashboard** → acesso via SSH tunnel (seguro)

---

## Isolamento: container vs. host

Essa é a parte mais importante.

### O que o container VÊ

```
/home/node/.openclaw/
  ├── openclaw.json (config)
  ├── workspace/ (arquivos do agente)
  └── memory/ (memória de longo prazo)
```

### O que o container NÃO VÊ

```
/home/vagner/
  ├── Documentos/
  ├── .ssh/
  ├── Downloads/
  └── qualquer outra coisa no host
```

### Por que isso importa

Se o agente:

- Baixar um pacote malicioso → fica preso no container
- Tentar acessar suas chaves SSH → não encontra
- Ser comprometido → você deleta o container e recria

O isolamento não é perfeito (container escape existe, mas é raro).
É perfeito o suficiente pra dormir tranquilo.

---

## Riscos de rodar em máquina pessoal (leia isso)

Vou ser direto:

> **Rodar OpenClaw no seu computador pessoal é como dar as chaves da sua casa pra um estagiário muito inteligente mas sem supervisão.**

### Riscos reais

**1. Exposição de dados pessoais**

O agente tem acesso ao filesystem do container.
Se você montar volumes errados, ele vê tudo.

```yaml
# ERRADO (não faça isso)
volumes:
  - /home/vagner:/home/node  # 😱 acesso total

# CERTO
volumes:
  - ./workspace:/home/node/.openclaw/workspace
  - ~/.openclaw:/home/node/.openclaw
```

**2. Token de API vazado**

Se o agente for comprometido, tokens salvos podem ser exfiltrados.

Mitigação:

- Use OAuth sempre que possível
- Tokens com escopo mínimo
- Rotação periódica

**3. Acesso indevido via rede**

Se você expor a porta 18789 sem autenticação:

```bash
# NUNCA faça isso em produção
ports:
  - "18789:18789"  # exposto pra internet
```

Use:

- SSH tunnel
- Tailscale
- Firewall restritivo

**4. Container escape (raro, mas possível)**

Vulnerabilidades no Docker podem permitir escape pro host.

Mitigação:

- Mantenha Docker atualizado
- Não rode como root
- Use security profiles (AppArmor, seccomp)

**5. Backups e persistência**

Se o container morre e você não tem backup:

- Memória do agente → perdida
- Configurações → perdidas
- SOPs → perdidas

Mitigação:

- GitHub como backup (Digital Immortality Protocol)
- Snapshots periódicos

**6. Atualizações de segurança**

Agente desatualizado = vulnerável.

Mitigação:

- Cron jobs pra atualizar
- Monitoramento de versão

---

## VPS vs. Local: a decisão que eu tomei

### Minha arquitetura atual

```
┌─────────────────┐
│  VPS (Hetzner)  │  ← OpenClaw rodando aqui
│  €5/mês         │
│  - Isolado      │
│  - Descartável  │
│  - Sempre on    │
└────────┬────────┘
         │
         │ SSH Tunnel / Tailscale
         │
┌────────┴────────┐
│  Meu Notebook   │  ← Apenas acesso via browser
│  (Ubuntu)       │
└─────────────────┘
```

### Por que migrei pra VPS

| Critério | Local (notebook) | VPS |
|----------|------------------|-----|
| **Segurança** | Risco alto | Isolado |
| **Disponibilidade** | Só quando ligado | 24/7 |
| **Recursos** | Limitados | Dedicados |
| **Ruído/Calor** | No seu espaço | Datacenter |
| **Custo** | "Grátis" | €5-10/mês |
| **Paz mental** | Baixa | Alta |

### Quando faz sentido rodar local

- Aprendizado e testes
- Rede isolada (sem internet)
- Hardware dedicado (não sua máquina principal)
- Você entende os riscos e aceita

### Quando NÃO faz sentido

- Máquina de produção
- Dados sensíveis no host
- Família compartilha o mesmo computador
- Você quer dormir tranquilo

---

## As 4 diretrizes que segui (e você deveria também)

Baseado no excelente artigo de Shane Collins[^1], implementei:

### 1. Digital Immortality Protocol

O agente tem um repositório GitHub como memória de longo prazo.

Todo dia às 23:00:

- `MEMORY.md` → commit no GitHub
- `memory/YYYY-MM-DD.md` → backup diário
- `SOPs` → versionadas

Se o servidor morrer, o cérebro do agente está salvo.

### 2. Daily Stand-Up (Lesson Learnt)

Todo dia, o agente responde:

- O que funcionou hoje?
- O que falhou?
- O que aprendi?
- O que mudar amanhã?

Isso vira um ativo composto.
O agente fica mais inteligente com o tempo, não porque o modelo melhorou, mas porque a experiência cresceu.

### 3. Heartbeat (check-in a cada 30-60 min)

O agente reporta:

```
Current Status: Executing Step 3 of 5.
Confidence Level: 85%.
Blockers: None.
Drift Check: same step for 1 cycle(s).
```

Se ficar travado no mesmo passo por 2+ ciclos → auto-corrige.

### 4. Burner Identity

O agente tem identidade própria:

- Email dedicado
- Conta GitHub separada
- Tokens específicos

Não misture sua identidade digital com a do agente.

---

## Lições aprendidas (até agora)

### O que funcionou

- Docker foi a escolha certa
- VPS tirou o peso das costas
- Heartbeat evitou drift em tarefas longas
- GitHub backup já salvou uma vez (deploy ruim)

### O que me assustou

- Primeiro pairing required no dashboard (resolvido com `devices approve`)
- Cron job que não rodava (era PATH errado)
- Token do Telegram que expirou (renovação automática agora)

### O que ainda estou ajustando

- Refinar quando o heartbeat envia mensagem (só com tarefa ativa)
- Melhorar logs de erro
- Automatizar atualizações de segurança

---

## Conclusão: o futuro é auto-hospedado (com responsabilidade)

Ter um "Jarvis" pessoal não é mais ficção.

Mas vem com responsabilidade.

OpenClaw é poderoso.
E poder sem arquitetura é acidente esperando pra acontecer.

Minha recomendação:

1. **Use Docker** (isolamento é seu amigo)
2. **Prefira VPS** (R$ 30/mês valem sua paz mental)
3. **Siga as 4 diretrizes** (memória, aprendizado, heartbeat, identidade)
4. **Nunca dê acesso total** (princípio do menor privilégio)
5. **Monitore** (heartbeat e logs salvam vidas)

O agente que eu construí não é perfeito.
Mas é útil.
E fica mais inteligente todo dia.

E o melhor: eu durmo tranquilo.

---

[^1]: [Stop Watching OpenClaw Install Tutorials — Shane Collins](https://medium.com/activated-thinker/stop-watching-openclaw-install-tutorials-this-is-how-you-actually-tame-it-f3416f5d80bc)
[^2]: [Run OpenClaw Safely with Docker — Bill WANG](https://towardsdev.com/run-openclaw-moltbot-clawdbot-safely-with-docker-a-practical-guide-for-beginners-94112a9b57be)
[^3]: [OpenClaw Documentation](https://docs.openclaw.ai)
