/**
 * Validation schemas — the single source of truth for API request shapes.
 *
 * These are consumed by the server (route handlers validate input against them)
 * AND the client (forms validate before submitting), so the contract can't
 * drift between the two. Types are inferred from the schemas, never redeclared.
 *
 * Pure — no server-only imports — so it is safe to import into client bundles.
 */
import { z } from "zod";

const PLANS = ["free", "pro", "enterprise"] as const;
const ROLES = ["owner", "admin", "member"] as const;

/** A normalized (trimmed, lowercased) email that must look like one. */
export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, "Please enter a valid email.")
  .email("Please enter a valid email.");

export const signupSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  email: emailSchema,
  password: z.string().min(8, "Password must be at least 8 characters."),
});

/**
 * Login only checks presence — never email format — so the response can stay
 * generic ("Invalid email or password") and not leak whether an account exists.
 */
export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().min(1, "Email and password are required."),
  password: z.string().min(1, "Email and password are required."),
});

export const updateProfileSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
});

export const changePlanSchema = z.object({
  plan: z.enum(PLANS, { message: "Unknown plan." }),
});

export const inviteMemberSchema = z.object({
  email: emailSchema,
  role: z.enum(ROLES, { message: "Unknown role." }).default("member"),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePlanInput = z.infer<typeof changePlanSchema>;
export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;

/**
 * Validate `value` against `schema`, returning either the parsed data or the
 * first human-readable error message. Handy for client-side form validation.
 */
export function validate<S extends z.ZodTypeAny>(
  schema: S,
  value: unknown,
): { success: true; data: z.infer<S> } | { success: false; error: string } {
  const result = schema.safeParse(value);
  if (result.success) return { success: true, data: result.data };
  return {
    success: false,
    error: result.error.issues[0]?.message ?? "Invalid input.",
  };
}
