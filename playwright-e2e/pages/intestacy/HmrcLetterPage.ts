import { Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class HmrcLetterPage extends BasePage {
  private readonly pageUrl = /\/intestacy\/hmrc-letter$/;
  private readonly yesRadioId = 'hmrcLetterId';

  constructor(page: Page) {
    super(page);
  }

  async selectYes(): Promise<void> {
    await this.selectRadioByIdAndContinue(this.pageUrl, this.yesRadioId);
  }
}
