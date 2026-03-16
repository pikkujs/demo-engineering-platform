Feature: Team & On-Call
  Team visibility and paging are role-restricted.

  Scenario: Developer sees only their team members
    Given I am logged in as "Sarah"
    When I request the team list
    Then all team members should belong to team "payments"

  Scenario: CTO sees all team members
    Given I am logged in as "Priya"
    When I request the team list
    Then I should see team members from multiple teams

  Scenario: Developer cannot page engineers
    Given I am logged in as "Sarah"
    When I try to page engineer "u-jake" with reason "Need help"
    Then the response should contain an access denied error

  Scenario: Engineering Manager can page engineers
    Given I am logged in as "Marcus"
    When I try to page engineer "u-jake" with reason "Need help"
    Then the response should be successful

  Scenario: Developer can view their team's on-call schedule
    Given I am logged in as "Sarah"
    When I request the on-call schedule
    Then I should see on-call entries

  Scenario: Developer cannot modify on-call schedule
    Given I am logged in as "Sarah"
    When I try to update on-call for team "payments" with primary "Jake Torres"
    Then the response should contain an access denied error

  Scenario: Engineering Manager can modify on-call schedule
    Given I am logged in as "Marcus"
    When I try to update on-call for team "payments" with primary "Jake Torres"
    Then the response should be successful
