/**
 * @jest-environment node
 */

import fs from 'fs'
import path from 'path'

describe('Footnotes Localization Integration', () => {
  it('should have "Referências" instead of "Footnotes" in generated HTML', () => {
    const htmlPath = path.join(process.cwd(), 'public', 'blog', 'a-carta', 'index.html')
    
    if (!fs.existsSync(htmlPath)) {
      throw new Error('HTML file not found. Run "npm run build" first before running tests.');
    }
    
    const htmlContent = fs.readFileSync(htmlPath, 'utf8')
    
    expect(htmlContent).toContain('id="footnote-label">Referências</h2>')
    expect(htmlContent).not.toContain('id="footnote-label">Footnotes</h2>')
  })

  it('should have footnotes section with Portuguese labels in multiple posts', () => {
    const postsWithFootnotes = [
      'a-carta',
      'sobre-nomes',
      'estilos-arquiteturais',
      'principios-de-projeto'
    ]
    
    postsWithFootnotes.forEach(postSlug => {
      const htmlPath = path.join(process.cwd(), 'public', 'blog', postSlug, 'index.html')
      
      if (fs.existsSync(htmlPath)) {
        const htmlContent = fs.readFileSync(htmlPath, 'utf8')
        
        if (htmlContent.includes('data-footnotes="true"')) {
          expect(htmlContent).toContain('id="footnote-label">Referências</h2>')
          expect(htmlContent).not.toContain('id="footnote-label">Footnotes</h2>')
        }
      }
    })
  })
})
