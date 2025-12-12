import { setWorldConstructor, World } from '@cucumber/cucumber';
import config from '../utils/config.js';
import logger from '../utils/logger.js';
import { ApiClient } from '../utils/apiClient.js';
import { TestDataBuilder } from '../utils/testDataBuilder.js';
import { Waits } from '../utils/waits.js';

/**
 * CustomWorld - Shared context across all steps in a scenario
 * Contains browser instance, configuration, utilities, and test data
 * This is instantiated fresh for each scenario ensuring test isolation
 */
class CustomWorld extends World {
  constructor(options) {
    super(options);

    // Browser and page instances
    this.browser = null;
    this.context = null;
    this.page = null;

    // Configuration and utilities
    this.config = config;
    this.logger = logger;
    this.apiClient = new ApiClient();
    this.testDataBuilder = TestDataBuilder;
    this.waits = Waits;

    // Test data storage
    this.testData = {};
    this.scenarioData = {};

    // Performance tracking
    this.startTime = null;
    this.endTime = null;

    const scenarioName = options?.pickle?.name || 'unknown scenario';
    logger.info(`[World] Initializing scenario: ${scenarioName}`);
  }

  /**
   * Store data for use across steps
   */
  setTestData(key, value) {
    this.testData[key] = value;
    this.logger.info(`[TestData] Stored: ${key} = ${JSON.stringify(value)}`);
  }

  /**
   * Retrieve stored test data
   */
  getTestData(key) {
    return this.testData[key];
  }

  /**
   * Store scenario-specific data
   */
  setScenarioData(key, value) {
    this.scenarioData[key] = value;
  }

  /**
   * Get scenario-specific data
   */
  getScenarioData(key) {
    return this.scenarioData[key];
  }

  /**
   * Take screenshot with timestamp
   */
  async takeScreenshot(fileName = null) {
    if (!this.config.captureScreenshots || !this.page) return;

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const name = fileName || `screenshot-${timestamp}`;
    const path = `reports/screenshots/${name}.png`;

    try {
      await this.page.screenshot({ path, fullPage: true });
      this.logger.info(`[Screenshot] Saved: ${path}`);
      return path;
    } catch (error) {
      this.logger.error(`[Screenshot] Failed: ${error.message}`);
    }
  }

  /**
   * Get current URL
   */
  getCurrentUrl() {
    return this.page?.url() || null;
  }

  /**
   * Navigate to URL
   */
  async navigateTo(url) {
    try {
      await this.page.goto(url, { waitUntil: 'networkidle', timeout: this.config.navigationTimeout });
      this.logger.info(`[Navigation] Navigated to: ${url}`);
    } catch (error) {
      this.logger.error(`[Navigation] Failed to navigate: ${error.message}`);
      throw error;
    }
  }

  /**
   * Measure execution time
   */
  startTimer() {
    this.startTime = Date.now();
  }

  /**
   * Get elapsed time
   */
  getElapsedTime() {
    if (!this.startTime) return 0;
    return Date.now() - this.startTime;
  }

  /**
   * Clear all data
   */
  clearData() {
    this.testData = {};
    this.scenarioData = {};
  }
}

setWorldConstructor(CustomWorld);

export default CustomWorld;
