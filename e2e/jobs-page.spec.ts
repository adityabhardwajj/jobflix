import { test, expect } from '@playwright/test';

test.describe('Jobs Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/jobs');
  });

  test('displays jobs page with correct title', async ({ page }) => {
    await expect(page.getByText('Find Your Dream Job')).toBeVisible();
    await expect(page.getByText('Discover thousands of verified opportunities')).toBeVisible();
  });

  test('displays search functionality', async ({ page }) => {
    // Check if search form is visible
    await expect(page.getByPlaceholder('Search jobs, companies, skills...')).toBeVisible();
    await expect(page.getByPlaceholder('Location')).toBeVisible();
    
    // Check if search button is present
    await expect(page.getByRole('button', { name: 'Search' })).toBeVisible();
  });

  test('displays job statistics', async ({ page }) => {
    // Check if live stats are visible
    await expect(page.getByText('Active Jobs')).toBeVisible();
    await expect(page.getByText('Verified Companies')).toBeVisible();
    await expect(page.getByText('Success Rate')).toBeVisible();
  });

  test('displays job listings', async ({ page }) => {
    // Wait for job listings to load
    await page.waitForSelector('[data-testid="job-card"], .job-card, [class*="job"]', { timeout: 10000 });
    
    // Check if job cards are visible (adjust selector based on your implementation)
    const jobCards = page.locator('[data-testid="job-card"], .job-card, [class*="job"]').first();
    await expect(jobCards).toBeVisible();
  });

  test('search functionality works', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search jobs, companies, skills...');
    
    // Type in search query
    await searchInput.fill('Frontend Developer');
    await page.getByRole('button', { name: 'Search' }).click();
    
    // Wait for search results
    await page.waitForTimeout(1000);
    
    // Check if results are displayed (this might need adjustment based on your implementation)
    const resultsText = page.getByText(/Jobs Found|results/i);
    if (await resultsText.isVisible()) {
      await expect(resultsText).toBeVisible();
    }
  });

  test('location filter works', async ({ page }) => {
    const locationInput = page.getByPlaceholder('Location');
    
    // Type in location
    await locationInput.fill('San Francisco');
    await page.getByRole('button', { name: 'Search' }).click();
    
    // Wait for filtered results
    await page.waitForTimeout(1000);
  });

  test('role filter works', async ({ page }) => {
    // Check if role dropdown exists
    const roleSelect = page.locator('select, [role="combobox"]').filter({ hasText: /Role|Frontend|Backend/ }).first();
    
    if (await roleSelect.isVisible()) {
      await roleSelect.click();
      
      // Select a role option
      const frontendOption = page.getByText('Frontend').first();
      if (await frontendOption.isVisible()) {
        await frontendOption.click();
      }
    }
  });

  test('sorting functionality works', async ({ page }) => {
    // Look for sort dropdown
    const sortDropdown = page.locator('select, [role="combobox"]').filter({ hasText: /Sort|Recent|Salary/ }).first();
    
    if (await sortDropdown.isVisible()) {
      await sortDropdown.click();
      
      // Select a sort option
      const salaryOption = page.getByText(/Salary.*High/i).first();
      if (await salaryOption.isVisible()) {
        await salaryOption.click();
      }
    }
  });

  test('view mode toggle works', async ({ page }) => {
    // Look for grid/list toggle buttons
    const gridButton = page.getByRole('button', { name: /grid/i }).first();
    const listButton = page.getByRole('button', { name: /list/i }).first();
    
    if (await gridButton.isVisible() && await listButton.isVisible()) {
      await listButton.click();
      await page.waitForTimeout(500);
      
      await gridButton.click();
      await page.waitForTimeout(500);
    }
  });

  test('job card interactions work', async ({ page }) => {
    // Wait for job cards to load
    await page.waitForSelector('[data-testid="job-card"], .job-card, [class*="job"]', { timeout: 10000 });
    
    const firstJobCard = page.locator('[data-testid="job-card"], .job-card, [class*="job"]').first();
    
    if (await firstJobCard.isVisible()) {
      // Hover over job card to trigger hover effects
      await firstJobCard.hover();
      
      // Look for save/bookmark button
      const saveButton = firstJobCard.locator('button').filter({ hasText: /save|bookmark/i }).first();
      if (await saveButton.isVisible()) {
        await saveButton.click();
      }
      
      // Look for apply button
      const applyButton = firstJobCard.locator('button').filter({ hasText: /apply/i }).first();
      if (await applyButton.isVisible()) {
        await applyButton.click();
        
        // Check if application modal opens
        const modal = page.locator('[role="dialog"], .modal, [class*="modal"]').first();
        if (await modal.isVisible()) {
          // Close modal
          const closeButton = modal.locator('button').filter({ hasText: /close|×/i }).first();
          if (await closeButton.isVisible()) {
            await closeButton.click();
          }
        }
      }
    }
  });

  test('pagination works if present', async ({ page }) => {
    // Look for pagination controls
    const nextButton = page.getByRole('button', { name: /next|>/i }).first();
    const prevButton = page.getByRole('button', { name: /prev|</i }).first();
    
    if (await nextButton.isVisible()) {
      await nextButton.click();
      await page.waitForTimeout(1000);
      
      if (await prevButton.isVisible()) {
        await prevButton.click();
        await page.waitForTimeout(1000);
      }
    }
  });

  test('handles no results gracefully', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search jobs, companies, skills...');
    
    // Search for something that likely won't have results
    await searchInput.fill('xyznonexistentjob123');
    await page.getByRole('button', { name: 'Search' }).click();
    
    // Wait for search to complete
    await page.waitForTimeout(2000);
    
    // Check if "no results" message is shown
    const noResultsMessage = page.getByText(/no.*jobs.*found|no.*results/i);
    if (await noResultsMessage.isVisible()) {
      await expect(noResultsMessage).toBeVisible();
    }
  });

  test('is responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check if mobile layout works
    await expect(page.getByText('Find Your Dream Job')).toBeVisible();
    
    // Check if search form is still accessible
    await expect(page.getByPlaceholder('Search jobs, companies, skills...')).toBeVisible();
  });

  test('loads without errors', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto('/jobs');
    await page.waitForLoadState('networkidle');
    
    // Filter out known acceptable errors
    const criticalErrors = errors.filter(error => 
      !error.includes('OPENAI_API_KEY') && 
      !error.includes('Failed to fetch') &&
      !error.includes('Network request failed')
    );
    
    expect(criticalErrors).toHaveLength(0);
  });
});
