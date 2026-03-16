Feature: Incidents
  Incident management has role-based access for reads and writes.

  Scenario: CTO sees revenue impact on incidents
    Given I am logged in as "Priya"
    When I request the incidents list
    Then incident "inc-4521" should have a revenue impact

  Scenario: Developer does not see revenue impact
    Given I am logged in as "Sarah"
    When I request the incidents list
    Then incident "inc-4521" should not have a revenue impact

  Scenario: Anyone can create an incident
    Given I am logged in as "Sarah"
    When I create an incident for service "svc-1" with title "Test incident" and severity 3
    Then the response should be successful

  Scenario: Developer cannot update incident severity
    Given I am logged in as "Sarah"
    When I try to update incident "inc-4518" with severity 1
    Then the response should contain an access denied error

  Scenario: Engineering Manager can update incident severity
    Given I am logged in as "Marcus"
    When I try to update incident "inc-4518" with severity 1
    Then the response should be successful

  Scenario: Developer cannot resolve incidents
    Given I am logged in as "Sarah"
    When I try to resolve incident "inc-4518"
    Then the response should contain an access denied error

  Scenario: Only CTO can resolve Severity 1 incidents
    Given I am logged in as "Marcus"
    And incident "inc-4518" has severity 1
    When I try to resolve incident "inc-4518"
    Then the response should contain an access denied error

  Scenario: CTO can resolve any incident
    Given I am logged in as "Priya"
    When I try to resolve incident "inc-4518"
    Then the response should be successful
