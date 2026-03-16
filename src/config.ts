import { pikkuConfig } from '#pikku/pikku-types.gen.js'

export const createConfig = pikkuConfig(async () => ({
  port: Number(process.env.PORT ?? 4010),
  hostname: '0.0.0.0',
  authSecret: process.env.AUTH_SECRET ?? 'demo-secret-only-for-development',
}))
