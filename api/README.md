# petstore api tests

Playwright request tests against [Swagger Petstore](https://petstore.swagger.io/).

Two endpoints:

- `POST /pet` — add a pet
- `GET /pet/{petId}` — fetch one by id

## what's covered

**POST /pet**

- happy path: create a pet, body comes back with the same id/name/status
- no body → 405
- broken json → 400 `bad input`
- missing `name` (required in the spec) — they still 200. calling that out so we don't pretend validation exists

**GET /pet/{petId}**

- create then fetch, fields match
- unknown id → 404 `Pet not found`
- `abc` as the id → 404 with a NumberFormatException (swagger says 400)
- negative id → 404


## run it

From the repo root:

```bash
npm install
npm run test:api
```

or from this folder:

```bash
npx playwright test
```

HTML report:

```bash
npx playwright show-report api/playwright-report
```

