import { wireHTTPRoutes } from '#pikku/pikku-types.gen.js'
import { createAuthRoutes } from '@pikku/auth-js'
import Credentials from '@auth/core/providers/credentials'

import { resolveSession } from '../auth.js'

import { getServices } from '../functions/get-services.function.js'
import { updateService } from '../functions/update-service.function.js'
import { getDeployments } from '../functions/get-deployments.function.js'
import { createDeployment } from '../functions/create-deployment.function.js'
import { rollbackDeployment } from '../functions/rollback-deployment.function.js'
import { getIncidents } from '../functions/get-incidents.function.js'
import { createIncident } from '../functions/create-incident.function.js'
import { updateIncident } from '../functions/update-incident.function.js'
import { resolveIncident } from '../functions/resolve-incident.function.js'
import { getCloudSpend } from '../functions/get-cloud-spend.function.js'
import { getTeam } from '../functions/get-team.function.js'
import { pageEngineer } from '../functions/page-engineer.function.js'
import { getOnCall } from '../functions/get-oncall.function.js'
import { updateOnCall } from '../functions/update-oncall.function.js'

wireHTTPRoutes({
  routes: {
    // Auth.js routes (signin, callback, session, etc.)
    auth: createAuthRoutes((services) => ({
      secret: services.config.authSecret,
      trustHost: true,
      providers: [
        Credentials({
          credentials: {
            apiKey: { label: 'API Key', type: 'text' },
          },
          async authorize(credentials) {
            const session = resolveSession(credentials.apiKey as string)
            if (!session) return null
            return {
              id: session.userId,
              name: session.name,
              role: session.role,
              teamId: session.teamId,
              divisionId: session.divisionId,
            } as any
          },
        }),
      ],
      callbacks: {
        jwt({ token, user }) {
          if (user) {
            token.userId = (user as any).id
            token.role = (user as any).role
            token.teamId = (user as any).teamId
            token.divisionId = (user as any).divisionId
          }
          return token
        },
        session({ session, token }) {
          ;(session as any).userId = token.userId
          ;(session as any).role = token.role
          ;(session as any).teamId = token.teamId
          ;(session as any).divisionId = token.divisionId
          return session
        },
      },
    })),

    // API routes
    getServices: { route: '/api/services', method: 'get', func: getServices },
    updateService: { route: '/api/services/:serviceId', method: 'patch', func: updateService },

    getDeployments: { route: '/api/deployments', method: 'get', func: getDeployments },
    createDeployment: { route: '/api/deployments', method: 'post', func: createDeployment },
    rollbackDeployment: { route: '/api/deployments/:deploymentId/rollback', method: 'post', func: rollbackDeployment },

    getIncidents: { route: '/api/incidents', method: 'get', func: getIncidents },
    createIncident: { route: '/api/incidents', method: 'post', func: createIncident },
    updateIncident: { route: '/api/incidents/:incidentId', method: 'patch', func: updateIncident },
    resolveIncident: { route: '/api/incidents/:incidentId/resolve', method: 'post', func: resolveIncident },

    getCloudSpend: { route: '/api/cloud-spend', method: 'get', func: getCloudSpend },

    getTeam: { route: '/api/team', method: 'get', func: getTeam },
    pageEngineer: { route: '/api/team/page', method: 'post', func: pageEngineer },

    getOnCall: { route: '/api/oncall', method: 'get', func: getOnCall },
    updateOnCall: { route: '/api/oncall', method: 'patch', func: updateOnCall },
  },
})
