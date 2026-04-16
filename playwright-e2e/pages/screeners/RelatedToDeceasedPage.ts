import { Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class RelatedToDeceasedPage extends BasePage {
  private readonly pageUrl = /related-to-deceased/;

  constructor(page: Page) {
    super(page);
  }

  async selectChild(): Promise<void> {
    await this.selectRadioByIdAndContinue(this.pageUrl, 'related-2');
  }
}
