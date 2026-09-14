import { type Page, expect } from "@playwright/test";

export const paths = {
  login: "/",
  inventory: "/inventory.html",
  cart: "/cart.html",
  info: "/checkout-step-one.html",
  overview: "/checkout-step-two.html",
  done: "/checkout-complete.html",
};

/** sauce urls all end in these html files except login */
export async function shouldBeOn(page: Page, path: string) {
  await expect(page).toHaveURL(new RegExp(`${path}$`));
}
