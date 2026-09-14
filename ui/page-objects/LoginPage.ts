import { type Locator, type Page, expect } from "@playwright/test";
import { paths, shouldBeOn } from "../support/paths";
import type { Creds } from "../support/test-data";

export class LoginPage {
  user: Locator;
  pass: Locator;
  submit: Locator;
  error: Locator;

  constructor(private readonly page: Page) {
    this.user = page.getByTestId("username");
    this.pass = page.getByTestId("password");
    this.submit = page.getByTestId("login-button");
    this.error = page.getByTestId("error");
  }

  async open() {
    await this.page.goto(paths.login);
    await expect(this.submit).toBeVisible();
  }

  async signIn(creds: Creds) {
    await this.user.fill(creds.username);
    await this.pass.fill(creds.password);
    await this.submit.click();
  }

  async seeError(message: string) {
    await expect(this.error).toBeVisible();
    await expect(this.error).toHaveText(message);
    await shouldBeOn(this.page, paths.login);
  }
}
