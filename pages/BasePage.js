import logger from '../utils/logger.js';
import config from '../utils/config.js';
import { Waits } from '../utils/waits.js';

/**
 * BasePage - Parent class for all page objects
 * Contains common actions and utilities used across all pages
 * Implements smart waits and error handling
 */
export class BasePage {
  constructor(page) {
    this.page = page;
    this.logger = logger;
    this.config = config;
    this.waits = Waits;
  }

  /**
   * Navigate to URL
   */
  async navigateTo(url) {
    try {
      await this.page.goto(url, {
        waitUntil: 'networkidle',
        timeout: this.config.navigationTimeout,
      });
      this.logger.info(`[Navigation] Navigated to: ${url}`);
    } catch (error) {
      this.logger.error(`[Navigation] Failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Click element with wait
   */
  async click(selector) {
    try {
      await this.waits.waitForElement(this.page, selector);
      await this.page.click(selector);
      this.logger.info(`[Click] Clicked: ${selector}`);
    } catch (error) {
      this.logger.error(`[Click] Failed: ${selector}`);
      throw error;
    }
  }

  /**
   * Fill input field
   */
  async fill(selector, text) {
    try {
      await this.waits.waitForElement(this.page, selector);
      await this.page.fill(selector, text);
      this.logger.info(`[Fill] Filled ${selector} with: ${text}`);
    } catch (error) {
      this.logger.error(`[Fill] Failed: ${selector}`);
      throw error;
    }
  }

  /**
   * Type text slowly (useful for inputs with event listeners)
   */
  async type(selector, text, delayMs = 50) {
    try {
      await this.waits.waitForElement(this.page, selector);
      await this.page.locator(selector).focus();
      await this.page.keyboard.type(text, { delay: delayMs });
      this.logger.info(`[Type] Typed in ${selector}: ${text}`);
    } catch (error) {
      this.logger.error(`[Type] Failed: ${selector}`);
      throw error;
    }
  }

  /**
   * Get element text
   */
  async getText(selector) {
    try {
      await this.waits.waitForElement(this.page, selector);
      const text = await this.page.textContent(selector);
      this.logger.info(`[getText] ${selector}: ${text}`);
      return text;
    } catch (error) {
      this.logger.error(`[getText] Failed: ${selector}`);
      throw error;
    }
  }

  /**
   * Get input value
   */
  async getInputValue(selector) {
    try {
      await this.waits.waitForElement(this.page, selector);
      const value = await this.page.inputValue(selector);
      this.logger.info(`[getValue] ${selector}: ${value}`);
      return value;
    } catch (error) {
      this.logger.error(`[getValue] Failed: ${selector}`);
      throw error;
    }
  }

  /**
   * Check if element is visible
   */
  async isVisible(selector) {
    try {
      const visible = await this.page.isVisible(selector);
      this.logger.info(`[isVisible] ${selector}: ${visible}`);
      return visible;
    } catch (error) {
      this.logger.error(`[isVisible] Failed: ${selector}`);
      return false;
    }
  }

  /**
   * Check if element exists
   */
  async isPresent(selector) {
    const element = await this.page.$(selector);
    return element !== null;
  }

  /**
   * Wait for element to be visible
   */
  async waitForVisible(selector, timeout = this.config.timeout) {
    try {
      await this.page.waitForSelector(selector, { state: 'visible', timeout });
      this.logger.info(`[waitForVisible] ${selector}`);
    } catch (error) {
      this.logger.error(`[waitForVisible] Timeout: ${selector}`);
      throw error;
    }
  }

  /**
   * Wait for element to be hidden
   */
  async waitForHidden(selector, timeout = this.config.timeout) {
    try {
      await this.page.waitForSelector(selector, { state: 'hidden', timeout });
      this.logger.info(`[waitForHidden] ${selector}`);
    } catch (error) {
      this.logger.error(`[waitForHidden] Timeout: ${selector}`);
      throw error;
    }
  }

  /**
   * Select dropdown by value
   */
  async selectDropdown(selector, value) {
    try {
      await this.waits.waitForElement(this.page, selector);
      await this.page.selectOption(selector, value);
      this.logger.info(`[selectDropdown] ${selector}: ${value}`);
    } catch (error) {
      this.logger.error(`[selectDropdown] Failed: ${selector}`);
      throw error;
    }
  }

  /**
   * Get dropdown value
   */
  async getDropdownValue(selector) {
    try {
      const value = await this.page.locator(selector).evaluate((el) => el.value);
      this.logger.info(`[getDropdownValue] ${selector}: ${value}`);
      return value;
    } catch (error) {
      this.logger.error(`[getDropdownValue] Failed: ${selector}`);
      throw error;
    }
  }

  /**
   * Get all text of elements
   */
  async getAllText(selector) {
    try {
      const texts = await this.page.locator(selector).allTextContents();
      this.logger.info(`[getAllText] ${selector}: ${JSON.stringify(texts)}`);
      return texts;
    } catch (error) {
      this.logger.error(`[getAllText] Failed: ${selector}`);
      throw error;
    }
  }

  /**
   * Check checkbox
   */
  async checkCheckbox(selector) {
    try {
      await this.waits.waitForElement(this.page, selector);
      const isChecked = await this.page.isChecked(selector);
      if (!isChecked) {
        await this.page.check(selector);
      }
      this.logger.info(`[checkCheckbox] ${selector}`);
    } catch (error) {
      this.logger.error(`[checkCheckbox] Failed: ${selector}`);
      throw error;
    }
  }

  /**
   * Uncheck checkbox
   */
  async uncheckCheckbox(selector) {
    try {
      await this.waits.waitForElement(this.page, selector);
      const isChecked = await this.page.isChecked(selector);
      if (isChecked) {
        await this.page.uncheck(selector);
      }
      this.logger.info(`[uncheckCheckbox] ${selector}`);
    } catch (error) {
      this.logger.error(`[uncheckCheckbox] Failed: ${selector}`);
      throw error;
    }
  }

  /**
   * Get current URL
   */
  getCurrentUrl() {
    const url = this.page.url();
    this.logger.info(`[currentUrl] ${url}`);
    return url;
  }

  /**
   * Get page title
   */
  async getTitle() {
    const title = await this.page.title();
    this.logger.info(`[getTitle] ${title}`);
    return title;
  }

  /**
   * Wait for URL to match pattern
   */
  async waitForUrl(urlPattern, timeout = this.config.timeout) {
    try {
      await this.page.waitForURL(urlPattern, { timeout });
      this.logger.info(`[waitForUrl] ${urlPattern}`);
    } catch (error) {
      this.logger.error(`[waitForUrl] Failed: ${urlPattern}`);
      throw error;
    }
  }

  /**
   * Reload page
   */
  async reload() {
    try {
      await this.page.reload({ waitUntil: 'networkidle' });
      this.logger.info('[reload] Page reloaded');
    } catch (error) {
      this.logger.error(`[reload] Failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Go back in history
   */
  async goBack() {
    try {
      await this.page.goBack({ waitUntil: 'networkidle' });
      this.logger.info('[goBack] Navigated back');
    } catch (error) {
      this.logger.error(`[goBack] Failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Press key
   */
  async pressKey(key) {
    try {
      await this.page.keyboard.press(key);
      this.logger.info(`[pressKey] ${key}`);
    } catch (error) {
      this.logger.error(`[pressKey] Failed: ${key}`);
      throw error;
    }
  }

  /**
   * Double click
   */
  async doubleClick(selector) {
    try {
      await this.waits.waitForElement(this.page, selector);
      await this.page.dblclick(selector);
      this.logger.info(`[doubleClick] ${selector}`);
    } catch (error) {
      this.logger.error(`[doubleClick] Failed: ${selector}`);
      throw error;
    }
  }

  /**
   * Right click (context menu)
   */
  async rightClick(selector) {
    try {
      await this.waits.waitForElement(this.page, selector);
      await this.page.click(selector, { button: 'right' });
      this.logger.info(`[rightClick] ${selector}`);
    } catch (error) {
      this.logger.error(`[rightClick] Failed: ${selector}`);
      throw error;
    }
  }

  /**
   * Hover over element
   */
  async hover(selector) {
    try {
      await this.waits.waitForElement(this.page, selector);
      await this.page.hover(selector);
      this.logger.info(`[hover] ${selector}`);
    } catch (error) {
      this.logger.error(`[hover] Failed: ${selector}`);
      throw error;
    }
  }

  /**
   * Scroll to element
   */
  async scrollToElement(selector) {
    try {
      await this.page.locator(selector).scrollIntoViewIfNeeded();
      this.logger.info(`[scrollToElement] ${selector}`);
    } catch (error) {
      this.logger.error(`[scrollToElement] Failed: ${selector}`);
      throw error;
    }
  }

  /**
   * Get element count
   */
  async getElementCount(selector) {
    try {
      const count = await this.page.locator(selector).count();
      this.logger.info(`[getElementCount] ${selector}: ${count}`);
      return count;
    } catch (error) {
      this.logger.error(`[getElementCount] Failed: ${selector}`);
      throw error;
    }
  }

  /**
   * Take screenshot
   */
  async takeScreenshot(fileName) {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const name = fileName || `screenshot-${timestamp}`;
      const path = `reports/screenshots/${name}.png`;
      await this.page.screenshot({ path, fullPage: true });
      this.logger.info(`[screenshot] Saved: ${path}`);
      return path;
    } catch (error) {
      this.logger.error(`[screenshot] Failed: ${error.message}`);
    }
  }

  /**
   * Wait for loading spinner to disappear
   */
  async waitForLoadingComplete() {
    await this.waits.waitForLoadingComplete(this.page);
  }

  /**
   * Execute JavaScript
   */
  async executeScript(script, ...args) {
    try {
      const result = await this.page.evaluate(script, ...args);
      this.logger.info(`[executeScript] Result: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      this.logger.error(`[executeScript] Failed: ${error.message}`);
      throw error;
    }
  }
}

export default BasePage;
