import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // petstore is a shared sandbox — one retry covers the random 5xx/empty-body days
  retries: process.env.CI ? 2 : 1,
  reporter: [["html", { open: "never" }], ["list"]],
  use: {
    // keep the host only. /v2 is on the request paths — trailing-slash games with
    // playwright's url join have burned me on this api before
    baseURL: "https://petstore.swagger.io",
    extraHTTPHeaders: {
      Accept: "application/json",
      // swagger ui mentions this for the api_key filter
      api_key: "special-key",
    },
  },
  projects: [{ name: "api" }],
});
