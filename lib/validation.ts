import { NextResponse } from "next/server";
import type { z } from "zod";
import { validate } from "@/lib/schemas";

/**
 * Parse and validate a request's JSON body against a schema.
 *
 * Returns either `{ data }` (validated, typed) or `{ error }` — a ready-to-return
 * 400 `NextResponse` carrying the first validation message. Keeps every route
 * handler's input-validation boilerplate down to one line.
 */
export async function parseBody<S extends z.ZodTypeAny>(
  request: Request,
  schema: S,
): Promise<
  { data: z.infer<S>; error?: never } | { data?: never; error: NextResponse }
> {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return {
      error: NextResponse.json({ error: "Invalid request body." }, { status: 400 }),
    };
  }

  const result = validate(schema, raw);
  if (!result.success) {
    return {
      error: NextResponse.json({ error: result.error }, { status: 400 }),
    };
  }
  return { data: result.data };
}
