import { expect, test } from "@playwright/test";

const DEMO = { email: "demo@acme.com", password: "password123" };

async function login(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(DEMO.email);
  await page.getByLabel("Password").fill(DEMO.password);
  await page.getByRole("button", { name: /log in/i }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
}

test.describe("team management", () => {
  test("lists members and shows the invite form", async ({ page }) => {
    await login(page);
    await page.getByRole("link", { name: /team/i }).click();

    await expect(page).toHaveURL(/\/dashboard\/team$/);
    await expect(page.getByRole("heading", { name: /^team$/i })).toBeVisible();
    await expect(page.getByLabel(/invite by email/i)).toBeVisible();
    // Seeded members are present (scoped to the table — the owner's email also
    // appears in the sidebar footer).
    await expect(page.getByRole("table").getByText("sam@acme.com")).toBeVisible();
  });

  test("invites a new member, then removes them", async ({ page }) => {
    await login(page);
    await page.goto("/dashboard/team");

    const email = `e2e-${Date.now()}@example.com`;
    await page.getByLabel(/invite by email/i).fill(email);
    await page.getByRole("button", { name: /send invite/i }).click();

    // New member appears with pending status.
    const row = page.getByRole("row").filter({ hasText: email });
    await expect(row).toBeVisible();
    await expect(row.getByText(/pending/i)).toBeVisible();

    // Remove them again.
    await row.getByRole("button", { name: new RegExp(`remove ${email}`, "i") }).click();
    await expect(page.getByText(email)).toHaveCount(0);
  });

  test("rejects an invalid email", async ({ page }) => {
    await login(page);
    await page.goto("/dashboard/team");

    // "foo@bar" passes the browser's native email check but fails the server
    // regex (no dot in the domain), so the server-side error is what we assert.
    await page.getByLabel(/invite by email/i).fill("foo@bar");
    await page.getByRole("button", { name: /send invite/i }).click();
    await expect(page.getByText(/valid email/i)).toBeVisible();
  });
});
