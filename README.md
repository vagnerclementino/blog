# Clementino's Notes

Um blog pessoal sobre desenvolvimento de software, design patterns e boas práticas de programação, construído com Gatsby e React.

<img alt="screenshot" src="./screenshot.gif">

## Autor

- [@vagnerclementino](https://github.com/vagnerclementino)

## 🔗 Links

[![portfolio](https://img.shields.io/badge/portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://clementino.me/)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/vagnerclementino/)
[![blog](https://img.shields.io/badge/blog-FF5722?style=for-the-badge&logo=gatsby&logoColor=white)](https://notes.clementino.me/)

## Demonstração

O blog está disponível em: [https://notes.clementino.me](https://notes.clementino.me)

## ✍️ Criando Artigos

Para facilitar a criação de novos artigos, o projeto inclui uma automação usando Gulp:

```bash
npm run article:new
```

O comando irá solicitar:

- **Título do artigo**: O título principal do artigo
- **Data de publicação**: No formato YYYY-MM-DD (padrão: data atual)  
- **Subtítulo/Descrição**: Uma breve descrição do artigo

### Removendo Artigos

Para remover um artigo existente:

```bash
npm run article:clean
```

### O que é criado automaticamente

A automação cria:

1. **Pasta do artigo**: `content/blog/[slug-do-titulo]/`
2. **Arquivo principal**: `index.md` com frontmatter preenchido
3. **Placeholder da imagem**: `feature.png` (arquivo vazio)

## Rodando localmente

Clone o projeto

```bash
git clone https://github.com/vagnerclementino/blog.git
```

Entre no diretório do projeto

```bash
cd blog
```

Instale as dependências

```bash
npm install
```

Inicie o servidor de desenvolvimento

```bash
npm start
```

O site estará disponível em `http://localhost:8000`

### Rodando com TypeScript

Para verificar a tipagem:

```bash
npm run check-types
```

## Rodando os testes

Para rodar os testes, execute o seguinte comando

```bash
npm test
```

Para rodar os testes em modo watch:

```bash
npm run test:watch
```

## Build e Deploy

Para fazer o build do projeto:

```bash
npm run build
```

### Deploy Automático via GitHub Actions

O deploy é feito automaticamente via GitHub Actions:

- **Deploy de Produção**: Quando código é merged na branch `main`, o GitHub Actions executa automaticamente:
  1. Instala dependências (`npm ci --legacy-peer-deps`)
  2. Executa testes (`npm test`)
  3. Faz build (`npm run build`)
  4. Deploy no Firebase Hosting (produção)

- **Deploy de Preview**: Para Pull Requests, é criado um preview temporário no Firebase Hosting

### Deploy Manual (casos específicos)

Para deploy manual usando Firebase CLI (apenas em casos específicos):

```bash
# Instalar Firebase CLI globalmente
npm install -g firebase-tools

# Login no Firebase
firebase login

# Deploy manual
npm run build && firebase deploy
```

## 🛠️ Tecnologias

- **Gatsby** - Framework React para sites estáticos
- **React** - Biblioteca JavaScript para interfaces
- **TypeScript** - Superset tipado de JavaScript
- **Styled Components** - CSS-in-JS para estilização
- **MDX** - Markdown com componentes React
- **Swiper** - Biblioteca para carrosséis
- **Jest** - Framework de testes
- **ESLint** - Linter para JavaScript/TypeScript
- **Firebase Hosting** - Hospedagem

## 📁 Estrutura do Projeto

```bash
blog_amazon_redshift_clone/
├── content/          # Conteúdo do blog
├── src/             # Componentes React/TypeScript
├── docs/            # Documentação
├── .github/         # Configurações GitHub
├── tasks/           # Tarefas da migração
├── package.json     # Dependências (com TypeScript)
├── tsconfig.json    # Configuração TypeScript
└── README.md        # Documentação atualizada
```

## 🎨 Funcionalidades

- ✅ Homepage com carrosséis de posts
- ✅ Posts em destaque configuráveis
- ✅ Design responsivo
- ✅ Navegação por setas e bullets
- ✅ Newsletter signup
- ✅ Links sociais
- ✅ SEO otimizado
- ✅ Testes automatizados

## 🔄 Migração para TypeScript

Este projeto está em processo de migração para TypeScript com arquitetura atômica.

**Status**: Fase 1 - Preparação concluída

Branch de migração: `typescript-migration`

Consulte `tasks/task.md` para ver o plano detalhado de migração.

**Objetivos**:
- Converter todo o código JavaScript para TypeScript
- Reestruturar componentes em uma arquitetura atômica
- Manter compatibilidade com Gatsby e MDX
- Testes incrementais durante a migração

## Contribuindo

Contribuições são sempre bem-vindas!

Para contribuir com o projeto, por favor **crie um fork** do repositório:

1. **Fork este repositório** clicando no botão "Fork" no GitHub
2. **Clone seu fork** para sua máquina local:

   ```bash
   git clone https://github.com/SEU-USUARIO/blog.git
   ```

3. **Crie uma branch** para sua feature:

   ```bash
   git checkout -b feature/MinhaNovaFeature
   ```

4. **Faça suas alterações** e commit:

   ```bash
   git commit -m 'feat: adiciona nova funcionalidade'
   ```

5. **Push para seu fork**:

   ```bash
   git push origin feature/MinhaNovaFeature
   ```

6. **Abra um Pull Request** do seu fork para este repositório

Por favor, certifique-se de que todos os testes estão passando antes de abrir o PR.

## Licença

[MIT](https://choosealicense.com/licenses/mit/)

## ⚠️ Nota de Migração

Este projeto está em processo de migração para TypeScript. Algumas funcionalidades podem estar temporariamente indisponíveis durante o processo de conversão.

