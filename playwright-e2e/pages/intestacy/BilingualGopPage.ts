import { Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class BilingualGopPage extends BasePage {
  private readonly pageUrl = /\/intestacy\/bilingual-gop$/;
  private readonly yesRadioId = 'bilingual';
  private readonly noRadioId = 'bilingual-2';

  constructor(page: Page) {
    super(page);
  }

  async selectYes(): Promise<void> {
    await this.selectRadioByIdAndContinue(this.pageUrl, this.yesRadioId);
  }

  async selectNo(): Promise<void> {
    await this.selectRadioByIdAndContinue(this.pageUrl, this.noRadioId);
  }
}
