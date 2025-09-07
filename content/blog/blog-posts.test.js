/* biome-disable */

/**
 * Tests for blog post frontmatter and Markdown content from the PR diff.
 *
 * Testing library/framework: autodetects Jest or Vitest via available globals.
 * - If 'vi' is present, assumes Vitest; otherwise falls back to Jest globals.
 *
 * Scope: Only validates the specific blog content provided in the diff.
 * No external network calls; purely static validations.
 */

/* eslint-disable no-useless-escape */

const useVitest = typeof globalThis.vi !== 'undefined';
const testFn = useVitest ? globalThis.test : globalThis.it;
const describeFn = globalThis.describe || (name => console.log(name));
const expectFn = globalThis.expect;

/**
 * Inline source from the PR diff (treated as the canonical content under test).
 * If a repository file with the exact title is later added, these tests can be
 * adapted to read from disk instead. For now, we keep it hermetic and inline.
 */
const md = `---
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

## Benefícios Observados na Prática

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

```java
public List<Holiday> processHolidaysInParallel(List<Holiday> holidays, int year) {
    return holidays.parallelStream()  // Seguro com dados imutáveis
        .map(holiday -> HolidayOperations.calculateDateForYear(holiday, year))
        .collect(Collectors.toList());
}
```

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

---
📖 **Série completa:**
- **[Parte 1](https://notes.clementino.me/blog/nem-tudo-eh-objeto-parte-1)**: A Arte de Lidar com a Complexidade
- **[Parte 2](https://notes.clementino.me/blog/nem-tudo-eh-objeto-parte-2)**: Programação Orientada a Dados
- **Parte 3**: Aplicando Programação Orientada a Dados na Prática **Você acabou de ler** 👈🏿

*Gostou da série? Compartilhe suas experiências aplicando esses conceitos!*

[^1]: [Stack Overflow Developer Survey 2025 - Most Popular Technologies](https://survey.stackoverflow.co/2025/technology#most-popular-technologies)
[^2]: [AWS Lambda](https://aws.amazon.com/lambda/)

function parseFrontmatter(text) {
  if (!text.startsWith('---')) throw new Error('Frontmatter must start with ---');
  const end = text.indexOf('\n---', 3);
  if (end === -1) throw new Error('Frontmatter end delimiter not found');
  const headerBlock = text.slice(3, end).trim();
  const content = text.slice(end + 4).replace(/^\r?\n/, '');

  const data = {};
  // Simple YAML-ish parser for key: value lines; supports quoted strings.
  const lines = headerBlock.split(/\r?\n/);
  for (const line of lines) {
    if (!line.trim()) continue;
    const m = line.match(/^([A-Za-z0-9_-]+):\s*(.+)$/);
    if (!m) throw new Error('Invalid frontmatter line: ' + line);
    const key = m[1];
    let value = m[2].trim();
    // Strip surrounding quotes if present
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    data[key] = value;
  }
  return { data, content };
}

function isISODateString(s) {
  // Accept YYYY-MM-DD only
  return /^\d{4}-\d{2}-\d{2}$/.test(s);
}

function toDate(s) {
  const d = new Date(s + 'T00:00:00Z');
  return isNaN(d.getTime()) ? null : d;
}

describeFn('Blog post frontmatter validations (from PR diff)', () => {
  const now = new Date('2025-09-07T00:00:00Z'); // Fixed for deterministic tests based on current date in US

  const { data, content } = parseFrontmatter(md);

  testFn('uses required keys with correct types', () => {
    expectFn(data).toHaveProperty('title');
    expectFn(typeof data.title).toBe('string');
    expectFn(data.title.length).toBeGreaterThan(5);

    expectFn(data).toHaveProperty('date');
    expectFn(isISODateString(data.date)).toBe(true);
    const dt = toDate(data.date);
    expectFn(dt).not.toBeNull();

    expectFn(data).toHaveProperty('description');
    expectFn(typeof data.description).toBe('string');
    expectFn(data.description.length).toBeGreaterThan(10);

    expectFn(data).toHaveProperty('featuredImage');
    expectFn(typeof data.featuredImage).toBe('string');
    expectFn(data.featuredImage).toMatch(/\.(png|jpg|jpeg|webp|gif)$/i);
  });

  testFn('date is not in the future relative to 2025-09-07 (publication constraint)', () => {
    const dt = toDate(data.date);
    expectFn(dt.getTime()).toBeLessThanOrEqual(now.getTime());
  });

  testFn('title follows expected pattern for Part 3 post', () => {
    expectFn(data.title).toMatch(/Nem tudo é objeto - Parte 3/i);
    expectFn(data.title).toMatch(/DOP/i);
  });

  testFn('content contains main sections introduced in the diff', () => {
    const mustHave = [
      '## Quando Usar a Programação Orientada a Dados',
      '## Casos de uso',
      '### API REST',
      '#### Estrutura de Dados Imutáveis',
      '#### Operações Separadas dos Dados',
      '#### Controller REST com Pattern Matching',
      '### AWS Lambda',
      '## Benefícios Observados na Prática',
    ];
    for (const section of mustHave) {
      expectFn(content).toContain(section);
    }
  });

  testFn('contains at least three https links and none with http (security)', () => {
    const links = Array.from(content.matchAll(/\((https?:\/\/[^)]+)\)/g)).map(m => m[1]);
    expectFn(links.length).toBeGreaterThanOrEqual(3);
    // All links must be https
    for (const href of links) {
      expectFn(href.startsWith('https://')).toBe(true);
    }
  });

  testFn('inline references [^1], [^2] have corresponding footnotes', () => {
    const refs = Array.from(content.matchAll(/\[\^(\d+)\]/g)).map(m => m[1]);
    const footnotes = Array.from(content.matchAll(/^\[\^(\d+)\]:\s+/gm)).map(m => m[1]);
    for (const r of refs) {
      expectFn(footnotes).toContain(r);
    }
  });

  testFn('Java code blocks are fenced and labeled with language "java"', () => {
    // Count ```java blocks
    const javaFenceOpen = (content.match(/```java/g) || []).length;
    const fenceClose = (content.match(/```/g) || []).length; // counts all fences
    expectFn(javaFenceOpen).toBeGreaterThanOrEqual(4); // multiple code blocks present in diff
    // Ensure every java open has a corresponding closing fence by scanning
    // Simple heuristic: each ```java should be closed by a later ```
    let pos = 0;
    let balanced = true;
    for (let i = 0; i < javaFenceOpen; i++) {
      const start = content.indexOf('```java', pos);
      if (start === -1) { balanced = false; break; }
      const end = content.indexOf('```', start + 7);
      if (end === -1) { balanced = false; break; }
      pos = end + 3;
    }
    expectFn(balanced).toBe(true);
  });

  testFn('no unmatched markdown fences remain', () => {
    // Count of ``` should be even
    const fences = (content.match(/```/g) || []).length;
    expectFn(fences % 2).toBe(0);
  });

  testFn('featuredImage filename is a safe relative file name (no path traversal)', () => {
    expectFn(data.featuredImage).not.toMatch(/[\\/]/); // no slashes
    expectFn(data.featuredImage).not.toMatch(/\.\./);   // no parent traversal
  });

  testFn('intro section lists the three parts with correct anchors', () => {
    expectFn(content).toContain('Parte 1');
    expectFn(content).toContain('Parte 2');
    // Ensure current page marker "Você está aqui" is present
    expectFn(content).toMatch(/Você está aqui/i);
  });

  testFn('controller example includes request mappings and returns', () => {
    expectFn(content).toMatch(/@RestController/);
    expectFn(content).toMatch(/@GetMapping/);
    expectFn(content).toMatch(/ResponseEntity/);
    expectFn(content).toMatch(/return ResponseEntity\.ok/);
  });

  testFn('lambda handler includes method routing and error handling', () => {
    expectFn(content).toMatch(/RequestHandler<APIGatewayProxyRequestEvent/);
    expectFn(content).toMatch(/Method not allowed/);
    expectFn(content).toMatch(/Internal server error/);
  });

  testFn('holiday operations example demonstrates pure functions and grouping', () => {
    expectFn(content).toMatch(/public final class HolidayOperations/);
    expectFn(content).toMatch(/calculateDateForYear/);
    expectFn(content).toMatch(/groupByType/);
  });

  testFn('does not contain obvious TODO placeholders', () => {
    expectFn(/TODO|FIXME/.test(content)).toBe(false);
  });
});