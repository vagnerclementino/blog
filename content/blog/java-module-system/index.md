---
title: "Java Module System: quando o classpath virou problema (e a solução)"
date: "2026-02-23"
description: "Uma análise do Java Platform Module System (JPMS) além da sintaxe — a filosofia por trás da modularidade forçada"
featuredImage: feature.png
---

## Introdução: o dia em que o classpath me traiu

2013. Projeto Java enterprise. `ClassNotFoundException` em produção. O motivo? Duas versões da mesma biblioteca no classpath. A JVM escolheu a errada.

O problema não era novo. Era o **classpath hell**: dependências conflitantes, JARs invisíveis, reflexão que acessa tudo.

A solução chegou em 2017 com Java 9: **Java Platform Module System (JPMS)**, também conhecido como Project Jigsaw.

Este artigo não é sobre `module-info.java`. É sobre por que Java precisou quebrar 20 anos de compatibilidade para consertar um problema fundamental: **a falta de boundaries**.

---

## O problema: por que o classpath é infernal?

### 1. JARs são transparentes
```bash
# Classpath tradicional
java -cp "lib/*:app.jar" com.example.Main
```
Qual JAR tem qual classe? Quais dependências? O classpath não sabe.

### 2. Acessibilidade total
```java
// Pode acessar qualquer classe, mesmo privada
Class<?> clazz = Class.forName("com.internal.Secret");
Field field = clazz.getDeclaredField("password");
field.setAccessible(true);  // Reflection quebra encapsulamento
```

### 3. Version conflicts
```
Classpath:
- lib/guava-18.0.jar
- lib/otherlib.jar (que depende de guava-20.0)
  
Resultado: NoSuchMethodError em runtime
```

### 4. Implied dependencies
Se A depende de B, e B depende de C, A tem acesso a C — mesmo que não queira.

### 5. JRE monolítico
`rt.jar` (Java 8) tinha 20MB, 20k classes. Sua app usa 100 classes, carrega todas.

---

## A solução: módulos como unidades de encapsulamento

### O que é um módulo?
Unidade de:
1. **Code:** Classes, pacotes
2. **Dependencies:** O que precisa de outros módulos
3. **Exports:** O que disponibiliza para outros
4. **Permissions:** Reflexão permitida ou não

### `module-info.java`: o manifesto
```java
module com.example.myapp {
    requires java.base;           // Dependência
    requires java.sql;            // Módulo da plataforma
    requires transitive com.lib;  // Dependência transitiva
    
    exports com.example.api;      // API pública
    exports com.example.internal to com.friend; // Export seletivo
    
    opens com.example.reflection; // Permite reflexão
    provides com.example.Service with com.example.ServiceImpl;
    uses com.example.Service;
}
```

---

## Os três tipos de módulos

### 1. Platform modules (Java SE)
```bash
# Listar módulos da plataforma
java --list-modules
```
```
java.base@17
java.sql@17
java.xml@17
...
```

**`java.base`:** Módulo fundamental. Todos os módulos requerem implicitamente.

### 2. Application modules (seus)
```java
module com.mycompany.app {
    requires java.logging;
    requires com.fasterxml.jackson.databind;
    exports com.mycompany.app.api;
}
```

### 3. Automatic modules (legacy JARs)
JARs sem `module-info.java` viram módulos automáticos:
- Nome derivado do JAR (`guava-31.0.jar` → `guava`)
- Exporta todos pacotes
- Requer todos módulos

**Ponte entre mundo modular e não-modular.**

---

## Migração: as quatro estratégias

### Estratégia 1: Ignorar (até Java 8)
```bash
java --add-opens=java.base/java.lang=ALL-UNNAMED ...
```
Funciona, mas perde benefícios.

### Estratégia 2: Módulo automático
Deixe JARs como automáticos, crie módulo apenas para seu app.

### Estratégia 3: Módulo mínimo
```java
module com.myapp {
    requires java.base;
    requires guava;  // automático
    requires log4j;  // automático
    exports com.myapp;
}
```

### Estratégia 4: Full modularization
Cada JAR vira módulo, com `module-info.java` próprio.

### Recomendação
Comece com estratégia 3. Evolua para 4 conforme bibliotecas se modularizam.

---

## Benefícios reais (além do hype)

### 1. Startup mais rápido
```bash
# Java 8: Carrega rt.jar inteiro (20MB)
# Java 17+: Carrega apenas módulos necessários
java --module-path mods -m com.myapp/com.myapp.Main
```
**Resultado:** 30-50% faster startup para apps pequenos.

### 2. Melhor diagnóstico
```bash
# Ver dependências
jdeps --module-path mods -m com.myapp

# Ver módulos resolvidos  
java --show-module-resolution -m com.myapp
```

### 3. JLink: runtime customizado
```bash
# Criar runtime mínimo
jlink --module-path $JAVA_HOME/jmods:mods \
      --add-modules com.myapp,java.sql \
      --output myruntime

# Tamanho: ~40MB (vs 300MB JDK completo)
./myruntime/bin/java -m com.myapp
```

### 4. Encapsulamento real
```java
// Módulo A não exporta pacote interno
module a {
    // exports com.a.api; apenas
}

// Módulo B tenta acessar
module b {
    requires a;
    // Não compila: package com.a.internal not visible
}
```

### 5. Dependencies explícitas
Gráfico de dependências visível, verificável em compile-time.

---

## Os desafios (a parte dolorosa)

### 1. Reflexão quebrada
```java
// Java 8: funciona
Class<?> clazz = Class.forName("com.sun.internal.Tool");
clazz.getMethod("run").invoke(null);

// Java 9+: falha
// module does not open com.sun.internal to unnamed module
```

**Solução:**
```java
module myapp {
    opens com.myapp.reflection;  // Permitir reflexão
    // ou
    opens com.myapp.reflection to hibernate, spring;
}
```

### 2. Split packages
```bash
# Dois módulos exportam mesmo pacote
module A: exports com.example.util;
module B: exports com.example.util;  # Erro!
```

**Solução:** Renomear, merge, ou usar `--patch-module`.

### 3. Bibliotecas não-modulares
2026 e muitas libs ainda sem `module-info.java`.

**Solução:** Módulos automáticos ou esperar.

### 4. Tooling imaturo
Maven, Gradle, IDEs ainda têm problemas.

### 5. Learning curve
Novos conceitos, novos erros, nova mentalidade.

---

## JPMS vs. Outros sistemas de módulos

### Maven/Gradle dependencies
```xml
<!-- Maven: gerencia download, não encapsulamento -->
<dependency>
    <groupId>com.google.guava</groupId>
    <artifactId>guava</artifactId>
    <version>31.0</version>
</dependency>
```

**JPMS complementa, não substitui.**

### OSGi
```java
// OSGi: dinâmico, runtime
BundleContext context = ...
ServiceReference ref = context.getServiceReference(Service.class);
```

**Comparação:**
- **OSGi:** Runtime, dinâmico, complexo
- **JPMS:** Compile-time, estático, integrado

### JavaScript ES modules
```javascript
// ES modules: similar filosofia
import { function } from './module.js';
export default class MyClass;
```

**JPMS inspirado em sistemas modernos.**

---

## Casos de uso práticos

### 1. Library author
```java
module com.mylib {
    exports com.mylib.api;
    // Esconde implementação
}
```
Clientes não podem depender de detalhes internos.

### 2. Application developer
```java
module com.myapp {
    requires com.mylib;
    requires java.sql;
    
    opens com.myapp.persistence to org.hibernate.orm;
}
```
Controle preciso sobre reflexão.

### 3. Platform builder
```bash
# Criar runtime mínimo para containers
jlink --add-modules java.base,java.sql \
      --compress=2 --strip-debug \
      --output /opt/jre-minimal
```
Imagem Docker de 50MB vs 300MB.

### 4. Security-conscious apps
```java
module bankapp {
    requires java.base;
    requires java.sql;
    // Não requires java.desktop (evita AWT/Swing)
}
```
Reduz attack surface.

---

## Migração passo a passo (exemplo real)

### Projeto: Spring Boot app tradicional

**Passo 1: Adicionar module-info.java**
```java
// src/main/java/module-info.java
module com.myapp {
    requires spring.boot;
    requires spring.boot.autoconfigure;
    requires spring.context;
    requires spring.web;
    
    opens com.myapp to spring.core, spring.beans, spring.context;
    opens com.myapp.controllers to spring.web;
    opens com.myapp.entities to spring.core, hibernate.core;
    
    exports com.myapp;
}
```

**Passo 2: Configurar build (Maven)**
```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-compiler-plugin</artifactId>
    <version>3.10.1</version>
    <configuration>
        <release>17</release>
        <compilerArgs>
            <arg>--module-path</arg>
            <arg>${project.build.directory}/modules</arg>
        </compilerArgs>
    </configuration>
</plugin>
```

**Passo 3: Executar modular**
```bash
# Criar module path
mvn clean package
java --module-path "target/*.jar" -m com.myapp/com.myapp.Application
```

**Passo 4: Otimizar com jlink**
```bash
jlink --module-path "$JAVA_HOME/jmods:target/*.jar" \
      --add-modules com.myapp \
      --launcher myapp=com.myapp/com.myapp.Application \
      --output target/runtime
```

---

## As críticas (e respostas)

### "Muito complexo para pouco benefício"
**Resposta:** Benefícios são incrementais. Comece simples, evolua.

### "Quebra compatibilidade"
**Resposta:** Modo compatível (`--add-opens`, `--add-exports`) existe.

### "Deveria ser opcional"
**Resposta:** É. Você pode ignorar (modo classpath).

### "Ferramentas não prontas"
**Resposta:** 2026: Maven, Gradle, IDEs suportam bem.

### "Bibliotecas não migram"
**Resposta:** Módulos automáticos funcionam. Pressão da comunidade ajuda.

---

## O futuro: além do JPMS

### Project Leyden (static images)
```bash
# Java 22+
jpackage --module-path mods --module com.myapp \
         --runtime-image myruntime \
         --type app-image
```

### Project Valhalla (value objects)
```java
// Futuro: value classes em módulos
value class Point {
    int x, y;
}
```

### Project Loom (virtual threads)
```java
// Virtual threads + módulos
module com.myapp {
    requires java.base;
    requires jdk.incubator.concurrent;
}
```

### Tendência: mais encapsulamento
Módulos → pacotes → classes → records. Tudo encapsulado.

---

## Conclusão: modularidade como disciplina

Voltando ao `ClassNotFoundException` de 2013. O problema não era técnico. Era de **design**.

Classpath permitia (encorajava!) design ruim:
- Dependências implícitas
- Acoplamento invisível  
- Encapsulamento quebrado

JPMS força disciplina:
- Dependências explícitas
- Acoplamento visível
- Encapsulamento real

A dor da migração não é bug, é feature. É Java dizendo: "Pare de fazer design ruim."

### Para começar hoje

1. **Java 17+** (LTS, melhor suporte a módulos)
2. **Adicione `module-info.java`** mesmo que simples
3. **Use `--module-path`** em vez de `-cp`
4. **Experimente jlink** para deployments
5. **Exija módulos** de novas bibliotecas

### A mudança mental

Antes:
```java
// Tudo é possível
// Tudo é visível  
// Problemas em runtime
```

Depois:
```java
// Explicito é melhor que implícito
// Encapsulado é melhor que exposto
// Erros em compile-time
```

É uma mudança de filosofia. De "funciona até quebrar" para "não compila se mal projetado".

E no longo prazo, essa é a única forma de construir sistemas que não desmoronam com o tempo.

---

## Último exercício

```java
// Seu projeto atual
// Quantas dependências não declaradas?
// Quantas classes internas acessíveis?
// Quantos JARs desnecessários?

// Adicione:
// module-info.java
// Mesmo vazio

// E pergunte:
// O que quebra?
// Por que quebra?
// Deveria quebrar?
//
// As respostas não são sobre JPMS.
// São sobre seu design.
//
// E design, bem feito, é o que separa
// código que funciona de código que dura.
```

Java Module System não é feature. É intervenção. E como toda intervenção, dói no começo, cura no longo prazo.

A escolha é sua: continuar com classpath hell, ou aceitar a dor curativa dos módulos.

Eu escolhi os módulos. E depois da dor inicial, nunca mais olhei para trás.