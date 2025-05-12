const gulp = require('gulp');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');

// Enhanced Portuguese to URL-safe slug conversion
function toUrlSlug(title) {
  return title
    .normalize('NFD')  // Normalize to decomposed form (separates accents)
    .replace(/[\u0300-\u036f]/g, '')  // Remove all accent marks
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')  // Replace non-alphanumeric with hyphens
    .replace(/^-+/, '')  // Remove leading hyphens
    .replace(/-+$/, '')  // Remove trailing hyphens
    .replace(/--+/g, '-');  // Replace multiple hyphens with single
}

gulp.task('draft', async function() {
  console.log(chalk.blue.bold('\n✨ Criando Novo Artigo ✨\n'));

  try {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Título do artigo (com acentos):',
        validate: input => input.trim() ? true : 'O título não pode estar vazio'
      },
      {
        type: 'input',
        name: 'description',
        message: 'Descrição breve:'
      }
    ]);

    const { title, description } = answers;
    const date = new Date().toISOString().split('T')[0];
    const folderName = toUrlSlug(title);
    const postDir = path.join('content', 'blog', folderName);

    // Create directory if it doesn't exist
    if (!fs.existsSync(postDir)) {
      fs.mkdirSync(postDir, { recursive: true });
    }

    // Create markdown content
    const content = `---
title: "${title}"
date: "${date}"
description: "${description}"
featuredImage: feature.jpg
draft: true
---

<!-- Comece a escrever seu conteúdo aqui -->
`;

    // Write files
    fs.writeFileSync(path.join(postDir, 'index.md'), content);
    fs.writeFileSync(path.join(postDir, 'feature.jpg'), ''); // Placeholder image

    console.log(chalk.green.bold('\n✅ Artigo criado com sucesso!'));
    console.log(chalk.yellow(`Título original: "${title}"`));
    console.log(chalk.yellow(`Pasta gerada: ${folderName}`));
    console.log(chalk.yellow(`Localização: ${postDir}`));
    console.log(chalk.yellow('\nPróximos passos:'));
    console.log(chalk.yellow('1. Adicione uma imagem como feature.jpg'));
    console.log(chalk.yellow('2. Edite o conteúdo em index.md'));
    console.log(chalk.yellow('3. Remova "draft: true" quando pronto para publicar\n'));

  } catch (error) {
    console.error(chalk.red.bold('\n❌ Erro ao criar artigo:'));
    console.error(chalk.red(error.message));
    process.exit(1);
  }
});
