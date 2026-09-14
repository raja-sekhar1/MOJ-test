import { test, expect } from "../support/fixtures";
import { errors, users } from "../support/test-data";

test.describe("login", () => {
  test.beforeEach(async ({ login }) => {
    await login.open();
  });

  test("standard_user gets through to the product list", async ({ login, shop }) => {
    await login.signIn(users.standard);

    await shop.waitForCatalog();
    // catalog is 6 items unless they change the demo again
    await expect(shop.names).toHaveCount(6);
  });

  test("invalid credentials throws error", async ({ login }) => {
    await login.signIn(users.invalid);

    await login.seeError(errors.badLogin);
    await expect(login.submit).toBeVisible();
  });

  // --- next ---
  test.skip("locked_out_user stays on login with the lockout message", async () => {
    // locked_out_user / secret_sauce → "Sorry, this user has been locked out."
  });

  test.skip("empty username still shows a field error", async () => {
    // password filled, username blank → epic sadface username is required
  });

  test.skip("empty password still shows a field error", async () => {
    // username filled, password blank → epic sadface password is required
  });

  test.skip("logged-out visitor hitting /inventory.html gets bounced to login", async () => {
    // no session cookie. unexpected deep link, not a form submit
  });
});
