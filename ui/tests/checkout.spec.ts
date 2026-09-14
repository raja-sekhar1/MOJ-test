import { test } from "../support/fixtures";
import { signInAsStandard } from "../support/sign-in";
import { backpack } from "../support/test-data";
import { buyer } from "../support/test-data";

test.describe("checkout", () => {
  test.beforeEach(async ({ login, shop }) => {
    await signInAsStandard(login, shop);
  });

  test("can buy the backpack all the way through", async ({
    shop,
    cart,
    info,
    overview,
    done,
  }) => {
    await shop.addToCart(backpack.name);
    await shop.cartShouldShow(1);
    await shop.goToCart();

    await cart.shouldHave(backpack.name);
    await cart.startCheckout();

    await info.loaded();
    await info.fillDetails(buyer);
    await info.continue();

    await overview.shouldList(backpack.name);
    await overview.placeOrder();

    await done.orderWentThrough();
  });

  test("empty checkout form just asks for first name", async ({ shop, cart, info }) => {
    await shop.addToCart(backpack.name);
    await shop.goToCart();
    await cart.startCheckout();

    await info.loaded();
    await info.continue();

    await info.seeMissingFirstName();
  });

  // --- next ---
  test.skip("two products in the cart, badge shows 2", async () => {
    // backpack + bike light. positive, but a different qty path than the single-item buy
  });

  test.skip("remove the only cart item and checkout is blocked / cart empty", async () => {
    // unexpected state: user changes their mind before paying . Right now I am able to finish the order - potential bug here?
  });

  test.skip("first name filled, last name blank — they ask for last name next", async () => {
    // missing first name →  first name is required
  });

  test.skip("first + last filled, zip blank — they ask for postal code", async () => {
    // missing zip →  postal code is required
  });

  test.skip("checkout with an empty cart doesn't place an order", async () => {
    // but i am still able to finish the order, bug here?
  });
});
