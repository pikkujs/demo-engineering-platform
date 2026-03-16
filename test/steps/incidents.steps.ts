import { Given, When, Then } from '@cucumber/cucumber'
import { strict as assert } from 'assert'
import type { DemoWorld } from '../support/world.js'

When('I request the incidents list', async function (this: DemoWorld) {
  await this.apiGet('/api/incidents')
})

When('I create an incident for service {string} with title {string} and severity {int}', async function (this: DemoWorld, serviceId: string, title: string, severity: number) {
  await this.apiPost('/api/incidents', { serviceId, title, severity, description: 'Test incident' })
})

When('I try to update incident {string} with severity {int}', async function (this: DemoWorld, incidentId: string, severity: number) {
  await this.apiPatch(`/api/incidents/${incidentId}`, { severity })
})

When('I try to resolve incident {string}', async function (this: DemoWorld, incidentId: string) {
  await this.apiPost(`/api/incidents/${incidentId}/resolve`)
})

Given('incident {string} has severity {int}', async function (this: DemoWorld, incidentId: string, severity: number) {
  // Ensure we're logged in as someone who can change severity
  const prevCookies = this.cookies
  const prevUser = this.currentUser
  await this.login('Priya')
  await this.apiPatch(`/api/incidents/${incidentId}`, { severity })
  // Restore previous user
  this.cookies = prevCookies
  this.currentUser = prevUser
})

Then('incident {string} should have a revenue impact', function (this: DemoWorld, incidentId: string) {
  const incident = this.lastBody?.incidents?.find((i: any) => i.id === incidentId)
  assert.ok(incident, `Incident ${incidentId} not found`)
  assert.notEqual(incident.revenueImpact, undefined, 'Expected revenue impact to be present')
  assert.notEqual(incident.revenueImpact, null, 'Expected revenue impact to be non-null')
})

Then('incident {string} should not have a revenue impact', function (this: DemoWorld, incidentId: string) {
  const incident = this.lastBody?.incidents?.find((i: any) => i.id === incidentId)
  assert.ok(incident, `Incident ${incidentId} not found`)
  assert.equal(incident.revenueImpact, undefined, 'Expected revenue impact to be absent')
})
