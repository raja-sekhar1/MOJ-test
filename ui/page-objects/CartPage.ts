import { type Locator, type Page, expect } from "@playwright/test";
import { paths, shouldBeOn } from "../support/paths";

export class CartPage {
  heading: Locator;
  items: Locator;
  checkoutBtn: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByTestId("title");
    this.items = page.getByTestId("inventory-item-name");
    this.checkoutBtn = page.getByTestId("checkout");
  }

  async shouldHave(productName: string) {
    await shouldBeOn(this.page, paths.cart);
    await expect(this.heading).toHaveText("Your Cart");
    await expect(this.items).toHaveText(productName);
  }

  async startCheckout() {
    await this.checkoutBtn.click();
  }
}
