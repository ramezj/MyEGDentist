import type { ClientResponse } from "hono/client";
import type { ApiErrorBody } from "@myegdentist/api";

export class ClientApiError extends Error {
  public readonly code: string;

  constructor(body: ApiErrorBody) {
    super(body.message);
    this.name = "ClientApiError";
    this.code = body.code;
  }
}

// Extract only the success data type from the union Hono produces.
// Error responses always use explicit 4xx/5xx codes; success uses ContentfulStatusCode (2xx).
type SuccessData<R> = R extends ClientResponse<infer T, infer S, "json">
  ? S extends 400 | 401 | 403 | 404 | 409 | 500
    ? never
    : T
  : never;

export async function parseResponse<R extends ClientResponse<unknown, number, "json">>(
  res: R,
): Promise<SuccessData<R>> {
  if (!res.ok) {
    const body = (await res.json()) as ApiErrorBody;
    throw new ClientApiError(body);
  }
  return res.json() as Promise<SuccessData<R>>;
}
