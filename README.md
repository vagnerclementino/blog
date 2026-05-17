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

A partir da raiz do projeto:

```bash
npx firebase-tools emulators:start --only functions
```

Ou usando o script do `functions/package.json`:

```bash
cd functions
npm run serve
```

> ⚠️ **Problema com certificado SSL (UNABLE_TO_GET_ISSUER_CERT_LOCALLY):**
> Se ao testar a function você receber erro de certificado SSL ao conectar com APIs externas (ex: Mailchimp), inicie o emulador com:
>
> ```bash
> NODE_TLS_REJECT_UNAUTHORIZED=0 npx firebase-tools emulators:start --only functions
> ```
>
> Isso desabilita a verificação de certificado **apenas para desenvolvimento local**. Nunca use em produção.

> ⚠️ **Firebase CLI não encontrado após `npm install -g firebase-tools`:**
> No macOS, o binário pode não estar no PATH. Use `npx` como alternativa:
>
> ```bash
> npx --yes firebase-tools emulators:start --only functions
> ```
>
> Ou adicione ao `~/.zshrc`:
>
> ```bash
> export PATH="$(npm prefix -g)/bin:$PATH"
> ```

A function ficará disponível em:

```
http://127.0.0.1:5001/clementino-notes/us-central1/subscribeToNewsletter
```

A UI do emulador estará em: `http://127.0.0.1:4000`

### Testando a function

```bash
curl -X POST http://127.0.0.1:5001/clementino-notes/us-central1/subscribeToNewsletter \
  -H "Content-Type: application/json" \
  -d '{"email": "teste@gmail.com"}'
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

### App Check (Debug Token para desenvolvimento local)

A function usa Firebase App Check para impedir chamadas não autorizadas. Em produção, o reCAPTCHA Enterprise gera tokens automaticamente. Em desenvolvimento local, é necessário configurar um **debug token**.

#### 1. Gerar o debug token

No `.env.development`, defina:

```env
GATSBY_FIREBASE_APPCHECK_DEBUG_TOKEN=true
```

Ao iniciar o Gatsby (`npm start`), o console do browser exibirá algo como:

```
App Check debug token: 12345678-1234-1234-1234-123456789abc
```

#### 2. Registrar o token no Firebase Console

1. Acesse [Firebase Console](https://console.firebase.google.com/) → seu projeto
2. Vá em **App Check** → **Apps**
3. Clique no app web → **Manage debug tokens**
4. Clique em **Add debug token** e cole o token exibido no console

Ou via CLI:

```bash
npx firebase-tools appcheck:debug-tokens:create --project clementino-notes --token "SEU-DEBUG-TOKEN"
```

#### 3. (Opcional) Usar um token fixo

Para evitar registrar um novo token a cada vez, cole o token já registrado diretamente no `.env.development`:

```env
GATSBY_FIREBASE_APPCHECK_DEBUG_TOKEN=12345678-1234-1234-1234-123456789abc
```

> ⚠️ O debug token **nunca** deve ser commitado ou usado em produção. O `.env.development` já está no `.gitignore`.

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
