# Playwright + Cucumber + JavaScript BDD Test Automation Framework

A production-ready, enterprise-grade test automation framework built with Playwright, Cucumber (BDD), and JavaScript. Designed for scalability, maintainability, and robustness - ready to support thousands of test scripts.

## 📋 Quick Start

```bash
# Install dependencies
npm install
npx playwright install

# Configure environment
cp .env.example .env

# Run tests
npm test
npm run test:smoke
npm run test:parallel

# Debug
npm run test:debug
npm run test:headed
```

## 🎯 Key Features

✅ **BDD Testing** - Write tests in plain English using Gherkin  
✅ **Page Object Model** - Encapsulated page interactions  
✅ **Custom World** - Shared context with utilities  
✅ **Smart Waits** - Intelligent wait mechanisms  
✅ **Parallel Execution** - Multi-worker test runs  
✅ **Cross-Browser** - Chrome, Firefox, Safari  
✅ **API Testing** - Built-in HTTP client  
✅ **Test Data** - Faker-based generation  
✅ **Logging** - Structured logs with Winston  
✅ **CI/CD Ready** - GitHub Actions included  

## 📁 Project Structure

```
features/              # Gherkin feature files
step_definitions/      # Step implementations
pages/                 # Page Object Models
hooks/                 # Hooks & CustomWorld
utils/                 # Config, logger, API, data builder
fixtures/              # Test data & selectors
reports/               # Generated reports & logs
```

## 🧪 Quick Example

### Feature File
```gherkin
# features/auth/login.feature
@smoke @critical
Scenario: Successful login
  Given user navigates to login page
  When user enters username "testuser" and password "pass123"
  And user clicks login button
  Then user should be redirected to dashboard
```

### Page Object
```javascript
export class LoginPage extends BasePage {
  selectors = {
    usernameInput: 'input[name="username"]',
    passwordInput: 'input[name="password"]',
    loginButton: 'button[type="submit"]',
  };

  async login(username, password) {
    await this.fill(this.selectors.usernameInput, username);
    await this.fill(this.selectors.passwordInput, password);
    await this.click(this.selectors.loginButton);
  }
}
```

### Step Definition
```javascript
When('user enters username {string} and password {string}', 
  async function(username, password) {
    const loginPage = new LoginPage(this.page);
    await loginPage.login(username, password);
});
```

## 🎓 Best Practices

✓ Use Page Objects for all interactions  
✓ Keep steps generic and reusable  
✓ Use test data from fixtures  
✓ Tag tests appropriately  
✓ Use smart waits, not arbitrary delays  
✓ Implement proper error handling  
✓ Keep tests independent  

## 🏷️ Test Tags

```
@smoke              Quick sanity checks
@regression         Full test suite
@critical           Must-pass tests
@negative           Error scenarios
@slow               Long-running tests
@api                API tests
@ui                 UI tests
@wip                Work in progress
```

Run specific tags:
```bash
npx cucumber-js --tags "@smoke"
npx cucumber-js --tags "@critical and not @slow"
```

## 📊 Utilities

**Logger:**
```javascript
this.logger.info('[Test] Message');
this.logger.error('[Error] Message');
```

**Test Data:**
```javascript
const user = this.testDataBuilder.generateUser();
const product = this.testDataBuilder.generateProduct();
```

**Smart Waits:**
```javascript
await this.waits.waitForElement(page, selector);
await this.waits.retry(action, 3, 500);
```

**API Client:**
```javascript
const response = await this.apiClient.get('/api/users');
await this.apiClient.post('/api/login', credentials);
```

## 📈 Scaling Strategies

1. **Organize by domains** - Separate features per module
2. **Parallel execution** - Use multiple workers
3. **Data-driven tests** - Scenario Outlines with many examples
4. **Step reuse** - Generic steps usable in hundreds of tests
5. **Test isolation** - Independent scenarios
6. **Environment config** - Dev/staging/prod support
7. **Performance monitoring** - Track slow/flaky tests

## 🔄 CI/CD

GitHub Actions workflow (`tests.yml`) included:
- Runs on push/PR
- Multi-browser testing
- Smoke tests on PR
- Daily scheduled runs
- Report artifacts

## 🔧 Environment

Create `.env` from `.env.example`:

```
BASE_URL=https://example.com
API_URL=https://api.example.com
HEADLESS=true
BROWSER=chromium
WORKERS=4
TIMEOUT=30000
LOG_LEVEL=info
```

## 📚 Resources

- [Playwright](https://playwright.dev)
- [Cucumber.js](https://cucumber.io/docs/cucumber/)
- [Gherkin Reference](https://cucumber.io/docs/gherkin/reference/)

## 🚀 Next Steps

1. Update `BASE_URL` in `.env`
2. Create page objects for your app
3. Write feature files in `features/`
4. Implement steps in `step_definitions/`
5. Run: `npm test`

---

**Production-ready for thousands of tests! 🎉**
