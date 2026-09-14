import { type Locator, type Page, expect } from "@playwright/test";
import { paths, shouldBeOn } from "../support/paths";

export class InventoryPage {
  heading: Locator;
  names: Locator;
  cartLink: Locator;
  cartCount: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByTestId("title");
    this.names = page.getByTestId("inventory-item-name");
    this.cartLink = page.getByTestId("shopping-cart-link");
    this.cartCount = page.getByTestId("shopping-cart-badge");
  }

  async waitForCatalog() {
    await shouldBeOn(this.page, paths.inventory);
    await expect(this.heading).toHaveText("Products");
    await expect(this.names.first()).toBeVisible();
  }

  // matching by name so we don't have to remember add-to-cart-sauce-labs-backpack
  async addToCart(productName: string) {
    const card = this.page
      .getByTestId("inventory-item")
      .filter({ hasText: productName });

    await expect(card).toBeVisible();
    await card.getByRole("button", { name: "Add to cart" }).click();
  }

  async cartShouldShow(count: number) {
    await expect(this.cartCount).toHaveText(String(count));
  }

  async goToCart() {
    await this.cartLink.click();
  }
}
