import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class ProbateEstateValuesPage extends BasePage {
  private readonly pageUrl = /\/intestacy\/probate-estate-values$/;
  private readonly grossValueInput: Locator;
  private readonly netValueInput: Locator;
  private readonly saveAndContinueButton: Locator;

  constructor(page: Page) {
    super(page);
    this.grossValueInput = page.locator('#grossValueField');
    this.netValueInput = page.locator('#netValueField');
    this.saveAndContinueButton = page.getByRole('button', { name: 'Save and continue' });
  }

  async fillEstateValuesAndContinue(grossValue: string, netValue: string): Promise<void> {
    await expect(this.page).toHaveURL(this.pageUrl);
    await this.grossValueInput.fill(grossValue);
    await this.netValueInput.fill(netValue);
    await this.saveAndContinueButton.click();
  }
}
