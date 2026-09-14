import { type Locator, type Page, expect } from "@playwright/test";
import { paths, shouldBeOn } from "../support/paths";
import { buyer, errors } from "../support/test-data";

// all three checkout screens live here — splitting them felt like overkill

export class CheckoutInfo {
  heading: Locator;
  first: Locator;
  last: Locator;
  zip: Locator;
  continueBtn: Locator;
  error: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByTestId("title");
    this.first = page.getByTestId("firstName");
    this.last = page.getByTestId("lastName");
    this.zip = page.getByTestId("postalCode");
    this.continueBtn = page.getByTestId("continue");
    this.error = page.getByTestId("error");
  }

  async loaded() {
    await shouldBeOn(this.page, paths.info);
    await expect(this.heading).toHaveText("Checkout: Your Information");
  }

  async fillDetails(who = buyer) {
    await this.first.fill(who.firstName);
    await this.last.fill(who.lastName);
    await this.zip.fill(who.zip);
  }

  async continue() {
    await this.continueBtn.click();
  }

  // if you hit continue empty they only yell about first name
  async seeMissingFirstName() {
    await expect(this.error).toHaveText(errors.needFirstName);
    await shouldBeOn(this.page, paths.info);
  }
}

export class CheckoutOverview {
  heading: Locator;
  items: Locator;
  finishBtn: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByTestId("title");
    this.items = page.getByTestId("inventory-item-name");
    this.finishBtn = page.getByTestId("finish");
  }

  async shouldList(productName: string) {
    await shouldBeOn(this.page, paths.overview);
    await expect(this.heading).toHaveText("Checkout: Overview");
    await expect(this.items).toHaveText(productName);
  }

  async placeOrder() {
    await this.finishBtn.click();
  }
}

export class CheckoutDone {
  heading: Locator;
  thanks: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByTestId("title");
    this.thanks = page.getByTestId("complete-header");
  }

  async orderWentThrough() {
    await shouldBeOn(this.page, paths.done);
    await expect(this.heading).toHaveText("Checkout: Complete!");
    await expect(this.thanks).toHaveText(errors.thanks);
  }
}
