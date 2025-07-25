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
// Modelagem tradicional OOP
public class ContaBancaria {
    private String numero;
    private BigDecimal saldo;
    private String titular;
    
    public ContaBancaria(String numero, String titular) {
        this.numero = numero;
        this.titular = titular;
        this.saldo = BigDecimal.ZERO;
    }
    
    public void depositar(BigDecimal valor) {
        if (valor.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valor deve ser positivo");
        }
        this.saldo = this.saldo.add(valor);
    }
    
    public void sacar(BigDecimal valor) {
        if (valor.compareTo(saldo) > 0) {
            throw new IllegalStateException("Saldo insuficiente");
        }
        this.saldo = this.saldo.subtract(valor);
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
// Dados imutáveis com records
public record ContaInfo(
    String numero,
    String titular,
    BigDecimal saldo
) {
    public ContaInfo {
        if (numero == null || numero.isBlank()) {
            throw new IllegalArgumentException("Número da conta é obrigatório");
        }
        if (saldo.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Saldo não pode ser negativo");
        }
    }
}

// Operações como funções puras
public class OperacoesBancarias {
    public static ContaInfo depositar(ContaInfo conta, BigDecimal valor) {
        if (valor.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valor deve ser positivo");
        }
        return new ContaInfo(
            conta.numero(),
            conta.titular(),
            conta.saldo().add(valor)
        );
    }
    
    public static ContaInfo sacar(ContaInfo conta, BigDecimal valor) {
        if (valor.compareTo(conta.saldo()) > 0) {
            throw new IllegalStateException("Saldo insuficiente");
        }
        return new ContaInfo(
            conta.numero(),
            conta.titular(),
            conta.saldo().subtract(valor)
        );
    }
}
```

#### 2. Modele os Dados, Todos os Dados, e Nada Além dos Dados

Este princípio enfatiza que nossas estruturas de dados devem representar
fielmente o domínio, sem adicionar complexidade desnecessária ou omitir
informações importantes:

```java
// Modelagem precisa do domínio
public record Endereco(
    String logradouro,
    String numero,
    String complemento,
    String bairro,
    String cidade,
    String estado,
    String cep
) {}

public record Cliente(
    String cpf,
    String nome,
    LocalDate dataNascimento,
    Endereco endereco,
    List<String> telefones
) {
    public Cliente {
        // Validações no construtor
        telefones = List.copyOf(telefones); // Imutabilidade
    }
}
```

#### 3. Torne Estados Ilegais Irrepresentáveis

Use o sistema de tipos para prevenir estados inválidos em tempo de compilação:

```java
// Estados mutuamente exclusivos
public sealed interface StatusPedido 
    permits Pendente, Processando, Enviado, Entregue, Cancelado {
}

public record Pendente(LocalDateTime criadoEm) implements StatusPedido {}
public record Processando(LocalDateTime iniciadoEm) implements StatusPedido {}
public record Enviado(LocalDateTime enviadoEm, String codigoRastreamento) implements StatusPedido {}
public record Entregue(LocalDateTime entregueEm, String assinatura) implements StatusPedido {}
public record Cancelado(LocalDateTime canceladoEm, String motivo) implements StatusPedido {}

public record Pedido(
    String id,
    String clienteId,
    List<ItemPedido> itens,
    StatusPedido status
) {}
```

#### 4. Valide nas Fronteiras

Mantenha validações nas bordas do sistema, permitindo que o núcleo trabalhe com
dados já validados:

```java
// Validação na fronteira
public class PedidoValidator {
    public static ValidationResult validar(PedidoRequest request) {
        var erros = new ArrayList<String>();
        
        if (request.clienteId() == null || request.clienteId().isBlank()) {
            erros.add("Cliente é obrigatório");
        }
        
        if (request.itens() == null || request.itens().isEmpty()) {
            erros.add("Pedido deve ter pelo menos um item");
        }
        
        return erros.isEmpty() 
            ? ValidationResult.success()
            : ValidationResult.failure(erros);
    }
}

// Núcleo trabalha com dados válidos
public class PedidoService {
    public Pedido criarPedido(PedidoRequest request) {
        // Assume que dados já foram validados
        return new Pedido(
            UUID.randomUUID().toString(),
            request.clienteId(),
            request.itens(),
            new Pendente(LocalDateTime.now())
        );
    }
}
```

## Exemplo Prático: API de Feriados Públicos

Vamos implementar uma API REST completa para gerenciar feriados públicos, demonstrando os princípios da programação orientada a dados em um cenário real usando AWS Lambda e API Gateway.

### Estruturas de Dados

```java
// Modelo de domínio imutável
public record Localizacao(
    String pais,
    Optional<String> estado,
    Optional<String> cidade
) {
    public Localizacao {
        if (pais == null || pais.isBlank()) {
            throw new IllegalArgumentException("País é obrigatório");
        }
    }
}

public enum TipoFeriado {
    NACIONAL, ESTADUAL, MUNICIPAL, RELIGIOSO, COMERCIAL
}

public record Feriado(
    String id,
    String nome,
    LocalDate data,
    Localizacao localizacao,
    TipoFeriado tipo,
    boolean recorrente,
    Optional<String> descricao
) {
    public Feriado {
        if (id == null || id.isBlank()) {
            throw new IllegalArgumentException("ID é obrigatório");
        }
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório");
        }
        if (data == null) {
            throw new IllegalArgumentException("Data é obrigatória");
        }
    }
}
```

### DTOs para API Gateway

```java
// Request/Response DTOs
public record CriarFeriadoRequest(
    String nome,
    String data, // ISO format
    String pais,
    String estado,
    String cidade,
    String tipo,
    boolean recorrente,
    String descricao
) {}

public record FeriadoResponse(
    String id,
    String nome,
    String data,
    LocalizacaoResponse localizacao,
    String tipo,
    boolean recorrente,
    String descricao
) {}

public record LocalizacaoResponse(
    String pais,
    String estado,
    String cidade
) {}

public record FiltroFeriados(
    Optional<String> pais,
    Optional<String> estado,
    Optional<String> cidade,
    Optional<LocalDate> dataInicio,
    Optional<LocalDate> dataFim,
    Optional<TipoFeriado> tipo
) {}
```

### Validação nas Fronteiras

```java
public class FeriadoValidator {
    public static ValidationResult validarCriacao(CriarFeriadoRequest request) {
        var erros = new ArrayList<String>();
        
        if (request.nome() == null || request.nome().isBlank()) {
            erros.add("Nome é obrigatório");
        }
        
        if (request.pais() == null || request.pais().isBlank()) {
            erros.add("País é obrigatório");
        }
        
        try {
            LocalDate.parse(request.data());
        } catch (DateTimeParseException e) {
            erros.add("Data deve estar no formato ISO (YYYY-MM-DD)");
        }
        
        try {
            TipoFeriado.valueOf(request.tipo().toUpperCase());
        } catch (IllegalArgumentException e) {
            erros.add("Tipo inválido: " + request.tipo());
        }
        
        return erros.isEmpty() 
            ? ValidationResult.success()
            : ValidationResult.failure(erros);
    }
}

public sealed interface ValidationResult 
    permits ValidationResult.Success, ValidationResult.Failure {
    
    record Success() implements ValidationResult {}
    record Failure(List<String> erros) implements ValidationResult {}
    
    static ValidationResult success() { return new Success(); }
    static ValidationResult failure(List<String> erros) { return new Failure(erros); }
}
```

### Mapeadores de Dados

```java
public class FeriadoMapper {
    public static Feriado fromRequest(CriarFeriadoRequest request) {
        return new Feriado(
            UUID.randomUUID().toString(),
            request.nome(),
            LocalDate.parse(request.data()),
            new Localizacao(
                request.pais(),
                Optional.ofNullable(request.estado()),
                Optional.ofNullable(request.cidade())
            ),
            TipoFeriado.valueOf(request.tipo().toUpperCase()),
            request.recorrente(),
            Optional.ofNullable(request.descricao())
        );
    }
    
    public static FeriadoResponse toResponse(Feriado feriado) {
        return new FeriadoResponse(
            feriado.id(),
            feriado.nome(),
            feriado.data().toString(),
            new LocalizacaoResponse(
                feriado.localizacao().pais(),
                feriado.localizacao().estado().orElse(null),
                feriado.localizacao().cidade().orElse(null)
            ),
            feriado.tipo().name(),
            feriado.recorrente(),
            feriado.descricao().orElse(null)
        );
    }
}
```

### Serviço de Domínio

```java
public class FeriadoService {
    private final FeriadoRepository repository;
    
    public FeriadoService(FeriadoRepository repository) {
        this.repository = repository;
    }
    
    public List<Feriado> buscarFeriados(FiltroFeriados filtro) {
        return repository.buscar(filtro);
    }
    
    public Optional<Feriado> buscarPorId(String id) {
        return repository.buscarPorId(id);
    }
    
    public Feriado salvar(Feriado feriado) {
        return repository.salvar(feriado);
    }
    
    public boolean deletar(String id) {
        return repository.deletar(id);
    }
    
    public Optional<Feriado> atualizar(String id, Feriado feriadoAtualizado) {
        return repository.buscarPorId(id)
            .map(existente -> {
                var atualizado = new Feriado(
                    id, // Mantém o ID original
                    feriadoAtualizado.nome(),
                    feriadoAtualizado.data(),
                    feriadoAtualizado.localizacao(),
                    feriadoAtualizado.tipo(),
                    feriadoAtualizado.recorrente(),
                    feriadoAtualizado.descricao()
                );
                return repository.salvar(atualizado);
            });
    }
}
```

### Handler do AWS Lambda

```java
public class FeriadoLambdaHandler implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {
    
    private final FeriadoService feriadoService;
    private final ObjectMapper objectMapper;
    
    public FeriadoLambdaHandler() {
        this.feriadoService = new FeriadoService(new DynamoDBFeriadoRepository());
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
                default -> createResponse(405, Map.of("erro", "Método não permitido"));
            };
        } catch (Exception e) {
            context.getLogger().log("Erro: " + e.getMessage());
            return createResponse(500, Map.of("erro", "Erro interno do servidor"));
        }
    }
    
    private APIGatewayProxyResponseEvent handleGet(APIGatewayProxyRequestEvent request) throws Exception {
        var pathParameters = request.getPathParameters();
        
        if (pathParameters != null && pathParameters.containsKey("id")) {
            // GET /feriados/{id}
            var id = pathParameters.get("id");
            var feriado = feriadoService.buscarPorId(id);
            
            return feriado
                .map(f -> createResponse(200, FeriadoMapper.toResponse(f)))
                .orElse(createResponse(404, Map.of("erro", "Feriado não encontrado")));
        } else {
            // GET /feriados com filtros
            var filtro = extrairFiltros(request.getQueryStringParameters());
            var feriados = feriadoService.buscarFeriados(filtro);
            var responses = feriados.stream()
                .map(FeriadoMapper::toResponse)
                .toList();
            
            return createResponse(200, responses);
        }
    }
    
    private APIGatewayProxyResponseEvent handlePost(APIGatewayProxyRequestEvent request) throws Exception {
        var feriadoRequest = objectMapper.readValue(request.getBody(), CriarFeriadoRequest.class);
        
        var validacao = FeriadoValidator.validarCriacao(feriadoRequest);
        if (validacao instanceof ValidationResult.Failure failure) {
            return createResponse(400, Map.of("erros", failure.erros()));
        }
        
        var feriado = FeriadoMapper.fromRequest(feriadoRequest);
        var feriadoSalvo = feriadoService.salvar(feriado);
        
        return createResponse(201, FeriadoMapper.toResponse(feriadoSalvo));
    }
    
    private APIGatewayProxyResponseEvent handlePut(APIGatewayProxyRequestEvent request) throws Exception {
        var pathParameters = request.getPathParameters();
        if (pathParameters == null || !pathParameters.containsKey("id")) {
            return createResponse(400, Map.of("erro", "ID é obrigatório"));
        }
        
        var id = pathParameters.get("id");
        var feriadoRequest = objectMapper.readValue(request.getBody(), CriarFeriadoRequest.class);
        
        var validacao = FeriadoValidator.validarCriacao(feriadoRequest);
        if (validacao instanceof ValidationResult.Failure failure) {
            return createResponse(400, Map.of("erros", failure.erros()));
        }
        
        var feriadoAtualizado = FeriadoMapper.fromRequest(feriadoRequest);
        var resultado = feriadoService.atualizar(id, feriadoAtualizado);
        
        return resultado
            .map(f -> createResponse(200, FeriadoMapper.toResponse(f)))
            .orElse(createResponse(404, Map.of("erro", "Feriado não encontrado")));
    }
    
    private APIGatewayProxyResponseEvent handleDelete(APIGatewayProxyRequestEvent request) {
        var pathParameters = request.getPathParameters();
        if (pathParameters == null || !pathParameters.containsKey("id")) {
            return createResponse(400, Map.of("erro", "ID é obrigatório"));
        }
        
        var id = pathParameters.get("id");
        var deletado = feriadoService.deletar(id);
        
        return deletado 
            ? createResponse(204, null)
            : createResponse(404, Map.of("erro", "Feriado não encontrado"));
    }
    
    private FiltroFeriados extrairFiltros(Map<String, String> queryParams) {
        if (queryParams == null) {
            return new FiltroFeriados(
                Optional.empty(), Optional.empty(), Optional.empty(),
                Optional.empty(), Optional.empty(), Optional.empty()
            );
        }
        
        return new FiltroFeriados(
            Optional.ofNullable(queryParams.get("pais")),
            Optional.ofNullable(queryParams.get("estado")),
            Optional.ofNullable(queryParams.get("cidade")),
            Optional.ofNullable(queryParams.get("dataInicio")).map(LocalDate::parse),
            Optional.ofNullable(queryParams.get("dataFim")).map(LocalDate::parse),
            Optional.ofNullable(queryParams.get("tipo")).map(t -> TipoFeriado.valueOf(t.toUpperCase()))
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
                response.setBody("{\"erro\":\"Erro na serialização\"}");
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
  FeriadosApi:
    Type: AWS::Serverless::Api
    Properties:
      StageName: prod
      Cors:
        AllowMethods: "'GET,POST,PUT,DELETE,OPTIONS'"
        AllowHeaders: "'Content-Type,X-Amz-Date,Authorization,X-Api-Key'"
        AllowOrigin: "'*'"

  FeriadosFunction:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: target/feriados-api-1.0.jar
      Handler: com.exemplo.FeriadoLambdaHandler::handleRequest
      Runtime: java17
      MemorySize: 512
      Timeout: 30
      Environment:
        Variables:
          DYNAMODB_TABLE: !Ref FeriadosTable
      Policies:
        - DynamoDBCrudPolicy:
            TableName: !Ref FeriadosTable
      Events:
        GetFeriados:
          Type: Api
          Properties:
            RestApiId: !Ref FeriadosApi
            Path: /feriados
            Method: get
        GetFeriado:
          Type: Api
          Properties:
            RestApiId: !Ref FeriadosApi
            Path: /feriados/{id}
            Method: get
        CreateFeriado:
          Type: Api
          Properties:
            RestApiId: !Ref FeriadosApi
            Path: /feriados
            Method: post
        UpdateFeriado:
          Type: Api
          Properties:
            RestApiId: !Ref FeriadosApi
            Path: /feriados/{id}
            Method: put
        DeleteFeriado:
          Type: Api
          Properties:
            RestApiId: !Ref FeriadosApi
            Path: /feriados/{id}
            Method: delete

  FeriadosTable:
    Type: AWS::DynamoDB::Table
    Properties:
      TableName: feriados
      BillingMode: PAY_PER_REQUEST
      AttributeDefinitions:
        - AttributeName: id
          AttributeType: S
      KeySchema:
        - AttributeName: id
          KeyType: HASH

Outputs:
  ApiUrl:
    Description: "URL da API"
    Value: !Sub "https://${FeriadosApi}.execute-api.${AWS::Region}.amazonaws.com/prod/feriados"
```

## Conclusão

A Programação Orientada a Dados oferece uma perspectiva valiosa para o desenvolvimento de software moderno, especialmente em contextos onde a clareza dos dados, a imutabilidade e a testabilidade são prioritárias. Ao separar dados de comportamento e focar na estrutura das informações, conseguimos criar sistemas mais previsíveis, fáceis de testar e menos propensos a bugs relacionados a estado mutável.

O exemplo da API de feriados demonstra como esses princípios podem ser aplicados na prática, resultando em código mais limpo, estruturas de dados bem definidas e uma arquitetura que facilita tanto a manutenção quanto a evolução do sistema. Embora a Programação Orientada a Objetos continue sendo fundamental em Java, a incorporação de conceitos orientados a dados pode significativamente melhorar a qualidade e robustez de nossas aplicações.

A chave está em reconhecer que, assim como no origami, diferentes técnicas de "dobrar" o código podem revelar aspectos distintos da solução, e a escolha do paradigma adequado pode fazer toda a diferença na elegância e eficácia do resultado final.
