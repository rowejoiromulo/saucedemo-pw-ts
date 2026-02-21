import { expect, Locator, Page } from "@playwright/test";
import { step } from "../utils/step";

export class LoginPage {
  private readonly page: Page;

  readonly header: Locator;
  readonly usernameField: Locator;
  readonly passwordField: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = page.getByText("Swag Labs");
    this.usernameField = page.locator('[data-test="username"]');
    this.passwordField = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }
  async goto() {
    await this.page.goto("/");
  }

  async fillUsername(userName: string) {
    await this.usernameField.fill(userName);
  }

  async fillPassword(password: string) {
    await this.passwordField.fill(password);
  }

  async clickLogin() {
    await this.loginButton.click();
  }

  async login({ userName, password }: { userName: string; password: string }) {
    await step(`Login as user: ${userName}`, async () => {
      await this.goto();
      await this.fillUsername(userName);
      await this.fillPassword(password);
      await this.clickLogin();
    });
  }

  async validateErrorMessage(expected: string) {
    await step(`Verify error message: "${expected}"`, async () => {
      await expect(this.errorMessage).toContainText(expected);
    });
  }

  async validateSuccessfulLogin(url: string) {
    await step(`Verify user is logged in url: ${url}`, async () => {
      await expect(this.page).toHaveURL("/inventory.html");
    })
  }
}