import dotenv from 'dotenv';

dotenv.config();

/**
 * Centralized configuration for the entire test framework
 * This ensures consistency across all tests and makes it easy to maintain
 */
export const config = {
  // Application URLs
  baseUrl: process.env.BASE_URL || 'https://example.com',
  apiUrl: process.env.API_URL || 'https://api.example.com',

  // Browser Configuration
  browser: process.env.BROWSER || 'chromium',
  headless: process.env.HEADLESS !== 'false',
  slowMo: parseInt(process.env.SLOW_MO || '0', 10),
  viewport: {
    width: parseInt(process.env.VIEWPORT_WIDTH || '1280', 10),
    height: parseInt(process.env.VIEWPORT_HEIGHT || '720', 10),
  },

  // Timeouts
  timeout: parseInt(process.env.TIMEOUT || '30000', 10),
  navigationTimeout: parseInt(process.env.TIMEOUT || '30000', 10),
  actionTimeout: parseInt(process.env.TIMEOUT || '30000', 10),

  // Test Execution
  workers: parseInt(process.env.WORKERS || '4', 10),
  retries: parseInt(process.env.RETRIES || '2', 10),
  tags: process.env.TAGS || '@smoke',

  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',

  // CI/CD
  isCI: process.env.CI === 'true',

  // Feature Flags
  recordVideo: process.env.RECORD_VIDEO === 'true',
  captureScreenshots: process.env.CAPTURE_SCREENSHOTS !== 'false',
  debugMode: process.env.DEBUG === 'true',
};

export default config;
