Feature: Services
  Service visibility is scoped by role.

  Scenario: Developer sees only their team's services
    Given I am logged in as "Sarah"
    When I request the services list
    Then I should see 3 services
    And all services should belong to team "payments"

  Scenario: Engineering Manager sees their division's services
    Given I am logged in as "Marcus"
    When I request the services list
    Then I should see 6 services

  Scenario: CTO sees all services
    Given I am logged in as "Priya"
    When I request the services list
    Then I should see 8 services

  Scenario: Developer cannot update service configuration
    Given I am logged in as "Sarah"
    When I try to update service "svc-1" with 10 instances
    Then the response should contain an access denied error

  Scenario: CTO can update service configuration
    Given I am logged in as "Priya"
    When I try to update service "svc-1" with 10 instances
    Then the response should be successful
    And the service should have 10 instances
