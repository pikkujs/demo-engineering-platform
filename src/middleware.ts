import { addHTTPMiddleware } from '#pikku/pikku-types.gen.js'
import { cors } from '@pikku/core/middleware'
import { authJsSession } from '@pikku/auth-js'
import type { UserSession } from './application-types.js'

addHTTPMiddleware('*', [
  cors({}),
  authJsSession({
    secret: process.env.AUTH_SECRET ?? 'demo-secret-only-for-development',
    mapSession: (claims): UserSession => ({
      userId: claims.userId ?? claims.sub,
      name: claims.name ?? '',
      role: claims.role ?? 'developer',
      teamId: claims.teamId ?? '',
      divisionId: claims.divisionId ?? '',
    }),
  }),
])
