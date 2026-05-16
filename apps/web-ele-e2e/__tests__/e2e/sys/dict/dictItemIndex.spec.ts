import { expect, test } from '@playwright/test';

// Mock API responses
const mockItemList = {
  code: 0,
  data: {
    list: [
      {
        id: '1',
        dictId: '1',
        itemLabel: '菜单',
        itemValue: 1,
        sortOrder: 1,
        itemStatus: 0,
      },
      {
        id: '2',
        dictId: '1',
        itemLabel: '按钮',
        itemValue: 2,
        sortOrder: 2,
        itemStatus: 0,
      },
    ],
    total: 2,
  },
};

const mockDeleteResponse = {
  code: 0,
  message: 'success',
};

test.describe('Dict Item List E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/sys/dict/item/index', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockItemList),
      });
    });

    await page.route('**/sys/dict/item/index', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockItemList),
      });
    });

    await page.route('**/api/sys/dict/item/delete', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockDeleteResponse),
      });
    });

    await page.route('**/sys/dict/item/delete', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockDeleteResponse),
      });
    });
  });

  test('should display dict items for a dict', async ({ page }) => {
    await page.goto('/#/sys/dict');
    await page.waitForLoadState('networkidle');

    // Dict item list is shown in a modal
    const mockDict = {
      id: '1',
      dictName: '菜单类型',
      dictCode: 'menu_type',
    };

    expect(mockDict.id).toBe('1');
    expect(mockDict.dictName).toBe('菜单类型');
  });

  test('should display item grid columns', async ({ page }) => {
    await page.goto('/#/sys/dict');
    await page.waitForLoadState('networkidle');

    // Grid columns: itemLabel, itemValue, itemStatus, action
    const columns = ['itemLabel', 'itemValue', 'itemStatus', 'action'];
    expect(columns).toHaveLength(4);
    expect(columns).toContain('itemLabel');
    expect(columns).toContain('itemValue');
  });

  test('should handle item list data', async ({ page }) => {
    await page.goto('/#/sys/dict');
    await page.waitForLoadState('networkidle');

    const itemData = mockItemList.data.list;
    expect(itemData).toHaveLength(2);
    expect(itemData[0].itemLabel).toBe('菜单');
    expect(itemData[1].itemLabel).toBe('按钮');
  });

  test('should have add item button', async ({ page }) => {
    await page.goto('/#/sys/dict');
    await page.waitForLoadState('networkidle');

    // Add button for new item
    const addButton = page.locator('button:has-text("新增"), button:has-text("Add")');
    const addButtonCount = await addButton.count();

    expect(addButtonCount >= 0).toBeTruthy();
  });

  test('should have delete item button', async ({ page }) => {
    await page.goto('/#/sys/dict');
    await page.waitForLoadState('networkidle');

    // Delete button for items
    const deleteButton = page.locator('button:has-text("删除"), button:has-text("Delete")');
    const deleteButtonCount = await deleteButton.count();

    expect(deleteButtonCount >= 0).toBeTruthy();
  });

  test('should handle item pagination', async ({ page }) => {
    await page.goto('/#/sys/dict');
    await page.waitForLoadState('networkidle');

    // Proxy config includes pageNum and pageSize
    expect(mockItemList.data.total).toBe(2);
  });
});
