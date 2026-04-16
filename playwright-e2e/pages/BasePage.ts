import { expect, Locator, Page } from '@playwright/test';

export class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(path = '/'): Promise<void> {
    await this.page.goto(path);
  }

  async waitForPageUrl(pageUrl: RegExp): Promise<void> {
    await expect(this.page).toHaveURL(pageUrl);
  }

  getContinueButton(): Locator {
    return this.page.locator('button[type="submit"]');
  }

  getSaveAndContinueButton(): Locator {
    return this.page.getByRole('button', { name: /save and continue/i });
  }

  getStartButton(): Locator {
    return this.page.locator('a[role="button"]');
  }

  getRadioById(id: string): Locator {
    return this.page.locator(`#${id}`);
  }

  getLinkByHref(href: string): Locator {
    return this.page.locator(`a[href="${href}"]`);
  }

  getInputById(id: string): Locator {
    return this.page.locator(`#${id}`);
  }

  async clickContinue(): Promise<void> {
    await this.getContinueButton().click();
  }

  async clickStart(): Promise<void> {
    await this.getStartButton().click();
  }

  async clickLinkAndWait(href: string, nextPageUrl: RegExp): Promise<void> {
    const link = this.getLinkByHref(href);
    await expect(link).toBeVisible();

    await Promise.all([
      this.page.waitForURL(nextPageUrl, { waitUntil: 'domcontentloaded' }),
      link.click(),
    ]);
  }

  async clickSaveAndContinue(): Promise<void> {
    await this.getSaveAndContinueButton().click();
  }

  async selectRadioByIdAndContinue(
    pageUrl: RegExp,
    radioId: string,
    nextPageUrl?: RegExp,
  ): Promise<void> {
    await this.waitForPageUrl(pageUrl);

    const radio = this.getRadioById(radioId);
    await expect(radio).toBeVisible();
    await radio.check();

    await expect(this.getContinueButton()).toBeVisible();

    if (nextPageUrl) {
      await Promise.all([
        this.page.waitForURL(nextPageUrl, { waitUntil: 'domcontentloaded' }),
        this.clickContinue(),
      ]);
    } else {
      await this.clickContinue();
    }
  }
}
