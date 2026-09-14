import type { APIRequestContext } from "@playwright/test";


export class PetApi {
  constructor(private readonly request: APIRequestContext) {}

  addPet(body: unknown) {
    return this.request.post("/v2/pet", { data: body });
  }

  /** used for the no-body / invalid payload cases */
  addPetRaw(options: { data?: string; headers?: Record<string, string> }) {
    return this.request.post("/v2/pet", options);
  }

  getById(petId: string | number) {
    return this.request.get(`/v2/pet/${petId}`);
  }
}
