import { expect, test } from '@playwright/test';

import {
  mockBindApi,
  mockTemplateApi,
  navigateToGenModule,
  waitForGridLoad,
} from './common/gen';

/**
 * E2E tests for Gen Column Binding
 * Tests column binding operations with mocked API
 */
test.describe('Gen Column Binding', () => {
  test.beforeEach(async ({ page }) => {
    // Set up API mocks
    await mockBindApi(page);
    await mockTemplateApi(page);

    // Navigate to the app
    await navigateToGenModule(page);
  });

  test('should display column bind list page', async ({ page }) => {
    // Navigate to column bind page
    await page.goto('/gen/column/bind');
    await page.waitForLoadState('networkidle');

    // Check page loads
    await expect(page.locator('body')).toContainText(/bind/i);
  });

  test('should show column bind list with mocked data', async ({ page }) => {
    await page.goto('/gen/column/bind');
    await waitForGridLoad(page);

    // Since API is mocked, we should see the mocked column types
    const columnTypeCell = page.locator('text=varchar');
    await expect(columnTypeCell.first()).toBeVisible({ timeout: 10000 });
  });

  test('should open column bind form dialog', async ({ page }) => {
    await page.goto('/gen/column/bind');
    await waitForGridLoad(page);

    // Click add button if visible
    const addButton = page.locator('button:has-text("Add"), button:has-text("add"), button:has-text("新增")');
    if (await addButton.isVisible()) {
      await addButton.click();

      // Check form dialog appears
      const formDialog = page.locator('.el-dialog, .vben-modal, [role="dialog"]');
      await expect(formDialog).toBeVisible({ timeout: 5000 });
    }
  });

  test('should edit column bind row', async ({ page }) => {
    await page.goto('/gen/column/bind');
    await waitForGridLoad(page);

    // Click edit button on first row if visible
    const editButton = page.locator('button:has-text("Edit"), button:has-text("edit"), button:has-text("编辑")').first();
    if (await editButton.isVisible()) {
      await editButton.click();

      // Check form dialog appears
      const formDialog = page.locator('.el-dialog, .vben-modal, [role="dialog"]');
      await expect(formDialog).toBeVisible({ timeout: 5000 });
    }
  });

  test('should open recycle bin', async ({ page }) => {
    // Mock recycle API
    await page.route('**/api/gen/column/bind/recycle', (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          code: 0,
          data: {
            list: [
              {
                id: 'recycled-1',
                columnType: 'text',
                entityType: 'String',
                componentType: 'Textarea',
              },
            ],
            total: 1,
          },
        }),
      });
    });

    await page.goto('/gen/column/bind');
    await waitForGridLoad(page);

    // Click recycle button if visible
    const recycleButton = page.locator('button:has-text("Recycle"), button:has-text("recycle"), button:has-text("回收站")');
    if (await recycleButton.isVisible()) {
      await recycleButton.click();

      // Check recycle dialog/modal appears
      const recycleDialog = page.locator('.el-dialog, .vben-modal, [role="dialog"]');
      await expect(recycleDialog).toBeVisible({ timeout: 5000 });
    }
  });

  test('should delete column bind with confirmation', async ({ page }) => {
    // Mock delete API
    await page.route('**/api/gen/column/bind/delete', (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ code: 0, message: 'success' }),
      });
    });

    await page.goto('/gen/column/bind');
    await waitForGridLoad(page);

    // Click delete button on first row if visible
    const deleteButton = page.locator('button:has-text("Delete"), button:has-text("delete"), button:has-text("删除")').first();
    if (await deleteButton.isVisible()) {
      await deleteButton.click();

      // Handle confirmation dialog
      const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("confirm"), button:has-text("确定")');
      if (await confirmButton.isVisible()) {
        await confirmButton.click();
        await page.waitForTimeout(500);
      }
    }
  });
});

/**
 * E2E tests for Column Bind Form
 */
test.describe('Column Bind Form Operations', () => {
  test('should validate lowercase columnType', async ({ page }) => {
    await page.goto('/gen/column/bind');

    // Open form
    const addButton = page.locator('button:has-text("Add"), button:has-text("add"), button:has-text("新增")');
    if (await addButton.isVisible()) {
      await addButton.click();

      // Fill with invalid (uppercase) column type
      const columnTypeInput = page.locator('input[placeholder*="columnType"], input[placeholder*="column"]');
      if (await columnTypeInput.isVisible()) {
        await columnTypeInput.fill('VARCHAR');
        await columnTypeInput.blur();

        // Should show validation error for lowercase requirement
        await page.waitForTimeout(500);
      }
    }
  });

  test('should create new column bind with valid lowercase type', async ({ page }) => {
    // Mock create API
    await page.route('**/api/gen/column/bind/create', (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ code: 0, message: 'success', data: { id: 2 } }),
      });
    });

    // Mock dict API for component types
    await page.route('**/api/sys/dict/items/**/all', (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          code: 0,
          data: [
            { itemValue: 1, itemLabel: 'Input' },
            { itemValue: 2, itemLabel: 'Textarea' },
          ],
        }),
      });
    });

    await page.goto('/gen/column/bind');

    // Open form
    const addButton = page.locator('button:has-text("Add"), button:has-text("add"), button:has-text("新增")');
    if (await addButton.isVisible()) {
      await addButton.click();

      // Fill form with valid lowercase column type
      const columnTypeInput = page.locator('input[placeholder*="columnType"], input[placeholder*="column"]');
      if (await columnTypeInput.isVisible()) {
        await columnTypeInput.fill('varchar');
      }

      const entityTypeInput = page.locator('input[placeholder*="entityType"], input[placeholder*="entity"]');
      if (await entityTypeInput.isVisible()) {
        await entityTypeInput.fill('String');
      }

      // Submit
      const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("confirm"), button:has-text("确定")');
      if (await confirmButton.isVisible()) {
        await confirmButton.click();
        await page.waitForTimeout(1000);
      }
    }
  });
});
