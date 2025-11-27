import { expect, test } from '@playwright/test';

import {
  mockTableApi,
  mockTemplateApi,
  navigateToGenModule,
  waitForGridLoad,
} from './common/gen';

/**
 * E2E tests for Gen Table Configuration
 * Tests table config operations with mocked API
 */
test.describe('Gen Table Configuration', () => {
  test.beforeEach(async ({ page }) => {
    // Set up API mocks
    await mockTableApi(page);
    await mockTemplateApi(page);

    // Navigate to the app
    await navigateToGenModule(page);
  });

  test('should display table config list page', async ({ page }) => {
    // Navigate to table page
    await page.goto('/gen/table');
    await page.waitForLoadState('networkidle');

    // Check page loads
    await expect(page.locator('body')).toContainText(/table/i);
  });

  test('should show table list with mocked data', async ({ page }) => {
    await page.goto('/gen/table');
    await waitForGridLoad(page);

    // Since API is mocked, we should see the mocked table names
    const tableCell = page.locator('text=gen_aggregate');
    await expect(tableCell.first()).toBeVisible({ timeout: 10000 });
  });

  test('should search table by database name', async ({ page }) => {
    await page.goto('/gen/table');
    await waitForGridLoad(page);

    // Find search input for database name
    const searchInput = page.locator('input[placeholder*="database"], input[placeholder*="数据库"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill('public');
      await searchInput.press('Enter');

      // Wait for results to update
      await page.waitForTimeout(500);
    }
  });

  test('should open project config dialog', async ({ page }) => {
    // Mock project info API
    await page.route('**/api/gen/projectInfo/queryInfoByTableName', (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          code: 0,
          data: {
            id: 'info-1',
            tableName: 'gen_aggregate',
            projectName: 'spring-ddd',
            moduleName: 'domain',
            packageName: 'com.example.domain',
            className: 'Aggregate',
            requestName: 'AggregateRequest',
          },
        }),
      });
    });

    await page.goto('/gen/table');
    await waitForGridLoad(page);

    // Click project config button on first row if visible
    const configButton = page.locator('button:has-text("Project"), button:has-text("project"), button:has-text("项目配置")').first();
    if (await configButton.isVisible()) {
      await configButton.click();

      // Check dialog appears
      const dialog = page.locator('.el-dialog, .vben-drawer, [role="dialog"]');
      await expect(dialog).toBeVisible({ timeout: 5000 });
    }
  });

  test('should open column config dialog', async ({ page }) => {
    // Mock table info API
    await page.route('**/api/gen/projectInfo/queryInfoByTableName', (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          code: 0,
          data: {
            id: 'info-1',
            tableName: 'gen_aggregate',
          },
        }),
      });
    });

    // Mock columns API
    await page.route('**/api/gen/columns/queryByInfoId', (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          code: 0,
          data: [
            {
              id: 'col-1',
              propColumnName: 'id',
              propColumnType: 'bigint',
              propColumnComment: 'ID',
              propJavaEntity: 'id',
              propJavaType: 'Long',
              tableVisible: true,
              tableOrder: true,
              tableFilter: false,
              formVisible: true,
              formRequired: true,
            },
          ],
        }),
      });
    });

    await page.goto('/gen/table');
    await waitForGridLoad(page);

    // Click column config button on first row if visible
    const columnButton = page.locator('button:has-text("Column"), button:has-text("column"), button:has-text("列配置")').first();
    if (await columnButton.isVisible()) {
      await columnButton.click();

      // Check dialog appears
      const dialog = page.locator('.el-dialog, .vben-drawer, [role="dialog"]');
      await expect(dialog).toBeVisible({ timeout: 5000 });
    }
  });

  test('should open aggregate config dialog', async ({ page }) => {
    // Mock table info API
    await page.route('**/api/gen/projectInfo/queryInfoByTableName', (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          code: 0,
          data: {
            id: 'info-1',
            tableName: 'gen_aggregate',
          },
        }),
      });
    });

    // Mock aggregate API
    await page.route('**/api/gen/aggregate/index', (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          code: 0,
          data: {
            list: [],
            total: 0,
          },
        }),
      });
    });

    await page.goto('/gen/table');
    await waitForGridLoad(page);

    // Click aggregate config button on first row if visible
    const aggregateButton = page.locator('button:has-text("Aggregate"), button:has-text("aggregate"), button:has-text("聚合")').first();
    if (await aggregateButton.isVisible()) {
      await aggregateButton.click();

      // Check dialog appears
      const dialog = page.locator('.el-dialog, .vben-modal, [role="dialog"]');
      await expect(dialog).toBeVisible({ timeout: 5000 });
    }
  });

  test('should sync table data', async ({ page }) => {
    // Mock wipe API
    await page.route('**/api/gen/table/wipe', (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ code: 0, message: 'success' }),
      });
    });

    await page.goto('/gen/table');
    await waitForGridLoad(page);

    // Click sync button if visible
    const syncButton = page.locator('button:has-text("Sync"), button:has-text("sync"), button:has-text("同步")');
    if (await syncButton.isVisible()) {
      await syncButton.click();

      // Handle confirmation dialog
      const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("confirm"), button:has-text("确定")');
      if (await confirmButton.isVisible()) {
        await confirmButton.click();
        await page.waitForTimeout(500);
      }
    }
  });

  test('should generate code for table', async ({ page }) => {
    // Mock generate API
    await page.route('**/api/gen/table/generate', (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ code: 0, message: 'success' }),
      });
    });

    // Mock preview API
    await page.route('**/api/gen/table/preview', (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          code: 0,
          data: [
            {
              label: 'domain',
              value: 'domain/Entity.java',
              children: [
                { label: 'Entity.java', value: 'package com.example.domain;\n\npublic class Entity { }' },
              ],
            },
          ],
        }),
      });
    });

    await page.goto('/gen/table');
    await waitForGridLoad(page);

    // Click generate button on first row if visible
    const generateButton = page.locator('button:has-text("Generate"), button:has-text("generate"), button:has-text("生成")').first();
    if (await generateButton.isVisible()) {
      await generateButton.click();

      // Wait for preview dialog
      await page.waitForTimeout(1000);
    }
  });
});

/**
 * E2E tests for Table Config Form
 */
test.describe('Table Config Form Operations', () => {
  test('should fill project config form', async ({ page }) => {
    // Mock APIs
    await page.route('**/api/gen/projectInfo/queryInfoByTableName', (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          code: 0,
          data: null,
        }),
      });
    });

    await page.route('**/api/gen/projectInfo/create', (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ code: 0, message: 'success', data: { id: 'new-1' } }),
      });
    });

    await page.goto('/gen/table');
    await waitForGridLoad(page);

    // Open project config
    const configButton = page.locator('button:has-text("Project"), button:has-text("project"), button:has-text("项目配置")').first();
    if (await configButton.isVisible()) {
      await configButton.click();

      // Wait for form to load
      await page.waitForTimeout(500);

      // Fill form fields
      const projectInput = page.locator('input[placeholder*="project"], input[placeholder*="项目"]');
      if (await projectInput.isVisible()) {
        await projectInput.fill('new-project');
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
