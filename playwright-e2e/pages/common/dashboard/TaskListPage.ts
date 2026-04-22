import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../../base/BasePage';

export class TaskListPage extends BasePage {
  private readonly pageUrl = /\/task-list$/;
  private readonly deceasedAddressUrl = /\/intestacy\/deceased-address$/;
  private readonly bilingualGopUrl = /\/intestacy\/bilingual-gop$/;
  private readonly deceasedNameUrl = /\/intestacy\/deceased-name$/;

  constructor(page: Page) {
    super(page);
  }

  private get tellUsAboutThePersonWhoHasDiedLink(): Locator {
    return this.page.getByRole('link', {
      name: /tell us about the person who has died/i,
    });
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(this.pageUrl);
  }

  async clickTellUsAboutThePersonWhoHasDied(): Promise<void> {
    await this.expectLoaded();
    await expect(this.tellUsAboutThePersonWhoHasDiedLink).toBeVisible();

    await this.tellUsAboutThePersonWhoHasDiedLink.click();

    await this.page.waitForURL(
      new RegExp(
        `${this.bilingualGopUrl.source}|${this.deceasedNameUrl.source}|${this.deceasedAddressUrl.source}`,
      ),
      { waitUntil: 'domcontentloaded', timeout: 60000 },
    );
  }
}
