import { test, expect } from "@playwright/test";

test("User can sign in successfully", async ({ page }) => {
  // Go to home page
  await page.goto("http://localhost:3000/");

  // Wait for SigninBuilder to appear
  await expect(page.locator("text=Sign In")).toBeVisible();

  // Fill out the form
  await page.fill('input[name="username"]', "testuser");
  await page.fill('input[name="password"]', "password123");

  // Click login
  await page.click("button:has-text('Sign In')");

  // Wait for redirect or success message
  await page.waitForURL("**/builder");
  await expect(page).toHaveURL(/.*builder/);

  console.log("✅ User login test passed");
});
