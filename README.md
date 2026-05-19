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

Este comando inicia simultaneamente:

- **Gatsby** (dev server) em `http://localhost:8000`
- **Firebase Functions Emulator** em `http://127.0.0.1:5001`

> Para rodar apenas o Gatsby sem o emulador de functions: `npm run develop`

## Rodando os testes

Para rodar os testes, execute o seguinte comando

```bash
npm test
```

Para rodar os testes em modo watch:

```bash
npm run test:watch
```

## ☁️ Firebase Functions (Newsletter)

O blog utiliza uma Firebase Function para gerenciar inscrições na newsletter via Mailchimp.

### Pré-requisitos

- Node.js 20+
- Firebase CLI (ou usar via `npx`)

### Instalação

```bash
cd functions
npm install
```

### Configuração dos Secrets

A function precisa de credenciais do Mailchimp. Para desenvolvimento local, copie o arquivo de exemplo:

```bash
cp functions/.secret.local.example functions/.secret.local
```

Edite o `functions/.secret.local` com suas credenciais reais:

```env
MAILCHIMP_API_KEY=sua-api-key
MAILCHIMP_SERVER_PREFIX=usX
MAILCHIMP_AUDIENCE_ID=seu-audience-id
```

> ⚠️ O arquivo `.secret.local` está no `.gitignore` e nunca deve ser commitado.

### Build

```bash
cd functions
npm run build
```

### Rodando o emulador localmente

O comando `npm start` na raiz já inicia o emulador automaticamente junto com o Gatsby. Para rodar o emulador isoladamente:

```bash
npm run emulator
```

Ou a partir do diretório `functions`:

```bash
cd functions
npm run serve
```

> ⚠️ **Certificado SSL (UNABLE_TO_GET_ISSUER_CERT_LOCALLY):**
> Os scripts `npm start` e `npm run emulator` já incluem `NODE_TLS_REJECT_UNAUTHORIZED=0` para contornar problemas de certificado SSL em desenvolvimento local. Nunca use essa variável em produção.

A function ficará disponível em:

```
http://127.0.0.1:5001/clementino-notes/us-central1/subscribeToNewsletter
```

A UI do emulador estará em: `http://127.0.0.1:4000`

### Testando a function

```bash
curl -X POST http://127.0.0.1:5001/clementino-notes/us-central1/subscribeToNewsletter \
  -H "Content-Type: application/json" \
  -d '{"data": {"email": "teste@gmail.com", "name": "Vagner Teste"}}'
```

### Testes unitários

```bash
cd functions
npm test
```

### Deploy

O deploy das functions é feito via GitHub Actions automaticamente ao fazer merge na `main`. Para deploy manual:

```bash
npx firebase-tools deploy --only functions
```

### App Check

Em produção, a function usa Firebase App Check com reCAPTCHA Enterprise para impedir chamadas não autorizadas. Em desenvolvimento local, o App Check é desabilitado automaticamente para simplificar o fluxo de testes.

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
- **Styled Components** - CSS-in-JS para estilização
- **MDX** - Markdown com componentes React
- **Swiper** - Biblioteca para carrosséis
- **Firebase Functions** - Backend serverless (newsletter)
- **Firebase Hosting** - Hospedagem
- **Mailchimp** - Gerenciamento de newsletter
- **Jest** - Framework de testes
- **ESLint** - Linter para JavaScript

## 📁 Estrutura do Projeto

```bash
src/
├── components/          # Componentes React reutilizáveis
├── pages/              # Páginas do Gatsby
├── templates/          # Templates para posts
├── styles/             # Estilos globais
├── firebase.js         # Inicialização do Firebase SDK
└── utils/              # Utilitários e helpers

functions/
└── src/
    └── newsletter-signup/  # Firebase Function (Mailchimp)

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
