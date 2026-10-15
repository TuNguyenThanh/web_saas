/**
 * Client-side data access for the app's JSON API.
 *
 * `jsonFetcher` is the default SWR fetcher (GET); `apiRequest` performs
 * mutations (POST/PATCH/DELETE). Both throw `ApiError` on a non-2xx response so
 * callers can surface `error.message` and SWR can mark the request as errored.
 */

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function parseError(res: Response, fallback: string): Promise<ApiError> {
  const data = await res.json().catch(() => null);
  const message =
    (data && typeof data.error === "string" && data.error) || fallback;
  return new ApiError(message, res.status);
}

/** Default SWR fetcher: GET `url` and return the parsed JSON body. */
export async function jsonFetcher<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw await parseError(res, "Request failed.");
  }
  return res.json() as Promise<T>;
}

type Method = "POST" | "PATCH" | "PUT" | "DELETE";

/** Perform a mutating JSON request and return the parsed body. */
export async function apiRequest<T>(
  url: string,
  options: { method: Method; body?: unknown } = { method: "POST" },
): Promise<T> {
  const res = await fetch(url, {
    method: options.method,
    headers: options.body ? { "Content-Type": "application/json" } : undefined,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  if (!res.ok) {
    throw await parseError(res, "Something went wrong. Please try again.");
  }
  return res.json().catch(() => ({})) as Promise<T>;
}
