import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class ApplicantNamePage extends BasePage {
  private readonly pageUrl = /\/intestacy\/applicant-name$/;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly saveAndContinueButton: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator('#firstName');
    this.lastNameInput = page.locator('#lastName');
    this.saveAndContinueButton = page.getByRole('button', { name: 'Save and continue' });
  }

  async fillApplicantNameAndContinue(firstName: string, lastName: string): Promise<void> {
    await expect(this.page).toHaveURL(this.pageUrl);
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.saveAndContinueButton.click();
  }
}
