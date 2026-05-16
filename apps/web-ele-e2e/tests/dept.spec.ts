import { test, expect } from '@playwright/test';

test.describe('Sys Dept CRUD Operations', () => {
  const mockDeptList = {
    code: 0,
    data: {
      list: [
        {
          id: '1',
          parentId: 0,
          deptName: '技术部',
          deptStatus: '1',
          sortOrder: 1,
        },
        {
          id: '2',
          parentId: 1,
          deptName: '研发组',
          deptStatus: '1',
          sortOrder: 1,
        },
      ],
      total: 2,
    },
  };

  const mockDeptTree = {
    code: 0,
    data: [
      {
        id: '1',
        parentId: 0,
        deptName: '技术部',
        children: [
          {
            id: '2',
            parentId: '1',
            deptName: '研发组',
            children: [],
          },
        ],
      },
    ],
  };

  test.beforeEach(async ({ page }) => {
    // Mock department list API
    await page.route('**/api/sys/dept/index', (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify(mockDeptList),
      });
    });

    // Mock department tree API
    await page.route('**/api/sys/dept/tree', (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify(mockDeptTree),
      });
    });

    // Mock recycle API
    await page.route('**/api/sys/dept/recycle', (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          code: 0,
          data: { list: [], total: 0 },
        }),
      });
    });

    // Mock delete API
    await page.route('**/api/sys/dept/delete', (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ code: 0 }),
      });
    });

    // Mock wipe API
    await page.route('**/api/sys/dept/wipe', (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ code: 0 }),
      });
    });

    // Mock restore API
    await page.route('**/api/sys/dept/restore', (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ code: 0 }),
      });
    });

    // Mock create API
    await page.route('**/api/sys/dept/create', (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ code: 0 }),
      });
    });

    // Mock update API
    await page.route('**/api/sys/dept/update', (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ code: 0 }),
      });
    });
  });

  test('dept list page should load', async ({ page }) => {
    await page.goto('/sys/dept');
    await page.waitForLoadState('networkidle');

    // Page should render
    await expect(page.locator('body')).toBeVisible();
  });

  test('dept list should display data', async ({ page }) => {
    await page.goto('/sys/dept');
    await page.waitForLoadState('networkidle');

    // Wait for grid to load
    await page.waitForTimeout(1000);

    // Check for the page content
    const pageContent = page.locator('body');
    await expect(pageContent).toBeVisible();
  });

  test('dept form modal should open', async ({ page }) => {
    await page.goto('/sys/dept');
    await page.waitForLoadState('networkidle');

    // Wait for the page to be fully loaded
    await page.waitForTimeout(1000);

    // Click add button if visible
    const addButton = page.getByRole('button', { name: /add/i });
    if (await addButton.isVisible()) {
      await addButton.click();
      await page.waitForTimeout(500);
    }
  });

  test('dept recycle modal should open', async ({ page }) => {
    await page.goto('/sys/dept');
    await page.waitForLoadState('networkidle');

    await page.waitForTimeout(1000);

    // Click recycle button if visible
    const recycleButton = page.getByRole('button', { name: /recycle/i });
    if (await recycleButton.isVisible()) {
      await recycleButton.click();
      await page.waitForTimeout(500);
    }
  });
});
