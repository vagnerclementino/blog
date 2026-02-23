---
title: "Memoize: quando cachear é mais que otimização, é design"
date: "2026-02-23"
description: "Uma análise do padrão memoize como ferramenta de design, não apenas de performance"
featuredImage: feature.png
---

## Introdução: a primeira vez que o cache me surpreendeu

Foi em 2010, durante uma entrevista técnica. A pergunta: "Como calcular Fibonacci eficientemente?"

Minha resposta ingênua:

```java
int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n-1) + fibonacci(n-2);
}
```

O entrevistador sorriu. "Teste com `fibonacci(50)`."

O programa não terminou. A complexidade exponencial era óbvia — em retrospectiva. Na hora, foi uma revelação dolorosa.

A solução que ele mostrou tinha uma palavra mágica: **memoize**.

Este artigo não é sobre Fibonacci. É sobre como memoize transformou minha forma de pensar sobre funções, estado e o próprio ato de computar.

---

## O que é memoize (realmente)?

Memoization (não confundir com memorization) é uma técnica de otimização que armazena resultados de chamadas de função caras, retornando o resultado cacheado quando as mesmas entradas ocorrem novamente.

### Definição formal

Dada uma função `f: X → Y`, memoize cria uma nova função `f': X → Y` tal que:
- `f'(x) = f(x)` na primeira chamada com `x`
- `f'(x) = cache[x]` nas chamadas subsequentes com o mesmo `x`

### A implementação mais simples (Python)

```python
def memoize(f):
    cache = {}
    def memoized(*args):
        key = tuple(args)  # Tuplas são hashable
        if key not in cache:
            cache[key] = f(*args)
        return cache[key]
    return memoized

@memoize
def expensive_computation(x):
    print(f"Computando {x}...")  # Só aparece uma vez por valor
    return x * x * x  # Operação cara
```

### O insight fundamental

Memoize não é sobre cache. É sobre **identidade**: a mesma entrada deve produzir a mesma saída. Se sua função não tem essa propriedade, memoize é bug, não feature.

---

## Memoize vs. Cache: uma distinção crucial

### Cache é infraestrutura

- **Onde:** Entre camadas (CPU cache, CDN, Redis)
- **Quando:** Baseado em política (LRU, TTL)
- **Quem:** Sistema, não desenvolvedor
- **Exemplo:** Cache de banco de dados

### Memoize é design

- **Onde:** Na função/método
- **Quando:** Sempre que entradas idênticas
- **Quem:** Desenvolvedor explicitamente
- **Exemplo:** `@memoize` decorator

```javascript
// Cache (infraestrutura)
async function getUserFromDB(id) {
    const cacheKey = `user:${id}`;
    let user = await redis.get(cacheKey);
    if (!user) {
        user = await db.users.find(id);
        await redis.set(cacheKey, user, { EX: 3600 }); // TTL: 1h
    }
    return user;
}

// Memoize (design)
const memoizedCalculate = memoize((a, b) => {
    // Cálculo determinístico caro
    return complexMath(a, b);
});
// memoizedCalculate(2, 3) calcula uma vez, retorna da memória depois
```

---

## Os quatro níveis de memoize

### Nível 1: Função pura (o caso ideal)

```haskell
-- Haskell: memoize é automático para funções puras
fib :: Int -> Integer
fib 0 = 0
fib 1 = 1
fib n = fib (n-1) + fib (n-2)
-- Com lazy evaluation, Haskell memoiza automaticamente
```

**Quando funciona:** Funções puras, determinísticas, com domínio finito ou padrão de acesso repetitivo.

### Nível 2: Função com efeitos colaterais controlados

```javascript
// React useMemo: memoize no ciclo de render
const expensiveValue = useMemo(() => {
    return computeExpensiveValue(a, b);
}, [a, b]);  // Só recalcula se a ou b mudarem
```

**Quando funciona:** Efeitos colaterais gerenciados pelo framework.

### Nível 3: Função com estado externo

```python
@memoize(ttl=300)  # Time-to-live: 5 minutos
def get_current_weather(city):
    # Depende de estado externo (tempo real)
    return weather_api.fetch(city)
```

**Quando funciona:** Estado externo muda lentamente, TTL apropriado.

### Nível 4: Função não-determinística (o perigo)

```python
@memoize  # ⚠️ PERIGO!
def get_random_number():
    return random.randint(1, 100)  # Quebra identidade!
```

**Não use memoize aqui.** A menos que queira o mesmo "random" sempre (o que não é random).

---

## Implementações no mundo real

### Python: `functools.lru_cache`

```python
from functools import lru_cache

@lru_cache(maxsize=128)  # LRU com 128 entradas
def fibonacci(n):
    if n < 2:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# De O(2^n) para O(n) com memória O(n)
```

### JavaScript: memoização manual ou libs

```javascript
// Implementação robusta
function memoize(fn, options = {}) {
    const cache = new Map();
    const { ttl, serializer = JSON.stringify } = options;
    
    return function(...args) {
        const key = serializer(args);
        const cached = cache.get(key);
        
        if (cached) {
            if (!ttl || Date.now() - cached.timestamp < ttl) {
                return cached.value;
            }
        }
        
        const result = fn.apply(this, args);
        cache.set(key, { value: result, timestamp: Date.now() });
        
        // Limite de tamanho (opcional)
        if (cache.size > (options.maxSize || 1000)) {
            const firstKey = cache.keys().next().value;
            cache.delete(firstKey);
        }
        
        return result;
    };
}
```

### Java: `ConcurrentHashMap` para thread-safety

```java
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.function.Function;

public class Memoizer<T, R> {
    private final ConcurrentMap<T, R> cache = new ConcurrentHashMap<>();
    private final Function<T, R> function;
    
    public Memoizer(Function<T, R> function) {
        this.function = function;
    }
    
    public R compute(T input) {
        return cache.computeIfAbsent(input, function);
    }
}

// Uso
Memoizer<Integer, BigInteger> fibMemoizer = new Memoizer<>(n -> {
    if (n <= 1) return BigInteger.valueOf(n);
    return fibMemoizer.compute(n-1).add(fibMemoizer.compute(n-2));
});
```

---

## Os desafios (onde memoize quebra)

### 1. Memória infinita

```python
@lru_cache(maxsize=None)  # Cuidado!
def process(item):
    # Se chamado com infinitas entradas diferentes...
    return expensive_processing(item)
```

**Solução:** LRU, TTL, ou tamanho máximo.

### 2. Argumentos não-hashable

```python
@memoize
def process_list(items):  # ⚠️ Listas não são hashable
    return sum(items)

process_list([1, 2, 3])  # TypeError
```

**Solução:** Serializador (JSON, pickle, tupla).

### 3. Statefulness escondido

```python
counter = 0

@memoize
def get_id():
    global counter
    counter += 1  # ⚠️ Efeito colateral!
    return counter

get_id()  # 1
get_id()  # 1 (bug!)
```

**Solução:** Funções puras ou estado explícito no cache key.

### 4. Memory leaks em closures

```javascript
function createHeavyObject() {
    const hugeArray = new Array(1000000).fill('data');
    return memoize((id) => {
        // hugeArray é referenciado pela closure
        return process(hugeArray, id);
    });
}
// hugeArray nunca é garbage collected enquanto memoize existir
```

**Solução:** WeakMap (JavaScript) ou cache com referências fracas.

---

## Memoize como padrão de design

Aqui está a mudança de mentalidade: memoize não é algo que você "adiciona" para performance. É algo que você "projeta" desde o início.

### Princípio 1: Funções como mapas

Pense em funções como `f: X → Y`. Se `X` é pequeno ou repetitivo, memoize é natural.

### Princípio 2: Transparência referencial

Memoize força transparência referencial: `f(x) === f(x)` sempre. Isso é bom design, não apenas boa performance.

### Princípio 3: Separação de preocupações

```python
# SEM memoize (acoplado)
def get_user_data(user_id):
    # Lógica de negócio + cache misturados
    cache_key = f"user:{user_id}"
    if cache.exists(cache_key):
        return cache.get(cache_key)
    # ... 50 linhas de lógica ...
    cache.set(cache_key, result)
    return result

# COM memoize (separado)
@memoize(ttl=300)
def calculate_user_metrics(user_data):
    # Lógica pura de negócio
    # ... 50 linhas de lógica ...
    return result

# Cache infraestrutural separado
def get_user_data(user_id):
    user = cache.get_or_set(f"user:{user_id}", 
                           lambda: db.get_user(user_id),
                           ttl=3600)
    return calculate_user_metrics(user)
```

---

## Casos de uso além do óbvio

### 1. Dynamic programming

```python
@lru_cache(maxsize=None)
def edit_distance(s1: str, s2: str) -> int:
    if not s1: return len(s2)
    if not s2: return len(s1)
    
    if s1[0] == s2[0]:
        return edit_distance(s1[1:], s2[1:])
    
    return 1 + min(
        edit_distance(s1[1:], s2),      # Delete
        edit_distance(s1, s2[1:]),      # Insert
        edit_distance(s1[1:], s2[1:])   # Replace
    )
```

### 2. Parsing/compilação

```python
@memoize
def parse_expression(tokens):
    # Parsing recursivo de expressões
    # Muitas subexpressões repetidas
    pass
```

### 3. Configuração/feature flags

```python
@memoize(ttl=60)  # Atualiza a cada minuto
def get_feature_flags(user_id):
    # Chamada HTTP cara para serviço de feature flags
    return http.get(f"/features/{user_id}").json()
```

### 4. Computação científica

```python
@memoize
def simulate(params):
    # Simulação Monte Carlo cara
    # Parâmetros são hashable (namedtuple)
    return run_simulation(params)
```

---

## Quando NÃO usar memoize

### 1. Funções I/O bound simples

```python
@memoize  # ❌ Overkill
def read_file(path):
    return open(path).read()
```

**Melhor:** Cache no nível do sistema de arquivos.

### 2. Funções com domínio enorme e acesso uniforme

```python
@memoize  # ❌ Cache hit rate baixíssima
def hash_password(password):
    return bcrypt.hash(password)
```

**Melhor:** Nenhum cache, ou cache com política agressiva de evicção.

### 3. Funções que devem falhar rápido

```python
@memoize  # ❌ Mascara erros transitórios
def call_external_api():
    response = requests.get("https://api.example.com")
    response.raise_for_status()  # HTTP 500 seria cacheado!
    return response.json()
```

**Melhor:** Circuit breaker + cache com TTL curto.

### 4. Funções em sistemas distribuídos

```python
# Aplicação com 10 instâncias
@memoize  # ❌ Cada instância tem cache diferente
def get_global_config():
    return db.query("SELECT * FROM config")
```

**Melhor:** Cache distribuído (Redis, Memcached).

---

## O futuro do memoize

### Tendência 1: Memoize automático

Languages como Haskell já fazem. Futuros compiladores podem identificar funções memoizáveis automaticamente.

### Tendência 2: Memoize persistente

```python
@persistent_memoize("s3://my-bucket/cache/")
def train_model(dataset):
    # Treinamento de ML de 8 horas
    return trained_model
```

### Tendência 3: Memoize com garantias formais

```rust
#[memoize(pure)]  // Compilador verifica pureza
fn compute(x: i32) -> i32 {
    x * x  // Compila
}

#[memoize(pure)]  // ❌ Não compila: I/O
fn get_input() -> String {
    let mut s = String::new();
    std::io::stdin().read_line(&mut s).unwrap();
    s
}
```

### Tendência 4: Memoize incremental

Recalcula apenas partes afetadas por mudanças nas entradas.

---

## Conclusão: memoize como filosofia

Voltando àquela entrevista de 2010. Hoje entendo que o problema não era Fibonacci. Era meu modelo mental de funções.

Via funções como **processos**: algo que acontece, consome recursos, produz resultado.

Memoize me ensinou a ver funções como **relações**: mapeamentos entre entradas e saídas. Se a relação não muda, por que recalcular?

Esta mudança de perspectiva tem implicações profundas:

1. **Design mais limpo:** Funções puras são mais testáveis, mais compostas, mais compreensíveis.
2. **Performance por design:** Não otimização tardia, mas propriedade intrínseca.
3. **Abstrações mais poderosas:** Memoize permite pensar em níveis mais altos (dynamic programming como "apenas memoize").

O verdadeiro poder do memoize não está em fazer Fibonacci rápido. Está em fazer você pensar: "Esta função é uma relação pura? Deveria ser?"

E quando a resposta é "sim", memoize não é uma otimização — é a implementação natural da sua intenção.

---

## Exercício final

Antes de adicionar `@memoize` à sua próxima função, pergunte:

1. **É pura?** Mesma entrada → mesma saída, sempre?
2. **O domínio é apropriado?** Poucas entradas ou muitas repetições?
3. **Os custos justificam?** Computação cara vs. memória limitada?
4. **Há alternativas melhores?** Cache distribuído? Precomputation?

Se todas as respostas forem "sim", memoize não é um hack de performance. É a expressão correta do seu design.

E isso, no final, é o que separa código que funciona de código que é elegante.

---

```python
# Sua função atual
def process_data(data):
    # 50 linhas de lógica complexa
    return result

# Pergunte: é memoizável?
# Se sim, a assinatura já diz:
# process_data: Data -> Result
# 
# E relações podem ser cacheadas.
# 
# Talvez a pergunta certa não seja
# "devo memoizar esta função?"
# mas
# "esta função é uma relação?"
#
# E se não é, deveria ser?
```

A resposta pode mudar mais que sua performance — pode mudar seu design.
