# FRAMEWORK_GUIDE.md

# Complete Playwright + Cucumber + JavaScript BDD Framework Guide

## 🎯 What You Have

A production-ready, enterprise-grade test automation framework with:

- ✅ **25+ files** covering all aspects of test automation
- ✅ **Page Object Model** for maintainable UI interactions  
- ✅ **CustomWorld** with utilities accessible in all steps
- ✅ **Smart waits** to handle timing issues gracefully
- ✅ **Sample tests** demonstrating best practices
- ✅ **CI/CD ready** with GitHub Actions
- ✅ **Comprehensive logging** for debugging
- ✅ **Parallel execution** for fast test runs
- ✅ **Cross-browser** testing support

## 📊 Framework Components

### 1. **Configuration Layer** (`utils/config.js`)
- Centralized configuration from environment variables
- Support for dev/staging/production environments
- Timeout, browser, worker settings

### 2. **Logging Layer** (`utils/logger.js`)
- Winston-based structured logging
- File and console transports
- Separate error logs
- Automatic log rotation

### 3. **Utilities** 
- `apiClient.js` - HTTP requests with retry logic
- `testDataBuilder.js` - Faker-based test data generation
- `waits.js` - Smart wait mechanisms

### 4. **Page Object Model** (`pages/`)
- `BasePage.js` - 30+ reusable interaction methods
- `LoginPage.js`, `DashboardPage.js` - Domain-specific pages
- Easy to extend for new pages

### 5. **Hooks & World**
- `hooks.js` - Before/After lifecycle hooks
- `world.js` - CustomWorld with shared state

### 6. **Step Definitions** (`step_definitions/steps.js`)
- 40+ reusable, generic steps
- Organized by functionality
- Easy to extend

### 7. **Test Data**
- `fixtures/testData.json` - Test data sets
- `fixtures/selectors.json` - Element selectors

### 8. **Feature Files** (`features/`)
- `login.feature` - Authentication tests
- `logout.feature` - Session management
- `common.feature` - Common UI interactions

## 🚀 Quick Start (5 Minutes)

### Step 1: Install Dependencies
```bash
cd /Users/lokeshtheramaraja/my_work/playwright-bdd-test
npm install
npx playwright install
```

### Step 2: Configure Environment
```bash
# .env is already set up, but update if needed:
# BASE_URL=https://your-app.com
# API_URL=https://api.your-app.com
```

### Step 3: Run Tests
```bash
# Run all tests
npm test

# Run smoke tests only
npm run test:smoke

# Run in parallel
npm run test:parallel

# Debug mode
npm run test:debug

# Run on specific browser
npm run test:chrome
```

### Step 4: View Results
```bash
# Reports are generated in:
# - reports/cucumber-report.html (Cucumber report)
# - reports/logs/combined.log (Execution logs)
# - reports/screenshots/ (Failure screenshots)
```

## 📝 How to Add Tests

### Adding a New Page

```javascript
// pages/MyNewPage.js
import { BasePage } from './BasePage.js';

export class MyNewPage extends BasePage {
  selectors = {
    title: 'h1',
    button: '#my-button',
    input: '#my-input',
    message: '[data-testid="message"]',
  };

  async clickButton() {
    await this.click(this.selectors.button);
  }

  async fillInput(text) {
    await this.fill(this.selectors.input, text);
  }

  async getMessage() {
    return await this.getText(this.selectors.message);
  }
}
```

### Adding Feature File

```gherkin
# features/mymodule/myfeature.feature

Feature: My New Feature
  As a user
  I want to do something
  So that I achieve a goal

  Background:
    Given user is on my new page

  @smoke @critical
  Scenario: Happy path scenario
    When user clicks button
    And user fills input with "test data"
    Then message should display "Success"

  @regression @negative
  Scenario: Error handling
    When user clicks button without input
    Then error should display "Input required"
```

### Adding Steps

```javascript
// In step_definitions/steps.js, add:

Given('user is on my new page', async function() {
  const myNewPage = new MyNewPage(this.page);
  await myNewPage.navigateTo(`${this.config.baseUrl}/my-page`);
  this.myNewPage = myNewPage;
});

When('user clicks button', async function() {
  await this.myNewPage.clickButton();
});

When('user fills input with {string}', async function(text) {
  await this.myNewPage.fillInput(text);
});

Then('message should display {string}', async function(expectedText) {
  const message = await this.myNewPage.getMessage();
  expect(message).toContain(expectedText);
});
```

## 🎓 Best Practices Summary

### ✅ DO

```javascript
// 1. Use Page Objects
const loginPage = new LoginPage(this.page);
await loginPage.login(username, password);

// 2. Store data in CustomWorld
this.setTestData('userId', '123');
const userId = this.getTestData('userId');

// 3. Use smart waits
await this.waits.waitForElement(page, selector);
await this.waits.retry(action, 3, 500);

// 4. Log important actions
this.logger.info('[Step] User logged in successfully');

// 5. Tag tests appropriately
@smoke @critical @auth
Scenario: ...

// 6. Use generic steps
When('user clicks {string}', async function(element) { ... })

// 7. Keep tests independent
Each test should work standalone
```

### ❌ DON'T

```javascript
// 1. Direct page access in steps
await this.page.fill('input[name="username"]', username);

// 2. Global variables
global.userId = '123';

// 3. Hardcoded test data
const password = 'hardcoded123';

// 4. Arbitrary delays
await new Promise(r => setTimeout(r, 5000));

// 5. Step dependencies
Scenario should not depend on previous scenario

// 6. Specific steps for one scenario
When('user clicks login button on login page', ...)

// 7. Complex logic in steps
// Instead: Move to page object
```

## 📈 Scaling Tips

### For 100+ Tests
- Organize by domain: `features/auth/`, `features/products/`
- Keep steps reusable and generic
- Use test data from fixtures

### For 500+ Tests
- Implement parallel execution (4-8 workers)
- Use Scenario Outlines for data-driven tests
- Monitor slow tests

### For 1000+ Tests
- Organize into 5+ domains
- Use environment-specific configs
- Implement test sharding
- Track test health metrics
- Consider cloud-based execution

## 🔧 Configuration

### Environment Variables (`.env`)

```bash
# Application
BASE_URL=https://example.com
API_URL=https://api.example.com

# Browser
HEADLESS=true              # false for headed/debug mode
BROWSER=chromium           # chromium, firefox, webkit
SLOW_MO=0                 # Slow down browser (ms)
VIEWPORT_WIDTH=1280
VIEWPORT_HEIGHT=720

# Execution
WORKERS=4                  # Parallel workers
TIMEOUT=30000             # Timeout in ms
RETRIES=2                 # Retry failed tests

# Logging
LOG_LEVEL=info            # debug, info, warn, error

# CI/CD
CI=false                  # Set to true in CI environment
```

## 📊 Key Utilities

### Logger
```javascript
this.logger.info('Information message');
this.logger.error('Error message');
this.logger.warn('Warning message');
```

### Test Data Builder
```javascript
const user = this.testDataBuilder.generateUser();
const product = this.testDataBuilder.generateProduct();
const address = this.testDataBuilder.generateAddress();
const customData = this.testDataBuilder.buildObject({
  name: () => faker.person.fullName(),
  email: () => faker.internet.email(),
});
```

### Smart Waits
```javascript
await this.waits.waitForElement(page, selector);
await this.waits.waitForNavigation(page, action);
await this.waits.waitForResponse(page, urlPattern, action);
await this.waits.retry(action, maxRetries, delay);
await this.waits.waitFor(() => condition);
await this.waits.waitForLoadingComplete(page);
```

### API Client
```javascript
const response = await this.apiClient.get('/api/users');
await this.apiClient.post('/api/login', { username, password });
await this.apiClient.put('/api/user/123', updateData);
await this.apiClient.delete('/api/user/123');
await this.apiClient.retryRequest(() => apiCall(), 3, 1000);
```

## 🔄 CI/CD Pipeline

### GitHub Actions
- File: `.github/workflows/tests.yml`
- Runs on: Push, Pull Request, Schedule (daily)
- Tests: Chrome, Firefox, Safari
- Uploads reports as artifacts

Run locally as CI:
```bash
CI=true npm test
```

### Jenkins Integration
```groovy
stage('Test') {
  steps {
    sh 'npm install && npx playwright install'
    sh 'npm test'
  }
  post {
    always {
      archiveArtifacts artifacts: 'reports/**'
    }
  }
}
```

## 📊 Reporting

### Generate Reports
```bash
npm run test:report
```

### Report Locations
- `reports/cucumber-report.json` - Raw test results
- `reports/cucumber-report.html` - Formatted report
- `reports/logs/combined.log` - All execution logs
- `reports/logs/error.log` - Error logs only
- `reports/screenshots/` - Failure screenshots

## 🧪 Sample Commands

```bash
# Basic runs
npm test                              # All tests
npm run test:smoke                    # Smoke tests (@smoke tag)
npm run test:regression               # Regression tests (@regression tag)

# Parallel execution
npm run test:parallel                 # 4 workers (configurable)

# Specific browser
npm run test:chrome                   # Chromium only
npm run test:firefox                  # Firefox only
npm run test:webkit                   # Safari only
npm run test:all-browsers             # All browsers sequentially

# Debug modes
npm run test:headed                   # UI visible
npm run test:debug                    # Verbose logging
DEBUG=true npm test                   # Even more verbose

# Custom tags
npx cucumber-js --tags "@critical"
npx cucumber-js --tags "@smoke and not @slow"

# Specific feature
npx cucumber-js features/auth/login.feature

# Generate report
npm run test:report
```

## 📚 File Reference

| File | Purpose |
|------|---------|
| `cucumber.js` | Cucumber configuration (profiles, formats) |
| `playwright.config.js` | Playwright configuration (browsers, timeouts) |
| `package.json` | Dependencies and npm scripts |
| `utils/config.js` | Centralized configuration |
| `utils/logger.js` | Winston logger setup |
| `utils/apiClient.js` | HTTP client for APIs |
| `utils/testDataBuilder.js` | Faker-based test data |
| `utils/waits.js` | Smart wait utilities |
| `pages/BasePage.js` | Base page with 30+ methods |
| `pages/LoginPage.js` | Login page object example |
| `pages/DashboardPage.js` | Dashboard page object example |
| `hooks/world.js` | CustomWorld class |
| `hooks/hooks.js` | Before/After hooks |
| `step_definitions/steps.js` | All step definitions |
| `features/auth/login.feature` | Login test scenarios |
| `features/auth/logout.feature` | Logout test scenarios |
| `fixtures/testData.json` | Sample test data |
| `.github/workflows/tests.yml` | GitHub Actions CI/CD |

## 🎯 Next Steps

1. **Update `BASE_URL`** in `.env` to your application
2. **Create new page objects** for your app pages
3. **Write feature files** for your test scenarios
4. **Implement steps** in `step_definitions/steps.js`
5. **Run tests**: `npm test`
6. **View reports**: `open reports/cucumber-report.html`

## 💡 Tips for Success

### For Maintenance
- Review tests monthly for redundancy
- Update selectors when UI changes
- Keep page objects DRY (Don't Repeat Yourself)
- Document complex scenarios

### For Performance
- Use parallel execution for CI/CD
- Cache page objects in steps
- Use smart waits, not arbitrary delays
- Monitor and fix slow tests

### For Reliability
- Keep tests independent
- Use proper error handling
- Implement smart retries
- Capture screenshots on failure

### For Scalability
- Organize by domain/module
- Keep steps generic and reusable
- Use data-driven testing for large datasets
- Tag tests for selective execution
- Monitor test health metrics

## 🆘 Troubleshooting

### Tests not running?
```bash
# Check Node version
node --version  # Should be 18+

# Check Playwright
npx playwright install

# Check configuration
cat .env
```

### Tests timing out?
```bash
# Increase timeout in .env
TIMEOUT=60000

# Check selectors are correct
npx cucumber-js features/auth/login.feature
```

### Flaky tests?
```bash
# Run with retry
RETRIES=3 npm test

# Run with more verbosity
DEBUG=true npm test

# Check logs
tail -f reports/logs/combined.log
```

### CI/CD failures?
```bash
# Run locally as CI
CI=true npm test

# Check GitHub Actions logs
# In repository: Actions tab → recent run → job details
```

## 📖 Documentation Files

- `README.md` - Quick start and overview
- `CONTRIBUTING.md` - Guidelines for adding tests
- `SCALING.md` - Strategies for scaling to 1000+ tests
- `FRAMEWORK_GUIDE.md` - This file

---

## 🎉 Congratulations!

You now have a production-ready test automation framework that can scale from 10 tests to 10,000+ tests!

### What's Included:
✅ 25+ files ready to use  
✅ Page Object Model for maintainability  
✅ CustomWorld for shared state  
✅ Smart waits for stability  
✅ Comprehensive logging  
✅ CI/CD integration  
✅ Cross-browser testing  
✅ Sample tests and data  
✅ Best practices documented  

### Ready to Go:
1. `npm install`
2. `npx playwright install`
3. Update `.env` with your app URL
4. `npm test`

**Happy Testing! 🚀**
