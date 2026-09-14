# swag labs e2e

Playwright UI tests against https://www.saucedemo.com/

Page objects live in `page-objects/`, shared bits in `support/`, specs in `tests/`.

## what's covered

- login works for `standard_user`
- login fails with invalid creds
- buy the backpack end to end scenario
- checkout with a blank form (they only complain about first name)

## run it

From the repo root:

```bash
npm install
npx playwright install
npm run test:ui
npm run test:ui:headed
npm run test:ui:ui
```

`npm run test:ui:chromium` if you don't want all the browsers.

From this folder:

```bash
npx playwright test
```
