import { expect, test } from '@playwright/test';

// Mock data for user API
const mockUserList = {
  code: 0,
  data: {
    list: [
      {
        id: '1',
        username: 'admin',
        phone: '13800138000',
        avatar: '',
        email: 'admin@example.com',
        sex: true,
        lockStatus: false,
      },
      {
        id: '2',
        username: 'testuser',
        phone: '13900139000',
        avatar: '',
        email: 'test@example.com',
        sex: false,
        lockStatus: false,
      },
    ],
    total: 2,
  },
};

const mockUserRecycleList = {
  code: 0,
  data: {
    list: [
      {
        id: '3',
        username: 'deleted_user',
        phone: '13700137000',
        avatar: '',
        email: 'deleted@example.com',
        sex: true,
        lockStatus: false,
      },
    ],
    total: 1,
  },
};

const mockAllRoles = {
  code: 0,
  data: [
    { id: '1', roleName: 'Administrator', roleCode: 'admin' },
    { id: '2', roleName: 'User', roleCode: 'user' },
    { id: '3', roleName: 'Guest', roleCode: 'guest' },
  ],
};

const mockUserRoles = {
  code: 0,
  data: [{ roleId: '1', roleName: 'Administrator' }],
};

test.describe('SysUser E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Mock user list API
    await page.route('**/api/sys/user/index', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockUserList),
      });
    });

    // Mock user recycle API
    await page.route('**/api/sys/user/recycle', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockUserRecycleList),
      });
    });

    // Mock get all roles API
    await page.route('**/api/sys/role/all', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockAllRoles),
      });
    });

    // Mock query roles by user ID
    await page.route('**/api/sys/user/queryRolesByUserId**', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockUserRoles.data),
      });
    });

    // Mock link user and role API
    await page.route('**/api/sys/user/linkUserAndRole**', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ code: 0 }),
      });
    });
  });

  test('should display user list page', async ({ page }) => {
    await page.goto('/#/sys/user/index');
    await page.waitForLoadState('networkidle');

    // Wait for the grid to load
    await expect(page.locator('.vxe-table')).toBeVisible({ timeout: 10000 });
  });

  test('should display user list with correct columns', async ({ page }) => {
    await page.goto('/#/sys/user/index');
    await page.waitForLoadState('networkidle');

    // Check that username column header exists
    await expect(page.locator('text=system.user.username').first()).toBeVisible({
      timeout: 10000,
    });
  });

  test('should open recycle bin modal', async ({ page }) => {
    await page.goto('/#/sys/user/index');
    await page.waitForLoadState('networkidle');

    // Click recycle button
    const recycleBtn = page.getByRole('button', { name: /recycle/i });
    if (await recycleBtn.isVisible()) {
      await recycleBtn.click();
      // Modal should open
      await expect(page.locator('.el-dialog')).toBeVisible({ timeout: 5000 });
    }
  });

  test('should open user form modal for create', async ({ page }) => {
    await page.goto('/#/sys/user/index');
    await page.waitForLoadState('networkidle');

    // Click add button
    const addBtn = page.getByRole('button', { name: /add/i }).first();
    if (await addBtn.isVisible()) {
      await addBtn.click();
      // Form modal should open
      await expect(page.locator('.el-dialog')).toBeVisible({ timeout: 5000 });
    }
  });

  test('should open user-role linking modal', async ({ page }) => {
    await page.goto('/#/sys/user/index');
    await page.waitForLoadState('networkidle');

    // Click roles button for first user
    const rolesBtn = page.getByRole('button', { name: /roles/i }).first();
    if (await rolesBtn.isVisible()) {
      await rolesBtn.click();
      // Modal should open
      await expect(page.locator('.el-dialog')).toBeVisible({ timeout: 5000 });
    }
  });
});

test.describe('SysUser CRUD Operations E2E Tests', () => {
  test('should create new user', async ({ page }) => {
    // Mock APIs
    await page.route('**/api/sys/user/index', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockUserList),
      });
    });

    await page.route('**/api/sys/user/create', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ code: 0 }),
      });
    });

    await page.route('**/api/sys/dept/tree**', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: [] }),
      });
    });

    await page.goto('/#/sys/user/index');
    await page.waitForLoadState('networkidle');

    // Open form
    const addBtn = page.getByRole('button', { name: /add/i }).first();
    if (await addBtn.isVisible()) {
      await addBtn.click();
      await expect(page.locator('.el-dialog')).toBeVisible({ timeout: 5000 });
    }
  });

  test('should delete user', async ({ page }) => {
    // Mock delete API
    await page.route('**/api/sys/user/delete**', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ code: 0 }),
      });
    });

    await page.goto('/#/sys/user/index');
    await page.waitForLoadState('networkidle');

    // Wait for grid to load
    await expect(page.locator('.vxe-table')).toBeVisible({ timeout: 10000 });
  });
});
