# CONTRIBUTING.md

# Contributing to Playwright BDD Framework

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Install Playwright: `npx playwright install`

## Writing Tests

### Feature Files

- Create feature files in `features/[module]/` 
- Use descriptive scenario names
- Follow Gherkin syntax
- Tag scenarios appropriately (@smoke, @regression, etc.)

### Page Objects

- Create page classes in `pages/`
- Extend `BasePage`
- Define selectors in `selectors` object
- Use meaningful method names

### Step Definitions

- Keep steps generic and reusable
- Use the `{string}`, `{int}`, `{float}` syntax
- Access CustomWorld via `this`
- Log important actions

## Testing Locally

```bash
# Run all tests
npm test

# Run specific feature
npx cucumber-js features/auth/login.feature

# Run with tag
npx cucumber-js --tags "@smoke"

# Debug mode
DEBUG=true npm test
```

## Code Style

- Use ES6+ modules
- Follow existing patterns
- Run prettier: `npm run format`
- Run eslint: `npm run lint`

## Pull Requests

1. Create feature branch: `git checkout -b feature/my-feature`
2. Write tests for your feature
3. Ensure all tests pass: `npm test`
4. Submit PR with description

## Best Practices

- ✅ Keep tests independent
- ✅ Use test data from fixtures
- ✅ Implement proper error handling
- ✅ Log important steps
- ✅ Document complex scenarios
- ❌ Don't hardcode test data
- ❌ Don't create test dependencies

## Directory Structure

```
features/
  └── my-module/
      └── my-feature.feature

pages/
  └── MyPage.js

step_definitions/
  └── steps.js (add your steps here)
```

## Questions?

Check existing tests for examples and follow the patterns used in the framework.
