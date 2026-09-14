import { test as base } from "@playwright/test";
import { CartPage } from "../page-objects/CartPage";
import {
  CheckoutDone,
  CheckoutInfo,
  CheckoutOverview,
} from "../page-objects/Checkout";
import { InventoryPage } from "../page-objects/InventoryPage";
import { LoginPage } from "../page-objects/LoginPage";

// dumping page objects on the test so specs don't new everything up

type Pages = {
  login: LoginPage;
  shop: InventoryPage;
  cart: CartPage;
  info: CheckoutInfo;
  overview: CheckoutOverview;
  done: CheckoutDone;
};

export const test = base.extend<Pages>({
  login: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  shop: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
  cart: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  info: async ({ page }, use) => {
    await use(new CheckoutInfo(page));
  },
  overview: async ({ page }, use) => {
    await use(new CheckoutOverview(page));
  },
  done: async ({ page }, use) => {
    await use(new CheckoutDone(page));
  },
});

export { expect } from "@playwright/test";
