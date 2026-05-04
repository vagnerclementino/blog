/*
 * Font Awesome: desabilitar injeção automática de CSS no SSR.
 * O CSS é importado via gatsby-browser.js e incluído no bundle estático.
 * Isso garante que os ícones SVG já tenham dimensões corretas no HTML inicial.
 */
import { config } from "@fortawesome/fontawesome-svg-core"
config.autoAddCss = false
