# Como Converter a Apresentação para PowerPoint/Google Slides

A apresentação está em formato **Marp** (Markdown Presentation Ecosystem), que permite versionar slides no Git e converter para múltiplos formatos.

## Opção 1: Marp CLI (Recomendado)

### Instalação

```bash
# Via npm
npm install -g @marp-team/marp-cli

# Ou via Homebrew (macOS)
brew install marp-cli

# Ou baixe o binário em: https://github.com/marp-team/marp-cli/releases
```

### Converter para PowerPoint

```bash
cd content/blog/piramide-code-review

# Para PPTX (PowerPoint)
marp presentation.md --pptx

# Para PDF
marp presentation.md --pdf

# Para HTML (apresentação web)
marp presentation.md --html
```

### Opções adicionais

```bash
# Com tema personalizado
marp presentation.md --pptx --theme-set ./theme.css

# Com tamanho específico (16:9 é padrão)
marp presentation.md --pptx --size 16:9

# Output com nome personalizado
marp presentation.md --pptx -o piramide-code-review.pptx
```

## Opção 2: Marp Web (Sem instalação)

1. Acesse: https://marp.app
2. Cole o conteúdo do `presentation.md`
3. Clique em **Export** → escolha PPTX, PDF ou HTML

## Opção 3: Google Slides (Manual)

Se preferir Google Slides:

1. **Converta para PDF primeiro:**
   ```bash
   marp presentation.md --pdf
   ```

2. **No Google Slides:**
   - Abra https://slides.google.com
   - Crie uma apresentação em branco
   - Arquivo → Importar slides → Upload → selecione o PDF
   - Importe todos os slides

3. **Ajuste o tema** conforme necessário

## Opção 4: VS Code com Extensão Marp

1. Instale a extensão **Marp for VS Code**
2. Abra o arquivo `presentation.md`
3. Clique no ícone do Marp no canto superior direito
4. Escolha **Export Slide Deck** → PPTX, PDF ou HTML

## Estrutura da Apresentação

- **Total de slides:** ~25
- **Tema:** Gaia (padrão, clean e profissional)
- **Formato:** 16:9 (widescreen)
- **Estilo:** Minimalista, foco no conteúdo

## Personalização

### Mudar o tema

No topo do `presentation.md`, altere:

```markdown
---
marp: true
theme: gaia  # Mude para: default, uncover, gaia, ou custom
---
```

### Temas disponíveis

- `default` — básico
- `gaia` — clean e moderno (atual)
- `uncover` — foco em imagens
- Customizado: crie seu próprio arquivo CSS

### Adicionar imagem de fundo

```markdown
![bg right:50% w:400](./sua-imagem.png)
```

### Criar slide com duas colunas

```markdown
<div class="columns">
<div>

## Coluna 1

Conteúdo aqui

</div>
<div>

## Coluna 2

Mais conteúdo

</div>
</div>
```

## Dicas para Apresentação

1. **Não leia os slides** — use como guia
2. **Adapte o ritmo** — alguns slides podem ser expandidos
3. **Tenha exemplos práticos** — prepare demos se possível
4. **Reserve tempo para Q&A** — o tópico gera boas discussões

## Atualizar a Apresentação

Como está em Markdown:

1. Edite o `presentation.md`
2. Commit e push
3. Regere o PPTX/PDF quando necessário

**Vantagem:** O conteúdo da apresentação está versionado junto com o artigo!

## Links Úteis

- [Marp Documentation](https://marp.app/)
- [Marp CLI GitHub](https://github.com/marp-team/marp-cli)
- [Marp Themes](https://github.com/marp-team/marp-themes)
- [VS Code Extension](https://marketplace.visualstudio.com/items?itemName=marp-team.marp-vscode)
