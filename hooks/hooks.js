import { Before, After, BeforeAll, AfterAll, Status } from '@cucumber/cucumber';
import { chromium, firefox, webkit } from '@playwright/test';
import logger from '../utils/logger.js';
import config from '../utils/config.js';
import fs from 'fs';
import path from 'path';

// Browser instance (shared across scenarios if needed)
let browser = null;

/**
 * BeforeAll - Runs once before all scenarios
 * Initialize browser instance
 */
BeforeAll(async function () {
  try {
    const browserType = config.browser === 'firefox' ? firefox : config.browser === 'webkit' ? webkit : chromium;

    browser = await browserType.launch({
      headless: config.headless,
      slowMo: config.slowMo,
      args: config.browser === 'chromium' ? ['--disable-notifications'] : [],
    });

    logger.info(`[Browser] Launched: ${config.browser} (headless: ${config.headless})`);
  } catch (error) {
    logger.error(`[Browser] Failed to launch: ${error.message}`);
    throw error;
  }
});

/**
 * Before - Runs before each scenario
 * Create new context and page
 */
Before(async function (scenario) {
  try {
    this.startTimer();

    // Create new context for this scenario (isolates cookies, storage, etc.)
    this.context = await browser.newContext({
      viewport: config.viewport,
      ignoreHTTPSErrors: true,
      locale: 'en-US',
    });

    // Create new page
    this.page = await this.context.newPage();

    // Set default navigation timeout
    this.page.setDefaultNavigationTimeout(config.navigationTimeout);
    this.page.setDefaultTimeout(config.actionTimeout);

    // Log scenario start
    this.logger.info(`[Scenario] START: ${scenario.pickle.name}`);
    this.logger.info(`[Scenario] Tags: ${scenario.pickle.tags.map((t) => t.name).join(', ')}`);

    // Create screenshots directory
    const screenshotsDir = path.join(process.cwd(), 'reports', 'screenshots');
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }
  } catch (error) {
    this.logger.error(`[Before Hook] Error: ${error.message}`);
    throw error;
  }
});

/**
 * After - Runs after each scenario
 * Cleanup and generate reports
 */
After(async function (scenario) {
  const executionTime = this.getElapsedTime();

  try {
    // Take screenshot on failure
    if (scenario.result.status === Status.FAILED) {
      this.logger.error(`[Scenario] FAILED: ${scenario.pickle.name}`);
      await this.takeScreenshot(`failed-${scenario.pickle.name}`);
    }

    // Log scenario result
    const statusLog = scenario.result.status === Status.PASSED ? '[Scenario] PASSED' : '[Scenario] FAILED';
    this.logger.info(`${statusLog}: ${scenario.pickle.name} (${executionTime}ms)`);

    // Close context
    if (this.context) {
      await this.context.close();
    }

    // Clear data
    this.clearData();
  } catch (error) {
    this.logger.error(`[After Hook] Error: ${error.message}`);
  }
});

/**
 * AfterAll - Runs once after all scenarios
 * Close browser instance
 */
AfterAll(async function () {
  try {
    if (browser) {
      await browser.close();
      logger.info('[Browser] Closed successfully');
    }
  } catch (error) {
    logger.error(`[Browser] Error during close: ${error.message}`);
  }
});

export { browser };
