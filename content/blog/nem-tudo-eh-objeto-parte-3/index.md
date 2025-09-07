---
title: "Nem tudo é objeto - Parte 3: Aplicando DOP na Prática"
date: "2025-08-12"
description: "Guia prático para implementar Programação Orientada a Dados em projetos reais"
featuredImage: feature.png
---

📖 **Esta é uma série em 3 partes sobre o paradigma de programação orientada a dados:**

- **[Parte 1](https://notes.clementino.me/blog/nem-tudo-eh-objeto-parte-1)**: A Arte de Lidar com a Complexidade
- **[Parte 2](https://notes.clementino.me/blog/nem-tudo-eh-objeto-parte-2)**: Programação Orientada a Dados
- **Parte 3**: Aplicando Programação Orientada a Dados na Prática **Você está aqui** 👈🏿

## Quando Usar a Programação Orientada a Dados

 Nas [partes anteriores](https://notes.clementino.me/blog/nem-tudo-eh-objeto-parte-1),
 exploramos os fundamentos da complexidade no software e os princípios da
 [Programação Orientada a Dados](https://notes.clementino.me/blog/nem-tudo-eh-objeto-parte-2).  
 Agora é hora de colocar em prática. A Programação Orientada a Dados não
 pretende substituir completamente a Programação Orientada a Objetos, mas
 oferece uma abordagem complementar que pode ser aplicada em situações
 específicas onde seus benefícios são mais evidentes[^1].

A DOP posiciona-se entre a Programação Funcional e a Programação Orientada a
Objetos, sendo, na prática, mais próxima da primeira. Enquanto a programação
funcional propõe que todas as operações sejam funções puras sem efeitos
colaterais (requisito que pode ser difícil de alcançar em muitos projetos reais)
a DOP aproveita os benefícios da pureza funcional onde possível e isola os
desvios necessários nos subsistemas responsáveis pela lógica correspondente.

O diferencial da DOP, similar à programação funcional, é que sua abordagem
funciona muito bem em pequena escala. Qualquer pedaço de lógica de domínio
representado como função - seja um pipeline de stream simples ou uma cadeia de
funções escritas à mão - torna a base de código mais confiável e mais fácil de
se manter. Não é necessário desenvolver sistemas inteiros de forma orientada a
dados. Se você quiser começar em pequena escala, a seguir temos alguns cenários
em que o uso da DOP pode ser um bom ponto de partida.

**1. Sistemas de Processamento de Dados**: Sistemas que diretamente ingerem e produzem dados são candidatos ideais para DOP. Exemplos incluem:

- Jobs de processamento em lote (batch jobs)
- Ferramentas de análise de dados  
- Sistemas de processamento de eventos (onde os eventos são "os dados")

**2. Problemas Pequenos que Não Requerem Modularização Adicional**: Problemas parciais ou subsistemas que podem ser resolvidos de forma relativamente isolada se beneficiam da clareza e simplicidade da DOP. Exemplos incluem:

- Utilitários de validação e formatação
- *Parsers* de configuração (JSON, XML)
- Calculadoras de domínio específico

## Casos de uso

Para demonstrar todos os conceitos da programação orientada a dados na prática,
desenvolvemos uma API REST completa para gerenciar feriados. O projeto completo
está disponível em
[github.com/vagnerclementino/api-holiday](https://github.com/vagnerclementino/api-holiday)
e pode ser executado localmente usando Docker Compose.

### API REST

Para demonstrar todos os conceitos da programação orientada a dados na prática,
desenvolvemos uma API REST completa para gerenciar feriados. O projeto completo
está disponível em [github.com/vagnerclementino/api-holiday](https://github.com/vagnerclementino/api-holiday) e pode ser executado localmente usando Docker Compose.

Vamos examinar como implementar uma API REST completa usando os princípios da
DOP. Este exemplo demonstra como os quatro princípios fundamentais se aplicam em
um cenário real de desenvolvimento.

#### Estrutura de Dados Imutáveis

```java
// Dados imutáveis e transparentes
public sealed interface Holiday permits FixedHoliday, MoveableHoliday, ObservedHoliday {
    String name();
    String description();
    LocalDate date();
    List<Locality> localities();
    HolidayType type();
}

public record FixedHoliday(
    String name, String description, int day, Month month, LocalDate date,
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

public record MoveableHoliday(
    String name, String description, LocalDate date,
    List<Locality> localities, HolidayType type,
    KnownHoliday knownHoliday, boolean mondayisation
) implements Holiday {
    
    public MoveableHoliday {
        Objects.requireNonNull(knownHoliday, "Known holiday type cannot be null");
        localities = List.copyOf(localities);
    }
}
```

#### Operações Separadas dos Dados

```java
// Operações como funções puras
public final class HolidayOperations {
    
    public static List<Holiday> getHolidaysForYear(List<Holiday> holidays, int year) {
        return holidays.stream()
            .map(holiday -> calculateDateForYear(holiday, year))
            .sorted(Comparator.comparing(Holiday::date))
            .toList();
    }
    
    public static Holiday calculateDateForYear(Holiday holiday, int year) {
        return switch (holiday) {
            case FixedHoliday fixed -> new FixedHoliday(
                fixed.name(), fixed.description(), fixed.day(), fixed.month(),
                LocalDate.of(year, fixed.month(), fixed.day()),
                fixed.localities(), fixed.type()
            );
            case MoveableHoliday moveable -> new MoveableHoliday(
                moveable.name(), moveable.description(),
                calculateMoveableDate(moveable.knownHoliday(), year),
                moveable.localities(), moveable.type(),
                moveable.knownHoliday(), moveable.mondayisation()
            );
            case ObservedHoliday observed -> calculateObservedDate(observed, year);
        };
    }
    
    public static List<Holiday> filterByLocality(List<Holiday> holidays, Locality locality) {
        return holidays.stream()
            .filter(holiday -> holiday.localities().contains(locality))
            .toList();
    }
    
    public static Map<HolidayType, List<Holiday>> groupByType(List<Holiday> holidays) {
        return holidays.stream()
            .collect(Collectors.groupingBy(Holiday::type));
    }
}
```

#### Controller REST com Pattern Matching

```java
@RestController
@RequestMapping("/api/holidays")
public class HolidayController {
    
    private final HolidayService holidayService;
    
    @GetMapping
    public ResponseEntity<List<HolidayResponse>> getHolidays(
            @RequestParam(defaultValue = "2024") int year,
            @RequestParam(required = false) Locality locality,
            @RequestParam(required = false) HolidayType type) {
        
        var holidays = holidayService.getHolidaysForYear(year);
        
        // Aplicar filtros usando operações funcionais
        var filteredHolidays = holidays.stream()
            .filter(holiday -> locality == null || holiday.localities().contains(locality))
            .filter(holiday -> type == null || holiday.type().equals(type))
            .map(this::toResponse)
            .toList();
            
        return ResponseEntity.ok(filteredHolidays);
    }
    
    @PostMapping
    public ResponseEntity<HolidayResponse> createHoliday(@RequestBody CreateHolidayRequest request) {
        try {
            var holiday = createHolidayFromRequest(request);
            var savedHoliday = holidayService.save(holiday);
            return ResponseEntity.status(201).body(toResponse(savedHoliday));
        } catch (ValidationException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    private Holiday createHolidayFromRequest(CreateHolidayRequest request) {
        return switch (request.type()) {
            case FIXED -> new FixedHoliday(
                request.name(), request.description(),
                request.day(), request.month(), null,
                request.localities(), request.holidayType()
            );
            case MOVEABLE -> new MoveableHoliday(
                request.name(), request.description(), null,
                request.localities(), request.holidayType(),
                request.knownHoliday(), request.mondayisation()
            );
        };
    }
    
    private HolidayResponse toResponse(Holiday holiday) {
        return switch (holiday) {
            case FixedHoliday fixed -> new HolidayResponse(
                fixed.name(), fixed.description(), fixed.date(),
                "FIXED", fixed.localities(), fixed.type()
            );
            case MoveableHoliday moveable -> new HolidayResponse(
                moveable.name(), moveable.description(), moveable.date(),
                "MOVEABLE", moveable.localities(), moveable.type()
            );
            case ObservedHoliday observed -> new HolidayResponse(
                observed.name(), observed.description(), observed.observed(),
                "OBSERVED", observed.localities(), observed.type()
            );
        };
    }
}
```

### AWS Lambda

Um outro exemplo de bom uso da DOP é em *handlers* de funções AWS Lambda[^2].  O
ambiente serverless beneficia-se enormemente da imutabilidade dos dados, que
elimina problemas de concorrência entre invocações simultâneas da função, e da
separação clara entre dados e operações, que facilita o teste unitário de cada
*handler* individualmente.

```java
public class HolidayLambdaHandler implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {
    
    @Override
    public APIGatewayProxyResponseEvent handleRequest(APIGatewayProxyRequestEvent request, Context context) {
        try {
            return switch (request.getHttpMethod()) {
                case "GET" -> handleGet(request);
                case "POST" -> handlePost(request);
                case "PUT" -> handlePut(request);
                case "DELETE" -> handleDelete(request);
                default -> createResponse(405, Map.of("error", "Method not allowed"));
            };
        } catch (Exception e) {
            context.getLogger().log("Error: " + e.getMessage());
            return createResponse(500, Map.of("error", "Internal server error"));
        }
    }
    
    private APIGatewayProxyResponseEvent handleGet(APIGatewayProxyRequestEvent request) {
        var pathParameters = request.getPathParameters();
        var queryParameters = request.getQueryStringParameters();
        
        return switch (extractResourceType(request.getPath())) {
            case "holidays" -> {
                if (pathParameters != null && pathParameters.containsKey("id")) {
                    yield getHolidayById(pathParameters.get("id"));
                } else {
                    var year = queryParameters != null ? 
                        Integer.parseInt(queryParameters.getOrDefault("year", "2024")) : 2024;
                    yield getHolidaysByYear(year);
                }
            }
            case "health" -> createResponse(200, Map.of("status", "healthy"));
            default -> createResponse(404, Map.of("error", "Resource not found"));
        };
    }
    
    private APIGatewayProxyResponseEvent handlePost(APIGatewayProxyRequestEvent request) {
        try {
            var holidayData = parseHolidayFromJson(request.getBody());
            var createdHoliday = HolidayOperations.createHoliday(holidayData);
            return createResponse(201, createdHoliday);
        } catch (ValidationException e) {
            return createResponse(400, Map.of("error", e.getMessage()));
        }
    }
    
    private APIGatewayProxyResponseEvent getHolidaysByYear(int year) {
        var holidays = HolidayRepository.findAll();
        var holidaysForYear = HolidayOperations.getHolidaysForYear(holidays, year);
        return createResponse(200, holidaysForYear);
    }
    
    private APIGatewayProxyResponseEvent createResponse(int statusCode, Object body) {
        return APIGatewayProxyResponseEvent.builder()
            .withStatusCode(statusCode)
            .withHeaders(Map.of(
                "Content-Type", "application/json",
                "Access-Control-Allow-Origin", "*"
            ))
            .withBody(JsonUtils.toJson(body))
            .build();
    }
}
```

O pattern matching com `switch` torna o roteamento de requisições HTTP mais
legível e fácil de manter em comparação com uma sequência de `if-else`.
Ademais, a ausência de estado mutável compartilhado reduz significativamente a
complexidade de debugging em um ambiente distribuído.

Além disso, a natureza funcional da DOP alinha-se perfeitamente com o modelo de
execução stateless (sem estado persistente) das funções Lambda, onde cada
invocação deve ser independente e previsível, características essenciais para
sistemas que podem escalar automaticamente e processar milhares de requisições
concorrentes. A seguir temos um exemplo do uso da DOP em uma função Lambda.

## Benefícios Observados na Prática

Ao implementar a API usando DOP, observamos vários benefícios práticos:

**1. Testabilidade**: Funções puras são extremamente fáceis de testar, pois não dependem de estado externo e sempre produzem o mesmo resultado para as mesmas entradas.

```java
@Test
void shouldCalculateChristmasForDifferentYears() {
    var christmas = new FixedHoliday("Christmas", "Birth of Christ", 
                                   25, Month.DECEMBER, null, 
                                   List.of(Locality.NATIONAL), HolidayType.RELIGIOUS);
    
    var christmas2024 = HolidayOperations.calculateDateForYear(christmas, 2024);
    var christmas2025 = HolidayOperations.calculateDateForYear(christmas, 2025);
    
    assertEquals(LocalDate.of(2024, 12, 25), christmas2024.date());
    assertEquals(LocalDate.of(2025, 12, 25), christmas2025.date());
}
```

**2. Thread Safety**: Dados imutáveis eliminam problemas de concorrência, permitindo processamento paralelo seguro.

```java
public List<Holiday> processHolidaysInParallel(List<Holiday> holidays, int year) {
    return holidays.parallelStream()  // Seguro com dados imutáveis
        .map(holiday -> HolidayOperations.calculateDateForYear(holiday, year))
        .collect(Collectors.toList());
}
```

**3. Debugging Simplificado**: Estados imutáveis facilitam o rastreamento de bugs, pois não há modificações inesperadas de dados.

**4. Composabilidade**: Operações podem ser facilmente combinadas para criar funcionalidades mais complexas.

```java
public List<Holiday> getNationalReligiousHolidaysForYear(int year) {
    return holidayRepository.findAll().stream()
        .map(holiday -> HolidayOperations.calculateDateForYear(holiday, year))
        .filter(holiday -> holiday.localities().contains(Locality.NATIONAL))
        .filter(holiday -> holiday.type() == HolidayType.RELIGIOUS)
        .sorted(Comparator.comparing(Holiday::date))
        .toList();
}
```

## Conclusão

A Programação Orientada a Dados (Data-Oriented Programming - DOP) representa uma
abordagem complementar à Programação Orientada a Objetos que prioriza a
estrutura e o fluxo dos dados de forma imutável, separando informação do seu
processamento. Baseada em quatro princípios fundamentais - dados imutáveis e
transparentes, modelagem precisa de todos os dados necessários, prevenção de
estados ilegais, e separação entre operações e dados - a DOP oferece uma
perspectiva que se posiciona entre a programação funcional e orientada a
objetos, aproveitando os benefícios da pureza funcional onde possível.

Os benefícios da DOP são evidentes tanto em pequena quanto em grande escala. A
**imutabilidade** elimina uma fonte comum de bugs relacionados a objetos
modificados por diferentes subsistemas, enquanto a **transparência** dos dados
facilita a construção e reconstrução de instâncias. A **modelagem precisa** com
sealed interfaces e records específicos torna estados ilegais irrepresentáveis
pelo sistema de tipos, reduzindo significativamente a necessidade de validações
defensivas. A **separação de operações** mantém os dados simples e as operações
poderosas, utilizando correspondência de padrões para escolher automaticamente
qual código executar para cada tipo de dado, de forma mais simples e direta que
padrões tradicionais de design. Esses princípios resultam em código mais
**legível**, **testável**, **mais fácil de manter** e **thread-safe por
design** (seguro para execução concorrente), características especialmente
valiosas em ambientes distribuídos e serverless.

A DOP é particularmente adequada para sistemas de processamento de dados que
ingerem e produzem informações de forma previsível, como jobs de processamento
em lote, ferramentas de análise, sistemas de processamento de eventos, e APIs
que modelam estruturas existentes. Também se beneficia de problemas menores que
podem ser resolvidos de forma isolada, aproveitando a clareza e simplicidade do
paradigma. Por fim, e não menos importante, a chave está em reconhecer que
diferentes paradigmas revelam aspectos distintos da solução, e a escolha
adequada pode fazer toda a diferença na elegância e eficácia do resultado final.

E aí, curtiu a ideia de dados simples e operações poderosas? Que tal dar uma
chance para a DOP em seu próximo projeto?

---

📖 **Série completa:**

- **[Parte 1](https://notes.clementino.me/blog/nem-tudo-eh-objeto-parte-1)**: A Arte de Lidar com a Complexidade
- **[Parte 2](https://notes.clementino.me/blog/nem-tudo-eh-objeto-parte-2)**: Programação Orientada a Dados
- **Parte 3**: Aplicando Programação Orientada a Dados na Prática **Você acabou de ler** 👈🏿

*Gostou da série? Compartilhe suas experiências aplicando esses conceitos!*

[^1]: [Stack Overflow Developer Survey 2025 - Most Popular Technologies](https://survey.stackoverflow.co/2025/technology#most-popular-technologies)
[^2]: [AWS Lambda](https://aws.amazon.com/lambda/)
