import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:3000";
const TEST_USERNAME = `testuser_${Date.now()}`;
const TEST_PASSWORD = "password123";

test("User signup flow - Navigate to builder and sign up", async ({ page }) => {
  // Step 1: Navigate to home page
  await page.goto(BASE_URL);
  await expect(page).toHaveURL(BASE_URL + "/");
  console.log(" Navigated to home page");
  
  // Step 2: Click on Builder Mode to navigate to builder page
  await page.click('a[href="/builder"]');
  await expect(page).toHaveURL(BASE_URL + "/builder");
  console.log(" Navigated to builder page");
  
  // Step 3: Verify signin form is displayed (default is login mode)
  await expect(page.locator("text=Sign In to Build")).toBeVisible();
  console.log(" Sign in form is visible");
  
  // Step 4: Locate and click "Sign up" button to switch to signup mode
  await page.click('button:has-text("Sign up")');
  console.log("Clicked Sign up button");
  
  // Step 5: Verify signup form is now displayed
  await expect(page.locator("text=Create an Account")).toBeVisible();
  await expect(page.locator('input[placeholder="Enter username"]')).toBeVisible();
  await expect(page.locator('input[placeholder="Enter password"]')).toBeVisible();
  await expect(page.locator('button:has-text("Sign Up")')).toBeVisible();
  console.log(" Signup form is visible");
  
  // Step 6: Fill out the signup form
  await page.fill('input[placeholder="Enter username"]', TEST_USERNAME);
  await page.fill('input[placeholder="Enter password"]', TEST_PASSWORD);
  console.log(` Filled form with username: ${TEST_USERNAME}`);
  
  // Step 7: Submit the signup form
  await page.click('button:has-text("Sign Up")');
  console.log(" Clicked Sign Up button");
  
  // Step 8: Wait for authentication to complete
  await page.waitForTimeout(1000);
  
  // Step 9: Verify user is authenticated by checking localStorage
  const user = await page.evaluate(() => localStorage.getItem("user"));
  expect(user).toBeTruthy();
  console.log(" User data stored in localStorage");
  
  // Step 10: Parse and verify user data
  if (user) {
    const userData = JSON.parse(user);
    expect(userData.username).toBe(TEST_USERNAME);
    expect(userData.role).toBe("BUILDER");
    console.log(`User signed up successfully: ${userData.username} (Role: ${userData.role})`);
  }
  
  console.log("Signup test completed successfully!");
});