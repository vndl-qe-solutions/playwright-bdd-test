import logger from './logger.js';
import config from './config.js';

/**
 * Utility functions for smart waits and retries
 * Improves test stability by handling timing issues gracefully
 */
export class Waits {
  /**
   * Wait for element with enhanced error handling
   */
  static async waitForElement(page, selector, options = {}) {
    const timeout = options.timeout || config.timeout;
    const visible = options.visible !== false;

    try {
      if (visible) {
        await page.waitForSelector(selector, { timeout, state: 'visible' });
      } else {
        await page.waitForSelector(selector, { timeout });
      }
      logger.info(`[Wait] Element found: ${selector}`);
      return true;
    } catch (error) {
      logger.error(`[Wait] Element not found: ${selector} (${timeout}ms)`);
      throw error;
    }
  }

  /**
   * Wait for navigation with timeout
   */
  static async waitForNavigation(page, action, options = {}) {
    const timeout = options.timeout || config.navigationTimeout;

    try {
      await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle', timeout }), action()]);
      logger.info('[Wait] Navigation completed');
    } catch (error) {
      logger.warn('[Wait] Navigation timeout, continuing anyway');
    }
  }

  /**
   * Wait for response from specific URL
   */
  static async waitForResponse(page, urlPattern, action, options = {}) {
    const timeout = options.timeout || config.timeout;

    const responsePromise = page.waitForResponse(
      (response) => response.url().includes(urlPattern),
      { timeout }
    );

    await action();
    const response = await responsePromise;

    logger.info(`[Wait] Response received: ${response.status()} ${response.url()}`);
    return response;
  }

  /**
   * Retry action multiple times
   */
  static async retry(action, maxRetries = 3, delayMs = 500) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        logger.info(`[Retry] Attempt ${i + 1}/${maxRetries}`);
        return await action();
      } catch (error) {
        if (i === maxRetries - 1) {
          logger.error(`[Retry] Failed after ${maxRetries} attempts`);
          throw error;
        }
        logger.warn(`[Retry] Failed, waiting ${delayMs}ms before retry`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  /**
   * Wait for condition to be true
   */
  static async waitFor(condition, options = {}) {
    const timeout = options.timeout || config.timeout;
    const interval = options.interval || 100;
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      if (await condition()) {
        return true;
      }
      await new Promise((resolve) => setTimeout(resolve, interval));
    }

    throw new Error(`[Wait] Condition not met within ${timeout}ms`);
  }

  /**
   * Wait for loading to complete (spinner disappears)
   */
  static async waitForLoadingComplete(page, options = {}) {
    const selectors = options.selectors || ['.spinner', '[data-testid="loading"]', '.loader'];

    for (const selector of selectors) {
      try {
        await page.waitForSelector(selector, { state: 'hidden', timeout: 5000 });
        logger.info(`[Wait] Loading indicator disappeared: ${selector}`);
        break;
      } catch (error) {
        // Selector might not exist, continue
      }
    }
  }

  /**
   * Small pause for animations to complete
   */
  static async pause(milliseconds = 500) {
    await new Promise((resolve) => setTimeout(resolve, milliseconds));
  }
}

export default Waits;
