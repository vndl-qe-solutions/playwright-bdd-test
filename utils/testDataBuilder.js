import { faker } from '@faker-js/faker';
import logger from './logger.js';

/**
 * Test Data Builder - generates realistic test data using Faker
 * Supports building complex objects with custom data
 */
export class TestDataBuilder {
  /**
   * Generate user credentials for testing
   */
  static generateUser(overrides = {}) {
    return {
      username: faker.internet.username(),
      email: faker.internet.email(),
      password: 'TestPassword@123',
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      ...overrides,
    };
  }

  /**
   * Generate product data
   */
  static generateProduct(overrides = {}) {
    return {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price()),
      quantity: faker.number.int({ min: 1, max: 100 }),
      sku: faker.string.alphaNumeric(10),
      ...overrides,
    };
  }

  /**
   * Generate order data
   */
  static generateOrder(overrides = {}) {
    return {
      orderId: faker.string.uuid(),
      orderNumber: faker.string.numeric(8),
      status: 'pending',
      total: parseFloat(faker.commerce.price({ min: 100, max: 10000 })),
      items: [],
      ...overrides,
    };
  }

  /**
   * Generate address data
   */
  static generateAddress(overrides = {}) {
    return {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state({ abbreviated: true }),
      zipCode: faker.location.zipCode(),
      country: faker.location.country(),
      ...overrides,
    };
  }

  /**
   * Generate payment card data (non-real)
   */
  static generatePaymentCard(overrides = {}) {
    return {
      cardNumber: '4532 1111 1111 1111',
      expiryDate: '12/25',
      cvv: '123',
      cardholderName: faker.person.fullName(),
      ...overrides,
    };
  }

  /**
   * Generic method to build any object with random data
   */
  static buildObject(schema) {
    const obj = {};
    for (const [key, value] of Object.entries(schema)) {
      if (typeof value === 'function') {
        obj[key] = value();
      } else {
        obj[key] = value;
      }
    }
    logger.info(`[TestDataBuilder] Generated object: ${JSON.stringify(obj)}`);
    return obj;
  }

  /**
   * Build array of objects
   */
  static buildArray(schema, count = 5) {
    return Array.from({ length: count }, () => this.buildObject(schema));
  }
}

export default TestDataBuilder;
