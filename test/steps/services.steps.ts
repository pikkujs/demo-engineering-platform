import { When, Then } from '@cucumber/cucumber'
import { strict as assert } from 'assert'
import type { DemoWorld } from '../support/world.js'

When('I request the services list', async function (this: DemoWorld) {
  await this.apiGet('/api/services')
})

When('I try to update service {string} with {int} instances', async function (this: DemoWorld, serviceId: string, instances: number) {
  await this.apiPatch(`/api/services/${serviceId}`, { instances })
})

Then('I should see {int} services', function (this: DemoWorld, count: number) {
  assert.equal(this.lastBody?.services?.length, count)
})

Then('all services should belong to team {string}', function (this: DemoWorld, teamId: string) {
  const services = this.lastBody?.services ?? []
  for (const s of services) {
    assert.equal(s.teamId, teamId, `Service ${s.name} belongs to ${s.teamId}, expected ${teamId}`)
  }
})

Then('the service should have {int} instances', function (this: DemoWorld, instances: number) {
  assert.equal(this.lastBody?.service?.instances, instances)
})
