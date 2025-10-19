import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:3000";
const TEST_USERNAME = `testuser_${Date.now()}`;
const TEST_PASSWORD = "password123";


test("User login flow - Navigate to builder and login", async ({ page }) => {
  // Setup: Create a test user first via API
  const loginUsername = `loginuser_${Date.now()}`;
  const loginPassword = "loginpass123";
  
  const signupResponse = await page.request.post(BASE_URL + "/api/users", {
    headers: { "Content-Type": "application/json" },
    data: { 
      username: loginUsername, 
      password: loginPassword, 
      role: "BUILDER" 
    },
  });
  
  expect(signupResponse.ok()).toBeTruthy();
  console.log(`  Created test user: ${loginUsername}`);
  
  // Step 1: Navigate to home page
  await page.goto(BASE_URL);
  await expect(page).toHaveURL(BASE_URL + "/");
  console.log("Navigated to home page");
  
  // Step 2: Click on Builder Mode to navigate to builder page
  await page.click('a[href="/builder"]');
  await expect(page).toHaveURL(BASE_URL + "/builder");
  console.log("Navigated to builder page");
  
  // Step 3: Verify signin form is displayed (default is login mode)
  await expect(page.locator("text=Sign In to Build")).toBeVisible();
  await expect(page.locator('input[placeholder="Enter username"]')).toBeVisible();
  await expect(page.locator('input[placeholder="Enter password"]')).toBeVisible();
  await expect(page.locator('button:has-text("Login")')).toBeVisible();
  console.log("  Login form is visible");
  
  // Step 4: Fill out the login form with existing credentials
  await page.fill('input[placeholder="Enter username"]', loginUsername);
  await page.fill('input[placeholder="Enter password"]', loginPassword);
  console.log(`  Filled login form with username: ${loginUsername}`);
  
  // Step 5: Submit the login form
  await page.click('button:has-text("Login")');
  console.log("  Clicked Login button");
  
  // Step 6: Wait for authentication to complete
  await page.waitForTimeout(1000);
  
  // Step 7: Verify user is authenticated by checking localStorage
  const user = await page.evaluate(() => localStorage.getItem("user"));
  expect(user).toBeTruthy();
  console.log("  User data stored in localStorage");
  
  // Step 8: Parse and verify user data
  if (user) {
    const userData = JSON.parse(user);
    expect(userData.username).toBe(loginUsername);
    expect(userData.role).toBe("BUILDER");
    console.log(`  User logged in successfully: ${userData.username} (Role: ${userData.role})`);
  }
  
  console.log("Login test completed successfully!");
});
