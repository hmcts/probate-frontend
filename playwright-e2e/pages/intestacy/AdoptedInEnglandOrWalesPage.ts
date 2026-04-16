import { Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class AdoptedInEnglandOrWalesPage extends BasePage {
  private readonly pageUrl = /\/intestacy\/adopted-in-england-or-wales$/;
  private readonly yesRadioId = 'adoptionPlace';
  private readonly noRadioId = 'adoptionPlaceNo';

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
