import { Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class DiedEnglandOrWalesPage extends BasePage {
  private readonly pageUrl = /\/intestacy\/died-eng-or-wales$/;
  private readonly nextPageUrl = /\/intestacy\/certificate-interim$/;

  constructor(page: Page) {
    super(page);
  }

  async selectYes(): Promise<void> {
    await this.selectRadioByIdAndContinue(this.pageUrl, 'diedEngOrWales', this.nextPageUrl);
  }

  async selectNo(): Promise<void> {
    await this.selectRadioByIdAndContinue(this.pageUrl, 'diedEngOrWales-2', this.nextPageUrl);
  }
}
