---
title: "Nem tudo é objeto - Parte 2: Programação Orientada a Dados"
date: "2025-08-11"
description: "Descubra como dados imutáveis e operações separadas podem tornar seu código mais limpo, seguro e fácil de manter"
featuredImage: feature.png
---

📖 **Esta é uma série em 3 partes sobre o paradigma de programação orientada a dados:**

- **[Parte 1](https://notes.clementino.me/blog/nem-tudo-eh-objeto-parte-1)**: A Arte de Lidar com a Complexidade
- **Parte 2**: Programação Orientada a Dados **Você está aqui** 👈🏿
- **[Parte 3](https://notes.clementino.me/blog/nem-tudo-eh-objeto-parte-3)**: Aplicando Programação Orientada a Dados na Prática

## Programação Orientada a Dados: Uma Nova Perspectiva

Na [Parte 1](https://notes.clementino.me/blog/nem-tudo-eh-objeto-parte-1),
exploramos como diferentes paradigmas lidam com a complexidade e identificamos
limitações inerentes a *Programação Orientada a Objetos - OOP*. Agora vamos
apresentar uma nova abordagem: a *Programação Orientada a Dados (Data-Oriented
Programming - DOP)*. A DOP representa uma perspectiva diferente em como pensamos
a modelagem de software. Em vez de focar em objetos que encapsulam dados e
comportamento, o paradigma prioriza a estrutura e o fluxo dos dados, separando
*a informação do seu processamento*.

A ideia de uma programação orientada a dados foi proposta originalmente por
Brian Goetz[^1], posteriormente, Nicolai Parlog[^2] refinou o conceito,
organizando melhor os princípios fundamentais. Este artigo apresenta uma visão
prática dos conceitos propostos por *Parlog*.

## Princípios Fundamentais

A Programação Orientada a Dados se baseia em quatro princípios fundamentais[^3]
que, quando aplicados em conjunto, criam sistemas robustos, previsíveis e
potencialmente mais fáceis de manter. A figura abaixo ilustra esses quatro
princípios fundamentais. Cada um dos princípios será descrito tomando como base
o desenho de um sistema de gerenciamento de feriados.

![Os princípios fundamentais da DOP - Fonte: Gerado por IA](four-pod-principles.png)

### 1. Dados são Imutáveis

A imutabilidade mitiga uma fonte comum de bugs como o de objetos que são
modificados por diferentes "subsistemas" sem comunicação adequada[^3]. Por
subsistemas estamos dizendo um módulo, função ou mesmo classe dentro de um
código fonte. Para exemplificar considere que um objeto em um `HashSet` e em
seguida alteramos qualquer propriedade desse objeto que por ventura seja usada
no cálculo do hash code. Essa alteração torna o objeto "inalcançável" na
estrutura, ou seja, não será possível recuperar o objeto pelo seu *hash*. Este
problema ocorre pelo fato de dois subsistemas (o `HashSet` e o código que
modifica o objeto) têm acesso ao mesmo objeto, contudo, com diferentes
requisitos para modificá-lo e nenhuma forma de comunicar essas necessidades. O
trecho de código a seguir demonstra o problema.

```java
// Problema conceitual: objeto mutável em HashSet
// Imagine uma classe FixedHoliday mutável com método setDate()
var holidays = new HashSet<Holiday>();
var christmas = new FixedHoliday("Christmas", 
                                 "Birth of Christ", 
                                 25,
                                 Month.DECEMBER,
                                 List.of(new Locality("BR")),
                                 HolidayType.RELIGIOUS, 
                                 false);
holidays.add(christmas);

// Objeto encontrado normalmente
System.out.println(holidays.contains(christmas)); // true

// Mutação quebra o contrato do HashSet
christmas.setDate(LocalDate.of(2024, 12, 24));

// Agora o objeto está "perdido" no HashSet
System.out.println(holidays.contains(christmas)); // false - objeto "perdido"
```

A solução para esse problema é direta: eliminando a mutabilidade, eliminamos
essa categoria de erros. Quando subsistemas compartilham apenas dados imutáveis,
o objeto não pode ser "perdido" no *HashSet* porque seu estado nunca muda após a
criação. Entretanto, aplicações reais precisam representar mudanças de estado. É
aqui que o primeiro princípio da DOP oferece uma alternativa: ao invés de
modificar objetos existentes, criamos novas instâncias com os dados alterados.
Para isso funcionar, os dados devem ser **transparentes**, ou seja, devem ser
acessíveis através de métodos de leitura e passiveis de serem recriados por meio
de construtores que aceitem todos os valores necessários. Essa transparência
garante que qualquer instância possa ser perfeitamente replicada ou transformada
em uma nova versão, mantendo a imutabilidade, enquanto permite a evolução do
estado através de novas instâncias.

Em termos práticos, isso significa que para "alterar" um objeto, você deve: (1)
obter seus dados atuais via *getters*, (2) modificar os valores necessários, e
(3) criar uma nova instância com o construtor apropriado. O exemplo a seguir
demonstra como implementar dados imutáveis e transparentes.

```java
// Solução: record imutável e transparente
public record FixedHoliday(
    String name, String description, LocalDate date, 
    List<Locality> localities, HolidayType type
) implements Holiday {
    
    public FixedHoliday {
        Objects.requireNonNull(name, "Holiday name cannot be null");
        if (name.isBlank()) {
            throw new IllegalArgumentException("Holiday name cannot be blank");
        }
        // Defensive copying para imutabilidade profunda
        localities = List.copyOf(localities);
    }
}
```

Os *Records*[^4] em Java foram criados especificamente como estruturas de dados
imutáveis e transparentes, atendendo perfeitamente aos requisitos da DOP. Eles
eliminam o *boilerplate* ao gerar automaticamente: (1) campos finais, (2)
construtor completo, (3) métodos de acesso, e (4) implementações consistentes de
`equals`/`hashCode`. Combinados com *defensive copying* (`List.copyOf()`) e
métodos de transformação que retornam novas instâncias, garantem imutabilidade e
transparência. O exemplo a seguir demonstra seu uso seguro em `HashSet`.

```java
// Transformações retornam novas instâncias (implementação DOP real)
public FixedHoliday withDate(LocalDate newDate) {
    return new FixedHoliday(name,
                           description,
                           newDate, 
                           newDate.getDayOfMonth(), 
                           newDate.getMonth(),
                           localities,
                           type
                        );
}

// Uso seguro - impossível quebrar o HashSet
var holidays = new HashSet<Holiday>();
var christmas = new FixedHoliday("Christmas", 
                                 "Birth of Christ", 
                                  LocalDate.of(2024, 12, 25), 
                                  25,
                                  Month.DECEMBER, 
                                  List.of(Locality.NATIONAL),
                                  HolidayType.RELIGIOUS
                                  );
holidays.add(christmas);
var christmasEve = christmas.withDate(LocalDate.of(2024, 12, 24)); // Nova instância
holidays.contains(christmas);    // Sempre true - objeto original inalterado
holidays.contains(christmasEve); // false - nova instância não está no set
```

Os *Records* representam a implementação nativa em Java dos princípios DOP,
automatizando campos finais, construtores e métodos de acesso. Entretanto,
classes tradicionais podem igualmente implementar imutabilidade e transparência
através de design cuidadoso: campos `final`, construtores que inicializam todos
os atributos, métodos *getter* sem *setters* e implementações consistentes de
`equals`/`hashCode`.

Independente da abordagem, a imutabilidade efetiva depende de acordos e padrões
de equipe: estabelecer convenções para *defensive copying*, definir
responsabilidades claras para validação de dados, padronizar métodos de
transformação imutável e, por fim, até definir um acordo entre o time de
desenvolvimento onde objetos não deveriam ser modificados após a instanciação.
Esses acordos transformam imutabilidade de algo estritamente técnico em parte da
cultura de desenvolvimento.

### 2. Modele os Dados, Todos os Dados, e Nada Além dos Dados

Este princípio enfatiza a criação de tipos específicos que representem fielmente
cada variação do domínio, evitando tipos genéricos com campos opcionais[^5].
Por exemplo, ao modelar o domínio de feriados, cujos detalhes estão na  
[Parte 1](https://notes.clementino.me/blog/nem-tudo-eh-objeto-parte-1), dessa
série, poderíamos definir/modelar um tipo genérico que tente acomodar todas as
variações de um feriado:

- Feriados fixos têm uma data definida
- Feriados móveis têm um algoritmo de cálculo
- Feriados observados podem ter datas diferentes da oficial

Ao criar um tipo genérico como `GenericHoliday` para todos os casos (abordagem
típica da OOP), estaríamos gerando um anti-padrão pelo fato de introduzimos
campos opcionais e regras implícitas sobre quais combinações são válidas para
cada tipo de feriado. Essa abordagem pode resultar em um código frágil e
propenso a erros, pois o compilador não consegue validar se as combinações de
campos estão corretas para cada contexto específico.

```java
// ANTES - Tipo genérico problemático
public record GenericHoliday(
    String name, 
    LocalDate date,
    LocalDate observed,        // null para feriados fixos
    KnownHoliday knownHoliday, // null para feriados fixos  
    Holiday baseHoliday,       // null para não-derivados
    int dayOffset,             // irrelevante para feriados fixos
    boolean mondayisation      // nem sempre aplicável
) {}
```

Em sistemas orientados a dados, a modelagem deve usar o sistema de tipos para
garantir que apenas estados válidos sejam representáveis. Feriados fixos não
devem ter campos para algoritmos de cálculo, dado que sempre vão ocorrer no
mesmo dia e mês. Tipos precisos transfere validações do tempo de execução para o
tempo de compilação, resultando em código mais seguro e desenvolvimento mais
eficiente.

```java
// DEPOIS - Sealed interface com tipos específicos
public sealed interface Holiday 
    permits FixedHoliday, ObservedHoliday, MoveableHoliday, MoveableFromBaseHoliday {

  String name();
  String description();
  LocalDate date();
  List<Locality> localities();
  HolidayType type();

  // Funcionalidade compartilhada
  default boolean isWeekend() {
    DayOfWeek dayOfWeek = date().getDayOfWeek();
    return dayOfWeek == DayOfWeek.SATURDAY || dayOfWeek == DayOfWeek.SUNDAY;
  }
}
```

Os *Sealed types* representam uma funcionalidade do Java 17+ que permite criar
hierarquias 'fechadas' de tipos. Ao declarar 
`public sealed interface Holiday permits (...)`,
estamos dizendo ao compilador: apenas estes tipos específicos podem implementar
`Holiday`, nenhum outro. Isso difere de interfaces tradicionais onde qualquer
classe pode implementá-las. Sealed types são ideais para modelar alternativas de
domínio onde conhecemos todas as variações possíveis e queremos impedir
extensões não controladas que poderiam quebrar a lógica do sistema.

Isso posto, uma alternativa para alcançar o segundo princípio é por meio de
*sealed interfaces*[^6] para modelar alternativas e criar *records* específicos
para cada variação. Em vez de múltiplos campos com requisitos mutuamente
exclusivos ou condicionais, criamos uma *sealed interface* para modelar as
alternativas e a usamos como tipo para um campo obrigatório.  Cada Record
implementa exatamente os dados necessários para seu tipo específico, eliminando
campos irrelevantes, melhorando a legibilidade e tornando o código mais fácil de
manter. As funcionalidades compartilhadas podem ser implementadas através de
métodos *default* na interface, como o método `isWeekend` do exemplo anterior,
evitando repetição entre implementações.

```java
// Cada tipo contém exatamente os dados necessários
public record FixedHoliday(
    String name, String description, int day, Month month, LocalDate date,
    List<Locality> localities, HolidayType type
) implements Holiday { }

public record MoveableHoliday(
    String name, String description, LocalDate date,
    List<Locality> localities, HolidayType type,
    KnownHoliday knownHoliday,    // Específico para feriados móveis
    boolean mondayisation         // Específico para feriados móveis
) implements Holiday { }
```

A modelagem anterior exemplifica o segundo princípio da DOP ao garantir que cada
tipo contenha exatamente os dados necessários para sua função específica. O
`FixedHoliday` possui campos `day` e `month` porque precisa representar uma data
fixa anual, enquanto o `MoveableHoliday` inclui `knownHoliday` (para algoritmos
de cálculo como Páscoa) e `mondayisation` (para regras de ajuste de fim de
semana) - campos que seriam irrelevantes em feriados fixos. Observe que ambos
compartilham dados essenciais como `name`, `description` e `localities` através
da interface `Holiday`, mas cada um adiciona apenas os campos específicos ao seu
domínio.

Essa abordagem elimina a necessidade de campos opcionais ou nulos, tornando
impossível criar estados inválidos como um feriado fixo com algoritmo de cálculo
ou um feriado móvel sem especificar seu tipo conhecido. O compilador Java
garante que cada instância contenha todos os dados necessários e nenhum dado
supérfluo, transformando regras de negócio em restrições do sistema de tipos.

Na prática, records frequentemente necessitam de customizações para uso efetivo
em DOP. A implementação padrão de `equals` usa todos os componentes, mas em
domínios reais é comum sobrescrever esse comportamento para usar identificadores
únicos - por exemplo, um `Holiday` pode usar apenas o `name` para igualdade, ou
um `Book` pode usar apenas o ISBN. Quanto aos métodos em records, as melhores
práticas sugerem priorizar:

- métodos sem parâmetros que derivam informação dos dados existentes
(`holiday.isWeekend()`)
- métodos que recebem o próprio tipo como parâmetro
(`holiday.isSameType(otherHoliday)`)
- evitar métodos com parâmetros mutáveis que possam transformar o record de
portador de dados em executor de operações complexas.

### 3. Torne Estados Ilegais Irrepresentáveis

O terceiro princípio define que apenas combinações legais de dados possam ser
representadas no sistema[^7]. O mundo é caótico e toda regra parece ter uma
exceção - "todo feriado tem uma data fixa" rapidamente se torna "todo feriado
fixo tem uma data fixa, mas os móveis dependem de cálculos complexos, e os
observados podem ter datas diferentes da oficial". Quando modelamos isso de
forma inadequada, podemos ficar presos com estruturas que permitem estados
inconsistentes.

Retomando o exemplo da modelagem problemática discutida anteriormente, onde
tentamos acomodar todos os tipos de feriados em uma classe genérica,
identificamos problemas fundamentais de design. Atributos como `baseHoliday` e
`dayOffset` são necessários apenas para feriados derivados (como Sexta-feira
Santa calculada a partir da Páscoa), mas ficam desnecessariamente presentes em
feriados fixos como o Natal. Ao tornar esses estados inconsistentes
irrepresentáveis através de tipos específicos, evitamos que:

- Regras de negócio permaneçam implícitas, ao invés de serem expressas através
do sistema de tipos
- Validações se espalhem pelo código, criando duplicação e inconsistências
- Desenvolvedores tenham dúvidas sobre quais campos são aplicáveis em cada
contexto específico

O exemplo a seguir demonstra como uma modelagem inadequada permite a criação de
estados logicamente impossíveis. A classe `BadHoliday` pode representar um
feriado fixo como o Natal com `baseHoliday` e `dayOffset` preenchidos (conceitos
irrelevantes para datas fixas), ou um feriado móvel sem `knownType` definido
(impossibilitando o cálculo da data). Pior ainda, permite criar feriados
observados onde `observedDate` é anterior a `actualDate`, violando a lógica de
que datas observadas são ajustes posteriores.

```java
// PROBLEMA: Estados ilegais são representáveis
public class BadHoliday {
    private String name;
    private LocalDate actualDate;
    private LocalDate observedDate;    // pode ser null
    private KnownHoliday knownType;    // pode ser null  
    private Holiday baseHoliday;       // pode ser null
    private int dayOffset;             // irrelevante para feriados fixos
    private boolean mondayisation;     // nem sempre aplicável
    
    // Permite criar: feriado fixo COM baseHoliday e dayOffset
    // Permite criar: feriado móvel SEM knownType  
    // Permite criar: feriado observado com observedDate anterior à actualDate
}
```

Ao não utilizar o sistema de tipos para expressar essas restrições, perdemos a
oportunidade de ter o compilador Java garantindo estados válidos
automaticamente. Esses estados ilegais não apenas confundem desenvolvedores, mas
podem causar bugs sutis em tempo de execução que o compilador não consegue
detectar, forçando a implementação de validações defensivas espalhadas pelo
código.

Parece óbvio, mas deveria ser regra que sistema, em especial os orientado a
dados, assegurem que apenas combinações legais dos dados possam ser
representadas. Para garantir esse requisito existem três níveis progressivos de
proteção:

- 🔒 **Primeiro**, use tipos precisos (sealed interfaces e records) para que o
compilador impeça a criação de tipos inválidos;
- ⚡ **Segundo**, em situações onde dados são mutuamente exclusivos, evite
múltiplos campos opcionais criando records específicos para cada variação;
- 🛡️ **Terceiro**, quando uma propriedade não pode ser expressa pelo sistema de
tipos, valide no construtor o mais cedo possível, idealmente na fronteira entre
o mundo externo e seu sistema.

O código a seguir detalha os três níveis de proteção que podem ser usados para
evitar estados inválidos.

```java
// Exemplo completo dos 3 níveis de proteção
public sealed interface Holiday  // Nível 1: Tipos precisos
    permits FixedHoliday, ObservedHoliday, MoveableHoliday, MoveableFromBaseHoliday {
    String name();
    String description();
    LocalDate date();
    List<Locality> localities();
    HolidayType type();
}

// Nível 2: Records específicos para cada variação
public record FixedHoliday(
    String name, String description, LocalDate date, int day, Month month,
    List<Locality> localities, HolidayType type
) implements Holiday { }

// Nível 3: Validação runtime para regras complexas
public record ObservedHoliday(
    String name, String description, LocalDate date, 
    List<Locality> localities, HolidayType type,
    LocalDate observed, boolean mondayisation
) implements Holiday {
    
    public ObservedHoliday {
        Objects.requireNonNull(name, "Holiday name cannot be null");
        Objects.requireNonNull(description, "Holiday description cannot be null");
        Objects.requireNonNull(date, "Holiday date cannot be null");
        Objects.requireNonNull(observed, "Observed date cannot be null");
        Objects.requireNonNull(localities, "Holiday localities cannot be null");
        Objects.requireNonNull(type, "Holiday type cannot be null");
        
        if (name.isBlank()) {
            throw new IllegalArgumentException("Holiday name cannot be blank");
        }
        if (localities.isEmpty()) {
            throw new IllegalArgumentException("Holiday must have at least one locality");
        }
        
        // Regra complexa: mondayisation em fim de semana deve ajustar a data
        if (mondayisation && date.equals(observed)) {
            DayOfWeek dayOfWeek = date.getDayOfWeek();
            if (dayOfWeek == DayOfWeek.SATURDAY || dayOfWeek == DayOfWeek.SUNDAY) {
                throw new IllegalArgumentException(
                    "Mondayisation is enabled but observed date equals original weekend date. " +
                    "Expected observed date to be adjusted for weekend.");
            }
        }
        
        localities = List.copyOf(localities); // Defensive copying
    }
}

// RESULTADO: Apenas estados legais são representáveis
var christmas = new FixedHoliday("Christmas", "Birth of Christ", 
                                LocalDate.of(2024, 12, 25), 25, Month.DECEMBER,
                                List.of(Locality.NATIONAL), HolidayType.RELIGIOUS);
var newYear = new ObservedHoliday("New Year", "First day of the year", 
                                 LocalDate.of(2024, 1, 1), 
                                 List.of(Locality.NATIONAL), HolidayType.NATIONAL,
                                 LocalDate.of(2024, 1, 1), false);

// Estes são IMPOSSÍVEIS de criar:
// - FixedHoliday com knownHoliday (campo não existe)
// - MoveableHoliday sem knownHoliday (construtor exige)
// - ObservedHoliday com mondayisation=true em fim de semana sem ajuste de data
```

Por fim, e não menos importante, para garantir estados válidos é fundamental
aplicamos **validação na fronteira**, ou seja,  validar os dados "externos" no
momento exato em que entram no sistema. Quando um feriado é carregado de um
arquivo JSON ou retornado de uma API, suas propriedades devem ser validadas
antes de criar o *record* correspondente. Construtores compactos[^9] são ideais
para isso, pois garantem que toda instância - independente de como foi criada -
passou pelas mesmas verificações. Assim, uma vez que um `FixedHoliday` existe no
sistema, podemos confiar que seus dados são válidos, eliminando verificações
defensivas nas demais partes do sistema.

### 4. Separe Operações dos Dados

O quarto e último princípio estabelece a separação entre dados e
comportamentos[^8]: records contêm apenas estrutura, enquanto operações são
implementadas como funções puras em classes dedicadas. Essa abordagem evita que
tipos centrais do domínio acumulem responsabilidades excessivas - um problema
comum na OOP - onde a classe `Holiday` acabaria com dezenas de métodos para
cálculo, formatação, validação e processamento, caracterizando o *code smell*
conhecido como *Large Class*[^10], tornando-se difícil de manter.

```java
// Dados puros - apenas estrutura
public record FixedHoliday(
    String name, String description, LocalDate date, int day, Month month,
    List<Locality> localities, HolidayType type
) implements Holiday { 
    
    public FixedHoliday {
        Objects.requireNonNull(name, "Holiday name cannot be null");
        Objects.requireNonNull(description, "Holiday description cannot be null");
        Objects.requireNonNull(date, "Holiday date cannot be null");
        Objects.requireNonNull(month, "Holiday month cannot be null");
        Objects.requireNonNull(localities, "Holiday localities cannot be null");
        Objects.requireNonNull(type, "Holiday type cannot be null");
        
        if (name.isBlank()) {
            throw new IllegalArgumentException("Holiday name cannot be blank");
        }
        if (localities.isEmpty()) {
            throw new IllegalArgumentException("Holiday must have at least one locality");
        }
        localities = List.copyOf(localities);
    }
}

public record MoveableHoliday(
    String name, String description, LocalDate date,
    List<Locality> localities, HolidayType type,
    KnownHoliday knownHoliday, boolean mondayisation
) implements Holiday { }

// Operações separadas - funções puras
public final class HolidayOperations {
    
    public Holiday calculateDate(Holiday holiday, int year) {
        Objects.requireNonNull(holiday, "Holiday cannot be null");
        validateYear(year);
        
        return switch (holiday) {
            case FixedHoliday fixed -> {
                LocalDate newDate = calculateFixedDate(fixed, year);
                yield fixed.withDate(newDate);
            }
            case ObservedHoliday observed -> {
                LocalDate newDate = calculateFixedDate(observed, year);
                LocalDate newObserved = observed.mondayisation() ? 
                    applyMondayisationRules(newDate) : newDate;
                yield observed.withDate(newDate).withObserved(newObserved);
            }
            case MoveableHoliday moveable -> {
                LocalDate newDate = calculateMoveableDate(moveable, year);
                yield moveable.withDate(newDate);
            }
            case MoveableFromBaseHoliday derived -> {
                // Implementação para feriados derivados
                yield calculateDerivedDate(derived, year);
            }
        };
    }
}

// Uso: operações como funções puras
var christmas = new FixedHoliday(
    "Christmas", "Birth of Christ",
    LocalDate.of(2024, 12, 25), 25, Month.DECEMBER,
    List.of(Locality.NATIONAL), HolidayType.RELIGIOUS);

var operations = new HolidayOperations();
var christmasIn2025 = operations.calculateDate(christmas, 2025);
```

A implementação dessas operações utiliza *pattern matching* com `switch`[^12]. O
switch implementa a seleção de qual código deve ser executado para um
determinado tipo: se tivéssemos definido `calculateDate` na interface `Holiday`
e chamado `holiday.calculateDate(year)`, o runtime decidiria qual implementação
executar. Com `switch` fazemos isso manualmente, permitindo não definir métodos
na interface e mantendo os dados puros. O código atual usa pattern matching
básico com `case FixedHoliday fixed ->`, onde o compilador automaticamente faz o
cast para o tipo específico, eliminando a necessidade de casting manual e
tornando o código mais seguro e expressivo.

Uma evolução importante do pattern matching são os *record patterns*[^14] (Java
21), que permitem 'desempacotar' records diretamente durante a correspondência.
O underscore `_` substitui campos que não precisamos, tornando explícito quais
dados cada operação realmente utiliza e melhorando a legibilidade do código.

```java
// ANTES - Pattern matching básico
public String formatHoliday(Holiday holiday) {
    return switch (holiday) {
        case FixedHoliday fixed -> 
            "Fixo: " + fixed.name() + " em " + fixed.day() + "/" + fixed.month().getValue();
        case MoveableHoliday moveable -> 
            "Móvel: " + moveable.name() + " (" + moveable.knownHoliday() + ")";
    };
}

// DEPOIS - Record patterns (Java 21+)
public String formatHoliday(Holiday holiday) {
    return switch (holiday) {
        case FixedHoliday(var name, _, _, var day, var month, _, _) -> 
            "Fixo: " + name + " em " + day + "/" + month.getValue();
        case MoveableHoliday(var name, _, _, _, _, var knownHoliday, _) -> 
            "Móvel: " + name + " (" + knownHoliday + ")";
    };
}
```

Agora que detalhamos os quatro princípios fundamentais da DOP vamos analisar
como eles podem ser utilizados para modelar o nosso sistema de gestão de
feriados.

## Feriados: uma modelagem orientada a dados

Para demonstrar como a Programação Orientada a Dados funciona na prática, vamos
implementar um sistema de gestão de feriados que exemplifica todos os quatro
princípios fundamentais. A modelagem DOP apresenta uma estrutura
fundamentalmente diferente da OOP, onde começamos definindo uma *sealed
interface* que estabelece o contrato comum para todos os tipos de feriados,
garantindo que apenas as implementações permitidas possam existir no sistema.

A interface `Holiday` utiliza o modificador `sealed` para implementar o primeiro
princípio da DOP - estados ilegais irrepresentáveis. Ao declarar `permits
FixedHoliday, ObservedHoliday, MoveableHoliday, MoveableFromBaseHoliday`,
estamos explicitamente limitando quais classes podem implementar esta interface,
eliminando a possibilidade de tipos inválidos serem criados acidentalmente:

```java
// 🔒 Sealed interface - Estados ilegais irrepresentáveis  
public sealed interface Holiday 
    permits FixedHoliday, ObservedHoliday, MoveableHoliday, MoveableFromBaseHoliday {
    
    String name();
    String description(); 
    LocalDate date();
    List<Locality> localities();
    HolidayType type();
    
    // Funcionalidade compartilhada
    default boolean isWeekend() {
        DayOfWeek dayOfWeek = date().getDayOfWeek();
        return dayOfWeek == DayOfWeek.SATURDAY || dayOfWeek == DayOfWeek.SUNDAY;
    }
}
```

Observe que a interface define apenas métodos de acesso aos dados, sem
comportamentos complexos. O método `isWeekend()` é uma funcionalidade
compartilhada simples que deriva informação dos dados existentes, mantendo a
pureza dos dados.

O segundo e terceiro princípios - dados imutáveis e transparência de dados - são
implementados através de records Java. Cada tipo de feriado é modelado como um
record específico que contém exatamente os dados necessários para seu contexto.
O `FixedHoliday`, por exemplo, representa feriados que sempre ocorrem na mesma
data, como o Natal:

```java
// 📦 Feriado fixo - sempre na mesma data
public record FixedHoliday(
    String name, String description, LocalDate date,
    int day, Month month, List<Locality> localities, HolidayType type
) implements Holiday {
    
    public FixedHoliday {
        Objects.requireNonNull(month, "Month cannot be null");
        if (day < 1 || day > month.maxLength()) {
            throw new IllegalArgumentException("Invalid day for month: " + day);
        }
        localities = List.copyOf(localities); // Defensive copying
    }
}
```

O construtor compacto do record (`public FixedHoliday`) implementa validações
que garantem a integridade dos dados no momento da criação. A validação do dia
em relação ao mês previne datas impossíveis como 31 de fevereiro. O
`List.copyOf(localities)` implementa *defensive copying*, garantindo que a lista
interna não possa ser modificada externamente, preservando a imutabilidade.

Para feriados mais complexos, como aqueles que seguem regras de "mondayisation"
(quando um feriado cai no fim de semana e é observado na segunda-feira), criamos
o `ObservedHoliday` com validações específicas:

```java
// 📦 Feriado observado - com regras de mondayisation
public record ObservedHoliday(
    String name, String description, LocalDate date, 
    List<Locality> localities, HolidayType type,
    LocalDate observed, boolean mondayisation
) implements Holiday {
    
    public ObservedHoliday {
        if (mondayisation && date.equals(observed)) {
            DayOfWeek dayOfWeek = date.getDayOfWeek();
            if (dayOfWeek == DayOfWeek.SATURDAY || dayOfWeek == DayOfWeek.SUNDAY) {
                throw new IllegalArgumentException(
                    "Mondayisation is enabled but observed date equals original weekend date");
            }
        }
        localities = List.copyOf(localities);
    }
}
```

Esta validação garante consistência lógica: se a mondayisation está habilitada e
a data original cai no fim de semana, a data observada deve ser diferente da
original. Isso previne estados inconsistentes onde um feriado deveria ser
ajustado mas não foi.

O quarto princípio - separação entre dados e operações - é implementado através
da classe `HolidayOperations`, que contém todas as operações que manipulam os
dados dos feriados. Esta classe utiliza *pattern matching* com `switch`
expressions para processar diferentes tipos de feriados de forma type-safe:

```java
// 🔀 Operações separadas dos dados
@Component  
public final class HolidayOperations {
    
    public Holiday calculateDate(Holiday holiday, int year) {
        return switch (holiday) {
            case FixedHoliday fixed -> {
                LocalDate newDate = calculateFixedDate(fixed, year);
                yield fixed.withDate(newDate);
            }
            case ObservedHoliday observed -> {
                LocalDate newDate = calculateFixedDate(observed, year);
                LocalDate newObserved = observed.mondayisation() 
                    ? applyMondayisationRules(newDate) 
                    : newDate;
                yield observed.withDate(newDate).withObserved(newObserved);
            }
            case MoveableHoliday moveable -> {
                LocalDate newDate = calculateMoveableDate(moveable, year);
                yield moveable.withDate(newDate);
            }
            case MoveableFromBaseHoliday derived -> {
                LocalDate newDate = calculateDerivedDate(derived, year);
                yield derived.withDate(newDate);
            }
            // Compilador garante que todos os casos são cobertos
        };
    }
}
```

O *pattern matching* permite que o compilador verifique se todos os casos
possíveis estão sendo tratados. Se adicionarmos um novo tipo de feriado à sealed
interface, o compilador nos forçará a atualizar todos os switches, garantindo
que nenhum caso seja esquecido. O método `calculateDate` é uma função pura -
dado o mesmo feriado e ano, sempre retorna o mesmo resultado, sem efeitos
colaterais.

![Diagrama de classe da modelagem dos feriados como DOP](class-diagram.png)

A implementação completa, incluindo testes e exemplos de uso, está disponível no
[repositório do projeto](https://github.com/vagnerclementino/odp-api-holiday)
para análise detalhada. O repositório contém também implementações de feriados
móveis (como a Páscoa) e exemplos de como integrar esta modelagem com frameworks
como Spring Boot.

Assim como fizemos uma analogia de uma classe na OOP com um organismo vivo,
podemos comparar a DOP com uma linha de montagem industrial moderna. Nesta
analogia, os dados imutáveis são como peças padronizadas que fluem pela linha
sem serem alteradas em sua essência, as operações funcionam como estações de
trabalho especializadas que processam essas peças de forma previsível. Por outro
lado, o *pattern matching* atua como um sistema de classificação automática que
direciona cada peça para a estação correta. Por fim, a separação entre dados e
operações espelha a divisão clara entre matéria-prima e processos de fabricação.
Esta analogia faz sentido porque, tanto a DOP quanto uma linha de montagem,
priorizam eficiência, previsibilidade, especialização de funções e fluxo
controlado de informação, onde cada componente tem uma responsabilidade bem
definida e o resultado final é construído através da composição ordenada de
operações simples e confiáveis.

## Programação orientada a dados em Java

A linguagem Java evoluiu com algumas funcionalidades que isoladas podem não ser
percebidas como relevantes, porém, em conjunto, servem para suportar os
princípios da Programação Orientada a Dados. A seguir listamos algumas
funcionalidades da linguagem que facilitam a implementação dos quatro princípios
fundamentais:

**📦 Records**[^4]

- **Versão**: Java 14 (Preview), Java 16 (Final)
- **Descrição**: Classes imutáveis concisas com equals, hashCode e toString automáticos
- **Uso em DOP**: Modelagem de dados imutáveis

**🔒 Sealed Classes/Interfaces**[^6]

- **Versão**: Java 15 (Preview), Java 17 (Final)
- **Descrição**: Controle sobre quais classes podem estender/implementar
- **Uso em DOP**: Estados ilegais irrepresentáveis

**🔍 Pattern Matching (instanceof)**[^11]

- **Versão**: Java 14 (Preview), Java 16 (Final)
- **Descrição**: Verificação de tipo e cast em uma operação
- **Uso em DOP**: Operações sobre dados

**🔀 Pattern Matching (switch)**[^12]

- **Versão**: Java 17 (Preview), Java 21 (Final)
- **Descrição**: Switch expressions com pattern matching
- **Uso em DOP**: Processamento de tipos selados

**📝 Text Blocks**[^13]

- **Versão**: Java 13 (Preview), Java 15 (Final)
- **Descrição**: Strings multilinha mais legíveis
- **Uso em DOP**: Documentação e exemplos

## Os Quatro Pilares da DOP

A Programação Orientada a Dados oferece uma abordagem sistemática para construir
sistemas mais robustos e manuteníveis através de quatro princípios fundamentais:

- **🔒 Dados Imutáveis e Transparentes**: Use records para criar estruturas de
dados que não podem ser modificadas após a criação, eliminando bugs relacionados
a estado compartilhado mutável. A transparência garante acesso direto aos dados
sem encapsulamento desnecessário.

- **📊 Modele os Dados Completos**: Crie tipos específicos para cada variação do
domínio usando *sealed interfaces* e *records* dedicados. Evite tipos genéricos
com campos opcionais - cada record deve conter exatamente os dados necessários
para seu contexto.

- **🛡️ Estados Ilegais Irrepresentáveis**: Use o sistema de tipos para prevenir
combinações inválidas de dados. As *Sealed interfaces* restringem implementações
possíveis, enquanto validações nos construtores garantem integridade na
fronteira do sistema.

- **⚡ Separe Operações dos Dados**: Mantenha records livres de lógica de domínio
complexa, implementando operações em classes dedicadas. Use pattern matching com
switch para processar diferentes tipos de forma type-safe, evitando o problema
da "Large Class".

A DOP não substitui completamente a OOP, mas oferece uma alternativa valiosa
especialmente para sistemas que processam grandes volumes de dados ou requerem
alta confiabilidade. A combinação de records, sealed interfaces e pattern
matching em versões mais recentes do Java torna essa abordagem prática e
expressiva.

## 🤔 O que vem a seguir?

Agora que você conhece os princípios da DOP, como aplicá-los em projetos reais?
Na **[Parte 3](https://notes.clementino.me/blog/nem-tudo-eh-objeto-parte-3)**,
vamos implementar esses conceitos em APIs REST, funções Lambda e descobrir
quando a DOP é a escolha mais adequada para seu próximo projeto.

[^1]: [Data-Oriented Programming in Java](https://www.infoq.com/articles/data-oriented-programming-java/)
[^2]: [Data-Oriented Programming in Java - Version 1.1](https://inside.java/2024/05/23/dop-v1-1-introduction/)
[^3]: [Model data immutably and transparently - DOP v1.1](https://inside.java/2024/05/27/dop-v1-1-immutable-transparent-data/)
[^4]: [JEP 395: Records](https://openjdk.org/jeps/395)
[^5]: [Model the data, the whole data, and nothing but the data - DOP v1.1](https://inside.java/2024/05/29/dop-v1-1-model-data/)
[^6]: [JEP 409: Sealed Classes](https://openjdk.org/jeps/409)
[^7]: [Make illegal states unrepresentable - DOP v1.1](https://inside.java/2024/06/03/dop-v1-1-illegal-states/)
[^8]: [Separate operations from data - DOP v1.1](https://inside.java/2024/06/05/dop-v1-1-separate-operations/)
[^9]: [Compact Constructors - Java Records](https://dev.java/learn/records/#compact)
[^10]: [Large Class](https://refactoring.com/catalog/extractClass.html)
[^11]: [JEP 394: Pattern Matching for instanceof](https://openjdk.org/jeps/394)
[^12]: [JEP 441: Pattern Matching for switch](https://openjdk.org/jeps/441)
[^13]: [JEP 378: Text Blocks](https://openjdk.org/jeps/378)
