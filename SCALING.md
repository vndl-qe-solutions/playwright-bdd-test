# SCALING.md

# Scaling the Framework to Thousands of Tests

This guide provides strategies for maintaining and scaling the framework as your test suite grows to thousands of tests.

## 1. Organization Strategy

### Module-Based Structure

Organize features by business domains:

```
features/
├── auth/
│   ├── login.feature
│   ├── logout.feature
│   ├── password-reset.feature
│   └── 2fa.feature
├── user-profile/
│   ├── view-profile.feature
│   ├── edit-profile.feature
│   └── delete-account.feature
├── products/
│   ├── search.feature
│   ├── filtering.feature
│   ├── sorting.feature
│   └── details.feature
├── cart/
│   ├── add-items.feature
│   ├── remove-items.feature
│   ├── quantity.feature
│   └── promo-codes.feature
└── checkout/
    ├── billing.feature
    ├── shipping.feature
    └── payment.feature
```

### Page Objects Organization

Group page objects by module:

```
pages/
├── auth/
│   ├── LoginPage.js
│   ├── LogoutPage.js
│   └── PasswordResetPage.js
├── user-profile/
│   ├── ProfilePage.js
│   └── SettingsPage.js
├── products/
│   ├── ProductListPage.js
│   └── ProductDetailPage.js
├── cart/
│   └── CartPage.js
└── checkout/
    ├── CheckoutPage.js
    └── PaymentPage.js
```

## 2. Step Definition Management

### Keep Steps Reusable

Create generic, widely-applicable steps:

```javascript
// ✅ GOOD - Reusable in 100+ scenarios
Given('user navigates to {string}', async function(path) {
  await this.navigateTo(`${this.config.baseUrl}/${path}`);
});

When('user clicks {string}', async function(element) {
  await this.page.click(`[aria-label="${element}"]`);
});

// ❌ BAD - Specific to one scenario
When('user clicks login button on login page', ...);
When('user clicks add to cart button on product page', ...);
```

### Step Organization

Even with thousands of scenarios, keep related steps together:

```javascript
// step_definitions/steps.js - Main file for common steps

// Navigation
Given('user navigates to ...');
When('user goes to ...');

// Form Interactions
When('user enters ...');
When('user selects ...');
When('user clicks ...');

// Assertions
Then('element should be visible ...');
Then('text should contain ...');
```

## 3. Parallel Execution

### Configure Workers

```bash
# Default 4 workers
npm test

# 8 workers for faster execution
npx cucumber-js --parallel 8

# CI environment - single worker
CI=true npm test
```

### Performance Monitoring

```bash
# Track slow tests
DEBUG=true npm test

# Look for tests taking >30 seconds
grep "duration.*ms" reports/logs/combined.log
```

## 4. Data-Driven Testing

### Use Scenario Outlines

Instead of creating 100 similar scenarios, use Scenario Outlines:

```gherkin
@regression
Scenario Outline: Purchase with various products
  Given user is on product page for "<productId>"
  When user adds product to cart
  And user proceeds to checkout
  Then order should be created for "<productId>"
  And order price should be "<price>"

  Examples:
    | productId | price  |
    | PROD001   | $99.99 |
    | PROD002   | $149.99|
    | PROD003   | $199.99|
    | ...       | ...    |
    | PROD1000  | $999.99|
```

### External Test Data

For very large datasets, load from files:

```javascript
// hooks/hooks.js
import fs from 'fs';

Before(async function(scenario) {
  const testDataFile = `./fixtures/data-${scenario.pickle.name}.json`;
  if (fs.existsSync(testDataFile)) {
    this.testData = JSON.parse(fs.readFileSync(testDataFile, 'utf8'));
  }
});
```

## 5. Smart Tagging

### Tag Strategy

```gherkin
# Critical path tests (required to pass)
@critical @smoke

# By module
@auth @products @cart @checkout

# By type
@positive @negative @edge-case

# Performance
@slow @fast

# Environment
@dev @staging @prod

# Status
@wip @skip @flaky
```

### Selective Test Runs

```bash
# Quick smoke tests (5 min)
npm run test:smoke

# Critical tests (15 min)
npx cucumber-js --tags "@critical"

# Overnight regression (2 hours)
npx cucumber-js --tags "@regression and not @slow"

# Quick dev tests
npx cucumber-js --tags "@fast"

# Skip flaky tests
npx cucumber-js --tags "not @flaky"
```

## 6. Test Isolation & Data Management

### Pre-test Data Setup

```javascript
Before(async function(scenario) {
  // Clear cookies/storage
  await this.context.clearCookies();
  await this.page.evaluate(() => localStorage.clear());
  
  // Reset database state if needed
  await resetTestData();
});
```

### Post-test Cleanup

```javascript
After(async function(scenario) {
  // Clean up created resources
  if (this.testData.userId) {
    await deleteUser(this.testData.userId);
  }
  
  // Clear context
  await this.context.close();
});
```

## 7. Environment Management

### Multi-Environment Support

```javascript
// utils/config.js
const environments = {
  dev: {
    baseUrl: 'https://dev.example.com',
    apiUrl: 'https://dev-api.example.com',
    database: 'dev_db',
  },
  staging: {
    baseUrl: 'https://staging.example.com',
    apiUrl: 'https://staging-api.example.com',
    database: 'staging_db',
  },
  prod: {
    baseUrl: 'https://example.com',
    apiUrl: 'https://api.example.com',
    database: 'prod_db',
  },
};

const env = process.env.ENV || 'dev';
export const config = environments[env];
```

Run on different environments:

```bash
ENV=dev npm test
ENV=staging npm run test:regression
ENV=prod npm run test:smoke
```

## 8. Performance Optimization

### Page Object Caching

```javascript
// ✅ GOOD - Cache page objects
When('user logs in', async function() {
  if (!this.loginPage) {
    this.loginPage = new LoginPage(this.page);
  }
  await this.loginPage.login(username, password);
});

// Reuse in next step
When('user accesses dashboard', async function() {
  // Already have this.loginPage
  await this.dashboardPage.navigate();
});
```

### Selector Optimization

```javascript
// ✅ GOOD - Specific, fast selectors
selectors = {
  username: 'input[name="username"]',  // Specific
  password: 'input[name="password"]',  // Specific
};

// ❌ BAD - Slow, generic selectors
selectors = {
  username: 'input',  // Too generic, might match unrelated elements
  password: 'div input:nth-child(2)',  // Fragile
};
```

### Timeout Management

```javascript
// utils/config.js
export const config = {
  // Shorter timeouts for local (faster)
  // Longer timeouts for CI (can be slower)
  timeout: process.env.CI ? 60000 : 30000,
};
```

## 9. Reporting & Monitoring

### Generate Execution Reports

```bash
npm run test:report
```

### Analyze Test Health

Track:
- Slow tests (>30s)
- Flaky tests (pass/fail inconsistent)
- Failed tests
- Skipped tests

```javascript
// scripts/analyzeResults.js
const results = JSON.parse(fs.readFileSync('reports/cucumber-report.json'));
const slowTests = results
  .flatMap(f => f.elements)
  .filter(e => e.duration > 30000);
console.log('Slow tests:', slowTests);
```

## 10. CI/CD Pipeline

### GitHub Actions Matrix

```yaml
strategy:
  matrix:
    browser: [chromium, firefox, webkit]
    shard: [1, 2, 3, 4]

run: |
  npm test -- --parallel 2
```

### Jenkins Parallel Stages

```groovy
parallel {
  stage('Chrome') {
    steps { sh 'BROWSER=chromium npm run test:regression' }
  }
  stage('Firefox') {
    steps { sh 'BROWSER=firefox npm run test:regression' }
  }
}
```

## Example: 1000+ Tests Structure

```
features/               (1000+ scenarios across 50+ feature files)
├── auth/              (100 tests)
├── products/          (300 tests)
├── cart/              (200 tests)
├── checkout/          (200 tests)
├── user-profile/      (100 tests)
└── admin/             (100 tests)

step_definitions/      (All steps in single steps.js - 2000+ lines)
pages/                 (50+ page objects)
utils/                 (Utilities for all 1000+ tests)
fixtures/              (Centralized test data)

Execution:
npm run test:parallel 8     # Run with 8 workers
npm run test:smoke          # Quick sanity (50 tests)
npm run test:regression     # Full suite (1000+ tests)
```

## Key Metrics for Scaling

| Metric | Small | Medium | Large |
|--------|-------|--------|-------|
| Tests | <100 | 100-500 | 500+ |
| Modules | 1-2 | 3-5 | 5+ |
| Page Objects | 5-10 | 10-30 | 30+ |
| Parallel Workers | 2 | 4 | 8+ |
| Execution Time | <5 min | 10-30 min | 30+ min |

## Maintenance Checklist

- [ ] Review slow tests monthly
- [ ] Remove or fix flaky tests
- [ ] Update selectors when UI changes
- [ ] Add tests for new features
- [ ] Remove redundant test cases
- [ ] Update documentation
- [ ] Monitor CI/CD pipeline health
- [ ] Analyze test coverage

---

**Pro Tip:** Start with this framework structure now, even with few tests. This foundation makes scaling to thousands seamless!
