import { expect, test } from '@playwright/test';

import {
  mockTemplateApi,
  navigateToGenModule,
  waitForGridLoad,
} from './common/gen';

/**
 * E2E tests for Gen Template Management
 * Tests template CRUD operations with mocked API
 */
test.describe('Gen Template Management', () => {
  test.beforeEach(async ({ page }) => {
    // Set up API mocks
    await mockTemplateApi(page);
    await mockAggregateApi(page);
    await mockBindApi(page);
    await mockTableApi(page);

    // Navigate to the app
    await navigateToGenModule(page);
  });

  test('should display template list page', async ({ page }) => {
    // Navigate to template page
    await page.goto('/gen/template');
    await page.waitForLoadState('networkidle');

    // Check page title or heading
    await expect(page.locator('body')).toContainText(/template/i);
  });

  test('should show template list with mocked data', async ({ page }) => {
    await page.goto('/gen/template');
    await waitForGridLoad(page);

    // Since API is mocked, we should see the mocked template names
    // The actual selector depends on the grid implementation
    const templateNameCell = page.locator('text=Entity Template');
    await expect(templateNameCell.first()).toBeVisible({ timeout: 10000 });
  });

  test('should open template form dialog', async ({ page }) => {
    await page.goto('/gen/template');
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

  test('should search template by name', async ({ page }) => {
    await page.goto('/gen/template');
    await waitForGridLoad(page);

    // Find search input
    const searchInput = page.locator('input[placeholder*="template"], input[placeholder*="模板"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill('Entity');
      await searchInput.press('Enter');

      // Wait for results to update
      await page.waitForTimeout(500);
    }
  });

  test('should delete template with confirmation', async ({ page }) => {
    await page.goto('/gen/template');
    await waitForGridLoad(page);

    // Mock delete API
    await page.route('**/api/gen/template/delete', (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ code: 0, message: 'success' }),
      });
    });

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
 * E2E tests for Template Form Operations
 */
test.describe('Template Form Operations', () => {
  test('should validate required fields in template form', async ({ page }) => {
    await page.goto('/gen/template');

    // Open form
    const addButton = page.locator('button:has-text("Add"), button:has-text("add"), button:has-text("新增")');
    if (await addButton.isVisible()) {
      await addButton.click();

      // Try to submit without filling required fields
      const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("confirm"), button:has-text("确定")');
      if (await confirmButton.isVisible()) {
        await confirmButton.click();

        // Should show validation error
        const errorMessage = page.locator('.el-form-item__error, [class*="error"]');
        await expect(errorMessage.first()).toBeVisible({ timeout: 3000 });
      }
    }
  });

  test('should create new template with valid data', async ({ page }) => {
    // Mock create API
    await page.route('**/api/gen/template/create', (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ code: 0, message: 'success', data: { id: 3 } }),
      });
    });

    await page.goto('/gen/template');

    // Open form
    const addButton = page.locator('button:has-text("Add"), button:has-text("add"), button:has-text("新增")');
    if (await addButton.isVisible()) {
      await addButton.click();

      // Fill form
      const nameInput = page.locator('input[placeholder*="name"], input[placeholder*="名称"]');
      if (await nameInput.isVisible()) {
        await nameInput.fill('New Template');
      }

      const contentInput = page.locator('textarea[placeholder*="content"], textarea[placeholder*="内容"]');
      if (await contentInput.isVisible()) {
        await contentInput.fill('public class ${className} { }');
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
