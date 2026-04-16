import { Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class NewSubmittedToHmrcPage extends BasePage {
  private readonly pageUrl = /\/intestacy\/new-submitted-to-hmrc$/;
  private readonly yesRadioId = 'estateValueCompleted';

  constructor(page: Page) {
    super(page);
  }

  async selectYes(): Promise<void> {
    await this.selectRadioByIdAndContinue(this.pageUrl, this.yesRadioId);
  }
}
