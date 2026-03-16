import { pikkuFunc } from '#pikku/pikku-types.gen.js'
import { NotFoundError } from '@pikku/core/errors'
import { isManager } from '../permissions.js'

export const updateIncident = pikkuFunc<
  { incidentId: string; severity?: number; addResponder?: string },
  any
>({
  permissions: { isManager },
  func: async ({ db }, input) => {
    const incident = await db.selectFrom('incidents').selectAll().where('id', '=', input.incidentId).executeTakeFirst()
    if (!incident) {
      throw new NotFoundError(`Incident ${input.incidentId} not found.`)
    }

    const updates: Record<string, any> = {}
    if (input.severity !== undefined) {
      updates.severity = input.severity
    }
    if (input.addResponder) {
      const responders = (incident.responders as any as string[]) ?? []
      if (!responders.includes(input.addResponder)) {
        responders.push(input.addResponder)
        updates.responders = responders as any
      }
    }

    if (Object.keys(updates).length > 0) {
      await db.updateTable('incidents').set(updates).where('id', '=', input.incidentId).execute()
    }

    const updated = await db.selectFrom('incidents').selectAll().where('id', '=', input.incidentId).executeTakeFirstOrThrow()
    return { incident: updated }
  },
})
