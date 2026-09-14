import type { APIResponse } from "@playwright/test";

export type Pet = {
  id?: number;
  name?: string;
  photoUrls?: string[];
  status?: string;
  tags?: { id?: number; name?: string }[];
};

export type PetstoreError = {
  code?: number;
  type?: string;
  message?: string;
};

/** ids stay inside MAX_SAFE_INTEGER so JSON round-trips don't scramble them */
export function freshPetId() {
  return Date.now();
}

export function newPet(overrides: Partial<Pet> = {}): Pet {
  const id = overrides.id ?? freshPetId();
  return {
    id,
    name: `dummy-name-${id}`,
    photoUrls: ["https://somedummyurl.com"],
    status: "available",
    ...overrides,
  };
}

/**
 * petstore sometimes replies with an empty body or xml. fail with the status + snippet
 * instead of a cryptic json() throw.
 */
export async function readJson<T>(res: APIResponse): Promise<T> {
  const raw = await res.text();
  if (!raw) {
    throw new Error(`${res.status()} ${res.url()} came back empty`);
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    throw new Error(
      `${res.status()} ${res.url()} was not json. first 200 chars: ${raw.slice(0, 200)}`,
    );
  }
}
