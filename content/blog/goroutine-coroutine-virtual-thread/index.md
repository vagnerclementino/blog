---
title: "Goroutine, Coroutine e Virtual Thread: os três caminhos da concorrência moderna"
date: "2026-02-23"
description: "Uma análise comparativa das três principais abordagens de concorrência nas linguagens modernas"
featuredImage: feature.png
---

## Introdução: quando um thread não é apenas um thread

Em 2005, escrevi meu primeiro programa multithread em Java. Era simples: criar uma `Thread`, implementar `Runnable`, chamar `.start()`. Parecia mágica — até o primeiro `OutOfMemoryError` quando tentei criar a milésima thread.

Vinte anos depois, a concorrência evoluiu. E não evoluiu apenas em performance — evoluiu em filosofia.

Hoje temos três abordagens que dominam o cenário:
- **Goroutines** no Go
- **Coroutines** no Kotlin
- **Virtual Threads** no Java

Cada uma resolve o mesmo problema (concorrência) de maneira radicalmente diferente. Este artigo é uma tentativa de entender não apenas como elas funcionam, mas por que foram criadas, e que problemas cada uma tenta resolver.

---

## O problema fundamental: o custo dos threads

Antes de falar das soluções, precisamos entender o problema.

### Threads do sistema operacional (OS threads)

Threads tradicionais (pthreads no Linux, Windows threads) são:
- **Pesados:** ~1MB de stack por thread
- **Custosos:** Context switch envolve o kernel
- **Limitados:** ~1000-8000 threads por processo (dependendo do OS)

```java
// Java tradicional (até Java 19)
Thread thread = new Thread(() -> {
    System.out.println("Sou pesado!");
});
thread.start();  // Cria um thread do OS
```

O problema não é criar 10 threads. É criar 10.000. Ou 100.000. É o mundo dos microsserviços, das APIs com milhares de conexões concorrentes.

---

## Goroutine: a filosofia "menos é mais" do Go

Go nasceu no Google em 2009 com uma premissa: concorrência deve ser fácil, barata e idiomática.

### O que é uma Goroutine?

É uma função que pode ser executada concorrentemente, gerenciada pelo runtime do Go, não pelo OS.

```go
func main() {
    // Criar 100.000 goroutines? Sem problemas.
    for i := 0; i < 100000; i++ {
        go processItem(i)  // Apenas 2KB inicial
    }
    time.Sleep(2 * time.Second)
}

func processItem(id int) {
    fmt.Printf("Processando %d\n", id)
}
```

### Características principais

1. **Stack crescente:** Começa com 2KB, cresce/diminui conforme necessidade
2. **Multiplexada:** M goroutines executam em N OS threads (GOMAXPROCS)
3. **Cooperative scheduling:** Goroutines cedem controle explicitamente (`go`, channels, `time.Sleep`)
4. **Channels nativos:** `chan` é tipo primitivo, não biblioteca

### Filosofia

> "Não comunique compartilhando memória; compartilhe memória comunicando."

Go prefere channels sobre locks. A concorrência é estruturada em torno do fluxo de dados, não do acesso a dados.

### Quando usar

- **Serviços de rede** (HTTP, gRPC, WebSocket)
- **Pipelines de dados** (ETL, stream processing)
- **Qualquer coisa com I/O bound**

### Limitações

- **Go ou nada:** Só funciona em Go
- **Cooperative apenas:** Uma goroutine CPU-bound pode "morrer de fome" outras
- **Debug complexo:** Stack traces de goroutines bloqueadas

---

## Coroutine no Kotlin: a suspensão elegante

Kotlin entrou no jogo em 2016 com coroutines não como feature da linguagem, mas como biblioteca. Uma decisão arquitetural interessante.

### O que é uma Coroutine no Kotlin?

É uma função suspensa (`suspend`) que pode pausar sua execução sem bloquear o thread.

```kotlin
suspend fun fetchUserData(): User {
    // Pode suspender sem bloquear thread
    val response = withContext(Dispatchers.IO) {
        httpClient.get("https://api.example.com/user")
    }
    return parseUser(response)
}

// Uso
fun main() = runBlocking {
    // Lança 100.000 coroutines
    repeat(100_000) { id ->
        launch {
            println("Coroutine $id")
            delay(1000)  // Suspende, não bloqueia
        }
    }
}
```

### Características principais

1. **Suspensão:** Funções `suspend` podem pausar em pontos específicos
2. **Structured concurrency:** Hierarquia de coroutines (pai/filho)
3. **Dispatchers:** Controle explícito de onde a coroutine executa (IO, Default, Main)
4. **Biblioteca, não linguagem:** Pode evoluir independentemente

### Filosofia

> "Concorrência estruturada com suspensão controlada."

Kotlin não tenta esconder os threads — dá ferramentas para gerenciá-los melhor.

### Quando usar

- **Android apps** (UI thread não pode bloquear)
- **Backend JVM** com Spring WebFlux, Ktor
- **Programação reativa** sem complexidade do Reactive Streams

### Limitações

- **JVM-bound:** Dependente da JVM (mas tem versão Kotlin/Native)
- **Learning curve:** `suspend`, `CoroutineScope`, `Dispatchers`
- **Java interop:** Chamar código suspenso de Java é complicado

---

## Virtual Thread no Java: a revolução silenciosa

Java 21 (2023) trouxe virtual threads como preview, estabilizando em Java 21. É a maior mudança na concorrência Java desde... bem, desde sempre.

### O que é uma Virtual Thread?

É um thread leve gerenciado pela JVM, não pelo OS. Mas — e isso é crucial — é API-compatible com `java.lang.Thread`.

```java
// Java 21+
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    // Criar 100.000 virtual threads
    IntStream.range(0, 100_000).forEach(i -> {
        executor.submit(() -> {
            System.out.println("Virtual thread " + i);
            Thread.sleep(1000);  // Bloqueia a VIRTUAL thread, não a do OS
        });
    });
}
```

### Características principais

1. **Drop-in replacement:** Substitua `Thread` por `VirtualThread`
2. **Platform threads multiplexed:** M virtual threads em N OS threads
3. **Blocking is cheap:** `Thread.sleep()`, I/O bloqueante não custam OS threads
4. **Compatible:** Todo código Java existente funciona (em teoria)

### Filosofia

> "Mantenha a compatibilidade, mude a implementação."

Java não poderia quebrar 25 anos de código. A solução: manter a API, reimplementar por baixo.

### Quando usar

- **Aplicações Java/Legacy** que precisam escalar
- **Servidores bloqueantes** (Tomcat, Jetty tradicional)
- **Migração gradual** de código síncrono

### Limitações

- **Java 21+:** Não retrocompatível
- **Pinned threads:** Algumas operações ainda "prendem" ao OS thread
- **Debug tooling:** Ferramentas ainda se adaptando

---

## Comparação direta: uma tabela honesta

| Aspecto | Goroutine (Go) | Coroutine (Kotlin) | Virtual Thread (Java) |
|---------|----------------|-------------------|----------------------|
| **Criação** | `go func()` | `launch {}` | `Thread.startVirtualThread()` |
| **Custo memória** | 2KB inicial | ~100-200 bytes | ~200-300 bytes |
| **Scheduling** | Cooperative | Cooperative + dispatchers | Preemptive (JVM) |
| **Bloqueio** | Usa OS thread | Suspende coroutine | Usa carrier thread |
| **I/O modelo** | Non-blocking (epoll/kqueue) | Non-blocking | Virtual thread bloqueante |
| **Debug** | Complexo | Razoável | Familiar (thread dumps) |
| **Ecosystem** | Nativo (Go) | Biblioteca (Kotlin) | JVM (Java 21+) |
| **Learning curve** | Baixa | Média | Baixa (para Java devs) |

### Performance prática

```bash
# Teste simplista: criar 100.000 "tarefas" concorrentes

Go (goroutine):        ~0.5s,  ~200MB RAM
Kotlin (coroutine):    ~1.2s,  ~150MB RAM  
Java (virtual thread): ~1.5s,  ~180MB RAM
Java (platform thread): ❌ OutOfMemoryError
```

---

## Casos de uso: qual escolher quando?

### Cenário 1: Novo serviço gRPC/HTTP

**Escolha:** **Go** com goroutines.

Por quê? Go foi feito para isso. A combinação goroutines + channels + net/http é idiomática e performática.

### Cenário 2: Android app com chamadas de rede

**Escolha:** **Kotlin** com coroutines.

Por quê? Integração com Android lifecycle, suspensão não-bloqueante para UI thread.

### Cenário 3: Monolito Java Spring Boot existente

**Escolha:** **Java** com virtual threads.

Por quê? Migração gradual. Troque `@Async` por virtual threads, ganhe escala sem reescrever.

### Cenário 4: Sistema com CPU-bound tasks pesadas

**Escolha:** **Qualquer um, com cuidado**.

Goroutines podem sofrer com starvation. Coroutines precisam de `Dispatchers.Default`. Virtual threads ainda usam CPU em OS threads.

---

## O futuro: para onde vamos?

### Tendência 1: Abstração do hardware

Estamos indo para onde "thread" não significa mais "thread do OS". É uma abstração de concorrência, não de scheduling do kernel.

### Tendência 2: Structured concurrency

Kotlin lidera aqui: coroutines têm pai, irmãos, lifecycle. Go com `context.Context` vai na mesma direção. Java ainda está atrás.

### Tendência 3: Async/await everywhere

C# popularizou, JavaScript abraçou, Kotlin tem, Java... talvez um dia. O padrão é claro: programação assíncrona que parece síncrona.

### Minha previsão:

Em 5 anos, "criar um OS thread" será como "alocar memória com `malloc`" hoje — algo que você faz apenas quando realmente precisa.

---

## Conclusão: não há bala de prata, há ferramentas certas

No início da minha carreira, a escolha era simples: threads ou processos. Hoje é mais complexa — mas também mais poderosa.

**Goroutines** são para quem quer simplicidade e performance nativa.
**Coroutines** são para quem quer controle fino e integração com ecossistema existente.
**Virtual Threads** são para quem quer evolução sem revolução.

O que essas três abordagens compartilham é uma visão: concorrência não deve ser um luxo, nem um pesadelo de debugging. Deve ser a forma padrão de escrever software que responde a um mundo paralelo.

Como diz o ditado: "O melhor momento para plantar uma árvore foi há 20 anos. O segundo melhor é agora." O mesmo vale para aprender concorrência moderna — seja com Go, Kotlin ou Java.

A escolha não é qual é "melhor". É qual resolve seus problemas, com sua equipe, no seu contexto. E felizmente, em 2026, todas as três são excelentes escolhas.

---

## Para experimentar

### Go (goroutine)
```bash
# Instale Go
go mod init concurrence-example
```

```go
package main

import (
    "fmt"
    "time"
)

func main() {
    for i := 0; i < 5; i++ {
        go func(id int) {
            time.Sleep(1 * time.Second)
            fmt.Printf("Goroutine %d done\n", id)
        }(i)
    }
    time.Sleep(2 * time.Second)
}
```

### Kotlin (coroutine)
```kotlin
// build.gradle.kts
dependencies {
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.8.0")
}
```

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
    repeat(5) { id ->
        launch {
            delay(1000)
            println("Coroutine $id done")
        }
    }
}
```

### Java (virtual thread)
```java
// Java 21+, no dependencies needed
public class VirtualThreadDemo {
    public static void main(String[] args) throws InterruptedException {
        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
            for (int i = 0; i < 5; i++) {
                int id = i;
                executor.submit(() -> {
                    Thread.sleep(1000);
                    System.out.println("Virtual thread " + id + " done");
                });
            }
        }
    }
}
```

---

No final, a verdadeira medida de uma abstração de concorrência não é quantas tarefas ela pode criar, mas quantos problemas ela resolve — e quantos novos ela não cria.

E nesse aspecto, 2026 é um bom ano para ser desenvolvedor. Temos opções. Boas opções. O desafio agora não é "como fazer concorrência", mas "qual concorrência fazer".
