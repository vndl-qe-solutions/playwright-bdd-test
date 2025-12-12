# features/auth/logout.feature

Feature: User Authentication - Logout
  As a logged-in user
  I want to logout from the application
  So that my session is terminated securely

  Background:
    Given user is logged in with username "testuser" and password "TestPassword@123"
    And user is on dashboard

  @smoke @critical @auth
  Scenario: Successful logout
    When user clicks profile menu
    And user clicks logout button
    Then user should be redirected to login page
    And user session should be cleared

  @regression @auth
  Scenario: Logout clears session data
    When user clicks profile menu
    And user clicks logout button
    Then user should be redirected to login page
    And cached user data should be cleared
    And user cookies should be deleted

  @regression @auth
  Scenario: Cannot access dashboard after logout
    When user clicks profile menu
    And user clicks logout button
    And user tries to navigate to dashboard directly
    Then user should be redirected to login page
