# moj tests

Playwright stuff, split so the browser tests and the api tests don't trip over each other.

| folder | what |
| --- | --- |
| [`ui/`](./ui/README.md) | Sauce Demo UI — login + checkout |
| [`api/`](./api/README.md) | [Petstore](https://petstore.swagger.io/) API — `POST /pet` and `GET /pet/{petId}` |

## setup

```bash
npm install
npx playwright install
```

Browsers are only needed for `ui/`.

## run

```bash
npm test                 # ui then api
npm run test:ui
npm run test:ui:headed
npm run test:ui:ui
npm run test:ui:chromium
npm run test:api
```

More detail in the folder READMEs. Design notes (why these cases, not how to run them) are in [`test-design.md`](./test-design.md).
