import { Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class DeceasedAliasPage extends BasePage {
  private readonly pageUrl = /\/intestacy\/deceased-alias$/;
  private readonly noRadioId = 'alias-2';

  constructor(page: Page) {
    super(page);
  }

  async selectNo(): Promise<void> {
    await this.selectRadioByIdAndContinue(this.pageUrl, this.noRadioId);
  }
}
