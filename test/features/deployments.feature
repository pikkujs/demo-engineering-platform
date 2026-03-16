Feature: Deployments
  Deployment visibility and actions are scoped by role.

  Scenario: Developer sees deployments without cost data
    Given I am logged in as "Sarah"
    When I request the deployments list
    Then deployments should not contain cost data

  Scenario: CTO sees deployments with cost data
    Given I am logged in as "Priya"
    When I request the deployments list
    Then deployments should contain cost data

  Scenario: Developer can create a deployment for their team's service
    Given I am logged in as "Sarah"
    When I create a deployment for service "svc-1" with version "v2.15.0"
    Then the response should be successful
    And the deployment should have status "success"

  Scenario: Developer cannot rollback a deployment
    Given I am logged in as "Sarah"
    When I try to rollback deployment "dep-1"
    Then the response should contain an access denied error

  Scenario: CTO can rollback a deployment
    Given I am logged in as "Priya"
    When I try to rollback deployment "dep-3"
    Then the response should be successful
