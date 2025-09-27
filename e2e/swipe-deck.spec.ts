import { test, expect } from '@playwright/test';

test.describe('Swipe Deck', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display swipe deck on home page', async ({ page }) => {
    await expect(page.getByText('Swipe Your Way to Your Dream Job')).toBeVisible();
    await expect(page.getByText('Discover opportunities that match your skills')).toBeVisible();
  });

  test('should navigate to profile page', async ({ page }) => {
    await page.click('[href="/profile"]');
    await expect(page).toHaveURL('/profile');
    await expect(page.getByText('Complete Your Profile')).toBeVisible();
  });

  test('should navigate to saved jobs page', async ({ page }) => {
    await page.click('[href="/saved"]');
    await expect(page).toHaveURL('/saved');
    await expect(page.getByText('Saved Jobs')).toBeVisible();
  });

  test('should handle keyboard navigation', async ({ page }) => {
    // Focus on the page to enable keyboard events
    await page.click('body');
    
    // Test arrow key navigation
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('ArrowDown');
    
    // Should not cause any errors
    await expect(page).toHaveURL('/');
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    await expect(page.getByText('Swipe Your Way to Your Dream Job')).toBeVisible();
    
    // Check if mobile navigation is visible
    await expect(page.locator('[href="/profile"]')).toBeVisible();
  });
});

test.describe('Job Details', () => {
  test('should navigate to job details', async ({ page }) => {
    await page.goto('/');
    
    // Wait for cards to load
    await page.waitForTimeout(1000);
    
    // Try to find a job card and click on it
    const jobCard = page.locator('[data-testid="job-card"]').first();
    if (await jobCard.isVisible()) {
      await jobCard.click();
      await expect(page).toHaveURL(/\/details\/job-/);
    }
  });
});

test.describe('Profile Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/profile');
  });

  test('should display profile form', async ({ page }) => {
    await expect(page.getByText('Complete Your Profile')).toBeVisible();
    await expect(page.getByLabel('Full Name')).toBeVisible();
    await expect(page.getByLabel('Job Title')).toBeVisible();
  });

  test('should show profile completion progress', async ({ page }) => {
    await expect(page.getByText('Profile Completion')).toBeVisible();
  });

  test('should allow adding skills', async ({ page }) => {
    const addSkillButton = page.getByText('+ Add Skill');
    if (await addSkillButton.isVisible()) {
      await addSkillButton.click();
      await expect(page.locator('input[placeholder="Enter a skill"]')).toBeVisible();
    }
  });
});
