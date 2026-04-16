import { Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class AnyOtherChildrenPage extends BasePage {
  private readonly pageUrl = /\/intestacy\/any-other-children$/;
  private readonly yesRadioId = 'anyOtherChildren';
  private readonly noRadioId = 'anyOtherChildren-2';

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
