import React from "react"
import { config } from "@fortawesome/fontawesome-svg-core"
config.autoAddCss = false

export const onRenderBody = ({ setHeadComponents }) => {
  const siteKey = process.env.GATSBY_RECAPTCHA_SITE_KEY
  if (siteKey) {
    setHeadComponents([
      <script
        key="recaptcha-enterprise"
        src={`https://www.google.com/recaptcha/enterprise.js?render=${siteKey}`}
        async
        defer
      ></script>,
    ])
  }
}
