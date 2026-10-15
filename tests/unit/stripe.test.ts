import { isStripeEnabled, priceIdForPlan, stripe } from "@/lib/stripe";

describe("stripe config", () => {
  it("is disabled when no secret key is set (the test/CI default)", () => {
    expect(isStripeEnabled).toBe(false);
    expect(stripe).toBeNull();
  });

  it("maps paid plans to their configured price ids", () => {
    process.env.STRIPE_PRICE_PRO = "price_pro_123";
    process.env.STRIPE_PRICE_ENTERPRISE = "price_ent_456";

    expect(priceIdForPlan("pro")).toBe("price_pro_123");
    expect(priceIdForPlan("enterprise")).toBe("price_ent_456");
    expect(priceIdForPlan("free")).toBeUndefined();
  });
});
