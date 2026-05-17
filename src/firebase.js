import { initializeApp } from "firebase/app"
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
  setTokenAutoRefreshEnabled,
} from "firebase/app-check"

const firebaseConfig = {
  apiKey: process.env.GATSBY_FIREBASE_API_KEY,
  authDomain: process.env.GATSBY_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.GATSBY_FIREBASE_PROJECT_ID,
  storageBucket: process.env.GATSBY_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.GATSBY_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.GATSBY_FIREBASE_APP_ID,
  measurementId: process.env.GATSBY_FIREBASE_MEASUREMENT_ID,
}

let app = null
if (firebaseConfig.apiKey && firebaseConfig.projectId) {
  app = initializeApp(firebaseConfig)
}



let appCheck = null
const siteKey = process.env.GATSBY_RECAPTCHA_SITE_KEY
if (siteKey && typeof window !== "undefined") {
  try {
    appCheck = initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider(siteKey),
      isTokenAutoRefreshEnabled: true,
    })
    setTokenAutoRefreshEnabled(appCheck, true)
  } catch (e) {
    appCheck = null
  }
}

export { app, appCheck }
