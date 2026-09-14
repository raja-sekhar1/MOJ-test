import { InventoryPage } from "../page-objects/InventoryPage";
import { LoginPage } from "../page-objects/LoginPage";
import { users } from "./test-data";

/** happy-path login I was copy-pasting into both checkout tests */
export async function signInAsStandard(login: LoginPage, shop: InventoryPage) {
  await login.open();
  await login.signIn(users.standard);
  await shop.waitForCatalog();
}
