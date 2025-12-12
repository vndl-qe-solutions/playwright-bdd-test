# features/auth/login.feature

Feature: User Authentication - Login
  As a user
  I want to login to the application
  So that I can access my account and dashboard

  Background:
    Given user navigates to login page

  @smoke @critical @auth
  Scenario: Successful login with valid credentials
    When user enters username "practice" and password "SuperSecretPassword!"
    And user clicks login button
    Then user should be redirected to dashboard
    And welcome message should display "testuser"

  @regression @auth
  Scenario Outline: Successful login with multiple valid credentials
    When user enters username "<username>" and password "<password>"
    And user clicks login button
    Then user should be redirected to dashboard
    And welcome message should display "<username>"

    Examples:
      | username    | password          |
      | testuser1   | TestPassword@123  |
      | testuser2   | SecurePass@456    |
      | testuser3   | MyPassword@789    |

  @negative @auth
  Scenario: Login fails with invalid username
    When user enters username "invaliduser" and password "TestPassword@123"
    And user clicks login button
    Then error message should display "Invalid credentials"
    And user should remain on login page

  @negative @auth
  Scenario: Login fails with invalid password
    When user enters username "testuser" and password "wrongpassword"
    And user clicks login button
    Then error message should display "Invalid credentials"
    And user should remain on login page

  @negative @auth
  Scenario: Login fails with empty username
    When user leaves username empty
    And user enters password "TestPassword@123"
    And user clicks login button
    Then validation error should display "Username is required"

  @negative @auth
  Scenario: Login fails with empty password
    When user enters username "testuser"
    And user leaves password empty
    And user clicks login button
    Then validation error should display "Password is required"

  @regression @auth
  Scenario: Remember me functionality works
    When user enters username "testuser" and password "TestPassword@123"
    And user checks remember me checkbox
    And user clicks login button
    Then user should be redirected to dashboard
    And remember me preference should be saved

  @slow @auth
  Scenario: Forgot password link redirects correctly
    When user clicks forgot password link
    Then user should be redirected to password reset page
