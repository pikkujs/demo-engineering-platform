import { When, Then } from '@cucumber/cucumber'
import { strict as assert } from 'assert'
import type { DemoWorld } from '../support/world.js'

When('I request the team list', async function (this: DemoWorld) {
  await this.apiGet('/api/team')
})

When('I try to page engineer {string} with reason {string}', async function (this: DemoWorld, userId: string, reason: string) {
  await this.apiPost('/api/team/page', { userId, reason })
})

When('I request the on-call schedule', async function (this: DemoWorld) {
  await this.apiGet('/api/oncall')
})

When('I try to update on-call for team {string} with primary {string}', async function (this: DemoWorld, teamId: string, primary: string) {
  await this.apiPatch('/api/oncall', { teamId, primary })
})

Then('all team members should belong to team {string}', function (this: DemoWorld, teamId: string) {
  const members = this.lastBody?.members ?? []
  assert.ok(members.length > 0, 'Expected at least one team member')
  for (const m of members) {
    assert.equal(m.teamId, teamId, `Member ${m.name} belongs to ${m.teamId}, expected ${teamId}`)
  }
})

Then('I should see team members from multiple teams', function (this: DemoWorld) {
  const members = this.lastBody?.members ?? []
  const teams = new Set(members.map((m: any) => m.teamId))
  assert.ok(teams.size > 1, `Expected multiple teams, got ${[...teams].join(', ')}`)
})

Then('I should see on-call entries', function (this: DemoWorld) {
  const schedule = this.lastBody?.schedule ?? []
  assert.ok(schedule.length > 0, 'Expected at least one on-call entry')
})
