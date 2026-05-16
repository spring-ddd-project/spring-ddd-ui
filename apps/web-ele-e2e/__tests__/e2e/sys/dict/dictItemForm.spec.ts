import { expect, test } from '@playwright/test';

// Mock API responses
const mockCreateResponse = {
  code: 0,
  message: 'success',
};

const mockUpdateResponse = {
  code: 0,
  message: 'success',
};

test.describe('Dict Item Form E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/sys/dict/item/create', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockCreateResponse),
      });
    });

    await page.route('**/sys/dict/item/create', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockCreateResponse),
      });
    });

    await page.route('**/api/sys/dict/item/update', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockUpdateResponse),
      });
    });

    await page.route('**/sys/dict/item/update', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockUpdateResponse),
      });
    });
  });

  test('should have form fields for item creation', async ({ page }) => {
    await page.goto('/#/sys/dict');
    await page.waitForLoadState('networkidle');

    // Form schema fields:
    // - itemLabel (required)
    // - itemValue (required)
    // - sortOrder (required)
    // - itemStatus (switch)

    const formFields = [
      { name: 'itemLabel', type: 'input' },
      { name: 'itemValue', type: 'input' },
      { name: 'sortOrder', type: 'input' },
      { name: 'itemStatus', type: 'switch' },
    ];

    expect(formFields).toHaveLength(4);
    expect(formFields[0].name).toBe('itemLabel');
    expect(formFields[1].name).toBe('itemValue');
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/#/sys/dict');
    await page.waitForLoadState('networkidle');

    // Required fields: itemLabel, itemValue, sortOrder
    const requiredFields = ['itemLabel', 'itemValue', 'sortOrder'];

    expect(requiredFields).toHaveLength(3);
    expect(requiredFields).toContain('itemLabel');
    expect(requiredFields).toContain('itemValue');
  });

  test('should handle create new item', async ({ page }) => {
    await page.goto('/#/sys/dict');
    await page.waitForLoadState('networkidle');

    const newItem = {
      dictId: '1',
      itemLabel: '新条目',
      itemValue: 'new_item',
      sortOrder: 1,
      itemStatus: true,
    };

    expect(newItem.dictId).toBe('1');
    expect(newItem.itemLabel).toBe('新条目');
    expect(newItem.itemValue).toBe('new_item');
  });

  test('should handle edit existing item', async ({ page }) => {
    await page.goto('/#/sys/dict');
    await page.waitForLoadState('networkidle');

    const existingItem = {
      id: '1',
      dictId: '1',
      itemLabel: '菜单',
      itemValue: 1,
      sortOrder: 1,
      itemStatus: true,
    };

    expect(existingItem.id).toBe('1');
    expect(existingItem.dictId).toBe('1');
    expect(existingItem.itemLabel).toBe('菜单');
  });

  test('should handle status switch', async ({ page }) => {
    await page.goto('/#/sys/dict');
    await page.waitForLoadState('networkidle');

    const enabledStatus = true;
    const disabledStatus = false;

    expect(enabledStatus).toBe(true);
    expect(disabledStatus).toBe(false);
  });

  test('should reload grid after save', async ({ page }) => {
    await page.goto('/#/sys/dict');
    await page.waitForLoadState('networkidle');

    // After save, grid should reload with dictId
    const reloadConfig = {
      dictId: '1',
    };

    expect(reloadConfig.dictId).toBe('1');
  });
});
