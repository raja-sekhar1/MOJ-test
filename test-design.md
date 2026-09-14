# Test design

This is the test strategy behind the two suites, not a how-to-run doc. Commands live in the READMEs.

UI and API are split on purpose. Sauce Demo is a browser journey. Petstore is HTTP. They don't share locators, data, or a Playwright config, so a UI selector change can't take the API run down with it.

I kept both suites small. Cover the paths that would actually hurt if they broke, plus the failure cases users (or callers) hit first.

---

## UI — Sauce Demo

### Approach

The shop is a straight line: log in, pick something, pay. Tests follow that line.

Page objects wrap each screen (login, inventory, cart, checkout). Specs talk in user steps, not CSS. Locators go through `data-test` where the app exposes it, and roles where that's clearer — e.g. "Add to cart" on a product card by name, so we don't hardcode `add-to-cart-sauce-labs-backpack`.

Fixtures hand the page objects to the test. Login and checkout each reset in `beforeEach` so tests can run in parallel and don't share a cart.

Checkout needs a logged-in user, so that setup is one helper (`signInAsStandard`) instead of pasting the login steps into both specs.

### Positive scenarios

**1. Valid login lands on the product list**

If `standard_user` can't get in, nothing else in the UI is worth running. Asserting the catalog (title + six items) proves we didn't just sit on a spinner or bounce back to login.

**2. Buy the backpack end to end**

This is the revenue path: add to cart → cart badge → checkout info → overview → confirmation. I used one known product and one buyer so the assertions stay tight (name on the cart, name on the overview, "Thank you for your order!" at the end).

I didn't split this into five tiny tests. A broken continue button only shows up if you walk the whole flow.

### Negative scenarios

**1. Bad username / password**

Most login bugs are "wrong creds still get you in" or "the form dies with no message". This checks we stay on `/` and show the epic-sadface copy. The login button still being there is a cheap extra check that we didn't navigate.

I didn't use `locked_out_user` here. That's a different account flag, not a credential check. Invalid user/pass is the case every login form has to get right.

**2. Continue checkout with an empty form**

You can fill a cart and still shouldn't be able to place an order with no customer info. On this app, empty continue only complains about first name — last name and zip are ignored until that field is filled. The test matches that behaviour rather than inventing a "all fields required" rule the UI doesn't have.

That's the gate before payment. Missing it would mean you can push an incomplete order through.

### What I left out

No sort, remove-from-cart, or logout. Fine as follow-ups. They don't prove the shop can take an order.

---

## API — Petstore

### Approach

No browser. Playwright's `request` fixture hits `https://petstore.swagger.io` directly.

I picked two endpoints that belong together:

- `POST /v2/pet` — write
- `GET /v2/pet/{petId}` — read

If POST lies about what it stored, GET will catch it. If GET 200s on junk ids, that's a real lookup bug.

A thin `PetApi` wrapper keeps the specs free of URL strings. Payloads use a fresh id (`Date.now()`) so we don't collide with whoever else is using this public store. I never GET pet `1` — that record comes and goes.

Swagger is treated as a hint, not the source of truth. This demo disagrees with its own spec in a few places (200 vs 201, required `name`, 400 vs 404 on bad ids). Tests assert what the service actually does, with a comment where that differs from the spec. Otherwise CI would fail on "correct" swagger and we'd be testing a document, not the API.

Responses are parsed through `readJson`. Petstore sometimes returns empty bodies or HTML. A raw `res.json()` throw is useless; status + a snippet of the body is enough to debug.

GET after POST can lag, so that one test polls with `toPass()` instead of sleeping.

### Positive scenarios

**1. POST creates a pet and echoes the payload**

Happy path for a write: send a valid body, get 200 (this API does not use 201), and get the same id, name, status, and photo URLs back. If echo is wrong, clients will store a pet they can't find again.

**2. GET returns the pet we just created**

Happy path for a read, but not against a hardcoded id. We create, then fetch. Matching id and name proves the write actually landed. Polling covers the store being slow under load, which this sandbox does a lot.

### Negative scenarios

These are the cases that usually leak data, corrupt the store, or confuse clients.

**POST — no body (405)**

A create with nothing in the request should not mint a pet. Spec says invalid input; they return 405. Either way it must not be 200.

**POST — invalid JSON (4xx / 5xx)**

Broken payload, `Content-Type: application/json`. Must not be treated as success. Curl often 400s this; Playwright's client sometimes gets 500 from Jetty instead. The assertion is "not ok, status >= 400" because both mean it wasn't stored. Pinning 400 only made the test lie about the transport.

**POST — missing `name` still 200**

Spec lists `name` as required. The service accepts the body and omits the field. I kept this as an explicit test so we don't pretend validation exists. If they ever start enforcing it, this test should fail and we'll update the contract.

**GET — unknown id → 404 `Pet not found`**

Lookup miss has to be 404, not 200 with an empty pet. Id is a value nobody should have (`9000111222`), not `1`.

**GET — non-numeric id (`abc`)**

Path param is int64. A string should not resolve to a pet. Spec says 400; they 404 with `NumberFormatException` in the message. We assert that actual shape so a change in error handling is visible.

**GET — negative id → 404**

Negative ids are invalid for this resource. Same "not found" contract as a missing record. Cheap check, easy to skip, and it's how a lot of clients mis-send ids.

### What I left out

`findByStatus`, orders, users. POST+GET on pet is enough to prove create and fetch, which is the core of this API. Status filter would be next if we grew the suite.

---

## How I chose positive vs negative

Positive = the thing a real user or client is trying to do. One path each layer: session + purchase on the UI, create + fetch on the API.

Negative = the first wrong input on that same path, not an exhaustive matrix. Bad login, empty checkout, empty/broken POST body, ids that must not resolve.

I don't assert implementation details we don't own (exact inventory count is already a bit tight; petstore status on GET is worse, so GET only checks id and name). Where the live API and swagger disagree, the test documents the live API.
