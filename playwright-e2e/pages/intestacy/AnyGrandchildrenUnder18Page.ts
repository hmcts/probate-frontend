import { Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class AnyGrandchildrenUnder18Page extends BasePage {
  private readonly pageUrl = /\/intestacy\/any-grandchildren-under-18$/;
  private readonly yesRadioId = 'anyGrandchildrenUnder18';
  private readonly noRadioId = 'anyGrandchildrenUnder18-2';

  constructor(page: Page) {
    super(page);
  }

  async selectYesAndContinue(): Promise<void> {
    await this.selectRadioByIdAndContinue(this.pageUrl, this.yesRadioId);
  }

  async selectNoAndContinue(): Promise<void> {
    await this.selectRadioByIdAndContinue(this.pageUrl, this.noRadioId);
  }
}
