import { expect, Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class TaskListPage extends BasePage {
  private readonly deceasedDetailsLinkHref = '/intestacy/bilingual-gop';
  private readonly nextPageUrl = /\/intestacy\/bilingual-gop$/;
  private readonly peopleApplyingLinkHref = '/intestacy/relationship-to-deceased';
  private readonly peopleApplyingNextPageUrl = /\/intestacy\/relationship-to-deceased$/;

  constructor(page: Page) {
    super(page);
  }

  getTellUsAboutDeceasedLink() {
    return this.getLinkByHref(this.deceasedDetailsLinkHref);
  }

  getGiveDetailsAboutThePeopleApplyingLink() {
    return this.getLinkByHref(this.peopleApplyingLinkHref);
  }

  async clickTellUsAboutDeceased(): Promise<void> {
    const deceasedLink = this.getTellUsAboutDeceasedLink();
    await expect(deceasedLink).toBeVisible();

    await Promise.all([
      this.page.waitForURL(this.nextPageUrl),
      deceasedLink.click(),
    ]);
  }

  async clickGiveDetailsAboutThePeopleApplying(): Promise<void> {
    const peopleApplyingLink = this.getGiveDetailsAboutThePeopleApplyingLink();
    await expect(peopleApplyingLink).toBeVisible();

    await Promise.all([
      this.page.waitForURL(this.peopleApplyingNextPageUrl),
      peopleApplyingLink.click(),
    ]);
  }
}
