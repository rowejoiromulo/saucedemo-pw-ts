import { test, expect } from "../fixtures/base-fixture";
import { CREDENTIALS, TEST_CUSTOMER } from "../utils/constants";

test.describe("Checkout Flow", () => {
  test.beforeEach(async ({ page, loginPage }) => {
    await page.goto("/");
    await loginPage.login({
      userName: CREDENTIALS.userName,
      password: CREDENTIALS.password,
    });
  });

  // ✅ POSITIVE TESTS

  test("TC-CHECKOUT-001: successful checkout (single item) @smoke", async ({
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    const itemsToAdd = ["Sauce Labs Backpack"];

    for (const item of itemsToAdd) {
      await inventoryPage.addItemToCart(item);
    }

    await inventoryPage.goToCart();
    await cartPage.checkout();
    await checkoutPage.fillInformation(TEST_CUSTOMER);

    await checkoutPage.validateExpectedUrl("checkout-step-two.html");
    await checkoutPage.finish();
    await checkoutPage.verifySuccessfulOrder("Thank you for your order!");
  });

  test("TC-CHECKOUT-002: single item checkout @regression", async ({
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    const itemsToAdd = ["Sauce Labs Backpack"];

    for (const item of itemsToAdd) {
      await inventoryPage.addItemToCart(item);
    }

    await inventoryPage.goToCart();
    await cartPage.checkout();
    await checkoutPage.fillInformation(TEST_CUSTOMER);

    await checkoutPage.validateCart(itemsToAdd);
  });

  test("TC-CHECKOUT-003: multiple items checkout @regression", async ({
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    const itemsToAdd = ["Sauce Labs Backpack", "Sauce Labs Bike Light"];

    for (const item of itemsToAdd) {
      await inventoryPage.addItemToCart(item);
    }

    await inventoryPage.goToCart();
    await cartPage.checkout();
    await checkoutPage.fillInformation(TEST_CUSTOMER);

    await checkoutPage.validateCart(itemsToAdd);
  });

  // ❌ NEGATIVE TESTS

  test("TC-CHECKOUT-004: missing first name @regression", async ({
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    await inventoryPage.addItemToCart("Sauce Labs Backpack");
    await inventoryPage.goToCart();
    await cartPage.checkout();

    await checkoutPage.fillInformation({
      ...TEST_CUSTOMER,
      firstName: "",
    });

    await checkoutPage.validateErrorMessage(/First Name is required/);
  });

  test("TC-CHECKOUT-005: missing last name @regression", async ({
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    await inventoryPage.addItemToCart("Sauce Labs Backpack");
    await inventoryPage.goToCart();
    await cartPage.checkout();

    await checkoutPage.fillInformation({
      ...TEST_CUSTOMER,
      lastName: "",
    });

    await checkoutPage.validateErrorMessage(/Last Name is required/);
  });

  test("TC-CHECKOUT-006: missing postal code @regression", async ({
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    await inventoryPage.addItemToCart("Sauce Labs Backpack");
    await inventoryPage.goToCart();
    await cartPage.checkout();

    await checkoutPage.fillInformation({
      ...TEST_CUSTOMER,
      postalCode: "",
    });

    await checkoutPage.validateErrorMessage(/Postal Code is required/);
  });

  test("TC-CHECKOUT-007: empty cart checkout shows no items @regression", async ({
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    await inventoryPage.goToCart();
    await cartPage.checkout();
    await checkoutPage.fillInformation(TEST_CUSTOMER);

    await checkoutPage.validateCart([]);
  });
});