import { Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class EeDeceasedDodPage extends BasePage {
  private readonly pageUrl = /ee-deceased-dod/;
  private readonly nextPageUrl = /ee-estate-valued/;

  constructor(page: Page) {
    super(page);
  }

  async selectYes(): Promise<void> {
    await this.selectRadioByIdAndContinue(this.pageUrl, 'eeDeceasedDod', this.nextPageUrl);
  }

  async selectNo(): Promise<void> {
    await this.selectRadioByIdAndContinue(this.pageUrl, 'eeDeceasedDod-2', this.nextPageUrl);
  }
}
