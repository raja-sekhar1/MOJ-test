import { expect, test } from "../helpers/fixtures";
import { newPet, readJson, type Pet, type PetstoreError } from "../helpers/payloads";

test.describe("GET /pet/{petId}", () => {
  test("returns the pet we just created", async ({ pets }) => {
    const payload = newPet();

    const created = await pets.addPet(payload);
    expect(created.ok()).toBeTruthy();

    //  poll until the get actually finds it
    await expect(async () => {
      const res = await pets.getById(payload.id!);
      expect(res.status()).toBe(200);

      const body = await readJson<Pet>(res);
      expect(body.id).toBe(payload.id);
      expect(body.name).toBe(payload.name);
    }).toPass();
  });

  test("unknown id comes back 404", async ({ pets }) => {
    // don't use 1 / 2 / 3 — other people leave junk in this store
    const res = await pets.getById(9_000_111_222);

    expect(res.status()).toBe(404);

    const body = await readJson<PetstoreError>(res);
    expect(body.message).toBe("Pet not found");
  });

  test("non-numeric id is not treated as a real pet", async ({ pets }) => {
    const res = await pets.getById("abc");

    // swagger says 400. they actually 404 with a NumberFormatException in the body
    expect(res.status()).toBe(404);

    const body = await readJson<PetstoreError>(res);
    expect(body.message).toMatch(/NumberFormatException/);
    expect(body.message).toMatch(/abc/);
  });

  test("negative id is not found", async ({ pets }) => {
    const res = await pets.getById(-1);

    expect(res.status()).toBe(404);

    const body = await readJson<PetstoreError>(res);
    expect(body.message).toBe("Pet not found");
  });

  // --- next ---
  test.skip("GET after DELETE comes back 404, not the old body", async () => {
    // unexpected state: resource gone. error response should match unknown id
  });

  test.skip("id 0 is not a pet", async () => {
    // invalid / edge id. they 404 this the same as a miss
  });

  test.skip("decimal id like 1.5 is not coerced into pet 1", async () => {
    // invalid input in the path. NumberFormatException or 404, not a silent round-down
  });

  test.skip("GET a pet we never created but with a recently used id from another tester — still 404 or we skip", async () => {
    // shared sandbox. don't treat leftover records as ours
  });

  test.skip("findByStatus=available returns an array, bogus status returns empty or 400", async () => {
    // neighbour endpoint. spec says 400 for bad status; they often 200 []
  });
});
