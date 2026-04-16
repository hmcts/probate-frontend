import { Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class RelationshipToDeceasedPage extends BasePage {
  private readonly pageUrl = /\/intestacy\/relationship-to-deceased$/;
  private readonly spousePartnerRadioId = 'relationshipToDeceased';
  private readonly childRadioId = 'relationshipToDeceased-2';
  private readonly grandchildRadioId = 'relationshipToDeceased-3';
  private readonly noneOfTheAboveRadioId = 'relationshipToDeceased-5';

  constructor(page: Page) {
    super(page);
  }

  async selectSpousePartnerAndContinue(): Promise<void> {
    await this.selectRadioByIdAndContinue(this.pageUrl, this.spousePartnerRadioId);
  }

  async selectChildAndContinue(): Promise<void> {
    await this.selectRadioByIdAndContinue(this.pageUrl, this.childRadioId);
  }

  async selectGrandchildAndContinue(): Promise<void> {
    await this.selectRadioByIdAndContinue(this.pageUrl, this.grandchildRadioId);
  }

  async selectNoneOfTheAboveAndContinue(): Promise<void> {
    await this.selectRadioByIdAndContinue(this.pageUrl, this.noneOfTheAboveRadioId);
  }
}
