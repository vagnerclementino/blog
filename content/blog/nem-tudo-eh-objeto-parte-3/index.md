---
title: "Nem tudo é objeto - Parte 3: Aplicando DOP na Prática"
date: "2025-08-12"
description: "Guia prático para implementar Programação Orientada a Dados em projetos reais"
featuredImage: feature.png
featured: true
---

📖 **Esta é uma série em 3 partes sobre o paradigma de programação orientada a dados:**

- **[Parte 1](https://notes.clementino.me/blog/nem-tudo-eh-objeto-parte-1)**: A Arte de Lidar com a Complexidade
- **[Parte 2](https://notes.clementino.me/blog/nem-tudo-eh-objeto-parte-2)**: Programação Orientada a Dados
- **Parte 3**: Aplicando Programação Orientada a Dados na Prática **Você está aqui** 👈🏿

## Quando Usar a Programação Orientada a Dados

Na [primeira parte](https://notes.clementino.me/blog/nem-tudo-eh-objeto-parte-1),
dessa série exploramos os fundamentos da complexidade no software e as ferramentas
para lidar com ela. No segundo artigo discutimos os princípios da 
[Programação Orientada a Dados](https://notes.clementino.me/blog/nem-tudo-eh-objeto-parte-2).
Agora é hora de colocar em prática.

Neste terceiro artigo, vamos apresentar um uso prático da DOP através de uma API
REST para gerenciar feriados. Analisaremos quando usar (e quando não usar) essa
abordagem. Também forneceremos um guia prático para implementar esses conceitos
em projetos reais. O foco é aplicar DOP em cenários reais de desenvolvimento.

Vale notar que a Programação Orientada a Dados não pretende substituir
completamente a Programação Orientada a Objetos, mas oferece uma abordagem
complementar que pode ser aplicada em situações específicas onde seus benefícios
são mais evidentes.

A DOP posiciona-se entre a Programação Funcional e a Programação Orientada a
Objetos, sendo, na prática, mais próxima da primeira. Enquanto a programação
funcional propõe que todas as operações sejam funções puras sem efeitos
colaterais (requisito que pode ser difícil de alcançar em muitos projetos reais)
a DOP usa funções sem efeitos colaterais sempre que possível e concentra as
operações que modificam estado (como salvar no banco de dados, enviar emails ou
escrever em arquivos) em partes específicas do sistema[^2].

O diferencial da DOP, similar à programação funcional, é que sua abordagem
funciona muito bem em pequena escala. Qualquer pedaço de lógica de domínio
que seja representado como função - seja um pipeline de transformações de dados
ou uma combinação de funções simples - torna a base de código mais confiável e
mais fácil de se manter.

A mensagem aqui é que não é necessário desenvolver sistemas inteiros de forma
orientada a dados. Se você quiser começar em pequena escala, a seguir temos
alguns cenários em que o uso da DOP pode ser um bom ponto de partida.

**1. Sistemas de Processamento de Dados**: Sistemas que diretamente ingerem e
produzem dados são candidatos ideais para DOP[^3], por exemplo:

- Jobs de processamento em lote (batch jobs)
- Ferramentas de análise de dados
- Sistemas de processamento de eventos (onde os eventos são "os dados")

**2. Problemas Isolados e Bem Definidos**: Módulos que podem ser desenvolvidos
de forma independente podem ser beneficiar da clareza e simplicidade da DOP.
Exemplos incluem:

- Utilitários de validação e formatação
- *Parsers* de configuração (JSON, XML)
- Calculadoras de domínio específico (juros compostos, impostos e Retorno Sobre o Investimento - *ROI*)

## Casos de uso

Para demonstrar os conceitos da programação orientada a dados na prática,
desenvolvemos uma API REST cujo objetivo é o de gerenciar feriados. O projeto
completo está disponível em [github.com/vagnerclementino/api-holiday](https://github.com/vagnerclementino/api-holiday)
e pode ser executado localmente usando Docker Compose[^8].

### API REST para Gerenciamento de Feriados

Nossa API demonstra como aplicar DOP em um sistema real que precisa gerenciar
diferentes tipos de feriados (fixos, móveis, observados). A implementação mostra
como os princípios da DOP se traduzem em código limpo, testável e performático.
Vamos examinar cada componente e entender as decisões de design.

#### Estrutura de Dados Imutáveis

```java
// Dados imutáveis e transparentes
public sealed interface Holiday 
    permits FixedHoliday, ObservedHoliday, MoveableHoliday, MoveableFromBaseHoliday {
    String name();
    String description();
    LocalDate date();
    List<Locality> localities();
    HolidayType type();
}

public record FixedHoliday(
    String name, String description, LocalDate date, int day, Month month,
    List<Locality> localities, HolidayType type
) implements Holiday {
    
    public FixedHoliday {
        Objects.requireNonNull(name, "Holiday name cannot be null");
        if (name.isBlank()) {
            throw new IllegalArgumentException("Holiday name cannot be blank");
        }
        localities = List.copyOf(localities); // Defensive copying
    }
}
```

Esta abordagem traz benefícios significativos: a estrutura é clara, previne
modificações acidentais e garante thread safety automático[^4]. Por outro lado,
criar novas instâncias para pequenas modificações pode ser verboso e gerar
sobrecarga de memória em sistemas com grandes volumes de dados.

#### Operações Separadas dos Dados

A separação entre dados e operações é um dos pilares da DOP. Em vez de métodos
dentro das classes de dados, criamos uma classe dedicada que contém todas as
operações como funções puras, ou seja, sem efeitos colaterais. Esta abordagem
facilita testes, permite reutilização e mantém os dados focados apenas em
representar informação.

```java
// Operações como funções puras (versão simplificada para didática)
@Component
public final class HolidayOperations {
    
    public Holiday calculateDate(Holiday holiday, int year) {
        Objects.requireNonNull(holiday, "Holiday cannot be null");
        
        return switch (holiday) {
            case FixedHoliday fixed -> fixed.withDate(
                LocalDate.of(year, fixed.month(), fixed.day())
            );
            case MoveableHoliday moveable -> moveable.withDate(
                calculateMoveableDate(moveable.knownHoliday(), year)
            );
            case ObservedHoliday observed -> calculateObservedDate(observed, year);
            case MoveableFromBaseHoliday moveableFromBase -> 
                calculateMoveableFromBase(moveableFromBase, year);
        };
    }
    
    public List<Holiday> getHolidaysForYear(List<Holiday> holidays, int year) {
        return holidays.parallelStream()
            .map(holiday -> calculateDate(holiday, year))
            .sorted(Comparator.comparing(Holiday::date))
            .toList();
    }
}
```

**💡 Nota**: O código real usa métodos de instância Spring. Versão completa disponível em: [HolidayOperations.java](https://github.com/vagnerclementino/api-holiday/blob/main/src/main/java/me/clementino/holiday/domain/dop/HolidayOperations.java)

Esta separação oferece vantagens importantes: operações são testáveis,
reutilizáveis e podem ser facilmente combinadas para criar funcionalidades
complexas. Entretanto, pode levar à proliferação de classes utilitárias e
dificultar a descoberta de funcionalidades relacionadas a um tipo específico de
dado.

#### Controller REST com Pattern Matching

O controller demonstra como pattern matching simplifica o tratamento de
diferentes tipos de dados. Em vez de usar instanceof ou métodos polimórficos,
utilizamos switch expressions que garantem cobertura completa de todos os casos
e tornam o código mais legível e fácil de manter.

```java
// Versão simplificada para demonstrar conceitos DOP
@RestController
@RequestMapping("/api/holidays")
public class HolidayController {
    
    private final HolidayService holidayService;
    
    @GetMapping
    public ResponseEntity<List<HolidayResponse>> getHolidays(
            @RequestParam(defaultValue = "2024") int year,
            @RequestParam(required = false) String locality) {
        
        var holidays = holidayService.getHolidaysForYear(year);
        var filteredHolidays = holidays.parallelStream()
            .filter(holiday -> locality == null || 
                holiday.localities().parallelStream().anyMatch(loc -> loc.name().equals(locality)))
            .map(this::toResponse)
            .toList();
            
        return ResponseEntity.ok(filteredHolidays);
    }
    
    private HolidayResponse toResponse(Holiday holiday) {
        return switch (holiday) {
            case FixedHoliday fixed -> new HolidayResponse(
                fixed.name(), fixed.date(), "FIXED", fixed.localities()
            );
            case MoveableHoliday moveable -> new HolidayResponse(
                moveable.name(), moveable.date(), "MOVEABLE", moveable.localities()
            );
            case ObservedHoliday observed -> new HolidayResponse(
                observed.name(), observed.date(), "OBSERVED", observed.localities()
            );
            case MoveableFromBaseHoliday moveableFromBase -> new HolidayResponse(
                moveableFromBase.name(), moveableFromBase.date(), "MOVEABLE_FROM_BASE", 
                moveableFromBase.localities()
            );
        };
    }
}
```

**💡 Nota**: A implementação real usa DTOs, mappers e anotações de validação. Código completo: [HolidayController.java](https://github.com/vagnerclementino/api-holiday/blob/main/src/main/java/me/clementino/holiday/controller/HolidayController.java)

O pattern matching oferece vantagens claras: torna o código mais legível que
cadeias de `if-else` e garante que todos os casos sejam tratados[^5]. Contudo,
adicionar novos tipos requer modificação em múltiplos pontos do código, violando
parcialmente o princípio Open/Closed[^6].

### AWS Lambda

Um outro exemplo de bom uso da DOP é em *handlers* de funções AWS Lambda[^1].
O ambiente serverless (computação em nuvem sem gerenciamento de servidor)
beneficia-se enormemente da imutabilidade dos dados, que elimina problemas de
concorrência entre invocações simultâneas da função e da separação clara entre
dados e operações, o que facilita o teste unitário de cada *handler*
individualmente.

```java
public class HolidayLambdaHandler implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {
    
    @Override
    public APIGatewayProxyResponseEvent handleRequest(APIGatewayProxyRequestEvent request, Context context) {
        try {
            return switch (request.getHttpMethod()) {
                case "GET" -> handleGet(request);
                case "POST" -> handlePost(request);
                default -> createResponse(405, "Method not allowed");
            };
        } catch (Exception e) {
            return createResponse(500, "Internal server error");
        }
    }
    
    private APIGatewayProxyResponseEvent handleGet(APIGatewayProxyRequestEvent request) {
        var year = extractYear(request.getQueryStringParameters());
        var holidays = HolidayRepository.findAll();
        var holidaysForYear = HolidayOperations.getHolidaysForYear(holidays, year);
        return createResponse(200, holidaysForYear);
    }
    
    private APIGatewayProxyResponseEvent handlePost(APIGatewayProxyRequestEvent request) {
        var holidayData = parseHolidayFromJson(request.getBody());
        var createdHoliday = HolidayOperations.createHoliday(holidayData);
        return createResponse(201, createdHoliday);
    }
}
```

Em ambientes serverless, a DOP demonstra seus pontos fortes: pattern matching
simplifica o roteamento, a ausência de estado mutável reduz complexidade de
debugging, e funções puras são naturalmente stateless (sem estado persistente
entre execuções). Porém, o tempo de inicialização de novas
instâncias (cold start) podem ser impactados pela criação de muitos objetos
imutáveis, e serialização/deserialização adiciona latência.

Além disso, a natureza funcional da DOP alinha-se perfeitamente com o modelo de
execução stateless das funções Lambda, onde cada invocação deve ser independente
e previsível, características essenciais para sistemas serverless.

## Quando DOP Não É a Melhor Escolha

É importante reconhecer que a DOP não é uma solução universal. Existem cenários
onde outros paradigmas podem ser mais adequados:

**1. Sistemas com Estado Complexo**: Aplicações que requerem gerenciamento
sofisticado de estado (como editores gráficos, jogos em tempo real, ou sistemas
de cache distribuído) podem se beneficiar mais da encapsulação oferecida pela
orientação a objetos.

**2. APIs com Muitas Variações**: Quando você tem dezenas de tipos diferentes
que compartilham comportamentos similares, a herança e polimorfismo da OOP
podem ser mais elegantes que pattern matching extenso.

**3. Sistemas Legados**: Integrar DOP em bases de código orientadas a objetos
existentes pode introduzir inconsistências arquiteturais e confundir a equipe
de desenvolvimento.

**4. Performance Crítica**: Em sistemas onde cada alocação de memória importa,
a criação constante de novos objetos imutáveis pode ser proibitiva em termos de
performance e uso de memória.

**5. Equipes Inexperientes**: A curva de aprendizado da DOP pode ser
significativa para equipes acostumadas exclusivamente com OOP, potencialmente
impactando a produtividade inicial.

## Benefícios Observados na Prática

Ao implementar a API usando DOP, observamos vários benefícios práticos:

**1. Testabilidade**: Funções puras são extremamente fáceis de testar, pois não
dependem de estado externo e sempre produzem o mesmo resultado para as mesmas
entradas.

```java
@Test
void shouldCalculateChristmasForDifferentYears() {
    var christmas = new FixedHoliday("Christmas", "Birth of Christ", 
                                   null, 25, Month.DECEMBER,
                                   List.of(Locality.NATIONAL), HolidayType.RELIGIOUS);
    
    var operations = new HolidayOperations();
    var christmas2024 = operations.calculateDate(christmas, 2024);
    var christmas2025 = operations.calculateDate(christmas, 2025);
    
    assertEquals(LocalDate.of(2024, 12, 25), christmas2024.date());
    assertEquals(LocalDate.of(2025, 12, 25), christmas2025.date());
}
```

**2. Thread Safety**: Dados imutáveis eliminam problemas de concorrência,
permitindo processamento paralelo seguro[^7].

```java
public List<Holiday> processHolidaysInParallel(List<Holiday> holidays, int year) {
    var operations = new HolidayOperations();
    return holidays.parallelStream()  // Seguro com dados imutáveis
        .map(holiday -> operations.calculateDate(holiday, year))
        .collect(Collectors.toList());
}
```

**3. Debugging Simplificado**: Estados imutáveis facilitam o rastreamento de
bugs, pois não há modificações inesperadas de dados.

**4. Facilidade de Composição**: Operações podem ser facilmente combinadas para criar
funcionalidades mais complexas.

```java
public List<Holiday> getNationalReligiousHolidaysForYear(int year) {
    var operations = new HolidayOperations();
    return holidayRepository.findAll()
        .parallelStream()
        .map(holiday -> operations.calculateDate(holiday, year))
        .filter(holiday -> holiday.localities().parallelStream()
            .anyMatch(locality -> locality.scope() == Locality.Scope.NATIONAL))
        .filter(holiday -> holiday.type() == HolidayType.RELIGIOUS)
        .sorted(Comparator.comparing(Holiday::date))
        .toList();
}
```

## Conclusão: Escolhendo a Ferramenta Certa

A Programação Orientada a Dados não é uma bala de prata, mas sim uma ferramenta
valiosa no arsenal do desenvolvedor. Como vimos nos exemplos práticos, ela
brilha em cenários específicos - processamento de dados, sistemas stateless,
APIs simples - mas pode ser inadequada em outros contextos.

Os benefícios incluem facilidade para testes, segurança em execução paralela
pela imutabilidade, depuração simplificada e alta capacidade de composição.
Contudo, as compensações incluem verbosidade do código, sobrecarga de memória,
curva de aprendizado para equipes familiarizadas com a orientação objetos e
fragmentação em múltiplas classes utilitárias.

A chave está em reconhecer que diferentes paradigmas revelam aspectos distintos
da solução. A DOP funciona excepcionalmente bem quando:

- Os dados têm estrutura clara e bem definida
- As operações são principalmente transformações
- A imutabilidade não impacta significativamente a performance
- A equipe está disposta a investir na curva de aprendizado

Por outro lado, a orientação a objetos tradicional pode ser mais adequada
quando:

- O sistema requer gerenciamento complexo de estado
- Há necessidade de extensibilidade através de herança
- A performance é crítica e mutabilidade controlada é aceitável
- A base de código existente já segue padrões OOP estabelecidos

A programação orientada a dados posiciona-se como uma abordagem complementar,
não substituta. Em projetos reais, é comum - e recomendável - usar DOP para
módulos específicos, enquanto mantém OOP em outras partes da aplicação.

O importante é fazer escolhas conscientes baseadas no contexto específico do
problema, nas características da equipe e nos requisitos não-funcionais do
sistema. Afinal, a elegância de uma solução não está apenas no paradigma
escolhido, mas na adequação da ferramenta ao problema que se pretende resolver.

E você, já identificou algum oportunidade em seus projetos que poderia se
beneficiar da Programação Orientada a Dados?

---

📖 **Série completa:**

- **[Parte 1](https://notes.clementino.me/blog/nem-tudo-eh-objeto-parte-1)**: A Arte de Lidar com a Complexidade
- **[Parte 2](https://notes.clementino.me/blog/nem-tudo-eh-objeto-parte-2)**: Programação Orientada a Dados
- **Parte 3**: Aplicando Programação Orientada a Dados na Prática **Você acabou de ler** 👈🏿

*Gostou da série? Compartilhe suas experiências aplicando esses conceitos!*

[^1]: [AWS Lambda](https://aws.amazon.com/lambda/)
[^2]: [Functional Programming Principles - Martin Odersky](https://www.coursera.org/learn/scala-functional-programming)
[^3]: [Data-Oriented Design and C++ - Mike Acton](https://www.youtube.com/watch?v=rX0ItVEVjHc)
[^4]: [Java Concurrency in Practice - Brian Goetz](https://jcip.net/)
[^5]: [Pattern Matching for Java - JEP 394](https://openjdk.org/jeps/394)
[^6]: [SOLID Principles - Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2020/10/18/Solid-Relevance.html)
[^7]: [Effective Java - Joshua Bloch](https://www.oreilly.com/library/view/effective-java/9780134686097/)
[^8]: [Docker Compose](https://docs.docker.com/compose/)
