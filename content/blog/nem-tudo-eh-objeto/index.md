---
title: "Nem tudo é objeto"
date: "2025-07-20"
description: "Programação Orientada a Dados em Java"
featuredImage: feature.png
---

## A Arte de Simplificar a Complexidade

Os detalhes são importante, porém trazem o custo de transformarem as coisas mais
complexas. É assim na vida. É assim no desenvolvimento de software. O processo
de desenhar e construir sistemas de software depende indubitavelmente das
linguagens, de software ou da linguagem natural. Essa última é por essência
ambígua e ambiguidade gera complexidade.

Em seu livro *A Philosophy of Software Design*[^24], John Ousterhout discute duas
maneiras principais de lidar com a complexidade. A primeira é simplificar e
tornar o código mais claro para reduzir a complexidade, por exemplo, removendo
casos especiais e utilizando identificadores consistentes. A segunda abordagem é
encapsular a complexidade por meio de um design modular, no qual um sistema de
software é dividido em módulos, como classes em uma linguagem orientada a
objetos, permitindo que os programadores trabalhem no sistema sem se sentirem
sobrecarregados com toda a sua complexidade de uma só vez. Eu acrescentaria um
terceiro que são os modelos.

Modelos são uma representação abstrata de um sistema (de software) que nos
auxilia a compreender e simplificar a complexidade inerente. Eles nos permitem
visualizar e comunicar as diferentes partes e interações do sistema, facilitando
o processo de planejamento e construção. Ao fornecer uma estrutura clara e
organizada, os modelos ajudam a reduzir a ambiguidade e a tornar o sistema mais
compreensível.

Engana-se quem pensa que o uso de modelos é uma abordagem exclusiva do
desenvolvimento de software para lidar com a complexidade. Imagine um artista de
origami criando um cisne a partir de uma simples folha de papel. O resultado
final captura a essência elegante da ave — seu pescoço curvado, suas asas
dobradas, sua postura graciosa — mas deixa de lado detalhes desnecessários como
a textura das penas ou a cor dos olhos. O origami não busca replicar
perfeitamente a realidade, mas sim extrair e representar apenas os aspectos mais
importantes e reconhecíveis.

![](2025-07-24-22-06-03.png)

O desenvolvimento de software deve considerar constantemente questões de design,
sendo minimizar a complexidade o principal aspecto do projeto de software[^24].
Em geral a primeira estratégia para reduzir a
complexidade é desenhar e construir um sistema que esteja aderente a determinado
paradigmas de programação. Os paradigmas foram criados para nos ajudar a reduzir
a complexidade do mundo real e mapeá-la em sistemas de software compreensíveis e
funcionais. Assim como o origami, cada paradigma oferece uma forma específica de
"transformar" a realidade em código, capturando os aspectos essenciais do
domínio que estamos modelando enquanto abstrai detalhes desnecessários.

Quando desenvolvemos software, não estamos tentando recriar o mundo real em sua
totalidade — isso seria impossível e improdutivo. Em vez disso, utilizamos
paradigmas como ferramentas conceituais que nos permitem focar nos elementos
mais relevantes para resolver problemas específicos, criando representações
elegantes e funcionais da complexidade que nos cerca.

## Panorama dos Paradigmas de Programação

Ao longo do tempo diferentes paradigmas de programação emergiram para abordar
distintos tipos de problemas e formas de pensar sobre software. Cada um oferece
uma perspectiva única sobre como organizar código, gerenciar estado e estruturar
soluções.

Um paradigma de programação determina uma linguagem de programação, e não o
contrário. Em outras palavras, um paradigma de programação define como os
problemas são resolvidos com código, e uma linguagem de programação é a
ferramenta que permite a implementação dessas soluções. Dado que uma linguagem
pode suportar um ou mais paradigmas, a partir da análise da adoção das
linguagens[^17] possível inferir quais são os paradigmas mais utilizados.
Independente da metodologia adotada é bem possível que o resultado dos
paradigmas mais utilizados será *procedural, orientado a objetos e funcional*,
não necessariamente nessa ordem.

![](2025-07-24-22-08-06.png)

### Comparação dos Principais Paradigmas

A tabela a seguir faz uma breve comparação entre os principais paradigmas
adotados pelo mercado, ao mesmo tempo que os compara com uma nova abordagem,
orientado a dados, ao que explicarei com mais detalhes um pouco mais a frente.

| Aspecto | Procedural | Orientado a Objetos | Funcional | Orientado a Dados |
|---------|------------|-------------------|-----------|------------------|
| **Foco Principal** | Sequência de procedimentos | Objetos e suas interações | Funções e transformações | Estrutura e fluxo de dados |
| **Gerenciamento de Estado** | Estado global/local mutável | Estado encapsulado em objetos | Estado imutável | Dados imutáveis |
| **Reutilização** | Funções e módulos | Herança e composição | Funções puras | Estruturas de dados |
| **Testabilidade** | Moderada (dependências) | Boa (isolamento) | Excelente (pureza) | Excelente (imutabilidade) |
| **Tratamento de Complexidade** | Decomposição em funções | Abstração e encapsulamento | Composição de funções | Separação dados/comportamento |

Para facilitar a discussão dos objetivos e limites da *Programação Orientada a
Dados (POD)* vamos utilizar como base a Programacao Orientada a Objetos (POO).
Entretanto, durante esse artigo você observará que a POD também bebe da fonte
dos paradigmas funcional e procedural.

## Fundamentos da Programação Orientada a Objetos

A Programação Orientada a Objetos (POO) deve a sua larga adoção a linguagens como
Java e C++. É importante salientar que Java não é uma linguagem puramente
orientada a objetos principalmente por conta tipos primitivos e os métodos
estáticos (static) que pertencem à classe e não a um objeto. Um exemplo de uma
linguagem puramente orientada a objetos é o
[Smalltalk](https://www.gnu.org/software/smalltalk/), onde tudo é tratado como
objeto.

Apesar de Java não ser um linguagem orientada a objetos "puro-sangue" o seu uso
extensivo na indústria de software contribuiu para popularizar os princípios de
POO. Este paradigma de programação enfatiza a modelagem de sistemas por meio de
objetos que possuem propriedades e comportamentos, promovendo a reutilização de
código e o encapsulamento de dados. Os Seus princípios fundamentais incluem:

- **Encapsulamento**: Agrupa dados e métodos que operam sobre esses dados em uma única unidade (classe), controlando o acesso através de modificadores de visibilidade.
- **Herança**: Permite que classes derivem características de outras classes, promovendo reutilização de código.
- **Abstração**: Oculta detalhes de implementação complexos, expondo apenas interfaces necessárias.
- **Polimorfismo**: Permite que objetos de diferentes tipos sejam tratados através de uma interface comum.

### Exemplo Prático em Java

Para exemplificar o uso dos princípios da POO vamos modelar um sistema
responsável por gerenciar feriados (`Holiday`). Acredito que leitor saiba o que
é um feriado, contudo, listarei algumas regras que serão importante no desenho
da solução.

- **Existem diferentes tipos de feriados**: Nacionais (Independência), religiosos (Natal, Ramadan), regionais (São João) e comerciais (Valentine's Day)[^1]

- **Os feriados podem ser fixos ou móveis**: Fixos sempre na mesma data (25/12), móveis calculados por lua (Páscoa), dia da semana (Memorial Day) ou calendário lunar (Eid)[^4]

- **Os feriados dependem de qual sistemas de calendário adotado**: Gregoriano (feriados ocidentais), lunar islâmico (Ramadan "roda" 11 dias/ano), luni-solar judaico (Rosh Hashanah varia mas mantém sazonalidade)[^7]

- **Data agendada diferente da osbervada**: Feriado pode ter data oficial diferente da celebrada - "Mondayisation" move feriados de fim de semana para segunda-feira[^10]

- **Diferentes regras de observância**: Alguns começam no pôr do sol anterior (judaicos/islâmicos), têm duração variável (Chanukah 8 dias), só aplicam em dias úteis e não duplicam benefícios[^15]

A modelagem da classe `Holiday` segue uma abordagem hierárquica típica da POO,
onde uma classe abstrata define o contrato comum e as características
compartilhadas por todos os tipos de feriados. A classe base encapsula
propriedades essenciais como nome, descrição, localidades onde é observado, tipo
de feriado e regras de "mondayisation" (ajuste para dias úteis), além de
comportamentos comuns como verificação de fim de semana e cálculo de data
observada. Um aspecto fundamental da POO é que a classe `Holiday` encapsula seu
estado através da propriedade `date`, mantendo as regras de cálculo da data como
responsabilidade interna - a própria classe gerencia como calcular a data de um
feriado para cada ano, ocultando essa complexidade do código cliente. As
subclasses `FixedHoliday` e `MoveableHoliday` especializam a implementação do
método abstrato `getDate()`, onde feriados fixos simplesmente retornam a mesma
data anual, enquanto feriados móveis executam algoritmos complexos - desde
cálculos astronômicos para a Páscoa até regras baseadas em dias da semana ou
dependências de outros feriados. Esta estrutura permite que o sistema trate
uniformemente diferentes tipos de feriados através de polimorfismo, ocultando a
complexidade específica de cada tipo de cálculo atrás de uma interface
consistente.

```
                    ┌─────────────────────────────────┐
                    │           Holiday               │
                    │         (abstract)              │
                    ├─────────────────────────────────┤
                    │ - name: String                  │
                    │ - description: String           │
                    │ - day: int                      │
                    │ - month: Month                  │
                    │ - localities: List<Locality>    │
                    │ - type: HolidayType             │
                    │ - mondayisation: boolean        │
                    ├─────────────────────────────────┤
                    │ + getDate(year: int): LocalDate │
                    │ + getObserved(year: int):       │
                    │   LocalDate                     │
                    │ + getName(): String             │
                    │ + getType(): HolidayType        │
                    └─────────────────────────────────┘
                                    △
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
        ┌─────────────────────────┐     ┌─────────────────────────┐
        │     FixedHoliday        │     │   MoveableHoliday       │
        ├─────────────────────────┤     ├─────────────────────────┤
        │                         │     │ - moveableType:         │
        │                         │     │   MoveableHolidayType   │
        │                         │     │ - baseHoliday: Holiday  │
        │                         │     │ - dayOffset: int        │
        ├─────────────────────────┤     ├─────────────────────────┤
        │ + getDate(year: int):   │     │ + getDate(year: int):   │
        │   LocalDate             │     │   LocalDate             │
        └─────────────────────────┘     │ + calculateEasterSunday │
                                        │   (year: int): LocalDate│
                                        └─────────────────────────┘
```

A modelagem orientada a objetos demonstra claramente os quatro princípios
fundamentais da POO. O **encapsulamento** é evidenciado pela classe abstrata
`Holiday` que agrupa dados (nome, descrição, localidades) e comportamentos
(cálculo de datas, verificação de fim de semana) em uma única unidade coesa,
controlando o acesso através de métodos públicos bem definidos. A **herança**
permite que `FixedHoliday` e `MoveableHoliday` compartilhem características
comuns da classe pai, evitando duplicação de código e estabelecendo uma
hierarquia lógica entre os conceitos.

O **polimorfismo** é implementado através do método abstrato `getDate(int
year)`, onde cada subclasse fornece sua própria implementação específica -
feriados fixos retornam sempre a mesma data, enquanto feriados móveis executam
cálculos complexos como o algoritmo astronômico da Páscoa. A **abstração**
oculta a complexidade dos diferentes tipos de cálculo de datas atrás de uma
interface uniforme, permitindo que o código cliente trate todos os feriados de
forma consistente, independentemente de serem fixos ou móveis.

```java
// Classe abstrata demonstrando encapsulamento e abstração
public abstract class Holiday {
    private String name;
    private String description;
    private List<Locality> localities;
    private HolidayType type;
    private boolean mondayisation;
    
    // Método abstrato para polimorfismo
    public abstract LocalDate getDate(int year);
    
    // Comportamento comum encapsulado
    public LocalDate getObserved(int year) {
        LocalDate actualDate = getDate(year);
        return mondayisation ? applyMondayisationRules(actualDate) : actualDate;
    }
    
    public boolean isWeekend(int year) {
        DayOfWeek dayOfWeek = getDate(year).getDayOfWeek();
        return dayOfWeek == DayOfWeek.SATURDAY || dayOfWeek == DayOfWeek.SUNDAY;
    }
}

// Herança: FixedHoliday especializa Holiday
public class FixedHoliday extends Holiday {
    @Override
    public LocalDate getDate(int year) {
        return LocalDate.of(year, getMonth(), getDay());
    }
}

// Herança: MoveableHoliday com lógica complexa
public class MoveableHoliday extends Holiday {
    private final MoveableHolidayType moveableType;
    private final Holiday baseHoliday;
    private final int dayOffset;
    
    @Override
    public LocalDate getDate(int year) {
        return switch (moveableType) {
            case LUNAR_BASED -> calculateEasterSunday(year);
            case RELATIVE_TO_HOLIDAY -> baseHoliday.getDate(year).plusDays(dayOffset);
            case WEEKDAY_BASED -> calculateWeekdayBasedDate(year);
        };
    }
}

// Uso polimórfico - mesmo código para diferentes tipos
List<Holiday> holidays = List.of(
    new FixedHoliday("Christmas", "Birth of Christ", 25, Month.DECEMBER, 
                     localities, HolidayType.RELIGIOUS, true),
    new MoveableHoliday("Easter", "Resurrection of Christ", 
                        localities, HolidayType.RELIGIOUS, 
                        MoveableHolidayType.LUNAR_BASED, true)
);

// Polimorfismo em ação
for (Holiday holiday : holidays) {
    LocalDate date = holiday.getDate(2024); // Cada tipo calcula diferentemente
    System.out.println(holiday.getName() + ": " + date);
}
```

Apesar dos benefícios da modelagem orientada a objetos, a implementação
apresenta limitações inerentes ao paradigma que podem comprometer a integridade
dos dados e a previsibilidade do sistema:

• **Lista mutável exposta:** O método `getLocalities()` retorna uma referência direta à lista interna, permitindo que código externo modifique o estado do objeto sem controle da classe

• **Estado mutável:** Os campos `date` e `observed` podem ser alterados após a criação do objeto através dos métodos `setDate()` e `setObserved()`, violando a expectativa de imutabilidade de um feriado

• **Falta de cópia defensiva:** A lista de localidades não é protegida contra modificação externa, criando vazamentos de encapsulamento que podem levar a bugs sutis e difíceis de rastrear

Essas limitações são características inerentes ao paradigma orientado a objetos,
onde o foco no encapsulamento de dados e comportamento pode inadvertidamente
criar pontos de mutabilidade não controlada. A Programação Orientada a Dados
emerge como uma alternativa que aborda diretamente esses problemas, priorizando
a imutabilidade dos dados e a separação clara entre informação e processamento,
eliminando os riscos associados ao estado mutável compartilhado.

📁 **Código Fonte Completo**: [github.com/vagnerclementino/api-holiday](https://github.com/vagnerclementino/api-holiday)

## Programação Orientada a Dados: Uma Nova Perspectiva

A Programação Orientada a Dados (Data-Oriented Programming) representa uma
mudança fundamental na forma como pensamos sobre software. Em vez de focar em
objetos que encapsulam dados e comportamento, este paradigma prioriza a
estrutura e o fluxo dos dados, separando claramente informação de processamento.

![](2025-07-24-22-21-00.png)

### Os Quatro Princípios Fundamentais

A Programação Orientada a Dados se baseia em quatro princípios fundamentais que,
quando aplicados em conjunto, criam sistemas mais robustos, previsíveis e fáceis
de manter. Vamos explorar cada princípio usando nossa implementação de feriados
como exemplo prático.

#### 1. Dados são Imutáveis

A imutabilidade elimina uma classe inteira de bugs relacionados a modificações
inesperadas de estado. Em Java, podemos usar records[^18] para criar estruturas
imutáveis de forma concisa:

```java
// Estrutura imutável usando record
public record FixedHoliday(
    String name, 
    String description, 
    LocalDate date, 
    List<Locality> localities, 
    HolidayType type
) implements Holiday {
    
    // Compact constructor com validação
    public FixedHoliday {
        Objects.requireNonNull(name, "Holiday name cannot be null");
        Objects.requireNonNull(date, "Holiday date cannot be null");
        if (name.isBlank()) {
            throw new IllegalArgumentException("Holiday name cannot be blank");
        }
    }
}

// Operações como funções puras - sempre retornam novas instâncias
public class HolidayOperations {
    public static Holiday updateDescription(Holiday holiday, String newDescription) {
        return switch (holiday) {
            case FixedHoliday fixed -> new FixedHoliday(
                fixed.name(), newDescription, fixed.date(), 
                fixed.localities(), fixed.type()
            );
            case MoveableHoliday moveable -> new MoveableHoliday(
                moveable.name(), newDescription, moveable.date(),
                moveable.localities(), moveable.type(), 
                moveable.knownHoliday(), moveable.mondayisation()
            );
            // Outros casos...
        };
    }
}
```

#### 2. Modele os Dados, Todos os Dados, e Nada Além dos Dados

Este princípio enfatiza que nossas estruturas de dados devem representar
fielmente o domínio, sem adicionar complexidade desnecessária ou omitir
informações importantes:

```java
// Interface selada que define exatamente os tipos de feriados possíveis
public sealed interface Holiday 
    permits FixedHoliday, ObservedHoliday, MoveableHoliday, MoveableFromBaseHoliday {
    
    String name();
    String description();
    LocalDate date();
    List<Locality> localities();
    HolidayType type();
    
    // Métodos default para funcionalidade comum
    default boolean isWeekend() {
        DayOfWeek dayOfWeek = date().getDayOfWeek();
        return dayOfWeek == DayOfWeek.SATURDAY || dayOfWeek == DayOfWeek.SUNDAY;
    }
}

// Cada tipo contém exatamente os dados necessários
public record MoveableHoliday(
    String name,
    String description, 
    LocalDate date,
    List<Locality> localities,
    HolidayType type,
    KnownHoliday knownHoliday,  // Específico para feriados móveis
    boolean mondayisation       // Específico para feriados móveis
) implements Holiday { }
```

#### 3. Torne Estados Ilegais Irrepresentáveis

Use o sistema de tipos para prevenir estados inválidos em tempo de compilação
através de _sealed interfaces_[^19]:

```java
// Interface selada impede tipos inválidos de localidade
public sealed interface Locality 
    permits Locality.Country, Locality.Subdivision, Locality.City {
    
    // Hierarquia bem definida
    record Country(String code, String name) implements Locality {
        public Country {
            Objects.requireNonNull(code, "Country code cannot be null");
            Objects.requireNonNull(name, "Country name cannot be null");
        }
    }
    
    record Subdivision(Country country, String code, String name) implements Locality {
        public Subdivision {
            Objects.requireNonNull(country, "Country cannot be null");
            Objects.requireNonNull(code, "Subdivision code cannot be null");
        }
    }
    
    record City(String name, Subdivision subdivision) implements Locality {
        public City {
            Objects.requireNonNull(name, "City name cannot be null");
            Objects.requireNonNull(subdivision, "Subdivision cannot be null");
        }
    }
}

// Pattern matching garante tratamento de todos os casos
public boolean appliesTo(Locality targetLocality) {
    return localities().stream()
        .anyMatch(holidayLocality -> 
            switch (holidayLocality) {
                case Locality.Country country -> 
                    matchesCountry(country, targetLocality);
                case Locality.Subdivision subdivision -> 
                    matchesSubdivision(subdivision, targetLocality);
                case Locality.City city -> 
                    matchesCity(city, targetLocality);
            }
        );
}
```

#### 4. Separe Operações dos Dados

Mantenha dados e comportamentos separados, com operações implementadas como
funções puras:

```java
// Dados puros - apenas estrutura
public record FixedHoliday(...) implements Holiday { }

// Operações separadas - funções puras
public class HolidayOperations {
    
    public static Holiday calculateDateForYear(Holiday holiday, int year) {
        return switch (holiday) {
            case FixedHoliday fixed -> new FixedHoliday(
                fixed.name(), fixed.description(),
                LocalDate.of(year, fixed.date().getMonth(), fixed.date().getDayOfMonth()),
                fixed.localities(), fixed.type()
            );
            
            case MoveableHoliday moveable -> new MoveableHoliday(
                moveable.name(), moveable.description(),
                calculateMoveableDate(moveable.knownHoliday(), year),
                moveable.localities(), moveable.type(),
                moveable.knownHoliday(), moveable.mondayisation()
            );
        };
    }
    
    public static List<Holiday> filterByCountry(List<Holiday> holidays, String countryCode) {
        return holidays.stream()
            .filter(holiday -> holiday.isObservedInCountry(countryCode))
            .toList();
    }
    
    public static boolean isGovernmental(Holiday holiday) {
        return holiday.type() == HolidayType.NATIONAL ||
               holiday.type() == HolidayType.STATE ||
               holiday.type() == HolidayType.MUNICIPAL;
    }
}
```

### Funcionalidades Java para Data-Oriented Programming

Java evoluiu significativamente para suportar melhor os princípios da
Programação Orientada a Dados. As funcionalidades modernas da linguagem
facilitam a implementação dos quatro princípios fundamentais:

| Funcionalidade | Versão Java | Descrição | Uso em DOP |
|---|---|---|---|
| **Records**[^18] | Java 14 (Preview) Java 16 (Final) | Classes imutáveis concisas com equals, hashCode e toString automáticos | Modelagem de dados imutáveis |
| **Sealed Classes/Interfaces**[^19] | Java 15 (Preview) Java 17 (Final) | Controle sobre quais classes podem estender/implementar | Estados ilegais irrepresentáveis |
| **Pattern Matching (instanceof)**[^20] | Java 14 (Preview) Java 16 (Final) | Verificação de tipo e cast em uma operação | Operações sobre dados |
| **Pattern Matching (switch)**[^21] | Java 17 (Preview) Java 21 (Final) | Switch expressions com pattern matching | Processamento de tipos selados |
| **Text Blocks**[^22] | Java 13 (Preview) Java 15 (Final) | Strings multilinha mais legíveis | Documentação e exemplos |

#### Exemplo Integrado das Funcionalidades

```java
// Records + Sealed Interface + Pattern Matching
public sealed interface Holiday permits FixedHoliday, MoveableHoliday {
    String name();
    LocalDate date();
    HolidayType type();
}

public record FixedHoliday(String name, LocalDate date, HolidayType type) 
    implements Holiday { }

public record MoveableHoliday(String name, LocalDate date, HolidayType type, 
                             KnownHoliday knownHoliday) implements Holiday { }

// Pattern Matching em Switch (Java 21)
public class HolidayProcessor {
    public String processHoliday(Holiday holiday) {
        return switch (holiday) {
            case FixedHoliday(var name, var date, var type) -> 
                "Fixed: " + name + " on " + date;
            case MoveableHoliday(var name, var date, var type, var known) -> 
                "Moveable: " + name + " (" + known + ") on " + date;
        };
    }
    
    public List<Holiday> getGovernmentalHolidays(List<Holiday> holidays) {
        return holidays.stream()
            .filter(this::isGovernmental)
            .sorted(Comparator.comparing(Holiday::date))
            .toList();
    }
    
    private boolean isGovernmental(Holiday holiday) {
        return switch (holiday.type()) {
            case NATIONAL, STATE, MUNICIPAL -> true;
            case RELIGIOUS, COMMERCIAL -> false;
        };
    }
}
```

Essas funcionalidades trabalham em conjunto para tornar a implementação de DOP em Java mais natural e expressiva, reduzindo significativamente o boilerplate code e aumentando a segurança de tipos.

#### Diagrama de Classes - Modelagem DOP

![Diagrama de Classes DOP](holiday-dop-diagram.puml)

A modelagem DOP apresenta uma estrutura fundamentalmente diferente da POO. A
sealed interface `Holiday` define apenas o contrato de dados (métodos de
acesso), enquanto cada record implementa exatamente os dados necessários para
seu tipo específico. Observe como não há herança de implementação - cada record
é independente e contém apenas os dados relevantes para seu contexto, eliminando
campos desnecessários e garantindo que estados ilegais sejam irrepresentáveis
pelo sistema de tipos.

![](2025-08-10-11-28-31.png)

## Exemplo Prático: API de Feriados Públicos

Para demonstrar todos os conceitos da programação orientada a dados na prática,
desenvolvemos uma API REST completa para gerenciar feriados públicos. O projeto
completo está disponível no GitHub e pode ser executado localmente usando Docker
Compose.

📁 **Código Fonte Completo**: [github.com/vagnerclementino/odp-api-holiday](https://github.com/vagnerclementino/api-holiday)

### Handler do AWS Lambda

```java
public class HolidayLambdaHandler implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {
    
    private final HolidayService holidayService;
    private final ObjectMapper objectMapper;
    
    public HolidayLambdaHandler() {
        this.holidayService = new HolidayService(new DynamoDBHolidayRepository());
        this.objectMapper = new ObjectMapper()
            .registerModule(new JavaTimeModule())
            .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    }
    
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
    
    private APIGatewayProxyResponseEvent handleGet(APIGatewayProxyRequestEvent request) throws Exception {
        var pathParameters = request.getPathParameters();
        
        if (pathParameters != null && pathParameters.containsKey("id")) {
            // GET /holidays/{id}
            var id = pathParameters.get("id");
            var holiday = holidayService.findById(id);
            
            return holiday
                .map(h -> createResponse(200, HolidayMapper.toResponse(h)))
                .orElse(createResponse(404, Map.of("error", "Holiday not found")));
        } else {
            // GET /holidays with filters
            var filter = extractFilters(request.getQueryStringParameters());
            var holidays = holidayService.findHolidays(filter);
            var responses = holidays.stream()
                .map(HolidayMapper::toResponse)
                .toList();
            
            return createResponse(200, responses);
        }
    }
    
    private APIGatewayProxyResponseEvent handlePost(APIGatewayProxyRequestEvent request) throws Exception {
        var holidayRequest = objectMapper.readValue(request.getBody(), CreateHolidayRequest.class);
        
        var validation = HolidayValidator.validateCreation(holidayRequest);
        if (validation instanceof ValidationResult.Failure failure) {
            return createResponse(400, Map.of("errors", failure.errors()));
        }
        
        var holiday = HolidayMapper.fromRequest(holidayRequest);
        var savedHoliday = holidayService.save(holiday);
        
        return createResponse(201, HolidayMapper.toResponse(savedHoliday));
    }
    
    private APIGatewayProxyResponseEvent handlePut(APIGatewayProxyRequestEvent request) throws Exception {
        var pathParameters = request.getPathParameters();
        if (pathParameters == null || !pathParameters.containsKey("id")) {
            return createResponse(400, Map.of("error", "ID is required"));
        }
        
        var id = pathParameters.get("id");
        var holidayRequest = objectMapper.readValue(request.getBody(), CreateHolidayRequest.class);
        
        var validation = HolidayValidator.validateCreation(holidayRequest);
        if (validation instanceof ValidationResult.Failure failure) {
            return createResponse(400, Map.of("errors", failure.errors()));
        }
        
        var updatedHoliday = HolidayMapper.fromRequest(holidayRequest);
        var result = holidayService.update(id, updatedHoliday);
        
        return result
            .map(h -> createResponse(200, HolidayMapper.toResponse(h)))
            .orElse(createResponse(404, Map.of("error", "Holiday not found")));
    }
    
    private APIGatewayProxyResponseEvent handleDelete(APIGatewayProxyRequestEvent request) {
        var pathParameters = request.getPathParameters();
        if (pathParameters == null || !pathParameters.containsKey("id")) {
            return createResponse(400, Map.of("error", "ID is required"));
        }
        
        var id = pathParameters.get("id");
        var deleted = holidayService.delete(id);
        
        return deleted 
            ? createResponse(204, null)
            : createResponse(404, Map.of("error", "Holiday not found"));
    }
    
    private HolidayFilter extractFilters(Map<String, String> queryParams) {
        if (queryParams == null) {
            return new HolidayFilter(
                Optional.empty(), Optional.empty(), Optional.empty(),
                Optional.empty(), Optional.empty(), Optional.empty()
            );
        }
        
        return new HolidayFilter(
            Optional.ofNullable(queryParams.get("country")),
            Optional.ofNullable(queryParams.get("state")),
            Optional.ofNullable(queryParams.get("city")),
            Optional.ofNullable(queryParams.get("startDate")).map(LocalDate::parse),
            Optional.ofNullable(queryParams.get("endDate")).map(LocalDate::parse),
            Optional.ofNullable(queryParams.get("type")).map(t -> HolidayType.valueOf(t.toUpperCase()))
        );
    }
    
    private APIGatewayProxyResponseEvent createResponse(int statusCode, Object body) {
        var response = new APIGatewayProxyResponseEvent();
        response.setStatusCode(statusCode);
        response.setHeaders(Map.of(
            "Content-Type", "application/json",
            "Access-Control-Allow-Origin", "*"
        ));
        
        if (body != null) {
            try {
                response.setBody(objectMapper.writeValueAsString(body));
            } catch (Exception e) {
                response.setStatusCode(500);
                response.setBody("{\"error\":\"Serialization error\"}");
            }
        }
        
        return response;
    }
}
```

#### Instruções de Uso

Para executar o projeto localmente:

```bash
# 1. Clone o repositório e navegue até o diretório
cd holidays-api

# 2. Configure o ambiente completo
make setup

# 3. Teste a API
make test

# 4. Para desenvolvimento contínuo
make build && make deploy

# 5. Visualizar logs
make logs

# 6. Limpar ambiente
make clean
```

### Benefícios da Abordagem Data-Oriented

O projeto demonstra como a programação orientada a dados oferece:

- **Previsibilidade**: Funções puras produzem sempre o mesmo resultado
- **Testabilidade**: Dados imutáveis facilitam testes unitários e de integração
- **Manutenibilidade**: Separação clara entre dados e comportamento
- **Performance**: Estruturas imutáveis podem ser otimizadas pela JVM
- **Concorrência**: Dados imutáveis são thread-safe por design

Esta configuração oferece um ambiente de desenvolvimento completo e isolado, permitindo testar todos os aspectos da programação orientada a dados sem custos de infraestrutura na nuvem.

## Conclusão

A Programação Orientada a Dados oferece uma perspectiva valiosa para o desenvolvimento de software moderno, especialmente em contextos onde a clareza dos dados, a imutabilidade e a testabilidade são prioritárias. Ao separar dados de comportamento e focar na estrutura das informações, conseguimos criar sistemas mais previsíveis, fáceis de testar e menos propensos a bugs relacionados a estado mutável.

O exemplo da API de feriados demonstra como esses princípios podem ser aplicados na prática, resultando em código mais limpo, estruturas de dados bem definidas e uma arquitetura que facilita tanto a manutenção quanto a evolução do sistema. Embora a Programação Orientada a Objetos continue sendo fundamental em Java, a incorporação de conceitos orientados a dados pode significativamente melhorar a qualidade e robustez de nossas aplicações.

A chave está em reconhecer que, assim como no origami, diferentes técnicas de "dobrar" o código podem revelar aspectos distintos da solução, e a escolha do paradigma adequado pode fazer toda a diferença na elegância e eficácia do resultado final.

[^1]: [Holiday](https://en.wikipedia.org/wiki/Holiday)
[^4]: [Moveable feast](https://en.wikipedia.org/wiki/Moveable_feast)
[^7]: [Islamic calendar](https://en.wikipedia.org/wiki/Islamic_calendar)
[^10]: [When a public holiday falls on a weekend](https://www.employment.govt.nz/leave-and-holidays/public-holidays/when-a-public-holiday-falls-on-a-weekend)
[^15]: [Religious Holidays](https://scl.cornell.edu/religiousholidays)
[^17]: [Stack Overflow Developer Survey 2025 - Most Popular Technologies](https://survey.stackoverflow.co/2025/technology#most-popular-technologies)
[^18]: [JEP 395: Records](https://openjdk.org/jeps/395)
[^19]: [JEP 409: Sealed Classes](https://openjdk.org/jeps/409)
[^20]: [JEP 394: Pattern Matching for instanceof](https://openjdk.org/jeps/394)
[^21]: [JEP 441: Pattern Matching for switch](https://openjdk.org/jeps/441)
[^22]: [JEP 378: Text Blocks](https://openjdk.org/jeps/378)
[^24]: [A Philosophy of Software Design - Book Review](https://blog.pragmaticengineer.com/a-philosophy-of-software-design-review/)