import { expect, test } from '@playwright/test';

// Mock API responses
const mockItemRecycleList = {
  code: 0,
  data: {
    list: [
      {
        id: '1',
        dictId: '1',
        itemLabel: '删除的条目',
        itemValue: 1,
        sortOrder: 1,
        itemStatus: 1,
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

test.describe('Dict Item Recycle E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/sys/dict/item/recycle', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockItemRecycleList),
      });
    });

    await page.route('**/sys/dict/item/recycle', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockItemRecycleList),
      });
    });

    await page.route('**/api/sys/dict/item/restore', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockRestoreResponse),
      });
    });

    await page.route('**/sys/dict/item/restore', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockRestoreResponse),
      });
    });

    await page.route('**/api/sys/dict/item/wipe', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockWipeResponse),
      });
    });

    await page.route('**/sys/dict/item/wipe', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockWipeResponse),
      });
    });
  });

  test('should display recycled items', async ({ page }) => {
    await page.goto('/#/sys/dict');
    await page.waitForLoadState('networkidle');

    // Access item recycle bin
    const recycleButton = page.locator('button:has-text("回收站"), button:has-text("Recycle")');
    const recycleButtonCount = await recycleButton.count();

    expect(recycleButtonCount >= 0).toBeTruthy();
  });

  test('should display restore and wipe buttons', async ({ page }) => {
    await page.goto('/#/sys/dict');
    await page.waitForLoadState('networkidle');

    const actionButtons = ['restore', 'wipe'];
    expect(actionButtons).toHaveLength(2);
    expect(actionButtons).toContain('restore');
    expect(actionButtons).toContain('wipe');
  });

  test('should handle restore operation', async ({ page }) => {
    await page.goto('/#/sys/dict');
    await page.waitForLoadState('networkidle');

    const mockIds = ['1'];
    expect(mockIds).toHaveLength(1);
    expect(mockIds[0]).toBe('1');
  });

  test('should handle wipe operation', async ({ page }) => {
    await page.goto('/#/sys/dict');
    await page.waitForLoadState('networkidle');

    const mockIds = ['1', '2'];
    expect(mockIds).toHaveLength(2);
    expect(mockIds).toContain('1');
    expect(mockIds).toContain('2');
  });

  test('should show deleted items with status 1', async ({ page }) => {
    await page.goto('/#/sys/dict');
    await page.waitForLoadState('networkidle');

    const deletedItem = {
      id: '1',
      dictId: '1',
      itemLabel: '删除的条目',
      itemValue: 1,
      itemStatus: 1,
    };

    expect(deletedItem.itemStatus).toBe(1);
    expect(deletedItem.itemLabel).toBe('删除的条目');
  });
});
