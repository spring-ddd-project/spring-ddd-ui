import type { PlaywrightTestConfig } from '@playwright/test';

import { devices } from '@playwright/test';

const config: PlaywrightTestConfig = {
  expect: {
    timeout: 5000,
  },
  forbidOnly: !!process.env.CI,
  outputDir: 'node_modules/.e2e/test-results/',
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
  reporter: [
    ['list'],
    ['html', { outputFolder: 'node_modules/.e2e/test-results' }],
  ],
  retries: process.env.CI ? 2 : 0,
  testDir: './__tests__/e2e',
  timeout: 30 * 1000,
  use: {
    actionTimeout: 0,
    baseURL: 'http://localhost:5555',
    headless: !!process.env.CI,
    trace: 'retain-on-failure',
  },
  webServer: {
    command: process.env.CI ? 'pnpm preview --port 5555' : 'pnpm dev',
    port: 5555,
    reuseExistingServer: !process.env.CI,
  },
  workers: process.env.CI ? 1 : undefined,
};

export default config;
