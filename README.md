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

Para fazer o deploy no Firebase, primeiro instale o Firebase CLI globalmente:

```bash
npm install -g firebase-tools
```

Faça login no Firebase:

```bash
firebase login
```

Em seguida, faça o deploy:

```bash
firebase deploy
```

Ou execute todos os passos em sequência:

```bash
npm run build && firebase deploy
```

## 🛠️ Tecnologias

- **Gatsby** - Framework React para sites estáticos
- **React** - Biblioteca JavaScript para interfaces
- **Styled Components** - CSS-in-JS para estilização
- **MDX** - Markdown com componentes React
- **Swiper** - Biblioteca para carrosséis
- **Jest** - Framework de testes
- **ESLint** - Linter para JavaScript
- **Firebase Hosting** - Hospedagem

## 📁 Estrutura do Projeto

```bash
src/
├── components/          # Componentes React reutilizáveis
├── pages/              # Páginas do Gatsby
├── templates/          # Templates para posts
├── styles/             # Estilos globais
└── utils/              # Utilitários e helpers

content/
└── blog/               # Artigos em Markdown/MDX
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
