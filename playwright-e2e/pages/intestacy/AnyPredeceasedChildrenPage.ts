import { Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class AnyPredeceasedChildrenPage extends BasePage {
  private readonly pageUrl = /\/intestacy\/any-predeceased-children$/;
  private readonly yesSomeRadioId = 'anyPredeceasedChildren';
  private readonly yesAllRadioId = 'anyPredeceasedChildren-2';
  private readonly noRadioId = 'anyPredeceasedChildren-3';

  constructor(page: Page) {
    super(page);
  }

  async selectYesSomeAndContinue(): Promise<void> {
    await this.selectRadioByIdAndContinue(this.pageUrl, this.yesSomeRadioId);
  }

  async selectYesAllAndContinue(): Promise<void> {
    await this.selectRadioByIdAndContinue(this.pageUrl, this.yesAllRadioId);
  }

  async selectNoAndContinue(): Promise<void> {
    await this.selectRadioByIdAndContinue(this.pageUrl, this.noRadioId);
  }
}
