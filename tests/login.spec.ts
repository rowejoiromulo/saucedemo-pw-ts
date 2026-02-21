import { expect } from "@playwright/test";
import { test } from "../fixtures/base-fixture";
import { CREDENTIALS } from "../utils/constants";

test.describe("Login Page", () => {
  test.describe.configure({ mode: "parallel" });
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  // ✅ POSITIVE TESTS

  test("TC-LOGIN-001: should display the login form @smoke", async ({ loginPage }) => {
    await expect(loginPage.header).toBeVisible();
    await expect(loginPage.usernameField).toBeVisible();
    await expect(loginPage.passwordField).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });

  test("TC-LOGIN-002: should login with valid credentials @smoke", async ({
    loginPage,
  }) => {
    await loginPage.login({
      userName: CREDENTIALS.userName,
      password: CREDENTIALS.password,
    });
    await loginPage.validateSuccessfulLogin("/inventory.html");
  });

  // ❌ NEGATIVE TESTS

  test("TC-LOGIN-003: should show correct error message with invalid credentials @regression", async ({
    loginPage,
  }) => {
    await loginPage.login({
      userName: "invalid_user",
      password: "invalid_password",
    });
    await loginPage.validateErrorMessage(
      "Epic sadface: Username and password do not match any user in this service",
    );
  });

  test("TC-LOGIN-004 should show correct error for locked out user @regression", async ({
    loginPage,
  }) => {
    await loginPage.login({
      userName: CREDENTIALS.lockedOutUserName,
      password: CREDENTIALS.password,
    });
    await loginPage.validateErrorMessage(
      "Epic sadface: Sorry, this user has been locked out.",
    );
  });

  test("TC-LOGIN-005: should show correct error for missing username @regression", async ({
    loginPage,
  }) => {
    await loginPage.login({ userName: "", password: CREDENTIALS.password });
    await loginPage.validateErrorMessage("Epic sadface: Username is required");
  });

  test("TC-LOGIN-006: should show correct error for missing password @regression", async ({
    loginPage,
  }) => {
    await loginPage.login({
      userName: CREDENTIALS.lockedOutUserName,
      password: "",
    });
    await loginPage.validateErrorMessage("Epic sadface: Password is required");
  });
});
