import { expect } from '@playwright/test';
import { BasePage } from '../../base/BasePage';

export class TaskListPage extends BasePage {
  protected readonly pageUrl = /\/task-list$/;

  async expectLoaded(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
  }

  async clickTellUsAboutThePersonWhoHasDied(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);

    const link = this.page.getByRole('link', {
      name: 'Tell us about the person who has died',
    });

    await expect(link).toBeVisible();
    await link.click();
  }

  async clickGiveDetailsAboutThePeopleApplying(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);

    const link = this.page.getByRole('link', {
      name: 'Give details about the people applying',
    });

    await expect(link).toBeVisible();
    await link.click();
  }

  async goToDeclaration(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);

    const link = this.page.getByRole('link', {
      name: 'Check your answers and make your legal declaration',
    });

    await expect(link).toBeVisible();

    await Promise.all([
      this.page.waitForURL(/\/summary\/declaration$/, { waitUntil: 'domcontentloaded' }),
      link.click(),
    ]);
  }

  async goToPayAndSubmit(): Promise<void> {
  await this.waitForPageUrl(this.pageUrl);

  const link = this.page.getByRole('link', {
    name: 'Pay and submit your application',
  });

  await expect(link).toBeVisible();

  await Promise.all([
    this.page.waitForURL(/\/intestacy\/copies-uk$/, { waitUntil: 'domcontentloaded' }),
    link.click(),
  ]);
  }
}
