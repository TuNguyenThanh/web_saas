import { expect, test } from "@playwright/test";

const DEMO = { email: "demo@acme.com", password: "password123" };

test.describe("marketing + auth flows", () => {
  test("landing page renders hero and CTA", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /ship your saas/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /get started/i }).first()).toBeVisible();
  });

  test("unauthenticated dashboard redirects to login", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login\?next=%2Fdashboard/);
    await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible();
  });

  test("login with demo account reaches the dashboard", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill(DEMO.email);
    await page.getByLabel("Password").fill(DEMO.password);
    await page.getByRole("button", { name: /log in/i }).click();

    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByRole("heading", { name: /welcome back, demo/i })).toBeVisible();
  });

  test("login with wrong password shows an error", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill(DEMO.email);
    await page.getByLabel("Password").fill("definitely-wrong");
    await page.getByRole("button", { name: /log in/i }).click();

    await expect(page.getByText(/invalid email or password/i)).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  test("logout returns to login and re-protects the dashboard", async ({ page }) => {
    // Log in first.
    await page.goto("/login");
    await page.getByLabel("Email").fill(DEMO.email);
    await page.getByLabel("Password").fill(DEMO.password);
    await page.getByRole("button", { name: /log in/i }).click();
    await expect(page).toHaveURL(/\/dashboard$/);

    // Sign out.
    await page.getByRole("button", { name: /sign out/i }).click();
    await expect(page).toHaveURL(/\/login/);

    // Dashboard is protected again.
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });
});
