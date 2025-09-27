# Product Requirements Document – Newsletter com Brevo e Firebase Functions

## 1. Resumo Executivo
Este documento descreve os requisitos para implementação de uma funcionalidade de newsletter utilizando Gatsby (frontend), Firebase Cloud Functions (backend serverless) e integração com a API do Brevo para gestão de assinantes e disparo de emails. O fluxo de publicação, capturas e disparos será automatizado. O deploy das funções backend será realizado via action dedicada do GitHub Actions. Todos os exemplos de código são sugestões e podem ser modificados conforme evolução técnica.

---

## 2. Justificativa do Projeto
- Engajamento e Retenção: Nutrir audiência com atualizações e novidades automatizadas
- Escalabilidade e Custo: Utilização de Brevo (plano gratuito robusto) e processamento serverless via Firebase
- Desenvolvimento Ágil: Pipeline CI/CD conectado a IDEs modernas (Kiro, VSCode, etc)
- Personalização: Templates de email flexíveis conforme tipo de interação

---

## 3. Objetivos e Metas
- Implementar sistema escalável e seguro para coleta de emails
- Processar e registrar inscrições via Cloud Function HTTP
- Orquestrar integração com API Brevo (inclusão e atualização de contatos)
- Disparar email de boas vindas e automatizar campanhas futuras
- Implementar deploy automático das Cloud Functions via GitHub Actions
- Permitir manutenção facilitada dos templates de email

---

## 4. Requisitos Funcionais
**4.1 Coleta de assinantes**
- Formulário Gatsby (nome, email)
- Submissão via POST para Firebase Function HTTP
- Validação mínima de dados (campo obrigatório, formato email)

**4.2 Integração com Brevo API**
- Enviar/atualizar contatos na lista Brevo
- Manuseio de API Key em ambiente seguro
- Tratar duplicidade (email já existente)

**4.3 Disparo de emails automáticos**
- Enviar alerta/boas vindas ao novo assinante
- Flexibilidade para disparar todos ou segmentado
- Possível futura automação via RSS/Firestore trigger

**4.4 Templates editáveis (Email)**
- Modelos disponíveis no Brevo e editáveis via HTML
- Três exemplos fornecidos (Boas-vindas, Novidades, Convite)

**4.5 Deploy Automático e Observabilidade**
- Deploy via GitHub Action dedicada
- Log/trace do deploy e status disponível para a squad

**4.6 Monitoramento e Logs**
- Log de eventos principais e erros no Firebase Console
- Rastreabilidade em caso de erro de integração

---

## 5. Requisitos Não-Funcionais
- Segurança: API Keys nunca expostas no frontend
- Escalabilidade: Grátis e estável para até 10.000 capturas/mês
- Latência: Resposta ao usuário em até 2 segundos na média
- Acessibilidade: Formulário/email compatível com WCAG
- Internacionalização futura dos templates

---

## 6. Integração e Deploy
Deploy das Cloud Functions só pode ocorrer via action dedicada:
```yaml
name: Deploy Firebase Functions
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy Functions
        run: |
          cd functions
          npm ci
          firebase deploy --only functions --token ${{ secrets.FIREBASE_TOKEN }}
```
Variáveis sensíveis em ambiente seguro, nunca no código-fonte.

---

## 7. Templates de Email

### 7.1 Boas-vindas Simples
```html
<h2>Bem-vindo à nossa Newsletter!</h2>
<p>Olá, {{ params.FIRSTNAME | default: 'assinante' }}.<br>
Obrigado por se inscrever. Em breve você receberá novidades fresquinhas da nossa equipe!</p>
<p>Até logo!<br/>Equipe {{ params.SENDER | default: 'Site Exemplo' }}</p>
```

### 7.2 Resumo de Novidades
```html
<h2>Veja as últimas novidades do blog:</h2>
{% for item in items %}
  <div style="margin-bottom:18px;">
   <strong>{{ item.title }}</strong><br/>
   <span>{{ item.date | date: '%d/%m/%Y' }}</span><br/>
   <a href="{{ item.url }}">Leia agora</a>
  </div>
{% endfor %}
<p>Boas leituras!<br/>Equipe {{ params.SENDER | default: 'Site Exemplo' }}</p>
```

### 7.3 Convite à Comunidade
```html
<h2>Junte-se à nossa comunidade!</h2>
<p>Você agora faz parte da nossa newsletter.<br>
Fique de olho nos próximos emails para oportunidades exclusivas!</p>
<p>Até breve,<br/>Equipe {{ params.SENDER | default: 'Site Exemplo' }}</p>
```

---

## 8. Exemplo de Estrutura Function (Sugestão)
```javascript
const functions = require('firebase-functions');
const axios = require('axios');
const cors = require('cors')({ origin: true });

exports.subscribeNewsletter = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });
    try {
      const { email, firstName } = req.body;
      const response = await axios.post(
        'https://api.brevo.com/v3/contacts',
        {
          email,
          attributes: { FIRSTNAME: firstName || '' },
          listIds: [1],
          updateEnabled: true
        },
        {
          headers: {
            'api-key': functions.config().brevo.api_key,
            'Content-Type': 'application/json'
          }
        }
      );
      return res.status(200).json({ success: true, message: 'Inscrito com sucesso!' });
    } catch (error) {
      functions.logger.error('Erro na inscrição:', error);
      return res.status(500).json({ success: false, error: 'Erro interno' });
    }
  });
});
```
> **Nota:** sugerido para servir de base, adaptações podem ser necessárias.

---

## 9. Critérios de Aceite
- [ ] Formulário Gatsby coleta assinantes corretamente
- [ ] Function adiciona contato Brevo e retorna status
- [ ] Deploy automatizado via action dedicada
- [ ] Email recebido (boas-vindas/teste) em grandes provedores
- [ ] Templates editáveis/testados no Brevo
- [ ] Logs e rastreabilidade de erros no Firebase Console

---

## 10. Observações
- Arquitetura focada em desacoplamento e integração CI/CD moderna
- Possíveis extensões: automação RSS, analytics, segmentação, multi-idioma
- Responsáveis por cada template/API devem ser especificados
- Sugestão de uso da IDE Kiro como ponto central de colaboração e versionamento