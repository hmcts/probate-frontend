import { Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class AssetsOutsideEnglandWalesPage extends BasePage {
  private readonly pageUrl = /\/intestacy\/assets-outside-england-wales$/;
  private readonly noRadioId = 'assetsOutside-2';

  constructor(page: Page) {
    super(page);
  }

  async selectNo(): Promise<void> {
    await this.selectRadioByIdAndContinue(this.pageUrl, this.noRadioId);
  }
}
