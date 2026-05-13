import { expect } from '@playwright/test';
import { BasePage } from '../../base/BasePage';
import { ROUTES } from '../../../constants/routes';

export class TaskListPage extends BasePage {
  private readonly pageUrl = ROUTES.taskList;

  async clickTellUsAboutThePersonWhoHasDied(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);

    const link = this.page.getByRole('link', { name: 'Tell us about the person who has died' });
    await expect(link).toBeVisible();

    await Promise.all([
      this.page.waitForURL(ROUTES.intestacyBilingualGop, { waitUntil: 'domcontentloaded' }),
      link.click(),
    ]);
  }

  async clickGiveDetailsAboutThePeopleApplying(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);

    const link = this.page.getByRole('link', {
      name: 'Give details about the people applying',
    });

    await expect(link).toBeVisible();

    await Promise.all([
      this.page.waitForURL(ROUTES.intestacyRelationshipToDeceased, {
        waitUntil: 'domcontentloaded',
      }),
      link.click(),
    ]);
  }

  async goToDeclaration(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);

    const link = this.page.getByRole('link', {
      name: 'Check your answers and make your legal declaration',
    });

    await expect(link).toBeVisible();

    await Promise.all([
      this.page.waitForURL(ROUTES.summaryDeclaration, { waitUntil: 'domcontentloaded' }),
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
      this.page.waitForURL(ROUTES.intestacyCopiesUk, { waitUntil: 'domcontentloaded' }),
      link.click(),
    ]);
  }
}
