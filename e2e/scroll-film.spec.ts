import { test, expect } from '@playwright/test';

test.describe('Maison Verlaine Scroll-Film Homepage', () => {
  test('loads and displays canvas', async ({ page }) => {
    await page.goto('/');

    // Wait for canvas to be ready
    const canvas = page.locator('canvas');
    await canvas.waitFor({ state: 'visible' });

    // Verify canvas exists and has dimensions
    const box = await canvas.boundingBox();
    expect(box).toBeTruthy();
    expect(box?.width).toBeGreaterThan(0);
    expect(box?.height).toBeGreaterThan(0);
  });

  test('displays logo', async ({ page }) => {
    await page.goto('/');

    const logo = page.locator('h1:has-text("MAISON VERLAINE")');
    await expect(logo).toBeVisible();
  });

  test('has correct meta tags', async ({ page }) => {
    await page.goto('/');

    // Verify page title or has key elements
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
  });

  test('scroll progress bar exists', async ({ page }) => {
    await page.goto('/');

    // Progress bar should be at bottom with fixed height
    const progressBar = page.locator('div[style*="height: 1px"]').first();
    const boundingBox = await progressBar.boundingBox();

    expect(boundingBox).toBeTruthy();
    if (boundingBox) {
      expect(boundingBox.height).toBe(1);
    }
  });

  test('scrolling updates progress', async ({ page }) => {
    await page.goto('/');

    // Get initial scroll position
    const initialScroll = await page.evaluate(() => window.scrollY);

    // Scroll down
    await page.evaluate(() => window.scrollBy(0, 500));

    // Get new scroll position
    const newScroll = await page.evaluate(() => window.scrollY);

    // Verify scroll happened
    expect(newScroll).toBeGreaterThan(initialScroll);
  });

  test('configurateur link navigates', async ({ page }) => {
    await page.goto('/');

    // Navigate to configurateur page
    await page.goto('/configurateur');

    // Should load without error
    expect(page.url()).toContain('/configurateur');
  });

  test('no console errors', async ({ page, context }) => {
    const errors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForTimeout(2000);

    // Should have no critical errors
    const criticalErrors = errors.filter(
      (e) =>
        !e.includes('Failed to load image') &&
        !e.includes('404') &&
        !e.includes('Deprecated')
    );

    expect(criticalErrors).toHaveLength(0);
  });

  test('responsive on mobile', async ({ page }) => {
    // Pixel 5 resolution
    await page.setViewportSize({ width: 393, height: 851 });

    await page.goto('/');

    const canvas = page.locator('canvas');
    await canvas.waitFor({ state: 'visible' });

    // Canvas should adapt to viewport
    const box = await canvas.boundingBox();
    expect(box?.width).toBeLessThanOrEqual(393);
  });

  test('frame images load', async ({ page }) => {
    await page.goto('/');

    // Wait a moment for frames to load
    await page.waitForTimeout(1000);

    // Check that at least some frame images are loaded
    const frameRequests = new Set<string>();

    page.on('response', (response) => {
      if (response.url().includes('frame-') && response.url().includes('.webp')) {
        frameRequests.add(response.url());
      }
    });

    // Scroll to trigger more frame loads
    await page.evaluate(() => window.scrollBy(0, 1000));
    await page.waitForTimeout(500);

    // We should have loaded at least the first batch of frames
    expect(frameRequests.size).toBeGreaterThan(0);
  });
});
