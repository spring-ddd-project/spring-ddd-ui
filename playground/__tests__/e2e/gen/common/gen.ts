import type { Page } from '@playwright/test';

import { expect } from '@playwright/test';

/**
 * Navigate to the Gen Code Generation module
 * This assumes the app has a menu navigation to gen module
 */
export async function navigateToGenModule(page: Page): Promise<void> {
  // Navigate to the gen module - the exact path depends on the menu structure
  // Common paths might be /gen/table, /gen/aggregate, etc.
  await page.goto('/');
  await page.waitForLoadState('networkidle');
}

/**
 * Mock the template API for gen/template
 */
export async function mockTemplateApi(page: Page): Promise<void> {
  await page.route('**/api/gen/template/index', (route) => {
    route.fulfill({
      status: 200,
      body: JSON.stringify({
        code: 0,
        data: {
          list: [
            {
              id: 1,
              templateName: 'Entity Template',
              templateContent: 'public class ${className} { }',
            },
            {
              id: 2,
              templateName: 'Repository Template',
              templateContent: 'public interface ${className}Repository { }',
            },
          ],
          total: 2,
        },
      }),
    });
  });
}

/**
 * Mock the aggregate API for gen/aggregate
 */
export async function mockAggregateApi(page: Page): Promise<void> {
  await page.route('**/api/gen/aggregate/index', (route) => {
    route.fulfill({
      status: 200,
      body: JSON.stringify({
        code: 0,
        data: {
          list: [
            {
              id: '1',
              infoId: 'info-1',
              objectName: 'OrderAggregate',
              objectValue: '["Order"]',
              objectType: 1,
              hasCreated: true,
            },
          ],
          total: 1,
        },
      }),
    });
  });
}

/**
 * Mock the bind API for gen/column/bind
 */
export async function mockBindApi(page: Page): Promise<void> {
  await page.route('**/api/gen/column/bind/index', (route) => {
    route.fulfill({
      status: 200,
      body: JSON.stringify({
        code: 0,
        data: {
          list: [
            {
              id: '1',
              columnType: 'varchar',
              entityType: 'String',
              typescriptType: 'string',
              componentType: 1,
            },
          ],
          total: 1,
        },
      }),
    });
  });
}

/**
 * Mock the table API for gen/table
 */
export async function mockTableApi(page: Page): Promise<void> {
  await page.route('**/api/gen/table/index', (route) => {
    route.fulfill({
      status: 200,
      body: JSON.stringify({
        code: 0,
        data: {
          list: [
            {
              id: '1',
              tableSchema: 'public',
              tableName: 'gen_aggregate',
              tableComment: 'Aggregate table',
              tableCollation: 'utf8mb4_general_ci',
            },
          ],
          total: 1,
        },
      }),
    });
  });
}

/**
 * Wait for grid to load
 */
export async function waitForGridLoad(page: Page): Promise<void> {
  await page.waitForSelector('.vxe-grid, .vxe-table', { timeout: 5000 }).catch(() => {
    // Grid might not be visible yet
  });
}

/**
 * Check if element is visible with timeout
 */
export async function waitForElementVisible(
  page: Page,
  selector: string,
  timeout = 5000,
): Promise<boolean> {
  try {
    await page.waitForSelector(selector, { state: 'visible', timeout });
    return true;
  } catch {
    return false;
  }
}
