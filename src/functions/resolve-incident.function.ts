import { pikkuFunc } from '#pikku/pikku-types.gen.js'
import { NotFoundError, ForbiddenError } from '@pikku/core/errors'
import { isManager } from '../permissions.js'

export const resolveIncident = pikkuFunc<
  { incidentId: string },
  any
>({
  permissions: { isManager },
  func: async ({ db }, input, { session }) => {
    const incident = await db.selectFrom('incidents').selectAll().where('id', '=', input.incidentId).executeTakeFirst()
    if (!incident) {
      throw new NotFoundError(`Incident ${input.incidentId} not found.`)
    }

    if (incident.severity === 1 && session.role !== 'cto') {
      throw new ForbiddenError('Only the CTO can resolve Severity 1 incidents.')
    }

    await db.updateTable('incidents').set({
      status: 'resolved',
      resolvedAt: new Date().toISOString(),
    }).where('id', '=', input.incidentId).execute()

    const updated = await db.selectFrom('incidents').selectAll().where('id', '=', input.incidentId).executeTakeFirstOrThrow()
    return {
      incident: updated,
      message: `Incident ${updated.id} "${updated.title}" resolved.`,
    }
  },
})
