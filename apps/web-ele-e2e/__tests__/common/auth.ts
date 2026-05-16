import type { Page } from '@playwright/test';

import { expect } from '@playwright/test';

export async function authLogin(page: Page) {
  // Ensure login form is visible
  const usernameInput = await page.locator(`input[name='username']`);
  await expect(usernameInput).toBeVisible();

  const passwordInput = await page.locator(`input[name='password']`);
  await expect(passwordInput).toBeVisible();

  const sliderCaptcha = await page.locator(`div[name='captcha']`);
  const sliderCaptchaAction = await page.locator(`div[name='captcha-action']`);
  await expect(sliderCaptcha).toBeVisible();
  await expect(sliderCaptchaAction).toBeVisible();

  // Drag captcha slider
  const sliderCaptchaBox = await sliderCaptcha.boundingBox();
  if (!sliderCaptchaBox) throw new Error('Captcha not found');

  const actionBoundingBox = await sliderCaptchaAction.boundingBox();
  if (!actionBoundingBox) throw new Error('Captcha action not found');

  const startX = actionBoundingBox.x + actionBoundingBox.width / 2;
  const startY = actionBoundingBox.y + actionBoundingBox.height / 2;
  const targetX = startX + sliderCaptchaBox.width + actionBoundingBox.width;
  const targetY = startY;

  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(targetX, targetY, { steps: 20 });
  await page.mouse.up();

  // Check action moved
  const newActionBoundingBox = await sliderCaptchaAction.boundingBox();
  expect(newActionBoundingBox?.x).toBeGreaterThan(actionBoundingBox.x);

  // Login
  await page.waitForTimeout(300);
  await page.getByRole('button', { name: 'login' }).click();
}
