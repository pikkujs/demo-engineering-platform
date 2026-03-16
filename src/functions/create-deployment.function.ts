import { pikkuFunc } from '#pikku/pikku-types.gen.js'
import { NotFoundError, ForbiddenError } from '@pikku/core/errors'
import { getTeamIdsForUser } from '../data.js'

export const createDeployment = pikkuFunc<
  { serviceId: string; version: string },
  any
>({
  func: async ({ db }, input, { session }) => {
    const teamIds = await getTeamIdsForUser(db, session.role, session.teamId, session.divisionId)

    const service = await db.selectFrom('services').selectAll().where('id', '=', input.serviceId).executeTakeFirst()
    if (!service) {
      throw new NotFoundError(`Service ${input.serviceId} not found.`)
    }
    if (!teamIds.includes(service.teamId)) {
      throw new ForbiddenError(`You can only deploy to services in your ${session.role === 'developer' ? 'team' : 'division'}.`)
    }

    const id = `dep-${Date.now()}`
    await db.insertInto('deployments').values({
      id,
      serviceId: input.serviceId,
      serviceName: service.name,
      version: input.version,
      timestamp: new Date().toISOString(),
      status: 'success',
      author: session.name,
      authorTeamId: session.teamId,
      durationMs: Math.floor(Math.random() * 200000) + 60000,
      costDelta: 0,
    }).execute()

    const deployment = await db.selectFrom('deployments').selectAll().where('id', '=', id).executeTakeFirstOrThrow()
    return { deployment }
  },
})
