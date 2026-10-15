import { ApiError, apiRequest, jsonFetcher } from "@/lib/fetcher";

function mockFetch(response: {
  ok: boolean;
  status?: number;
  json: () => unknown;
}) {
  global.fetch = jest.fn().mockResolvedValue({
    ok: response.ok,
    status: response.status ?? (response.ok ? 200 : 400),
    json: async () => response.json(),
  }) as unknown as typeof fetch;
}

describe("jsonFetcher", () => {
  it("returns the parsed body on success", async () => {
    mockFetch({ ok: true, json: () => ({ members: [{ id: "1" }] }) });
    await expect(jsonFetcher("/api/team")).resolves.toEqual({
      members: [{ id: "1" }],
    });
  });

  it("throws an ApiError carrying the server message and status", async () => {
    mockFetch({ ok: false, status: 401, json: () => ({ error: "Nope." }) });
    await expect(jsonFetcher("/api/team")).rejects.toMatchObject({
      message: "Nope.",
      status: 401,
    });
  });
});

describe("apiRequest", () => {
  it("sends a JSON body and returns the parsed response", async () => {
    mockFetch({ ok: true, json: () => ({ member: { id: "2" } }) });

    const result = await apiRequest("/api/team", {
      method: "POST",
      body: { email: "a@b.com" },
    });

    expect(result).toEqual({ member: { id: "2" } });
    expect(global.fetch).toHaveBeenCalledWith("/api/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "a@b.com" }),
    });
  });

  it("throws an ApiError with a fallback message when none is given", async () => {
    mockFetch({ ok: false, status: 500, json: () => ({}) });

    let err: ApiError | undefined;
    try {
      await apiRequest("/api/team", { method: "DELETE" });
    } catch (e) {
      err = e as ApiError;
    }
    expect(err).toBeInstanceOf(ApiError);
    expect(err?.message).toMatch(/something went wrong/i);
    expect(err?.status).toBe(500);
  });
});
