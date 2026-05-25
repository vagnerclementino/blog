# Migração do Java 21 para o Java 25

## Visão geral
A nova versão oficial da linguagem traz **grandes melhorias** – desde *compact headers* até *structured concurrency* e *multi-threading scoped values*. Se você já usa Java 21, a migração pode parecer cheias de mudanças, mas com alguns ajustes de sintaxe o seu código continua se beneficiando de performance e legibilidade.

## 1. New Features from Java 21
- **DoFn** – simples forma de escrever *map*/`forEach` sem lambdas verborrágicos.
- **Pattern Matching for `instanceof`** – simplifica verificações e casts.
- **Compact Object Headers** – reduz o overhead de objetos menores.
- **Virtual Threads** – sobra e estreita maior paralelismo com custo reduzido.

## 2. Java 25 – Novidades impactantes
### 2.1 Java Language Module Import Declarations
```java
module com.example {\n  requires java.base;\n}\n```
Agora você pode declarar importações de módulos diretamente no módulo, eliminando a necessidade de controlar dependências na linha de comando.

### 2.2 Flexible Constructor Bodies
```java
record Point(int x, int y) {\n  public Point { } // corpo livre...\n}\n```
Você pode colocar lógica no corpo do record, algo que era impossível em Java 21.

### 2.3 Compact Source Files and Instance Main Methods
```java
module myapp;\n\npublic class Main {\n  public static void main(String[] args) { }\n}\n```
Um único arquivo agora pode conter módulos, classes e métodos `main` — torna rápida prototipagem.

### 2.4 Pattern Matching Core Library
Permite usar `instanceof` com *var* na mesma linha, trazendo clareza sem cast manual.

### 2.5 Stream Gatherers
```java\nList<String> names = List.of("A", "B", "C");\nMap<String,Integer> lenMap = names.stream()\n    .collect(Gatherers.toMap(str -> str, String::length));\n```
Substitui coletores tradicionais, mais eficientes em paralelo.

### 2.6 Class-File API Integrity by Default
Garantia de que binários que não dependem de APIs internas são mais estáveis.

### 2.7 Multi-threading Scoped Values
Gerenciamento de valores de thread local sem sobrescrever o thread‑local original.

### 2.8 Structured Concurrency
```java
try (var scope = StructuredTaskScope.withDefaults()) {\n  scope.fork(() -> doLongRunningThing());\n  scope.fork(() -> doAnotherThing());\n  scope.join();\n}\n```
Facilita gerenciamento de tarefas assíncronas.

### 2.9 Synchronize Virtual Threads without Pinning
Aumenta paralelismo mantendo a sincronização segura em virtual threads.

### 2.10 Stable Values
Elementos inalteráveis que rodam sem criação de clones – útil em APIs concorrentes.

### 2.11 JVM Garbage Collectors Compact Object Headers
Reduz overhead de GC e aumenta throughput.

### 2.12 Project Leyden
Ferramenta de análise estática de código que ajuda a detectar pontos fracos ao migrar.

### 2.13 Tools Launch Multi-File Source-Code Programs
Garaça a execução de múltiplos arquivos sem precisar criar um JAR.

### 2.14 Annotations Processing
Compilador que apoia *Record* e *sealed classes* no momento da compilação, verificando semântica.

## 3. Breaking Changes & Compatibilidade
1. **Record constructors** – agora podem ter lógica, alterando o comportamento em herança.
2. **Conversão de tipos** em `switch` virou mais estrito.
3. **Virtual Threads** – detecção de deadlocks alterada.
4. **HTTP Client** – API de arquivos foi removida.

Para mitigação: atue em ambientes de testes, use `-Xlint:unchecked` para identificar local de break.

## 4. Guia prático de migração
1. **Configuração** – Atualize Gradle/Maven para `8` em `sourceCompatibility` e `targetCompatibility`.
2. **Escaneamento Inicial** – Rode `jolb diagnose --all` (Project Leyden) para pegar falhas.
3. **Habilitando Virtual Threads** – No `pom.xml`:
   ```xml
   <properties><java.version>25</java.version></properties>
   ```
4. **Atualizando Imports de Modulo** – Tente migrar “requires” para “imports” nos módulos.
5. **Reescrever Records** – Adicione *flexible body* onde necessário.
6. **Substituir Stream Collectors** – Use `Gatherers.toMap()`.
7. **Testes** – Execute `mvn test -Dtest=*Test*` e verifique falhas.
8. **Commit & PR**
   ```bash
   git checkout -b migra-java25
   git add .
   git commit -m "Migração Java 21 → 25: novos recursos e correções"
   git push -u origin migra-java25
   ```
   Em seguida abra o PR na sua plataforma de CI.

## 5. Vantagens de mudar o código-fonte
- **Menor memória**: Compact headers reduzem uso por 20‑30 %.
- **Maior performance**: Structured Concurrency e Virtual Threads.
- **Mais segurança**: Class‑File Integrity previne leaks de API interna.
- **Legibilidade**: Pattern matching e modular imports simplificam código.

Concluindo, migrar vai exigir algum esforço inicial, mas os ganhos em performance, segurança e manutenção valem a pena. Mantenha sempre um branch de teste e use CI para validar cada mudança.

---
**Autor**: Seu Nome
**Projeto**: Blog de Vagner Clementino
**Publicado em**: 2026-05-25