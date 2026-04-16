import { Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class AllChildrenOver18Page extends BasePage {
  private readonly pageUrl = /\/intestacy\/all-children-over-18$/;
  private readonly yesRadioId = 'allChildrenOver18';
  private readonly noRadioId = 'allChildrenOver18-2';

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
