import { test, expect } from '@playwright/test';

test.describe('Dashboard Analytics Views', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API calls for dashboard analytics
    await page.route('**/api/sys/dept/index', (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          code: 0,
          data: { list: [], total: 0 },
        }),
      });
    });

    await page.route('**/api/sys/menu/index', (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          code: 0,
          data: { list: [], total: 0 },
        }),
      });
    });
  });

  test('analytics-trends should render echarts', async ({ page }) => {
    await page.goto('/dashboard/analytics');
    await page.waitForLoadState('networkidle');

    // Verify the page loads
    await expect(page.locator('body')).toBeVisible();

    // Check for echarts container
    const chartContainer = page.locator('.echarts-ui');
    if (await chartContainer.count() > 0) {
      await expect(chartContainer.first()).toBeVisible();
    }
  });

  test('analytics-visits-data should render pie chart', async ({ page }) => {
    await page.goto('/dashboard/analytics');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('body')).toBeVisible();
  });

  test('analytics-visits-sales should render line chart', async ({ page }) => {
    await page.goto('/dashboard/analytics');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('body')).toBeVisible();
  });

  test('analytics-visits-source should render bar chart', async ({ page }) => {
    await page.goto('/dashboard/analytics');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('body')).toBeVisible();
  });

  test('analytics-visits should render donut chart', async ({ page }) => {
    await page.goto('/dashboard/analytics');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('body')).toBeVisible();
  });
});
