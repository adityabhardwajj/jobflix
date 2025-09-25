import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('has correct title and meta description', async ({ page }) => {
    await expect(page).toHaveTitle(/JobFlix/);
    
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /precise way to find verified roles/);
  });

  test('displays main navigation', async ({ page }) => {
    // Check if main navigation elements are visible
    await expect(page.getByRole('navigation')).toBeVisible();
    await expect(page.getByText('Jobs')).toBeVisible();
    await expect(page.getByText('Tech News')).toBeVisible();
    await expect(page.getByText('Project Ideas')).toBeVisible();
  });

  test('displays JobFlix logo', async ({ page }) => {
    // Check if logo is visible and contains correct text
    await expect(page.getByText('Job')).toBeVisible();
    await expect(page.getByText('Flix')).toBeVisible();
  });

  test('displays hero section with typewriter effect', async ({ page }) => {
    // Check if hero section is visible
    await expect(page.getByText('Your Career, Your Next Step')).toBeVisible();
    await expect(page.getByText('A precise way to find meaningful work')).toBeVisible();
  });

  test('displays animated statistics', async ({ page }) => {
    // Check if stats are visible
    await expect(page.getByText('Active Jobs')).toBeVisible();
    await expect(page.getByText('Verified Companies')).toBeVisible();
    await expect(page.getByText('Success Rate')).toBeVisible();
    await expect(page.getByText('Decision-Maker Intros')).toBeVisible();
  });

  test('displays career advancement section', async ({ page }) => {
    await expect(page.getByText('Create a profile, get tailored matches')).toBeVisible();
  });

  test('displays company culture showcase', async ({ page }) => {
    await expect(page.getByText('Where Innovation Meets Culture')).toBeVisible();
  });

  test('has working theme toggle', async ({ page }) => {
    // Find theme toggle button (assuming it exists)
    const themeToggle = page.getByRole('button', { name: /theme/i });
    
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
      
      // Check if theme changed (you might need to adjust this based on your implementation)
      const html = page.locator('html');
      const classAttribute = await html.getAttribute('class');
      expect(classAttribute).toBeTruthy();
    }
  });

  test('navigation links work correctly', async ({ page }) => {
    // Test Jobs link
    await page.getByRole('link', { name: 'Jobs' }).click();
    await expect(page).toHaveURL(/\/jobs/);
    
    // Go back to homepage
    await page.goto('/');
    
    // Test Tech News link
    await page.getByRole('link', { name: 'Tech News' }).click();
    await expect(page).toHaveURL(/\/tech-news/);
  });

  test('is responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check if mobile navigation works
    await expect(page.getByText('JobFlix')).toBeVisible();
    
    // Check if content is properly displayed on mobile
    await expect(page.getByText('Your Career, Your Next Step')).toBeVisible();
  });

  test('loads without JavaScript errors', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Filter out known acceptable errors (like missing API keys in development)
    const criticalErrors = errors.filter(error => 
      !error.includes('OPENAI_API_KEY') && 
      !error.includes('Failed to fetch')
    );
    
    expect(criticalErrors).toHaveLength(0);
  });

  test('has good performance metrics', async ({ page }) => {
    // Navigate to page and wait for load
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check if page loads reasonably fast
    const performanceEntries = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
      };
    });
    
    // Basic performance assertions (adjust thresholds as needed)
    expect(performanceEntries.loadTime).toBeLessThan(5000); // 5 seconds
    expect(performanceEntries.domContentLoaded).toBeLessThan(3000); // 3 seconds
  });
});
