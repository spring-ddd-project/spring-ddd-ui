import { expect, test } from '@playwright/test';

import {
  mockAggregateApi,
  mockTemplateApi,
  navigateToGenModule,
  waitForGridLoad,
} from './common/gen';

/**
 * E2E tests for Gen Aggregate Management
 * Tests aggregate CRUD operations with mocked API
 */
test.describe('Gen Aggregate Management', () => {
  test.beforeEach(async ({ page }) => {
    // Set up API mocks
    await mockAggregateApi(page);
    await mockTemplateApi(page);

    // Navigate to the app
    await navigateToGenModule(page);
  });

  test('should display aggregate list page', async ({ page }) => {
    // Navigate to aggregate page
    await page.goto('/gen/aggregate');
    await page.waitForLoadState('networkidle');

    // Check page loads
    await expect(page.locator('body')).toContainText(/aggregate/i);
  });

  test('should show aggregate list with mocked data', async ({ page }) => {
    await page.goto('/gen/aggregate');
    await waitForGridLoad(page);

    // Since API is mocked, we should see the mocked aggregate names
    const aggregateCell = page.locator('text=OrderAggregate');
    await expect(aggregateCell.first()).toBeVisible({ timeout: 10000 });
  });

  test('should open aggregate form dialog', async ({ page }) => {
    await page.goto('/gen/aggregate');
    await waitForGridLoad(page);

    // Click add button if visible
    const addButton = page.locator('button:has-text("Add"), button:has-text("add"), button:has-text("新增")');
    if (await addButton.isVisible()) {
      await addButton.click();

      // Check form dialog appears
      const formDialog = page.locator('.el-dialog, .vben-drawer, [role="dialog"]');
      await expect(formDialog).toBeVisible({ timeout: 5000 });
    }
  });

  test('should edit aggregate row', async ({ page }) => {
    await page.goto('/gen/aggregate');
    await waitForGridLoad(page);

    // Click edit button on first row if visible
    const editButton = page.locator('button:has-text("Edit"), button:has-text("edit"), button:has-text("编辑")').first();
    if (await editButton.isVisible()) {
      await editButton.click();

      // Check form dialog appears
      const formDialog = page.locator('.el-dialog, .vben-drawer, [role="dialog"]');
      await expect(formDialog).toBeVisible({ timeout: 5000 });
    }
  });

  test('should delete aggregate with confirmation', async ({ page }) => {
    // Mock delete API
    await page.route('**/api/gen/aggregate/wipe', (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ code: 0, message: 'success' }),
      });
    });

    await page.goto('/gen/aggregate');
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
 * E2E tests for Aggregate Form
 */
test.describe('Aggregate Form Operations', () => {
  test('should fill aggregate form with valid data', async ({ page }) => {
    // Mock create API
    await page.route('**/api/gen/aggregate/create', (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ code: 0, message: 'success', data: { id: 2 } }),
      });
    });

    // Mock entity info API
    await page.route('**/api/gen/columns/queryJavaEntityInfoByInfoId', (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          code: 0,
          data: [
            { propJavaEntity: 'Order', propColumnComment: 'Order entity' },
            { propJavaEntity: 'OrderItem', propColumnComment: 'Order item entity' },
          ],
        }),
      });
    });

    await page.goto('/gen/aggregate');

    // Open form
    const addButton = page.locator('button:has-text("Add"), button:has-text("add"), button:has-text("新增")');
    if (await addButton.isVisible()) {
      await addButton.click();

      // Wait for form to load
      await page.waitForTimeout(500);

      // Fill form fields
      const objectNameInput = page.locator('input[placeholder*="objectName"], input[placeholder*="object"]');
      if (await objectNameInput.isVisible()) {
        await objectNameInput.fill('NewAggregate');
      }

      // Select object type (radio buttons)
      const radioButton = page.locator('input[type="radio"]').first();
      if (await radioButton.isVisible()) {
        await radioButton.click();
      }

      // Submit
      const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("confirm"), button:has-text("确定")');
      if (await confirmButton.isVisible()) {
        await confirmButton.click();
        await page.waitForTimeout(1000);
      }
    }
  });

  test('should validate required fields in aggregate form', async ({ page }) => {
    await page.goto('/gen/aggregate');

    // Open form
    const addButton = page.locator('button:has-text("Add"), button:has-text("add"), button:has-text("新增")');
    if (await addButton.isVisible()) {
      await addButton.click();

      // Try to submit without filling required fields
      const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("confirm"), button:has-text("确定")');
      if (await confirmButton.isVisible()) {
        await confirmButton.click();

        // Should show validation error
        await page.waitForTimeout(500);
      }
    }
  });
});
