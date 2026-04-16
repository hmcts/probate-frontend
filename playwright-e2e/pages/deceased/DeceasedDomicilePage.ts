import { Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class DeceasedDomicilePage extends BasePage {
  private readonly pageUrl = /deceased-domicile/;

  constructor(page: Page) {
    super(page);
  }

  async selectYes(): Promise<void> {
    await this.selectRadioByIdAndContinue(this.pageUrl, 'domicile');
  }

  async selectNo(): Promise<void> {
    await this.selectRadioByIdAndContinue(this.pageUrl, 'domicile-2');
  }
}
