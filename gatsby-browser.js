/*
 * Font Awesome: desabilitar injeção automática de CSS e importar manualmente.
 * Isso evita o FOUC (Flash of Unstyled Content) onde os ícones SVG aparecem gigantes
 * antes do JavaScript carregar e injetar o CSS.
 */
import { config } from "@fortawesome/fontawesome-svg-core"
import "@fortawesome/fontawesome-svg-core/styles.css"
config.autoAddCss = false

import "./src/styles/prism-dracula.css"
import "prismjs/plugins/line-numbers/prism-line-numbers.css"
import "prismjs/plugins/command-line/prism-command-line.css"

import "typeface-montserrat"
import "typeface-merriweather"
import "./src/styles/global.css"
