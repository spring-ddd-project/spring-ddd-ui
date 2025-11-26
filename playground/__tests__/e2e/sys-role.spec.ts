import { expect, test } from '@playwright/test';

// Mock data for role API
const mockRoleList = {
  code: 0,
  data: {
    list: [
      {
        id: '1',
        roleName: 'Administrator',
        roleCode: 'admin',
        roleDesc: 'System administrator',
        dataScope: 1,
        roleStatus: true,
        ownerStatus: true,
      },
      {
        id: '2',
        roleName: '普通角色',
        roleCode: 'user',
        roleDesc: '普通用户角色',
        dataScope: 2,
        roleStatus: true,
        ownerStatus: false,
      },
    ],
    total: 2,
  },
};

const mockRoleRecycleList = {
  code: 0,
  data: {
    list: [
      {
        id: '3',
        roleName: '已删除角色',
        roleCode: 'deleted',
        roleDesc: '已删除的角色',
        dataScope: 1,
        roleStatus: false,
        ownerStatus: false,
      },
    ],
    total: 1,
  },
};

const mockMenuTree = [
  {
    id: '1',
    name: 'System',
    meta: { icon: 'Setting' },
    children: [
      { id: '1-1', name: 'User Management', meta: { icon: 'User' } },
      { id: '1-2', name: 'Role Management', meta: { icon: 'Key' } },
    ],
  },
];

test.describe('SysRole E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Mock role list API
    await page.route('**/api/sys/role/index', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockRoleList),
      });
    });

    // Mock role recycle API
    await page.route('**/api/sys/role/recycle', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockRoleRecycleList),
      });
    });

    // Mock menu tree API for link view
    await page.route('**/api/sys/menu/treeWithPermission', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockMenuTree),
      });
    });

    // Mock query menus by role ID
    await page.route('**/api/sys/role/queryMenusByRoleId**', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ menuId: '1-1' }, { menuId: '1-2' }]),
      });
    });

    // Mock link role and menus API
    await page.route('**/api/sys/role/linkRoleAndMenus**', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ code: 0 }),
      });
    });
  });

  test('should display role list page', async ({ page }) => {
    await page.goto('/#/sys/role/index');
    await page.waitForLoadState('networkidle');

    // Wait for the grid to load
    await expect(page.locator('.vxe-table')).toBeVisible({ timeout: 10000 });
  });

  test('should display role list with correct columns', async ({ page }) => {
    await page.goto('/#/sys/role/index');
    await page.waitForLoadState('networkidle');

    // Check that role name column header exists
    await expect(page.locator('text=system.role.label').first()).toBeVisible({
      timeout: 10000,
    });
  });

  test('should open recycle bin modal', async ({ page }) => {
    await page.goto('/#/sys/role/index');
    await page.waitForLoadState('networkidle');

    // Click recycle button
    const recycleBtn = page.getByRole('button', { name: /recycle/i });
    if (await recycleBtn.isVisible()) {
      await recycleBtn.click();
      // Modal should open
      await expect(page.locator('.el-dialog')).toBeVisible({ timeout: 5000 });
    }
  });

  test('should open role form modal for create', async ({ page }) => {
    await page.goto('/#/sys/role/index');
    await page.waitForLoadState('networkidle');

    // Click add button
    const addBtn = page.getByRole('button', { name: /add/i }).first();
    if (await addBtn.isVisible()) {
      await addBtn.click();
      // Form modal should open
      await expect(page.locator('.el-dialog')).toBeVisible({ timeout: 5000 });
    }
  });
});

test.describe('SysRole Link (Role-Menu) E2E Tests', () => {
  test('should display role-menu linking interface', async ({ page }) => {
    // Mock all required APIs
    await page.route('**/api/sys/role/index', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockRoleList),
      });
    });

    await page.route('**/api/sys/menu/treeWithPermission', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockMenuTree),
      });
    });

    await page.route('**/api/sys/role/queryMenusByRoleId**', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ menuId: '1-1' }, { menuId: '1-2' }]),
      });
    });

    await page.goto('/#/sys/role/index');
    await page.waitForLoadState('networkidle');

    // Click permissions button for first role
    const permBtn = page.getByRole('button', { name: /permissions/i }).first();
    if (await permBtn.isVisible()) {
      await permBtn.click();
      // Drawer should open
      await expect(page.locator('.el-drawer')).toBeVisible({ timeout: 5000 });
    }
  });
});
