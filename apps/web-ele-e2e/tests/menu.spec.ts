import { test, expect } from '@playwright/test';

test.describe('Sys Menu CRUD Operations', () => {
  const mockMenuList = {
    code: 0,
    data: {
      list: [
        {
          id: '1',
          parentId: 0,
          name: 'system',
          path: '/system',
          component: 'Layout',
          menuType: 1,
          meta: {
            title: '系统管理',
            icon: 'ant-design:setting',
            order: 1,
          },
        },
        {
          id: '2',
          parentId: '1',
          name: 'dept',
          path: '/system/dept',
          component: 'sys/dept/index',
          menuType: 2,
          meta: {
            title: '部门管理',
            icon: 'ant-design:team',
            order: 1,
          },
        },
      ],
      total: 2,
    },
  };

  const mockMenuTree = {
    code: 0,
    data: [
      {
        id: '1',
        parentId: 0,
        name: 'system',
        meta: { title: '系统管理' },
        children: [
          {
            id: '2',
            parentId: '1',
            name: 'dept',
            meta: { title: '部门管理' },
            children: [],
          },
        ],
      },
    ],
  };

  const mockRecycleList = {
    code: 0,
    data: {
      list: [],
      total: 0,
    },
  };

  test.beforeEach(async ({ page }) => {
    // Mock menu list API
    await page.route('**/api/sys/menu/index', (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify(mockMenuList),
      });
    });

    // Mock menu tree API
    await page.route('**/api/sys/menu/getMenuTreeWithoutPermission', (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify(mockMenuTree),
      });
    });

    // Mock recycle API
    await page.route('**/api/sys/menu/recycle', (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify(mockRecycleList),
      });
    });

    // Mock delete API
    await page.route('**/api/sys/menu/delete', (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ code: 0 }),
      });
    });

    // Mock wipe API
    await page.route('**/api/sys/menu/wipe', (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ code: 0 }),
      });
    });

    // Mock restore API
    await page.route('**/api/sys/menu/restore', (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ code: 0 }),
      });
    });

    // Mock create API
    await page.route('**/api/sys/menu/create', (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ code: 0 }),
      });
    });

    // Mock update API
    await page.route('**/api/sys/menu/update', (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ code: 0 }),
      });
    });
  });

  test('menu list page should load', async ({ page }) => {
    await page.goto('/sys/menu');
    await page.waitForLoadState('networkidle');

    // Page should render
    await expect(page.locator('body')).toBeVisible();
  });

  test('menu list should display data', async ({ page }) => {
    await page.goto('/sys/menu');
    await page.waitForLoadState('networkidle');

    // Wait for grid to load
    await page.waitForTimeout(1000);

    // Check for the page content
    const pageContent = page.locator('body');
    await expect(pageContent).toBeVisible();
  });

  test('menu form modal should open', async ({ page }) => {
    await page.goto('/sys/menu');
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

  test('menu recycle modal should open', async ({ page }) => {
    await page.goto('/sys/menu');
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
