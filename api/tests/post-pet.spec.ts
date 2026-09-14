import { expect, test } from "../helpers/fixtures";
import { newPet, readJson, type Pet, type PetstoreError } from "../helpers/payloads";

test.describe("POST /pet", () => {
  test("creates a pet and echoes the payload back", async ({ pets }) => {
    const payload = newPet();

    const res = await pets.addPet(payload);
    expect(res.status(), " returns 200").toBe(200);

    const body = await readJson<Pet>(res);
    expect(body.id).toBe(payload.id);
    expect(body.name).toBe(payload.name);
    expect(body.status).toBe("available");
    expect(body.photoUrls).toEqual(payload.photoUrls);
  });

  test("no body is rejected", async ({ pets }) => {
    const res = await pets.addPetRaw({
      headers: { "Content-Type": "application/json" },
    });

    expect(res.status()).toBe(405);

    const body = await readJson<PetstoreError>(res);
    expect(body.code).toBe(405);
  });

  test("Invalid json is rejected", async ({ pets }) => {
    const res = await pets.addPetRaw({
      headers: { "Content-Type": "application/json" },
      data: "{not valid json",
    });

      expect(res.ok()).toBeFalsy();
    expect(res.status()).toBeGreaterThanOrEqual(400);
  });

  // negative test: missing name still comes back with 200
  test("missing name still comes back with 200", async ({
    pets,
  }) => {
    const id = Date.now();
    const res = await pets.addPet({ id, photoUrls: ["https://dummyurl.com/x.png"] });

    expect(res.status()).toBe(200);

    const body = await readJson<Pet>(res);
    expect(body.id).toBe(id);
    expect(body.name).toBeUndefined();
  });

  // --- next ---
  test.skip("update an existing pet with PUT /pet and GET shows the new name", async () => {
    // positive write after create. same resource, different verb
  });

  test.skip("status outside available|pending|sold is rejected or echoed — pin whatever they actually do", async () => {
    // invalid input vs spec enum. last I checked they 200 and store the junk status
  });

  test.skip("photoUrls omitted (the other required field) — same story as missing name?", async () => {
    // spec says required. confirm they still 200 or finally 405
  });

  test.skip("id sent as a string, not a number", async () => {
    // type mismatch. either coerced or 400. shouldn't 500
  });

  test.skip("POST the same id twice — second call overwrites, doesn't 409", async () => {
    // unexpected state on a shared store. no uniqueness guarantee here
  });
});
