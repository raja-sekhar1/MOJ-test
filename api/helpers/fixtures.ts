import { test as base } from "@playwright/test";
import { PetApi } from "./petApi";

type ApiFixtures = {
  pets: PetApi;
};

export const test = base.extend<ApiFixtures>({
  pets: async ({ request }, use) => {
    await use(new PetApi(request));
  },
});

export { expect } from "@playwright/test";
