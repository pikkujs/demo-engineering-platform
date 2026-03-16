import { pikkuFunc } from '#pikku/pikku-types.gen.js'
import { NotFoundError, BadRequestError } from '@pikku/core/errors'
import { isManager } from '../permissions.js'

export const rollbackDeployment = pikkuFunc<
  { deploymentId: string },
  any
>({
  permissions: { isManager },
  func: async ({ db }, input) => {
    const deployment = await db.selectFrom('deployments').selectAll().where('id', '=', input.deploymentId).executeTakeFirst()
    if (!deployment) {
      throw new NotFoundError(`Deployment ${input.deploymentId} not found.`)
    }
    if (deployment.status === 'rolled_back') {
      throw new BadRequestError(`Deployment ${input.deploymentId} is already rolled back.`)
    }

    await db.updateTable('deployments').set({ status: 'rolled_back' }).where('id', '=', input.deploymentId).execute()

    const updated = await db.selectFrom('deployments').selectAll().where('id', '=', input.deploymentId).executeTakeFirstOrThrow()
    return {
      deployment: updated,
      message: `Rolled back ${updated.serviceName} ${updated.version}. Service reverted to previous version.`,
    }
  },
})
