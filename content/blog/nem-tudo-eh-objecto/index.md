---
title: "Nem tudo é objeto"
date: "2025-07-20"
description: "Programação Orientada a Dados em Java"
featuredImage: feature.png
---

## A Arte de Simplificar a Complexidade

Imagine um artista de origami criando um cisne a partir de uma simples folha de
papel. O resultado final captura a essência elegante da ave — seu pescoço
curvado, suas asas dobradas, sua postura graciosa — mas deixa de lado detalhes
desnecessários como a textura das penas ou a cor dos olhos. O origami não busca
replicar perfeitamente a realidade, mas sim extrair e representar apenas os
aspectos mais importantes e reconhecíveis.

Os paradigmas de programação funcionam de maneira similar. Eles foram criados
para nos ajudar a reduzir a complexidade do mundo real e mapeá-la em sistemas de
software compreensíveis e funcionais. Assim como o origami, cada paradigma
oferece uma forma específica de "dobrar" a realidade em código, capturando os
aspectos essenciais do domínio que estamos modelando enquanto abstrai detalhes
desnecessários.

Quando desenvolvemos software, não estamos tentando recriar o mundo real em sua
totalidade — isso seria impossível e improdutivo. Em vez disso, utilizamos
paradigmas como ferramentas conceituais que nos permitem focar nos elementos
mais relevantes para resolver problemas específicos, criando representações
elegantes e funcionais da complexidade que nos cerca.

## Panorama dos Paradigmas de Programação

Ao longo da evolução da computação, diferentes paradigmas emergiram para abordar
distintos tipos de problemas e formas de pensar sobre software. Cada um oferece
uma perspectiva única sobre como organizar código, gerenciar estado e estruturar
soluções.

### Comparação dos Principais Paradigmas

| Aspecto | Procedural | Orientado a Objetos | Funcional | Orientado a Dados |
|---------|------------|-------------------|-----------|------------------|
| **Foco Principal** | Sequência de procedimentos | Objetos e suas interações | Funções e transformações | Estrutura e fluxo de dados |
| **Gerenciamento de Estado** | Estado global/local mutável | Estado encapsulado em objetos | Estado imutável | Dados imutáveis |
| **Reutilização** | Funções e módulos | Herança e composição | Funções puras | Estruturas de dados |
| **Testabilidade** | Moderada (dependências) | Boa (isolamento) | Excelente (pureza) | Excelente (imutabilidade) |
| **Tratamento de Complexidade** | Decomposição em funções | Abstração e encapsulamento | Composição de funções | Separação dados/comportamento |

## Programação Orientada a Objetos em Java

A Programação Orientada a Objetos (POO) tem sido o paradigma dominante em Java
desde sua criação. Seus princípios fundamentais incluem:

### Princípios Fundamentais da POO

**Encapsulamento**: Agrupa dados e métodos que operam sobre esses dados em uma única unidade (classe), controlando o acesso através de modificadores de visibilidade.

**Herança**: Permite que classes derivem características de outras classes, promovendo reutilização de código.

**Abstração**: Oculta detalhes de implementação complexos, expondo apenas interfaces necessárias.

**Polimorfismo**: Permite que objetos de diferentes tipos sejam tratados através de uma interface comum.

### Exemplo Prático em Java

```java
// Traditional OOP modeling
public class BankAccount {
    private String accountNumber;
    private BigDecimal balance;
    private String accountHolder;
    
    public BankAccount(String accountNumber, String accountHolder) {
        this.accountNumber = accountNumber;
        this.accountHolder = accountHolder;
        this.balance = BigDecimal.ZERO;
    }
    
    public void deposit(BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be positive");
        }
        this.balance = this.balance.add(amount);
    }
    
    public void withdraw(BigDecimal amount) {
        if (amount.compareTo(balance) > 0) {
            throw new IllegalStateException("Insufficient balance");
        }
        this.balance = this.balance.subtract(amount);
    }
    
    // getters...
}
```

## Programação Orientada a Dados: Uma Nova Perspectiva

A Programação Orientada a Dados (Data-Oriented Programming) representa uma
mudança fundamental na forma como pensamos sobre software. Em vez de focar em
objetos que encapsulam dados e comportamento, este paradigma prioriza a
estrutura e o fluxo dos dados, separando claramente informação de processamento.

### Os Quatro Princípios Fundamentais

#### 1. Dados são Imutáveis

A imutabilidade elimina uma classe inteira de bugs relacionados a modificações
inesperadas de estado. Em Java, podemos usar records para criar estruturas
imutáveis de forma concisa:

```java
// Immutable data with records
public record AccountInfo(
    String accountNumber,
    String accountHolder,
    BigDecimal balance
) {
    public AccountInfo {
        if (accountNumber == null || accountNumber.isBlank()) {
            throw new IllegalArgumentException("Account number is required");
        }
        if (balance.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Balance cannot be negative");
        }
    }
}

// Operations as pure functions
public class BankingOperations {
    public static AccountInfo deposit(AccountInfo account, BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be positive");
        }
        return new AccountInfo(
            account.accountNumber(),
            account.accountHolder(),
            account.balance().add(amount)
        );
    }
    
    public static AccountInfo withdraw(AccountInfo account, BigDecimal amount) {
        if (amount.compareTo(account.balance()) > 0) {
            throw new IllegalStateException("Insufficient balance");
        }
        return new AccountInfo(
            account.accountNumber(),
            account.accountHolder(),
            account.balance().subtract(amount)
        );
    }
}
```

#### 2. Modele os Dados, Todos os Dados, e Nada Além dos Dados

Este princípio enfatiza que nossas estruturas de dados devem representar
fielmente o domínio, sem adicionar complexidade desnecessária ou omitir
informações importantes:

```java
// Precise domain modeling
public record Address(
    String street,
    String number,
    String complement,
    String neighborhood,
    String city,
    String state,
    String zipCode
) {}

public record Customer(
    String cpf,
    String name,
    LocalDate birthDate,
    Address address,
    List<String> phoneNumbers
) {
    public Customer {
        // Validations in constructor
        phoneNumbers = List.copyOf(phoneNumbers); // Immutability
    }
}
```

#### 3. Torne Estados Ilegais Irrepresentáveis

Use o sistema de tipos para prevenir estados inválidos em tempo de compilação:

```java
// Mutually exclusive states
public sealed interface OrderStatus 
    permits Pending, Processing, Shipped, Delivered, Cancelled {
}

public record Pending(LocalDateTime createdAt) implements OrderStatus {}
public record Processing(LocalDateTime startedAt) implements OrderStatus {}
public record Shipped(LocalDateTime shippedAt, String trackingCode) implements OrderStatus {}
public record Delivered(LocalDateTime deliveredAt, String signature) implements OrderStatus {}
public record Cancelled(LocalDateTime cancelledAt, String reason) implements OrderStatus {}

public record Order(
    String id,
    String customerId,
    List<OrderItem> items,
    OrderStatus status
) {}
```

#### 4. Valide nas Fronteiras

Mantenha validações nas bordas do sistema, permitindo que o núcleo trabalhe com
dados já validados:

```java
// Boundary validation
public class OrderValidator {
    public static ValidationResult validate(OrderRequest request) {
        var errors = new ArrayList<String>();
        
        if (request.customerId() == null || request.customerId().isBlank()) {
            errors.add("Customer is required");
        }
        
        if (request.items() == null || request.items().isEmpty()) {
            errors.add("Order must have at least one item");
        }
        
        return errors.isEmpty() 
            ? ValidationResult.success()
            : ValidationResult.failure(errors);
    }
}

// Core works with validated data
public class OrderService {
    public Order createOrder(OrderRequest request) {
        // Assumes data has already been validated
        return new Order(
            UUID.randomUUID().toString(),
            request.customerId(),
            request.items(),
            new Pending(LocalDateTime.now())
        );
    }
}
```

## Exemplo Prático: API de Feriados Públicos

Vamos implementar uma API REST completa para gerenciar feriados públicos, demonstrando os princípios da programação orientada a dados em um cenário real usando AWS Lambda e API Gateway.

### Estruturas de Dados

```java
// Immutable domain model
public record Location(
    String country,
    Optional<String> state,
    Optional<String> city
) {
    public Location {
        if (country == null || country.isBlank()) {
            throw new IllegalArgumentException("Country is required");
        }
    }
}

public enum HolidayType {
    NATIONAL, STATE, MUNICIPAL, RELIGIOUS, COMMERCIAL
}

public record Holiday(
    String id,
    String name,
    LocalDate date,
    Location location,
    HolidayType type,
    boolean recurring,
    Optional<String> description
) {
    public Holiday {
        if (id == null || id.isBlank()) {
            throw new IllegalArgumentException("ID is required");
        }
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Name is required");
        }
        if (date == null) {
            throw new IllegalArgumentException("Date is required");
        }
    }
}
```

### DTOs para API Gateway

```java
// Request/Response DTOs
public record CreateHolidayRequest(
    String name,
    String date, // ISO format
    String country,
    String state,
    String city,
    String type,
    boolean recurring,
    String description
) {}

public record HolidayResponse(
    String id,
    String name,
    String date,
    LocationResponse location,
    String type,
    boolean recurring,
    String description
) {}

public record LocationResponse(
    String country,
    String state,
    String city
) {}

public record HolidayFilter(
    Optional<String> country,
    Optional<String> state,
    Optional<String> city,
    Optional<LocalDate> startDate,
    Optional<LocalDate> endDate,
    Optional<HolidayType> type
) {}
```

### Validação nas Fronteiras

```java
public class HolidayValidator {
    public static ValidationResult validateCreation(CreateHolidayRequest request) {
        var errors = new ArrayList<String>();
        
        if (request.name() == null || request.name().isBlank()) {
            errors.add("Name is required");
        }
        
        if (request.country() == null || request.country().isBlank()) {
            errors.add("Country is required");
        }
        
        try {
            LocalDate.parse(request.date());
        } catch (DateTimeParseException e) {
            errors.add("Date must be in ISO format (YYYY-MM-DD)");
        }
        
        try {
            HolidayType.valueOf(request.type().toUpperCase());
        } catch (IllegalArgumentException e) {
            errors.add("Invalid type: " + request.type());
        }
        
        return errors.isEmpty() 
            ? ValidationResult.success()
            : ValidationResult.failure(errors);
    }
}

public sealed interface ValidationResult 
    permits ValidationResult.Success, ValidationResult.Failure {
    
    record Success() implements ValidationResult {}
    record Failure(List<String> errors) implements ValidationResult {}
    
    static ValidationResult success() { return new Success(); }
    static ValidationResult failure(List<String> errors) { return new Failure(errors); }
}
```

### Mapeadores de Dados

```java
public class HolidayMapper {
    public static Holiday fromRequest(CreateHolidayRequest request) {
        return new Holiday(
            UUID.randomUUID().toString(),
            request.name(),
            LocalDate.parse(request.date()),
            new Location(
                request.country(),
                Optional.ofNullable(request.state()),
                Optional.ofNullable(request.city())
            ),
            HolidayType.valueOf(request.type().toUpperCase()),
            request.recurring(),
            Optional.ofNullable(request.description())
        );
    }
    
    public static HolidayResponse toResponse(Holiday holiday) {
        return new HolidayResponse(
            holiday.id(),
            holiday.name(),
            holiday.date().toString(),
            new LocationResponse(
                holiday.location().country(),
                holiday.location().state().orElse(null),
                holiday.location().city().orElse(null)
            ),
            holiday.type().name(),
            holiday.recurring(),
            holiday.description().orElse(null)
        );
    }
}
```

### Serviço de Domínio

```java
public class HolidayService {
    private final HolidayRepository repository;
    
    public HolidayService(HolidayRepository repository) {
        this.repository = repository;
    }
    
    public List<Holiday> findHolidays(HolidayFilter filter) {
        return repository.find(filter);
    }
    
    public Optional<Holiday> findById(String id) {
        return repository.findById(id);
    }
    
    public Holiday save(Holiday holiday) {
        return repository.save(holiday);
    }
    
    public boolean delete(String id) {
        return repository.delete(id);
    }
    
    public Optional<Holiday> update(String id, Holiday updatedHoliday) {
        return repository.findById(id)
            .map(existing -> {
                var updated = new Holiday(
                    id, // Keep original ID
                    updatedHoliday.name(),
                    updatedHoliday.date(),
                    updatedHoliday.location(),
                    updatedHoliday.type(),
                    updatedHoliday.recurring(),
                    updatedHoliday.description()
                );
                return repository.save(updated);
            });
    }
}
```

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

### Configuração do SAM Template

```yaml
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31

Resources:
  HolidaysApi:
    Type: AWS::Serverless::Api
    Properties:
      StageName: prod
      Cors:
        AllowMethods: "'GET,POST,PUT,DELETE,OPTIONS'"
        AllowHeaders: "'Content-Type,X-Amz-Date,Authorization,X-Api-Key'"
        AllowOrigin: "'*'"

  HolidaysFunction:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: target/holidays-api-1.0.jar
      Handler: com.example.HolidayLambdaHandler::handleRequest
      Runtime: java17
      MemorySize: 512
      Timeout: 30
      Environment:
        Variables:
          DYNAMODB_TABLE: !Ref HolidaysTable
      Policies:
        - DynamoDBCrudPolicy:
            TableName: !Ref HolidaysTable
      Events:
        GetHolidays:
          Type: Api
          Properties:
            RestApiId: !Ref HolidaysApi
            Path: /holidays
            Method: get
        GetHoliday:
          Type: Api
          Properties:
            RestApiId: !Ref HolidaysApi
            Path: /holidays/{id}
            Method: get
        CreateHoliday:
          Type: Api
          Properties:
            RestApiId: !Ref HolidaysApi
            Path: /holidays
            Method: post
        UpdateHoliday:
          Type: Api
          Properties:
            RestApiId: !Ref HolidaysApi
            Path: /holidays/{id}
            Method: put
        DeleteHoliday:
          Type: Api
          Properties:
            RestApiId: !Ref HolidaysApi
            Path: /holidays/{id}
            Method: delete

  HolidaysTable:
    Type: AWS::DynamoDB::Table
    Properties:
      TableName: holidays
      BillingMode: PAY_PER_REQUEST
      AttributeDefinitions:
        - AttributeName: id
          AttributeType: S
      KeySchema:
        - AttributeName: id
          KeyType: HASH

Outputs:
  ApiUrl:
    Description: "API URL"
    Value: !Sub "https://${HolidaysApi}.execute-api.${AWS::Region}.amazonaws.com/prod/holidays"
```

## Conclusão

A Programação Orientada a Dados oferece uma perspectiva valiosa para o desenvolvimento de software moderno, especialmente em contextos onde a clareza dos dados, a imutabilidade e a testabilidade são prioritárias. Ao separar dados de comportamento e focar na estrutura das informações, conseguimos criar sistemas mais previsíveis, fáceis de testar e menos propensos a bugs relacionados a estado mutável.

O exemplo da API de feriados demonstra como esses princípios podem ser aplicados na prática, resultando em código mais limpo, estruturas de dados bem definidas e uma arquitetura que facilita tanto a manutenção quanto a evolução do sistema. Embora a Programação Orientada a Objetos continue sendo fundamental em Java, a incorporação de conceitos orientados a dados pode significativamente melhorar a qualidade e robustez de nossas aplicações.

A chave está em reconhecer que, assim como no origami, diferentes técnicas de "dobrar" o código podem revelar aspectos distintos da solução, e a escolha do paradigma adequado pode fazer toda a diferença na elegância e eficácia do resultado final.
