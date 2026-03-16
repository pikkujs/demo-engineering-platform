Feature: Cloud Spend
  Cloud spend data is restricted to management roles.

  Scenario: Developer cannot view cloud spend
    Given I am logged in as "Sarah"
    When I request cloud spend data
    Then the response should contain an access denied error

  Scenario: Engineering Manager sees their division's spend
    Given I am logged in as "Marcus"
    When I request cloud spend data
    Then the response should be successful
    And all spend entries should belong to division "platform"

  Scenario: CTO sees all cloud spend
    Given I am logged in as "Priya"
    When I request cloud spend data
    Then the response should be successful
    And I should see spend for multiple divisions
