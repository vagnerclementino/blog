const gulp = require('gulp');
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');

function createPost(done) {
  inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Enter the blog post title:',
    },
    {
      type: 'input',
      name: 'description',
      message: 'Enter the blog post description:',
    },
  ]).then(answers => {
    const { title, description } = answers;
    const date = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format
    const slug = title.toLowerCase().replace(/ /g, '-');
    const postDir = path.join(__dirname, 'content', 'blog', slug);

    if (!fs.existsSync(postDir)) {
      fs.mkdirSync(postDir, { recursive: true });
    }

    const content = `---
title: "${title}"
date: "${date}"
description: "${description}"
featuredImage: feature.jpg
---
`;

    fs.writeFileSync(path.join(postDir, 'index.md'), content);
    fs.writeFileSync(path.join(postDir, 'feature.jpg'), ''); // Placeholder for the image
    console.log(`Blog post created at ${postDir}`);

    done();
  });
}

gulp.task('draft', createPost);
