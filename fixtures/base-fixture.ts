import { test as base, Page } from "@playwright/test";

import { LoginPage } from "../pages/login";
import { InventoryPage } from "../pages/inventory";
import { CartPage } from "../pages/cart";
import { CheckoutPage } from "../pages/checkout";

type Pages = {
  page: Page;
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
};

export const test = base.extend<Pages>({
  page: async ({ page }, use, testInfo) => {
    await use(page);

    if (testInfo.status !== testInfo.expectedStatus) {
      await testInfo.attach("Screenshot on failure", {
        body: await page.screenshot(),
        contentType: "image/png",
      });
    }
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
});

export { expect } from "@playwright/test";