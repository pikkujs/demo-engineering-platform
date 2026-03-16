import { World, setWorldConstructor, Before, After, setDefaultTimeout } from '@cucumber/cucumber'

setDefaultTimeout(30_000)

const BASE_URL = process.env.TEST_BASE_URL ?? 'http://localhost:4010'

const API_KEYS: Record<string, string> = {
  Sarah: 'sarah-key-only-hardcoded-for-demo',
  Marcus: 'marcus-key-only-hardcoded-for-demo',
  Priya: 'priya-key-only-hardcoded-for-demo',
}

export class DemoWorld extends World {
  baseUrl = BASE_URL
  cookies: string = ''
  currentUser: string = ''
  lastResponse!: Response
  lastBody: any = null
  lastStatus: number = 0

  async login(userName: string) {
    const apiKey = API_KEYS[userName]
    if (!apiKey) throw new Error(`Unknown user: ${userName}`)

    // Get CSRF token
    const csrfRes = await fetch(`${this.baseUrl}/auth/csrf`)
    const csrfCookies = csrfRes.headers.getSetCookie?.() ?? []
    const { csrfToken } = await csrfRes.json() as any

    // Collect cookies
    let cookieJar = csrfCookies.map(c => c.split(';')[0]).join('; ')

    // Sign in
    const signinRes = await fetch(`${this.baseUrl}/auth/callback/credentials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieJar,
      },
      body: JSON.stringify({ apiKey, csrfToken }),
      redirect: 'manual',
    })

    // Collect all set-cookie headers from redirect chain
    const signinCookies = signinRes.headers.getSetCookie?.() ?? []
    const allCookies = [...csrfCookies, ...signinCookies]
    cookieJar = allCookies.map(c => c.split(';')[0]).join('; ')

    // Follow redirect to get final session cookie
    const location = signinRes.headers.get('location')
    if (location) {
      const redirectUrl = location.startsWith('http') ? location : `${this.baseUrl}${location}`
      const followRes = await fetch(redirectUrl, {
        headers: { Cookie: cookieJar },
        redirect: 'manual',
      })
      const moreCookies = followRes.headers.getSetCookie?.() ?? []
      const finalCookies = [...allCookies, ...moreCookies]
      cookieJar = finalCookies.map(c => c.split(';')[0]).join('; ')
    }

    this.cookies = cookieJar
    this.currentUser = userName
  }

  async apiGet(path: string) {
    this.lastResponse = await fetch(`${this.baseUrl}${path}`, {
      headers: { Cookie: this.cookies },
    })
    this.lastStatus = this.lastResponse.status
    try {
      this.lastBody = await this.lastResponse.json()
    } catch {
      this.lastBody = null
    }
  }

  async apiPost(path: string, body?: any) {
    this.lastResponse = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: this.cookies,
      },
      body: body ? JSON.stringify(body) : '{}',
    })
    this.lastStatus = this.lastResponse.status
    try {
      this.lastBody = await this.lastResponse.json()
    } catch {
      this.lastBody = null
    }
  }

  async apiPatch(path: string, body?: any) {
    this.lastResponse = await fetch(`${this.baseUrl}${path}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: this.cookies,
      },
      body: body ? JSON.stringify(body) : '{}',
    })
    this.lastStatus = this.lastResponse.status
    try {
      this.lastBody = await this.lastResponse.json()
    } catch {
      this.lastBody = null
    }
  }
}

setWorldConstructor(DemoWorld)
