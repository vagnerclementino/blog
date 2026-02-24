#!/bin/bash
# Script para criar artigos seguindo padrão

set -euo pipefail

if [ $# -lt 2 ]; then
    echo "Uso: $0 <titulo> <slug>"
    echo "Exemplo: $0 'Meu Artigo' 'meu-artigo'"
    exit 1
fi

TITLE="$1"
SLUG="$2"
DATE="$(date +%Y-%m-%d)"
BRANCH="article/${SLUG}"

echo "=== Criando artigo: $TITLE ==="
echo "Slug: $SLUG"
echo "Branch: $BRANCH"
echo "Data: $DATE"
echo ""

# Criar branch
cd /home/node/.openclaw/workspace/blog
git checkout main
git pull origin main
git checkout -b "$BRANCH"

# Criar diretório do artigo
ARTICLE_DIR="content/blog/${SLUG}"
mkdir -p "$ARTICLE_DIR"

# Criar arquivo do artigo
cat > "${ARTICLE_DIR}/index.md" <<EOF
---
title: "$TITLE"
date: "$DATE"
description: "Artigo sobre $TITLE"
featuredImage: feature.png
---

## Introdução

Escreva a introdução do artigo aqui...

---

## Conteúdo principal

Desenvolva o conteúdo do artigo aqui...

---

## Conclusão

Conclua o artigo aqui...
EOF

# Criar placeholder para imagem
touch "${ARTICLE_DIR}/feature.png"

echo "Artigo criado em: ${ARTICLE_DIR}/index.md"
echo "Próximo: Editar o artigo e fazer commit"
echo ""
echo "Para editar:"
echo "  vim ${ARTICLE_DIR}/index.md"
echo ""
echo "Para commit:"
echo "  git add ${ARTICLE_DIR}/"
echo "  git commit -m 'feat(article): ${TITLE}'"
echo "  git push -u origin ${BRANCH}"
