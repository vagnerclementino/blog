const ORIGINAL_ENV = process.env

describe('src/firebase.js', () => {
  afterEach(() => {
    jest.resetModules()
    process.env = { ...ORIGINAL_ENV }
    delete global.window
  })

  test('initializes Firebase app and App Check when env vars are present', () => {
    const initializeApp = jest.fn(() => ({ name: 'app' }))
    const initializeAppCheck = jest.fn(() => ({ check: true }))
    const ReCaptchaEnterpriseProvider = jest.fn()
    const setTokenAutoRefreshEnabled = jest.fn()
    const getFunctions = jest.fn(() => ({ region: 'us-central1' }))
    const connectFunctionsEmulator = jest.fn()

    jest.doMock('firebase/app', () => ({ initializeApp }))
    jest.doMock('firebase/app-check', () => ({
      initializeAppCheck,
      ReCaptchaEnterpriseProvider,
      setTokenAutoRefreshEnabled,
    }))
    jest.doMock('firebase/functions', () => ({
      getFunctions,
      connectFunctionsEmulator,
    }))

    process.env = { ...ORIGINAL_ENV }
    process.env.GATSBY_FIREBASE_API_KEY = 'test-key'
    process.env.GATSBY_FIREBASE_PROJECT_ID = 'test-project'
    process.env.GATSBY_RECAPTCHA_SITE_KEY = 'site-key'
    process.env.NODE_ENV = 'production'

    global.window = {}

    let mod
    jest.isolateModules(() => {
      mod = require('./firebase')
    })

    expect(initializeApp).toHaveBeenCalledWith(expect.objectContaining({
      apiKey: 'test-key',
      projectId: 'test-project',
    }))

    expect(initializeAppCheck).toHaveBeenCalled()
    expect(setTokenAutoRefreshEnabled).toHaveBeenCalled()
    expect(mod.app).toBeDefined()
    expect(mod.appCheck).toBeDefined()
    expect(mod.functions).toBeDefined()
  })

  test('does not initialize Firebase app when required env vars are missing', () => {
    const initializeApp = jest.fn()
    const getFunctions = jest.fn()
    const connectFunctionsEmulator = jest.fn()

    jest.doMock('firebase/app', () => ({ initializeApp }))
    jest.doMock('firebase/app-check', () => ({
      initializeAppCheck: jest.fn(),
      ReCaptchaEnterpriseProvider: jest.fn(),
      setTokenAutoRefreshEnabled: jest.fn(),
    }))
    jest.doMock('firebase/functions', () => ({
      getFunctions,
      connectFunctionsEmulator,
    }))

    process.env = { ...ORIGINAL_ENV }
    delete process.env.GATSBY_FIREBASE_API_KEY
    delete process.env.GATSBY_FIREBASE_PROJECT_ID

    let mod
    jest.isolateModules(() => {
      mod = require('./firebase')
    })

    expect(initializeApp).not.toHaveBeenCalled()
    expect(mod.app).toBeNull()
    expect(mod.appCheck).toBeNull()
    expect(mod.functions).toBeNull()
  })

  test('does not initialize App Check when site key is missing', () => {
    const initializeApp = jest.fn(() => ({ name: 'app' }))
    const initializeAppCheck = jest.fn()
    const setTokenAutoRefreshEnabled = jest.fn()
    const getFunctions = jest.fn(() => ({ region: 'us-central1' }))
    const connectFunctionsEmulator = jest.fn()

    jest.doMock('firebase/app', () => ({ initializeApp }))
    jest.doMock('firebase/app-check', () => ({
      initializeAppCheck,
      ReCaptchaEnterpriseProvider: jest.fn(),
      setTokenAutoRefreshEnabled,
    }))
    jest.doMock('firebase/functions', () => ({
      getFunctions,
      connectFunctionsEmulator,
    }))

    process.env = { ...ORIGINAL_ENV }
    process.env.GATSBY_FIREBASE_API_KEY = 'test-key'
    process.env.GATSBY_FIREBASE_PROJECT_ID = 'test-project'

    global.window = {}

    let mod
    jest.isolateModules(() => {
      mod = require('./firebase')
    })

    expect(initializeApp).toHaveBeenCalled()
    expect(initializeAppCheck).not.toHaveBeenCalled()
    expect(mod.app).toBeDefined()
    expect(mod.appCheck).toBeNull()
    expect(mod.functions).toBeDefined()
  })
})
