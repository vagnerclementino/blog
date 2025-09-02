const gulp = require('gulp');
const fs = require('fs');
const path = require('path');

async function createSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function createArticleTemplate(title, date, description) {
  return `---
title: "${title}"
date: "${date}"
description: "${description}"
featuredImage: feature.png
---

# ${title}

Escreva seu artigo aqui...
`;
}

async function createArticle() {
  const inquirer = await import('inquirer');
  
  const answers = await inquirer.default.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Título do artigo:',
      validate: input => input.trim() !== '' || 'O título é obrigatório'
    },
    {
      type: 'input',
      name: 'date',
      message: 'Data de publicação (YYYY-MM-DD):',
      default: new Date().toISOString().split('T')[0],
      validate: input => {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        return dateRegex.test(input) || 'Use o formato YYYY-MM-DD';
      }
    },
    {
      type: 'input',
      name: 'description',
      message: 'Subtítulo/Descrição:',
      validate: input => input.trim() !== '' || 'A descrição é obrigatória'
    }
  ]);

  const slug = await createSlug(answers.title);
  const articleDir = path.join(__dirname, 'content', 'blog', slug);
  const indexPath = path.join(articleDir, 'index.md');
  const featurePath = path.join(articleDir, 'feature.png');

  // Criar diretório
  if (!fs.existsSync(articleDir)) {
    fs.mkdirSync(articleDir, { recursive: true });
  }

  // Criar index.md
  const template = createArticleTemplate(answers.title, answers.date, answers.description);
  fs.writeFileSync(indexPath, template);

  // Criar feature.png vazio (placeholder)
  fs.writeFileSync(featurePath, '');

  console.log(`\n✅ Artigo criado com sucesso!`);
  console.log(`📁 Diretório: ${articleDir}`);
  console.log(`📝 Arquivo: ${indexPath}`);
  console.log(`🖼️  Imagem: ${featurePath} (placeholder criado)`);
  console.log(`\n💡 Não esqueça de adicionar a imagem feature.png!`);
}

gulp.task('new-article', createArticle);
gulp.task('article', createArticle);

gulp.task('default', () => {
  console.log('Tarefas disponíveis:');
  console.log('  gulp new-article  - Criar novo artigo');
  console.log('  gulp article      - Criar novo artigo (alias)');
});
