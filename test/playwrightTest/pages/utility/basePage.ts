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

  async navByClick(buttonLocator: Locator | string, timeout: number = 5_000): Promise<void> {
    const currentUrl = await this.page.url();
    const locator = typeof buttonLocator === 'string'
      ? this.page.locator(buttonLocator)  // String - convert to Locator
      : buttonLocator;
    await expect(locator).toBeVisible();
    await expect(locator).toBeEnabled();

    await expect(async () => {
      await this.page.waitForLoadState('networkidle');
      await locator.click({ timeout: timeout });
      await this.page.waitForLoadState('networkidle');
      await expect(this.page).not.toHaveURL(currentUrl);
    }).toPass({ intervals: [2_000, 2_000, 2_000], timeout: 60_000 });
  }

  async closeCurrentTab(){
    const pages = this.context.pages();
    const mostRecentTab = pages[pages.length - 1];

    await mostRecentTab.close();

    const remainingTab = this.context.pages()[0];
    await remainingTab.bringToFront();

    return remainingTab;
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

  async downloadPdfIfNotIE11(locator: Locator): Promise<void> {
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      locator.click()
    ]);
    expect(download.suggestedFilename()).toContain('.pdf');
    expect(await download.failure()).toBeNull();
  }

  async switchToNextTab(tabIndex: number): Promise<Page> {
    const pages = this.context.pages();
    const nextTab = pages[tabIndex];
    await nextTab.waitForLoadState();
    return nextTab;
  }
}
