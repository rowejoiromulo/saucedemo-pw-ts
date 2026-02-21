import { Page, Locator, expect } from "@playwright/test";
import { step } from "../utils/step";

export class CheckoutPage {
  private readonly page: Page;

  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly errorMessage: Locator;

  readonly cartItems: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly subtotalLabel: Locator;
  readonly finishButton: Locator;

  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.errorMessage = page.locator('[data-test="error"]');

    this.cartItems = page.locator(".cart_item");
    this.itemNames = page.locator(".inventory_item_name");
    this.itemPrices = page.locator(".inventory_item_price");
    this.subtotalLabel = page.locator(".summary_subtotal_label");
    this.finishButton = page.locator('[data-test="finish"]');

    this.successMessage = page.locator(".complete-header");
  }

  // User information
  async fillInformation({
    firstName,
    lastName,
    postalCode,
  }: {
    firstName: string;
    lastName: string;
    postalCode: string;
  }) {
    await step("Fill checkout information", async () => {
      await this.firstNameInput.fill(firstName);
      await this.lastNameInput.fill(lastName);
      await this.postalCodeInput.fill(postalCode);
      await this.continueButton.click();
    });
  }

  async finish() {
    await step("Finish order", async () => {
      await this.finishButton.click();
    });
  }

  async validateErrorMessage(expected: string | RegExp) {
    await step(`Verify error message: "${expected}"`, async () => {
      await expect(this.errorMessage).toContainText(expected);
    });
  }

  // Cart helpers
  private extractAmount(text: string | null): number {
    if (!text) return 0;
    const match = text.match(/\$([0-9.]+)/);
    return match ? Number(match[1]) : 0;
  }

  async readCartData(): Promise<{
    items: { name: string; price: number }[];
    subtotal: number;
  }> {
    let result: { items: { name: string; price: number }[]; subtotal: number };

    await step("Read all cart data", async () => {
      const count = await this.itemNames.count();
      const items: { name: string; price: number }[] = [];

      for (let i = 0; i < count; i++) {
        const name = (await this.itemNames.nth(i).textContent())?.trim() ?? "";
        const priceText =
          (await this.itemPrices.nth(i).textContent())?.trim() ?? "";
        const price = parseFloat(priceText.replace("$", ""));
        items.push({ name, price });
      }

      const subtotalText =
        (await this.subtotalLabel.textContent())?.trim() ?? "";
      const subtotal = this.extractAmount(subtotalText);

      result = { items, subtotal };
    });

    return result!;
  }

  async validateCart(expectedItemNames: string[]) {
    await step("Validate cart items and subtotal", async () => {
      const { items, subtotal } = await this.readCartData();

      // Validate number of items
      expect(items.length).toBe(expectedItemNames.length);

      // Validate item names
      const actualNames = items.map((item) => item.name);
      expectedItemNames.forEach((name) => expect(actualNames).toContain(name));

      // Validate subtotal
      const expectedSubtotal = items.reduce((sum, item) => sum + item.price, 0);
      expect(subtotal).toBeCloseTo(expectedSubtotal, 2);
    });
  }

  async verifySuccessfulOrder(expected: string) {
    await step("Verify successful order", async () => {
      await expect(this.successMessage).toHaveText(expected);
      await this.validateExpectedUrl("checkout-complete.html");
    });
  }

  async validateExpectedUrl(expected: string) {
    await step(`Validate page url to contain: ${expected}`, async () => {
      await expect(this.page).toHaveURL(expected);
    });
  }
}
