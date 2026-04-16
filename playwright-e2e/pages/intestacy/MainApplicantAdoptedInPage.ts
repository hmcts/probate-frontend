import { Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class MainApplicantAdoptedInPage extends BasePage {
  private readonly pageUrl = /\/intestacy\/main-applicant-adopted-in$/;
  private readonly yesRadioId = 'adoptedIn';
  private readonly noRadioId = 'adoptedIn-2';

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
