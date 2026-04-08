import { Locator, Page } from '@playwright/test';

export class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(path = '/'): Promise<void> {
    await this.page.goto(path);
  }

  getSubmitContinueButton(): Locator {
    return this.page.locator('button[type="submit"]');
  }

  getRoleContinueButton(): Locator {
    return this.page.getByRole('button', { name: /continue/i });
  }

  async clickSubmitContinue(): Promise<void> {
    await this.getSubmitContinueButton().click();
  }

  async clickRoleContinue(): Promise<void> {
    await this.getRoleContinueButton().click();
  }

  getContinueButton(): Locator {
    return this.page.locator('button[type="submit"]');
  }

  getRadioById(id: string): Locator {
    return this.page.locator(`#${id}`);
  }

  getRadioByNameAndValue(name: string, value: string): Locator {
    return this.page.locator(`input[name="${name}"][value="${value}"]`);
  }

  async clickContinue(): Promise<void> {
    await this.getContinueButton().click();
  }
}
