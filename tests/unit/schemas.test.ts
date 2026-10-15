import {
  changePlanSchema,
  inviteMemberSchema,
  loginSchema,
  signupSchema,
  updateProfileSchema,
  validate,
} from "@/lib/schemas";

describe("signupSchema", () => {
  it("accepts and normalizes a valid signup", () => {
    const result = validate(signupSchema, {
      name: "  Ada  ",
      email: "  ADA@Example.COM ",
      password: "password123",
    });
    expect(result).toEqual({
      success: true,
      data: { name: "Ada", email: "ada@example.com", password: "password123" },
    });
  });

  it("rejects a bad email", () => {
    const result = validate(signupSchema, {
      name: "Ada",
      email: "not-an-email",
      password: "password123",
    });
    expect(result).toEqual({ success: false, error: "Please enter a valid email." });
  });

  it("rejects a short password", () => {
    const result = validate(signupSchema, {
      name: "Ada",
      email: "ada@example.com",
      password: "short",
    });
    expect(result).toMatchObject({ success: false });
  });
});

describe("loginSchema", () => {
  it("checks presence only — it does not validate email format", () => {
    // 'foo@bar' would fail email-format checks, but login must stay generic.
    expect(validate(loginSchema, { email: "foo@bar", password: "x" })).toEqual({
      success: true,
      data: { email: "foo@bar", password: "x" },
    });
  });

  it("rejects an empty email", () => {
    expect(
      validate(loginSchema, { email: "", password: "x" }),
    ).toMatchObject({ success: false });
  });
});

describe("inviteMemberSchema", () => {
  it("defaults the role to member", () => {
    expect(validate(inviteMemberSchema, { email: "a@b.com" })).toEqual({
      success: true,
      data: { email: "a@b.com", role: "member" },
    });
  });

  it("rejects an invalid email with the shared message", () => {
    expect(validate(inviteMemberSchema, { email: "foo@bar" })).toEqual({
      success: false,
      error: "Please enter a valid email.",
    });
  });

  it("rejects an unknown role", () => {
    expect(
      validate(inviteMemberSchema, { email: "a@b.com", role: "superuser" }),
    ).toEqual({ success: false, error: "Unknown role." });
  });
});

describe("changePlanSchema", () => {
  it("accepts a known plan and rejects an unknown one", () => {
    expect(validate(changePlanSchema, { plan: "pro" })).toMatchObject({
      success: true,
    });
    expect(validate(changePlanSchema, { plan: "ultra" })).toEqual({
      success: false,
      error: "Unknown plan.",
    });
  });
});

describe("updateProfileSchema", () => {
  it("requires a non-empty name", () => {
    expect(validate(updateProfileSchema, { name: "   " })).toMatchObject({
      success: false,
    });
  });
});
