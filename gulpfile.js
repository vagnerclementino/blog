const gulp = require('gulp');
const fs = require('fs');
const path = require('path');

const createSlug = async (title) => {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

const createArticleTemplate = (title, date, description) => {
  return `---
title: "${title}"
date: "${date}"
description: "${description}"
featuredImage: feature.png
---

## ${title}

Escreva seu artigo aqui...
`;
}

const checkExistingFiles = (indexPath, featurePath) => {
  const indexExists = fs.existsSync(indexPath);
  const featureExists = fs.existsSync(featurePath);

  if (indexExists || featureExists) {
    console.log('⚠️  Arquivos já existem:');
    if (indexExists) console.log(`   - ${indexPath}`);
    if (featureExists) console.log(`   - ${featurePath}`);
  }
  return { indexExists, featureExists };
};

const handleIndexFile = async (indexPath, indexExists, answers, inquirer) => {
  if (!indexExists) {
    const template = createArticleTemplate(answers.title, answers.date, answers.description);
    fs.writeFileSync(indexPath, template);
    return true;
  }
  
  const overwrite = await inquirer.default.prompt([{
    type: 'confirm',
    name: 'confirm',
    message: `Sobrescrever ${path.basename(indexPath)}?`,
    default: false
  }]);
  
  if (overwrite.confirm) {
    const template = createArticleTemplate(answers.title, answers.date, answers.description);
    fs.writeFileSync(indexPath, template);
    return true;
  }
  return false;
};

const handleFeatureFile = async (featurePath, featureExists, inquirer) => {
  const writeFeature = () => {
    const baseFeaturePath = path.join(__dirname, 'content', 'assets', 'feature.png');
    if (fs.existsSync(baseFeaturePath)) {
      fs.copyFileSync(baseFeaturePath, featurePath);
    } else {
      fs.writeFileSync(featurePath, '');
    }
  };

  if (!featureExists) {
    writeFeature();
    return true;
  }
  
  const overwrite = await inquirer.default.prompt([{
    type: 'confirm',
    name: 'confirm',
    message: `Sobrescrever ${path.basename(featurePath)}?`,
    default: false
  }]);
  
  if (overwrite.confirm) {
    writeFeature();
    return true;
  }
  return false;
};

const createArticle = async () => {
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

  const { indexExists, featureExists } = checkExistingFiles(indexPath, featurePath);

  if (!fs.existsSync(articleDir)) {
    fs.mkdirSync(articleDir, { recursive: true });
  }

  const indexWritten = await handleIndexFile(indexPath, indexExists, answers, inquirer);
  const featureWritten = await handleFeatureFile(featurePath, featureExists, inquirer);

  console.log(`\n✅ Processamento concluído!`);
  console.log(`📁 Diretório: ${articleDir}`);
  console.log(`📝 Arquivo ${indexWritten ? 'criado' : 'mantido'}: ${indexPath}`);
  console.log(`🖼️  Imagem ${featureWritten ? 'criada' : 'mantida'}: ${featurePath}`);
}

const cleanArticle = async () => {
  const inquirer = await import('inquirer');
  
  const answers = await inquirer.default.prompt([
    {
      type: 'input',
      name: 'articlePath',
      message: 'Caminho do artigo (ex: meu-artigo):',
      validate: input => input.trim() !== '' || 'O caminho é obrigatório'
    }
  ]);

  const articleDir = path.join(__dirname, 'content', 'blog', answers.articlePath);

  if (!fs.existsSync(articleDir)) {
    console.log(`❌ Artigo não encontrado: ${articleDir}`);
    return;
  }

  fs.rmSync(articleDir, { recursive: true });
  console.log(`🗑️  Artigo removido: ${articleDir}`);
}

gulp.task('new-article', createArticle);
gulp.task('article', createArticle);
gulp.task('clean-article', cleanArticle);

gulp.task('default', () => {
  console.log('Tarefas disponíveis:');
  console.log('  gulp new-article    - Criar novo artigo');
  console.log('  gulp article        - Criar novo artigo (alias)');
  console.log('  gulp clean-article  - Remover artigo existente');
});
