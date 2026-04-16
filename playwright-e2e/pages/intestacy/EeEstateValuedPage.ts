import { Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class EeEstateValuedPage extends BasePage {
  private readonly pageUrl = /ee-estate-valued/;
  private readonly nextPageUrl = /will-left/;

  constructor(page: Page) {
    super(page);
  }

  async selectYes(): Promise<void> {
    await this.selectRadioByIdAndContinue(this.pageUrl, 'eeEstateValued', this.nextPageUrl);
  }

  async selectNo(): Promise<void> {
    await this.selectRadioByIdAndContinue(this.pageUrl, 'eeEstateValued-2', this.nextPageUrl);
  }
}
