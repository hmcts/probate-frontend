import { Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class CalcCheckPage extends BasePage {
  private readonly pageUrl = /\/intestacy\/calc-check$/;
  private readonly yesRadioId = 'calcCheckCompleted';

  constructor(page: Page) {
    super(page);
  }

  async selectYes(): Promise<void> {
    await this.selectRadioByIdAndContinue(this.pageUrl, this.yesRadioId);
  }
}
