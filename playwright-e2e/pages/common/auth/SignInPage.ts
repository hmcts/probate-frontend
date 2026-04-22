import { expect, Page } from '@playwright/test';
import { BasePage } from '../../base/BasePage';

export class SignInPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async signInFromEnv(): Promise<void> {
    await this.page.locator('#username').fill(process.env.PA_USER_EMAIL ?? '');
    await this.page.locator('#password').fill(process.env.PA_USER_PASSWORD ?? '');

    const submitButton = this.page.locator('button[type="submit"], input[type="submit"]');
    await expect(submitButton.first()).toBeVisible();
    await submitButton.first().click();

    await this.page.waitForURL(/\/dashboard/, {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });

    await expect(this.page).toHaveURL(/\/dashboard/);
  }
}
