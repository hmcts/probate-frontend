import { Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class WillLeftPage extends BasePage {
  private readonly pageUrl = /will-left/;

  constructor(page: Page) {
    super(page);
  }

  async selectYes(): Promise<void> {
    await this.selectRadioByIdAndContinue(this.pageUrl, 'left');
  }

  async selectNo(): Promise<void> {
    await this.selectRadioByIdAndContinue(this.pageUrl, 'left-2');
  }
}
