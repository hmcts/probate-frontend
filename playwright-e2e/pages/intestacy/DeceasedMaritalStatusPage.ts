import { Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class DeceasedMaritalStatusPage extends BasePage {
  private readonly pageUrl = /\/intestacy\/deceased-marital-status$/;
  private readonly marriedRadioId = 'maritalStatus';
  private readonly divorcedRadioId = 'maritalStatus-2';
  private readonly separatedRadioId = 'maritalStatus-3';
  private readonly widowedRadioId = 'maritalStatus-4';
  private readonly neverMarriedRadioId = 'maritalStatus-5';

  constructor(page: Page) {
    super(page);
  }

  async selectMarriedAndContinue(): Promise<void> {
    await this.selectRadioByIdAndContinue(this.pageUrl, this.marriedRadioId);
  }

  async selectDivorcedAndContinue(): Promise<void> {
    await this.selectRadioByIdAndContinue(this.pageUrl, this.divorcedRadioId);
  }

  async selectSeparatedAndContinue(): Promise<void> {
    await this.selectRadioByIdAndContinue(this.pageUrl, this.separatedRadioId);
  }

  async selectWidowedAndContinue(): Promise<void> {
    await this.selectRadioByIdAndContinue(this.pageUrl, this.widowedRadioId);
  }

  async selectNeverMarriedAndContinue(): Promise<void> {
    await this.selectRadioByIdAndContinue(this.pageUrl, this.neverMarriedRadioId);
  }
}
