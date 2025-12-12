import { BasePage } from './BasePage.js';

/**
 * LoginPage - Page Object for login functionality
 * Demonstrates POM pattern with specific page selectors and methods
 */
export class LoginPage extends BasePage {
  // Selectors
  selectors = {
    usernameInput: 'input[name="username"]',
    emailInput: 'input[name="email"]',
    passwordInput: 'input[name="password"]',
    loginButton: 'button[type="submit"]',
    rememberMeCheckbox: 'input[name="rememberMe"]',
    forgotPasswordLink: 'a[href*="forgot"]',
    errorMessage: '[data-testid="error-message"]',
    successMessage: '[data-testid="success-message"]',
    signupLink: 'a[href*="signup"]',
  };

  /**
   * Navigate to login page
   */
  async navigateToLoginPage() {
    await this.navigateTo(`${this.config.baseUrl}/login`);
    await this.waitForVisible(this.selectors.usernameInput);
  }

  /**
   * Enter username
   */
  async enterUsername(username) {
    await this.fill(this.selectors.usernameInput, username);
  }

  /**
   * Enter email
   */
  async enterEmail(email) {
    await this.fill(this.selectors.emailInput, email);
  }

  /**
   * Enter password
   */
  async enterPassword(password) {
    await this.fill(this.selectors.passwordInput, password);
  }

  /**
   * Click login button
   */
  async clickLoginButton() {
    await this.click(this.selectors.loginButton);
  }

  /**
   * Login with username and password
   */
  async login(username, password) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }

  /**
   * Login with email and password
   */
  async loginWithEmail(email, password) {
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }

  /**
   * Check remember me checkbox
   */
  async checkRememberMe() {
    await this.checkCheckbox(this.selectors.rememberMeCheckbox);
  }

  /**
   * Click forgot password link
   */
  async clickForgotPassword() {
    await this.click(this.selectors.forgotPasswordLink);
  }

  /**
   * Get error message
   */
  async getErrorMessage() {
    return await this.getText(this.selectors.errorMessage);
  }

  /**
   * Get success message
   */
  async getSuccessMessage() {
    return await this.getText(this.selectors.successMessage);
  }

  /**
   * Verify error message is visible
   */
  async isErrorMessageVisible() {
    return await this.isVisible(this.selectors.errorMessage);
  }

  /**
   * Click signup link
   */
  async clickSignupLink() {
    await this.click(this.selectors.signupLink);
  }

  /**
   * Verify login page loaded
   */
  async isLoginPageLoaded() {
    return await this.isVisible(this.selectors.usernameInput);
  }
}

export default LoginPage;
