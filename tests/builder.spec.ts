import { test, expect } from "@playwright/test";

test("User can create and save a room", async ({ page }) => {
  // Go directly to builder page (after login)
  await page.goto("http://localhost:3000/builder");

  // Wait for page load
  await expect(page.locator("text=Theme")).toBeVisible();

  // Open room details modal
  await page.click("button:has-text('Room Details')");
  await page.fill('input[id="roomName"]', "Test Room");
  await page.fill('textarea[id="roomDescription"]', "Automated test room");
  await page.click("button:has-text('Save')");

  // Add an object
  await page.click("button:has-text('Add Object')");
  const object = page.locator(".object").first();
  await expect(object).toBeVisible();

  // Click save room
  await page.click("button:has-text('Save Room')");

  // Wait for success alert
  await page.waitForTimeout(1000); // or detect an alert box
  console.log("✅ Room creation test passed");
});

