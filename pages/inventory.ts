import { Locator, Page } from "@playwright/test";
import { step } from "../utils/step";

export class InventoryPage {
  private page: Page;
  private header: Locator;
  private menuButton: Locator;
  private productSortDropdown: Locator;
  private shoppingCartBadge: Locator;
  private shoppingCartLink: Locator;
  private inventoryItems: Locator;
  private productTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = page.getByText("Swag Labs");
    this.menuButton = page.locator('[id="react-burger-menu-btn"]');
    this.productSortDropdown = page.locator(
      '[data-test="product-sort-container"]',
    );
    this.shoppingCartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.shoppingCartLink = page.locator('[data-test="shopping-cart-link"]');
    this.inventoryItems = page.locator('[data-test="inventory-item"]');
    this.productTitle = page.locator('[data-test="title"]');
  }

  async goto() {
    await this.page.goto("/inventory.html");
  }

  async getInventoryItems() {
    return this.inventoryItems;
  }

  async getInventoryItemCount() {
    return await this.inventoryItems.count();
  }

  async addItemToCart(itemName: string) {
    await step(`Add item "${itemName}" to cart`, async () => {
      const normalizedName = itemName.toLowerCase().replace(/\s+/g, "-");
      await this.page
        .locator(`[data-test="add-to-cart-${normalizedName}"]`)
        .click();
    });
  }

  async removeItemFromCart(itemName: string) {
    const normalizedName = itemName.toLowerCase().replace(/\s+/g, "-");
    await this.page.locator(`[data-test="remove-${normalizedName}"]`).click();
  }

  async getCartBadgeCount() {
    return await this.shoppingCartBadge.textContent();
  }

  async isCartBadgeVisible() {
    return await this.shoppingCartBadge.isVisible();
  }

  async sortProducts(sortOption: string) {
    await this.productSortDropdown.selectOption(sortOption);
  }

  async getProductNames() {
    const items = await this.inventoryItems
      .locator('[data-test="inventory-item-name"]')
      .allTextContents();
    return items;
  }

  async getProductPrices() {
    const prices = await this.inventoryItems
      .locator('[data-test="inventory-item-price"]')
      .allTextContents();
    return prices.map((price) => parseFloat(price.replace("$", "")));
  }

  async clickProduct(productName: string) {
    await this.page
      .locator(`[data-test="inventory-item-name"]`, { hasText: productName })
      .click();
  }

  async openMenu() {
    await this.menuButton.click();
  }

  async getProductsHeaderText() {
    return await this.productTitle.textContent();
  }

  async goToCart() {
    await step('View your cart', async () => {
      await this.shoppingCartLink.click();
    })
  }
}
