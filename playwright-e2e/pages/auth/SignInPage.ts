import { expect, Page } from '@playwright/test';
import { BasePage } from '../BasePage';
import { testConfig } from '../../config/config';

export class SignInPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async login(): Promise<void> {
    if (!testConfig.email || !testConfig.password) {
      throw new Error('PA_USER_EMAIL or PA_USER_PASSWORD is missing in playwright-e2e/.env');
    }

    await this.goto('/');

    const emailInput = this.page.getByLabel(/email address/i);
    const passwordInput = this.page.getByLabel(/password/i);
    const signInButton = this.page.getByRole('button', { name: /sign in|sign in securely/i });

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(signInButton).toBeVisible();

    await emailInput.fill(testConfig.email);
    await passwordInput.fill(testConfig.password);

    await Promise.all([
      this.page.waitForURL(/probate\.ithc\.platform\.hmcts\.net\/.*/),
      signInButton.click(),
    ]);
  }
}
