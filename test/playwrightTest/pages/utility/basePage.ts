import { BrowserContext, expect, type Locator, type Page } from '@playwright/test';
import {getContent} from "./contentHelper.ts";

export const getTestLanguages = (): string[] =>
  String(process.env.DONT_TEST_WELSH) === 'true' ? ['en'] : ['en', 'cy'];

export function decodeHTML(str: string): string {
  return str.replace(/&([a-zA-Z]+);/g,
    tag => ({
      '&rsquo;': '\u2019',
      '&lsquo;': '\u2018',
      '&iuml;': 'ï',
      '&acirc;': 'â',
      '&ecirc;': 'ê',
      '&icirc;': 'î',
      '&ocirc;': 'ô',
      '&ucirc;': 'û',
      '&wcirc;': 'ŵ',
      '&ycirc;': 'ŷ',
    } as Record<string, string>)[tag] ?? tag);
}

export class BasePage {
  public readonly page: Page;
  public readonly context: BrowserContext;
  protected commonContent: any;

  constructor(page: Page, context: BrowserContext, language: string) {
    this.page = page;
    this.context = context;
    this.commonContent = getContent(language, true)
  }

  async waitForPageUrl(pageUrl: RegExp): Promise<void> {
    await expect(this.page).toHaveURL(pageUrl);
  }

  async checkInUrl(expectedText: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(expectedText));
  }

  getById(id: string): Locator {
    return this.page.locator(`#${id}`);
  }

  getInputById(id: string): Locator {
    return this.page.locator(`input#${id}`);
  }

  getButtonByText(name: string): Locator {
    return this.page.getByRole('button', { name, exact: true });
  }

  async navByClick(button) {
    await expect(button).toBeVisible();
    await expect(button).toBeEnabled();
    await button.click();
  }

  async clickContinue(nextPageUrl?: RegExp): Promise<void> {
    const button = this.getButtonByText('Continue');
    await expect(button).toBeVisible();
    await expect(button).toBeEnabled();

    if (nextPageUrl) {
      await Promise.all([
        this.page.waitForURL(nextPageUrl, { waitUntil: 'domcontentloaded' }),
        button.click(),
      ]);
      return;
    }

    await button.click();
  }


  async clickSaveAndContinue(nextPageUrl?: RegExp): Promise<void> {
    const button = this.page.getByRole('button', {
      name: /^(Save and continue|Continue)$/i,
    });

    await expect(button).toBeVisible();
    await expect(button).toBeEnabled();

    if (nextPageUrl) {
      await Promise.all([
        this.page.waitForURL(nextPageUrl, { waitUntil: 'domcontentloaded' }),
        button.click(),
      ]);
      return;
    }

    await button.click();
  }

  async selectRadioById(radioId: string): Promise<void> {
    const radio = this.getInputById(radioId);
    await expect(radio).toHaveCount(1);
    await radio.setChecked(true);
  }

  async selectRadioByIdAndContinue(
    radioId: string,
    nextPageUrl?: RegExp,
    continueButtonText: 'Continue' | 'Save and continue' = 'Save and continue',
  ): Promise<void> {
    await this.selectRadioById(radioId);

    if (continueButtonText === 'Continue') {
      await this.clickContinue(nextPageUrl);
      return;
    }

    await this.clickSaveAndContinue(nextPageUrl);
  }

  async fillDateByIdPrefix(prefix: string, day: string, month: string, year: string): Promise<void> {
    await this.getInputById(`${prefix}-day`).fill(day);
    await this.getInputById(`${prefix}-month`).fill(month);
    await this.getInputById(`${prefix}-year`).fill(year);
  }

  async seeSummaryPage(pageName: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(pageName));
  }

}
