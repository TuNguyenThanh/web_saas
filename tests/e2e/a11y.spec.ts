import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const DEMO = { email: "demo@acme.com", password: "password123" };

/** WCAG 2.1 A/AA tags — the bar we hold the UI to. */
const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

async function scan(page: import("@playwright/test").Page) {
  return new AxeBuilder({ page }).withTags(TAGS).analyze();
}

test.describe("accessibility", () => {
  test("landing page has no WCAG A/AA violations", async ({ page }) => {
    await page.goto("/");
    const { violations } = await scan(page);
    expect(violations).toEqual([]);
  });

  test("login page has no WCAG A/AA violations", async ({ page }) => {
    await page.goto("/login");
    const { violations } = await scan(page);
    expect(violations).toEqual([]);
  });

  test("dashboard has no WCAG A/AA violations", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill(DEMO.email);
    await page.getByLabel("Password").fill(DEMO.password);
    await page.getByRole("button", { name: /log in/i }).click();
    await expect(page).toHaveURL(/\/dashboard$/);

    // Re-load the dashboard directly so axe scans a fully server-rendered
    // document (with its <title>), not a transient client-navigation DOM.
    await page.goto("/dashboard");
    await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible();

    const { violations } = await scan(page);
    expect(violations).toEqual([]);
  });
});
