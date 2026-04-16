import { Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class AnySurvivingGrandchildrenPage extends BasePage {
  private readonly pageUrl = /\/intestacy\/any-surviving-grandchildren$/;
  private readonly yesRadioId = 'anySurvivingGrandchildren';
  private readonly noRadioId = 'anySurvivingGrandchildren-2';

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
