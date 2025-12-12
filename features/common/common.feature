# features/common/common.feature

Feature: Common UI Interactions
  Tests for common UI elements and interactions used across the application

  @smoke @ui
  Scenario: Page loads successfully
    Given user navigates to base URL
    Then page should load within "5" seconds
    And browser console should have no errors

  @regression @ui
  Scenario: Navigation elements are visible
    Given user is on dashboard
    Then user menu should be visible
    And settings button should be visible
    And logout button should be visible

  @regression @ui
  Scenario: Responsive design works on different viewports
    Given user is on dashboard
    When user resizes viewport to "1280x720"
    Then layout should be properly displayed
    And all buttons should be clickable
