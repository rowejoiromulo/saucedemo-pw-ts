import { Page, Locator, expect } from "@playwright/test";
import { step } from "../utils/step";

export class CartPage {
  readonly checkoutButton: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
  }

  async checkout() {
    await step("Checkout cart", async () => {
      await this.checkoutButton.click();
    });
  }

  async getCartBadgeCount(): Promise<number> {
    const badge = this.cartBadge;
    const exists = await badge.count();

    if (exists === 0) return 0;

    const text = (await badge.textContent())?.trim() ?? "0";
    return parseInt(text, 10);
  }

  async validateBadgeCount(expected: number) {
    await step(`Verify cart badge count is ${expected}`, async () => {
      const actual = await this.getCartBadgeCount();
      expect(actual).toBe(expected);
    });
  }
}
