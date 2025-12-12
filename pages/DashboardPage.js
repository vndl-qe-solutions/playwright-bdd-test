import { BasePage } from './BasePage.js';

/**
 * DashboardPage - Page Object for dashboard functionality
 */
export class DashboardPage extends BasePage {
  // Selectors
  selectors = {
    dashboardTitle: '[data-testid="dashboard-title"]',
    userGreeting: '[data-testid="user-greeting"]',
    profileButton: '[data-testid="profile-button"]',
    logoutButton: '[data-testid="logout-button"]',
    settingsButton: '[data-testid="settings-button"]',
    mainContent: '[data-testid="main-content"]',
    userMenu: '[data-testid="user-menu"]',
  };

  /**
   * Navigate to dashboard
   */
  async navigateToDashboard() {
    await this.navigateTo(`${this.config.baseUrl}/dashboard`);
    await this.waitForVisible(this.selectors.dashboardTitle);
  }

  /**
   * Get dashboard title
   */
  async getDashboardTitle() {
    return await this.getText(this.selectors.dashboardTitle);
  }

  /**
   * Get user greeting message
   */
  async getUserGreeting() {
    return await this.getText(this.selectors.userGreeting);
  }

  /**
   * Click profile button
   */
  async clickProfileButton() {
    await this.click(this.selectors.profileButton);
  }

  /**
   * Click logout button
   */
  async clickLogout() {
    await this.click(this.selectors.logoutButton);
  }

  /**
   * Click settings button
   */
  async clickSettings() {
    await this.click(this.selectors.settingsButton);
  }

  /**
   * Verify dashboard loaded
   */
  async isDashboardLoaded() {
    return await this.isVisible(this.selectors.dashboardTitle);
  }

  /**
   * Verify main content is visible
   */
  async isMainContentVisible() {
    return await this.isVisible(this.selectors.mainContent);
  }

  /**
   * Open user menu
   */
  async openUserMenu() {
    await this.click(this.selectors.userMenu);
  }
}

export default DashboardPage;
