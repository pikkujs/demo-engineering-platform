import { Given, When, Then } from '@cucumber/cucumber'
import { strict as assert } from 'assert'
import type { DemoWorld } from '../support/world.js'

Given('I am logged in as {string}', async function (this: DemoWorld, userName: string) {
  await this.login(userName)
})

When('I make a GET request to {string} without authentication', async function (this: DemoWorld, path: string) {
  this.lastResponse = await fetch(`${this.baseUrl}${path}`)
  this.lastStatus = this.lastResponse.status
})

When('I check my session', async function (this: DemoWorld) {
  await this.apiGet('/auth/session')
})

Then('the response status should be {int}', function (this: DemoWorld, status: number) {
  assert.equal(this.lastStatus, status)
})

Then('my session role should be {string}', function (this: DemoWorld, role: string) {
  assert.equal(this.lastBody?.role, role)
})

Then('my session name should be {string}', function (this: DemoWorld, name: string) {
  assert.equal(this.lastBody?.user?.name, name)
})

Then('the response should be successful', function (this: DemoWorld) {
  assert.ok(!this.lastBody?.errorId, `Expected success but got error: ${JSON.stringify(this.lastBody)}`)
})

Then('the response should contain an access denied error', function (this: DemoWorld) {
  assert.ok(
    this.lastBody?.errorId || this.lastBody?.message || this.lastStatus === 403,
    `Expected an error/forbidden response but got status ${this.lastStatus}: ${JSON.stringify(this.lastBody)}`
  )
})
