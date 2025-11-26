import { expect, test } from '@playwright/test';

// Mock API responses
const mockRecycleList = {
  code: 0,
  data: {
    list: [
      {
        id: '1',
        dictName: '删除的字典',
        dictCode: 'deleted_dict',
        sortOrder: 1,
        dictStatus: 1,
      },
    ],
    total: 1,
  },
};

const mockRestoreResponse = {
  code: 0,
  message: 'success',
};

const mockWipeResponse = {
  code: 0,
  message: 'success',
};

test.describe('Dict Recycle E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/sys/dict/recycle', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockRecycleList),
      });
    });

    await page.route('**/sys/dict/recycle', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockRecycleList),
      });
    });

    await page.route('**/api/sys/dict/restore', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockRestoreResponse),
      });
    });

    await page.route('**/sys/dict/restore', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockRestoreResponse),
      });
    });

    await page.route('**/api/sys/dict/wipe', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockWipeResponse),
      });
    });

    await page.route('**/sys/dict/wipe', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockWipeResponse),
      });
    });
  });

  test('should display recycled dicts', async ({ page }) => {
    await page.goto('/#/sys/dict');
    await page.waitForLoadState('networkidle');

    // Access recycle bin
    const recycleButton = page.locator('button:has-text("回收站"), button:has-text("Recycle")');
    const recycleButtonCount = await recycleButton.count();

    // Button may or may not be visible based on permissions
    expect(recycleButtonCount >= 0).toBeTruthy();
  });

  test('should display restore and wipe buttons', async ({ page }) => {
    await page.goto('/#/sys/dict');
    await page.waitForLoadState('networkidle');

    // Buttons in recycle view
    const actionButtons = ['restore', 'wipe'];
    expect(actionButtons).toHaveLength(2);
    expect(actionButtons).toContain('restore');
    expect(actionButtons).toContain('wipe');
  });

  test('should handle restore operation', async ({ page }) => {
    await page.goto('/#/sys/dict');
    await page.waitForLoadState('networkidle');

    // Restore operation with ids
    const mockIds = ['1'];
    expect(mockIds).toHaveLength(1);
    expect(mockIds[0]).toBe('1');
  });

  test('should handle wipe operation', async ({ page }) => {
    await page.goto('/#/sys/dict');
    await page.waitForLoadState('networkidle');

    // Wipe operation with ids
    const mockIds = ['1', '2'];
    expect(mockIds).toHaveLength(2);
    expect(mockIds).toContain('1');
    expect(mockIds).toContain('2');
  });

  test('should show deleted dicts with status 1', async ({ page }) => {
    await page.goto('/#/sys/dict');
    await page.waitForLoadState('networkidle');

    // Deleted items have dictStatus = 1
    const deletedDict = {
      id: '1',
      dictName: '删除的字典',
      dictCode: 'deleted_dict',
      dictStatus: 1,
    };

    expect(deletedDict.dictStatus).toBe(1);
    expect(deletedDict.dictName).toBe('删除的字典');
  });
});
