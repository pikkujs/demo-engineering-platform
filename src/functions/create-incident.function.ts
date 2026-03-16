import { pikkuFunc } from '#pikku/pikku-types.gen.js'
import { NotFoundError } from '@pikku/core/errors'

export const createIncident = pikkuFunc<
  { serviceId: string; title: string; severity: number; description: string },
  any
>({
  func: async ({ db }, input, { session }) => {
    const service = await db.selectFrom('services').selectAll().where('id', '=', input.serviceId).executeTakeFirst()
    if (!service) {
      throw new NotFoundError(`Service ${input.serviceId} not found.`)
    }

    const id = `inc-${Date.now()}`
    await db.insertInto('incidents').values({
      id,
      title: input.title,
      serviceId: input.serviceId,
      serviceName: service.name,
      severity: input.severity,
      status: 'active',
      startedAt: new Date().toISOString(),
      resolvedAt: null,
      responders: [session.name] as any,
      revenueImpact: null,
      description: input.description,
    }).execute()

    const incident = await db.selectFrom('incidents').selectAll().where('id', '=', id).executeTakeFirstOrThrow()
    return { incident }
  },
})
