const { test, expect } = require('@playwright/test');

test.describe('Maison Verlaine Scroll-Film Homepage', () => {
  test('homepage loads', async ({ page }) => {
    await page.goto('/');
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
  });

  test('canvas renders', async ({ page }) => {
    await page.goto('/');
    const canvas = page.locator('canvas');
    await canvas.waitFor({ state: 'visible' });
    const box = await canvas.boundingBox();
    expect(box).toBeTruthy();
  });

  test('mobile responsive', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    const canvas = page.locator('canvas');
    await canvas.waitFor({ state: 'visible' });
    expect(canvas).toBeVisible();
  });

  test('no critical errors', async ({ page }) => {
    const errors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.goto('/');
    await page.waitForTimeout(1000);
    expect(errors.length).toBe(0);
  });
});
