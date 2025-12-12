import axios from 'axios';
import config from './config.js';
import logger from './logger.js';

/**
 * API Client for making HTTP requests
 * Includes error handling, logging, and retry logic
 */
export class ApiClient {
  constructor(baseURL = config.apiUrl) {
    this.client = axios.create({
      baseURL,
      timeout: config.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (requestConfig) => {
        logger.info(`[API] ${requestConfig.method.toUpperCase()} ${requestConfig.url}`);
        return requestConfig;
      },
      (error) => {
        logger.error(`[API] Request error: ${error.message}`);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        logger.info(`[API] Response: ${response.status} ${response.statusText}`);
        return response;
      },
      (error) => {
        if (error.response) {
          logger.error(`[API] Error ${error.response.status}: ${JSON.stringify(error.response.data)}`);
        } else {
          logger.error(`[API] Error: ${error.message}`);
        }
        return Promise.reject(error);
      }
    );
  }

  async get(url, config = {}) {
    return this.client.get(url, config);
  }

  async post(url, data, config = {}) {
    return this.client.post(url, data, config);
  }

  async put(url, data, config = {}) {
    return this.client.put(url, data, config);
  }

  async delete(url, config = {}) {
    return this.client.delete(url, config);
  }

  /**
   * Retry logic for failed requests
   */
  async retryRequest(fn, maxRetries = 3, delayMs = 1000) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        logger.warn(`[API] Retry ${i + 1}/${maxRetries} after ${delayMs}ms`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }
}

export default ApiClient;
