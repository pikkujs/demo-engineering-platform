import { When, Then } from '@cucumber/cucumber'
import { strict as assert } from 'assert'
import type { DemoWorld } from '../support/world.js'

When('I request the deployments list', async function (this: DemoWorld) {
  await this.apiGet('/api/deployments')
})

When('I create a deployment for service {string} with version {string}', async function (this: DemoWorld, serviceId: string, version: string) {
  await this.apiPost('/api/deployments', { serviceId, version })
})

When('I try to rollback deployment {string}', async function (this: DemoWorld, deploymentId: string) {
  await this.apiPost(`/api/deployments/${deploymentId}/rollback`)
})

Then('deployments should not contain cost data', function (this: DemoWorld) {
  const deployments = this.lastBody?.deployments ?? []
  assert.ok(deployments.length > 0, 'Expected at least one deployment')
  for (const d of deployments) {
    assert.equal(d.costDelta, undefined, `Deployment ${d.id} should not have cost data`)
  }
})

Then('deployments should contain cost data', function (this: DemoWorld) {
  const deployments = this.lastBody?.deployments ?? []
  assert.ok(deployments.length > 0, 'Expected at least one deployment')
  const hasCost = deployments.some((d: any) => d.costDelta !== undefined)
  assert.ok(hasCost, 'Expected at least one deployment with cost data')
})

Then('the deployment should have status {string}', function (this: DemoWorld, status: string) {
  assert.equal(this.lastBody?.deployment?.status, status)
})
