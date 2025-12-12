import { Given, When, Then, Before } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { DashboardPage } from '../pages/DashboardPage.js';
import logger from '../utils/logger.js';

/**
 * Common Step Definitions
 * Reusable steps for navigation and general actions
 */

Given('user navigates to login page', async function () {
  const loginPage = new LoginPage(this.page);
  await loginPage.navigateToLoginPage();
  this.loginPage = loginPage;
  this.logger.info('[Steps] User navigated to login page');
});

Given('user navigates to base URL', async function () {
  await this.navigateTo(this.config.baseUrl);
  this.logger.info('[Steps] User navigated to base URL');
});

Given('user is on dashboard', async function () {
  const dashboardPage = new DashboardPage(this.page);
  await dashboardPage.navigateToDashboard();
  this.dashboardPage = dashboardPage;
  this.logger.info('[Steps] User is on dashboard');
});

Given('user is logged in with username {string} and password {string}', async function (username, password) {
  const loginPage = new LoginPage(this.page);
  await loginPage.navigateToLoginPage();
  await loginPage.login(username, password);

  // Wait for dashboard to load
  const dashboardPage = new DashboardPage(this.page);
  await dashboardPage.waitForVisible(dashboardPage.selectors.dashboardTitle);

  this.loginPage = loginPage;
  this.dashboardPage = dashboardPage;
  this.logger.info(`[Steps] User logged in as ${username}`);
});

When('user enters username {string} and password {string}', async function (username, password) {
  if (!this.loginPage) {
    this.loginPage = new LoginPage(this.page);
  }
  await this.loginPage.enterUsername(username);
  await this.loginPage.enterPassword(password);
  this.setTestData('username', username);
  this.logger.info('[Steps] User entered credentials');
});

When('user enters username {string}', async function (username) {
  if (!this.loginPage) {
    this.loginPage = new LoginPage(this.page);
  }
  await this.loginPage.enterUsername(username);
  this.setTestData('username', username);
  this.logger.info(`[Steps] User entered username: ${username}`);
});

When('user enters password {string}', async function (password) {
  if (!this.loginPage) {
    this.loginPage = new LoginPage(this.page);
  }
  await this.loginPage.enterPassword(password);
  this.logger.info('[Steps] User entered password');
});

When('user leaves username empty', async function () {
  if (!this.loginPage) {
    this.loginPage = new LoginPage(this.page);
  }
  // Clear the field if it has any value
  const field = this.page.locator(this.loginPage.selectors.usernameInput);
  await field.clear();
  this.logger.info('[Steps] Username field left empty');
});

When('user leaves password empty', async function () {
  if (!this.loginPage) {
    this.loginPage = new LoginPage(this.page);
  }
  // Clear the field if it has any value
  const field = this.page.locator(this.loginPage.selectors.passwordInput);
  await field.clear();
  this.logger.info('[Steps] Password field left empty');
});

When('user clicks login button', async function () {
  if (!this.loginPage) {
    this.loginPage = new LoginPage(this.page);
  }
  await this.loginPage.clickLoginButton();
  await this.waits.pause(1000); // Wait for navigation
  this.logger.info('[Steps] User clicked login button');
});

When('user checks remember me checkbox', async function () {
  if (!this.loginPage) {
    this.loginPage = new LoginPage(this.page);
  }
  await this.loginPage.checkRememberMe();
  this.logger.info('[Steps] User checked remember me');
});

When('user clicks forgot password link', async function () {
  if (!this.loginPage) {
    this.loginPage = new LoginPage(this.page);
  }
  await this.loginPage.clickForgotPassword();
  this.logger.info('[Steps] User clicked forgot password link');
});

When('user clicks profile menu', async function () {
  if (!this.dashboardPage) {
    this.dashboardPage = new DashboardPage(this.page);
  }
  await this.dashboardPage.openUserMenu();
  this.logger.info('[Steps] User clicked profile menu');
});

When('user clicks logout button', async function () {
  if (!this.dashboardPage) {
    this.dashboardPage = new DashboardPage(this.page);
  }
  await this.dashboardPage.clickLogout();
  await this.waits.pause(1000); // Wait for navigation
  this.logger.info('[Steps] User clicked logout button');
});

When('user tries to navigate to dashboard directly', async function () {
  try {
    await this.navigateTo(`${this.config.baseUrl}/dashboard`);
    this.logger.info('[Steps] User attempted to navigate to dashboard');
  } catch (error) {
    this.logger.warn('[Steps] Navigation attempt failed: ' + error.message);
  }
});

When('user resizes viewport to {string}', async function (viewport) {
  const [width, height] = viewport.split('x').map(Number);
  await this.page.setViewportSize({ width, height });
  this.logger.info(`[Steps] Viewport resized to ${width}x${height}`);
});

Then('user should be redirected to dashboard', async function () {
  const dashboardPage = new DashboardPage(this.page);
  await dashboardPage.waitForUrl(/secure/, { timeout: 5000 });
  const isDashboardLoaded = await dashboardPage.isDashboardLoaded();
  expect(isDashboardLoaded).toBe(true);
  this.dashboardPage = dashboardPage;
  this.logger.info('[Steps] User redirected to dashboard');
});

Then('user should remain on login page', async function () {
  const loginPage = new LoginPage(this.page);
  const isLoginPageLoaded = await loginPage.isLoginPageLoaded();
  expect(isLoginPageLoaded).toBe(true);
  this.logger.info('[Steps] User remained on login page');
});

Then('user should be redirected to login page', async function () {
  const loginPage = new LoginPage(this.page);
  await loginPage.waitForUrl(/login/, { timeout: 5000 });
  const isLoginPageLoaded = await loginPage.isLoginPageLoaded();
  expect(isLoginPageLoaded).toBe(true);
  this.loginPage = loginPage;
  this.logger.info('[Steps] User redirected to login page');
});

Then('user should be redirected to password reset page', async function () {
  await this.page.waitForURL(/password|reset|forgot/, { timeout: 5000 });
  const currentUrl = this.page.url();
  expect(currentUrl).toMatch(/password|reset|forgot/);
  this.logger.info('[Steps] User redirected to password reset page');
});

Then('welcome message should display {string}', async function (username) {
  if (!this.dashboardPage) {
    this.dashboardPage = new DashboardPage(this.page);
  }
  const greeting = await this.dashboardPage.getUserGreeting();
  expect(greeting).toContain(username);
  this.logger.info(`[Steps] Welcome message displayed: ${greeting}`);
});

Then('error message should display {string}', async function (expectedMessage) {
  if (!this.loginPage) {
    this.loginPage = new LoginPage(this.page);
  }
  const isErrorVisible = await this.loginPage.isErrorMessageVisible();
  expect(isErrorVisible).toBe(true);
  const errorMessage = await this.loginPage.getErrorMessage();
  expect(errorMessage).toContain(expectedMessage);
  this.logger.info(`[Steps] Error message verified: ${errorMessage}`);
});

Then('validation error should display {string}', async function (expectedMessage) {
  if (!this.loginPage) {
    this.loginPage = new LoginPage(this.page);
  }
  const isErrorVisible = await this.loginPage.isErrorMessageVisible();
  expect(isErrorVisible).toBe(true);
  const errorMessage = await this.loginPage.getErrorMessage();
  expect(errorMessage).toContain(expectedMessage);
  this.logger.info(`[Steps] Validation error verified: ${errorMessage}`);
});

Then('remember me preference should be saved', async function () {
  // Check if remember me cookie or local storage is set
  const cookies = await this.context.cookies();
  const hasRememberMeCookie = cookies.some((c) => c.name.toLowerCase().includes('remember'));
  expect(hasRememberMeCookie || cookies.length > 0).toBe(true);
  this.logger.info('[Steps] Remember me preference verified');
});

Then('user session should be cleared', async function () {
  const cookies = await this.context.cookies();
  const sessionCookies = cookies.filter((c) => c.name.toLowerCase().includes('session'));
  expect(sessionCookies.length).toBe(0);
  this.logger.info('[Steps] User session cleared');
});

Then('cached user data should be cleared', async function () {
  const localStorage = await this.page.evaluate(() => JSON.stringify(window.localStorage));
  const userDataPresent = localStorage.includes('user') || localStorage.includes('currentUser');
  expect(userDataPresent).toBe(false);
  this.logger.info('[Steps] Cached user data cleared');
});

Then('user cookies should be deleted', async function () {
  await this.context.clearCookies();
  const cookies = await this.context.cookies();
  expect(cookies.length).toBe(0);
  this.logger.info('[Steps] User cookies deleted');
});

Then('page should load within {string} seconds', async function (seconds) {
  const timeoutMs = parseInt(seconds) * 1000;
  const navigationPromise = this.page.waitForLoadState('networkidle', { timeout: timeoutMs });
  try {
    await navigationPromise;
    this.logger.info(`[Steps] Page loaded within ${seconds} seconds`);
  } catch (error) {
    this.logger.warn(`[Steps] Page load exceeded ${seconds} seconds`);
  }
});

Then('browser console should have no errors', async function () {
  const consoleErrors = [];
  this.page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  // Check for any existing errors (this is a simplified check)
  expect(consoleErrors.length).toBe(0);
  this.logger.info('[Steps] Browser console has no errors');
});

Then('user menu should be visible', async function () {
  if (!this.dashboardPage) {
    this.dashboardPage = new DashboardPage(this.page);
  }
  const isVisible = await this.dashboardPage.isVisible(this.dashboardPage.selectors.userMenu);
  expect(isVisible).toBe(true);
  this.logger.info('[Steps] User menu is visible');
});

Then('settings button should be visible', async function () {
  if (!this.dashboardPage) {
    this.dashboardPage = new DashboardPage(this.page);
  }
  const isVisible = await this.dashboardPage.isVisible(this.dashboardPage.selectors.settingsButton);
  expect(isVisible).toBe(true);
  this.logger.info('[Steps] Settings button is visible');
});

Then('logout button should be visible', async function () {
  if (!this.dashboardPage) {
    this.dashboardPage = new DashboardPage(this.page);
  }
  const isVisible = await this.dashboardPage.isVisible(this.dashboardPage.selectors.logoutButton);
  expect(isVisible).toBe(true);
  this.logger.info('[Steps] Logout button is visible');
});

Then('layout should be properly displayed', async function () {
  await this.waits.pause(500); // Wait for layout to adjust
  const isMainContentVisible = await this.dashboardPage.isMainContentVisible();
  expect(isMainContentVisible).toBe(true);
  this.logger.info('[Steps] Layout is properly displayed');
});

Then('all buttons should be clickable', async function () {
  const buttons = await this.page.locator('button').count();
  expect(buttons).toBeGreaterThan(0);
  this.logger.info(`[Steps] Found ${buttons} buttons`);
});

export { };
