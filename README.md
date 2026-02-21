# Saucedemo Playwright Automation

This repository contains end-to-end automated tests for the [SauceDemo](https://www.saucedemo.com) web application using Playwright, TypeScript, and Allure reporting. It is designed for robust, maintainable, and scalable UI test automation, with CI integration via GitHub Actions.

---

```
├── fixtures/
│   └── base-fixture.ts      # Custom Playwright fixtures for page objects and utilities
├── pages/
│   ├── cart.ts              # Cart page object
│   ├── checkout.ts          # Checkout page object
│   ├── inventory.ts         # Inventory page object
│   └── login.ts             # Login page object
├── tests/
│   ├── checkout.spec.ts     # Checkout flow tests
│   └── login.spec.ts        # Login page tests
├── utils/
│   ├── constants.ts         # Test data and environment variable mapping
│   └── step.ts              # Step annotation utility for reporting
├── .env                     # Environment variables (credentials, base URL)
├── package.json             # Project dependencies and scripts
├── playwright.config.ts     # Playwright configuration (reporters, projects, env)
└── .github/
    └── workflows/
        └── playwright.yml   # GitHub Actions workflow for CI
```

---

## Getting Started

### 1. Install Dependencies

```bash
npm ci
```

### 2. Configure Environment Variables

Create a `.env` file in the project root (see below for details):

```
# User credentials
SAUCEDEMO_USERNAME=standard_user
SAUCEDEMO_PASSWORD=secret_sauce
SAUCEDEMO_LOCKEDOUT_USERNAME=locked_out_user

# Application URL (optional - defaults to https://www.saucedemo.com)
BASE_URL=https://www.saucedemo.com
```


### 3. Run Tests Locally

```bash
npm test
```

#### Run Tests by Tag

You can run only tests with a specific tag using Playwright's `--grep` option. For example:

```bash
# Run only @smoke tests
npx playwright test --grep "@smoke"

# Run only @regression tests
npx playwright test --grep "@regression"
```

You can also combine tags or use `--grep-invert` to exclude certain tags. See the [Playwright docs on test annotations](https://playwright.dev/docs/test-annotations#tag-tests) for more details.

### 4. Generate and View Allure Report

```bash
npm run allure:generate
npm run allure:open
```

---

## Fixtures and Page Objects

- **Custom Fixture (`fixtures/base-fixture.ts`)**: Extends Playwright's test context to inject page objects (`loginPage`, `inventoryPage`, `cartPage`, `checkoutPage`) for easy access in tests. Also attaches a screenshot on test failure for reporting.
- **Page Objects (`pages/`)**: Encapsulate UI interactions for each page, promoting reusability and maintainability.

Example usage in a test:
```typescript
import { test } from '../fixtures/base-fixture';

test('should login with valid credentials', async ({ loginPage }) => {
  await loginPage.login({ userName: 'standard_user', password: 'secret_sauce' });
  // ... assertions ...
});
```

---


## Reporting

- **Allure Reports**: Allure is integrated via the `allure-playwright` reporter. After running tests, generate the report with `npm run allure:generate` and view it with `npm run allure:open`.

---


## Continuous Integration (GitHub Actions)

The workflow `.github/workflows/playwright.yml` runs on every push and pull request to `main` or `master`:
- Installs dependencies and Playwright browsers
- Runs all tests
- Generates Allure report
- Uploads the Allure report as an artifact for download

Example workflow snippet:
```yaml
    - name: Run Playwright tests
      run: npx playwright test
    - name: Generate Allure Report
      run: npm run allure:generate
    - uses: actions/upload-artifact@v4
      with:
        name: allure-report
        path: allure-report/
        retention-days: 30
```

---

## Environment Variables (`.env`)

- `SAUCEDEMO_USERNAME`: Username for SauceDemo login
- `SAUCEDEMO_PASSWORD`: Password for SauceDemo login
- `SAUCEDEMO_LOCKEDOUT_USERNAME`: (Optional) Locked out user for negative tests
- `BASE_URL`: (Optional) Base URL for the application (defaults to https://www.saucedemo.com)

---

## Scripts

- `npm test` — Run all Playwright tests
- `npm run allure:generate` — Generate Allure report from test results
- `npm run allure:open` — Open Allure report in a browser

---

## Notes

- Tests are written in TypeScript and use Playwright's parallel execution and retry features for CI stability.
- Custom fixtures and page objects make tests readable and maintainable.
- Allure and Playwright reports are available as downloadable artifacts in each GitHub Actions run.

---

## License

MIT
