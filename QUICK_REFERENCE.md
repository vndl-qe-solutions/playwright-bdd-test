# Quick Reference - Playwright BDD Framework

## 🚀 Installation & Setup (One Time)

```bash
# 1. Install all dependencies
npm install

# 2. Install Playwright browsers
npx playwright install

# 3. Configure your app URL
nano .env  # Update BASE_URL to your application
```

## ▶️ Running Tests

```bash
# All tests
npm test

# Only smoke tests
npm run test:smoke

# In parallel (4 workers)
npm run test:parallel

# Headed mode (see browser)
npm run test:headed

# Debug with logs
npm run test:debug

# Specific browser
npm run test:chrome
npm run test:firefox
npm run test:webkit
```

## 📝 Writing a New Test

### 1. Create Feature File
```gherkin
# features/myfeature/test.feature
@smoke
Scenario: My test
  Given user navigates to login page
  When user enters username "test" and password "pass"
  Then user should be redirected to dashboard
```

### 2. Add Steps (or use existing ones)
```javascript
// step_definitions/steps.js
When('user does something', async function() {
  // Your step code
});
```

### 3. Create Page Object (if needed)
```javascript
// pages/MyPage.js
export class MyPage extends BasePage {
  selectors = { button: '#btn' };
  async click() { await this.click(this.selectors.button); }
}
```

### 4. Run
```bash
npm test
# or specific feature:
npx cucumber-js features/myfeature/test.feature
```

## 🏗️ Project Structure

```
features/          ← Write .feature files here
pages/             ← Create page objects here
step_definitions/  ← Add steps here (steps.js)
hooks/             ← Browser setup (auto, don't change)
utils/             ← Utilities (don't change)
fixtures/          ← Test data (JSON files)
reports/           ← Generated reports (auto)
```

## 📊 Available Utilities

### In Your Steps (via `this`)

```javascript
// Logger
this.logger.info('message');
this.logger.error('error');

// Test Data
const user = this.testDataBuilder.generateUser();

// Smart Waits
await this.waits.waitForElement(page, selector);
await this.waits.retry(action, 3);

// API Requests
await this.apiClient.get('/api/users');
await this.apiClient.post('/api/login', data);

// Store/Get Data
this.setTestData('key', value);
this.getTestData('key');

// Browser
this.page              ← The Playwright page object
this.config            ← Configuration
this.context           ← Browser context
```

## 🎯 Common Step Examples

```gherkin
# These steps are already implemented:
Given user navigates to login page
Given user navigates to base URL

When user enters username "john" and password "pass123"
When user enters username "john"
When user enters password "pass123"
When user clicks login button
When user leaves username empty
When user checks remember me checkbox
When user clicks profile menu
When user clicks logout button

Then user should be redirected to dashboard
Then user should remain on login page
Then welcome message should display "john"
Then error message should display "Invalid"
Then user menu should be visible
Then logout button should be visible
```

## 🏷️ Test Tags

```gherkin
@smoke         # Quick smoke tests (run before commit)
@regression    # Full regression suite
@critical      # Must-pass tests
@negative      # Error/edge case tests
@slow          # Tests taking >30 seconds
@api           # API-specific tests
@ui            # UI-specific tests
```

Run by tag:
```bash
npx cucumber-js --tags "@smoke"
npx cucumber-js --tags "@critical and not @slow"
```

## 📋 Checklists

### Adding a New Page Object

- [ ] Create file in `pages/` directory
- [ ] Extend `BasePage`
- [ ] Define selectors in `selectors = { ... }`
- [ ] Add methods for page actions
- [ ] Import and use in steps

### Adding a New Feature

- [ ] Create `.feature` file in `features/domain/`
- [ ] Write scenarios in Gherkin
- [ ] Use existing steps when possible
- [ ] Add new steps to `step_definitions/steps.js`
- [ ] Run and verify: `npm test`

### Before Committing

```bash
npm test              # ✓ Tests pass
npm run lint          # ✓ No lint errors
npm run format        # ✓ Code formatted
git add .
git commit -m "Added new test for..."
```

## 🐛 Debugging

### See Browser While Running
```bash
npm run test:headed
```

### Verbose Logging
```bash
DEBUG=true npm test
```

### Check One Feature
```bash
npx cucumber-js features/auth/login.feature
```

### View Logs
```bash
cat reports/logs/combined.log
cat reports/logs/error.log
```

### Check Screenshots
```bash
open reports/screenshots/
```

## 🔧 Configuration (.env)

```
BASE_URL=https://yourapp.com
HEADLESS=true              # false to see browser
BROWSER=chromium           # chromium, firefox, webkit
WORKERS=4                  # parallel workers
TIMEOUT=30000             # timeout ms
LOG_LEVEL=info            # debug, info, warn, error
```

## �� View Reports

After running tests:
```bash
open reports/cucumber-report.html    # Test report
tail reports/logs/combined.log       # Execution logs
open reports/screenshots/            # Failure screenshots
```

## 🔄 CI/CD

Tests run automatically on:
- Push to `main` or `dev`
- Pull requests
- Daily schedule (2 AM UTC)

View results in GitHub: Actions → Recent workflow run

## ⚡ Performance Tips

1. Use `npm run test:parallel` for faster execution
2. Run `npm run test:smoke` for quick checks
3. Use `@critical` tag for must-pass tests
4. Keep steps generic and reusable
5. Cache page objects: `this.loginPage = loginPage`

## 📞 Need Help?

1. Check existing feature files for examples
2. Check existing page objects for patterns
3. Review logs: `cat reports/logs/error.log`
4. Debug: `npm run test:debug`
5. Read: `FRAMEWORK_GUIDE.md` for detailed docs

## 🎯 Common Mistakes

❌ Don't: `await this.page.fill('input', text)` in steps  
✅ Do: Use page object: `await loginPage.fillInput(text)`

❌ Don't: Hardcode data in steps  
✅ Do: Use fixtures or test data builder

❌ Don't: Sleep for fixed time  
✅ Do: Use smart waits

❌ Don't: Create test dependencies  
✅ Do: Each test independent

❌ Don't: Access `this.page` in page objects  
✅ Do: Use `this.page` - it's available

## 🚀 Next Step

Pick a page in your app → Create page object → Write feature → Add steps → Run!

```bash
npm test
```

**Happy Testing. -type f -name "*.js" -o -name "*.json" -o -name "*.feature" -o -name "*.md" | grep -v node_modules | sort* 🎉
