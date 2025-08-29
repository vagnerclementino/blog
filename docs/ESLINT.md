# 📋 Configuração do ESLint

Este projeto usa **ESLint v9** com configuração flat config para garantir qualidade e consistência do código.

## 🎯 Regras Ativas

### JavaScript Básico

- **`no-console`**: Avisa sobre `console.log` (pode ser removido em produção)
- **`no-unused-vars`**: Avisa sobre variáveis não utilizadas (permite prefixo `_`)

### React

- **`react/prop-types`**: Desabilitado (não obrigatório para este projeto)
- **`react/react-in-jsx-scope`**: Desabilitado (React 17+ não precisa importar)
- **`react/no-unescaped-entities`**: Desabilitado (permite aspas simples em texto)
- **`react/display-name`**: Desabilitado (componentes anônimos permitidos)

### React Hooks

- **`react-hooks/rules-of-hooks`**: **OBRIGATÓRIO** - Garante ordem correta dos hooks
- **`react-hooks/exhaustive-deps`**: Avisa sobre dependências faltantes

## 🔧 Configurações Específicas

### Arquivos de Teste

- Globais do Jest explicitamente habilitadas via `languageOptions.globals`
- Regras mais flexíveis para variáveis não utilizadas

### Arquivos de Configuração

- `console.log` permitido
- Globais do Node.js incluídas

### Ignorando Diretórios de Build

Para evitar lint lento e ruído, adicione diretórios de build/output ao `ignores`:

```js
export default [
  {
    ignores: [
      "node_modules/**",
      "public/**", 
      ".cache/**"
    ]
  },
  // ... resto da configuração
]
```

Isso previne o escaneamento desses diretórios mantendo o resto da configuração inalterada.

## 📚 Regras Comentadas (Para Análise Futura)

### JavaScript

```javascript
// "eqeqeq": "error",                    // Força === ao invés de ==
// "no-var": "error",                    // Proíbe var (prefere let/const)
// "prefer-const": "error",              // Prefere const quando possível
// "semi": ["error", "always"],          // Força ponto e vírgula
// "quotes": ["error", "single"],        // Força aspas simples
// "comma-dangle": ["error", "always-multiline"], // Vírgula final
// "indent": ["error", 2],               // Espaçamento de 2 espaços
// "complexity": ["warn", 10],           // Limita complexidade
// "max-lines-per-function": ["warn", 50], // Limita linhas por função
```

### React

```javascript
// "react/sort-comp": "error",           // Ordem dos métodos em classes
// "react/no-array-index-key": "warn",   // Proíbe índice como key
// "react/jsx-fragments": ["error", "syntax"], // Força Fragment
// "react/jsx-props-no-multi-spaces": "error", // Espaçamento em props
```

### Acessibilidade (JSX-A11Y)

```javascript
// "jsx-a11y/alt-text": "error",       // Alt text obrigatório
// "jsx-a11y/anchor-is-valid": "error", // Valida links
// "jsx-a11y/label-has-associated-control": "error", // Labels em inputs
// "jsx-a11y/role-has-required-aria-props": "error", // ARIA válido
```

### Testes (Jest)

```javascript
// "jest/expect-expect": "error",       // Força expect.assertions()
// "jest/no-focused-tests": "error",    // Proíbe fit, fdescribe
// "jest/no-disabled-tests": "warn",    // Proíbe xit, xdescribe
```

## 🚀 Como Usar

### Executar Lint

```bash
npm run lint          # Verificar problemas
npm run lint:fix       # Corrigir automaticamente
```

### Integração com Editor

Instale a extensão do ESLint no seu editor para feedback em tempo real:

- **VS Code**: ESLint extension
- **WebStorm**: Suporte nativo
- **Vim/Neovim**: coc-eslint ou similar

## 📖 Links Úteis

- [ESLint v9 Documentation](https://eslint.org/docs/latest/)
- [Flat Config Guide](https://eslint.org/docs/latest/use/configure/configuration-files)
- [React ESLint Plugin](https://github.com/jsx-eslint/eslint-plugin-react)
- [React Hooks ESLint Plugin](https://github.com/facebook/react/tree/main/packages/eslint-plugin-react-hooks)
- [JSX A11Y Plugin](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y)

## 🔄 Ativando Regras Comentadas

Para ativar uma regra comentada:

1. Remova o `//` do início da linha
2. Execute `npm run lint` para testar
3. Ajuste o código conforme necessário
4. Commit as mudanças

Exemplo:

```javascript
// Antes (comentado)
// "eqeqeq": "error",

// Depois (ativo)
"eqeqeq": "error",
```
