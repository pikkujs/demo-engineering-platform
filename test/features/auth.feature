Feature: Authentication
  Users must authenticate with a valid API key to access the platform.

  Scenario: Unauthenticated request is rejected
    When I make a GET request to "/api/services" without authentication
    Then the response status should be 403

  Scenario: Sarah can authenticate and access her session
    Given I am logged in as "Sarah"
    When I check my session
    Then my session role should be "developer"
    And my session name should be "Sarah Chen"

  Scenario: Marcus can authenticate and access his session
    Given I am logged in as "Marcus"
    When I check my session
    Then my session role should be "em"

  Scenario: Priya can authenticate and access her session
    Given I am logged in as "Priya"
    When I check my session
    Then my session role should be "cto"
