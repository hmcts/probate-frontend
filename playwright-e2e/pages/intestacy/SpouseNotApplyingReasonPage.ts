import { Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class SpouseNotApplyingReasonPage extends BasePage {
  private readonly pageUrl = /\/intestacy\/spouse-not-applying-reason$/;
  private readonly renouncingRadioId = 'spouseNotApplyingReason';
  private readonly otherRadioId = 'spouseNotApplyingReason-2';

  constructor(page: Page) {
    super(page);
  }

  async selectGivingUpRightToApplyAndContinue(): Promise<void> {
    await this.selectRadioByIdAndContinue(this.pageUrl, this.renouncingRadioId);
  }

  async selectOtherAndContinue(): Promise<void> {
    await this.selectRadioByIdAndContinue(this.pageUrl, this.otherRadioId);
  }
}
