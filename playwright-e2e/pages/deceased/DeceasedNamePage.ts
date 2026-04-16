import { expect, Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class DeceasedNamePage extends BasePage {
  private readonly pageUrl = /\/intestacy\/deceased-name$/;
  private readonly nextPageUrl = /\/intestacy\/deceased-dob$/;

  constructor(page: Page) {
    super(page);
  }

  async fillDeceasedName(firstName: string, lastName: string): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);

    const firstNameInput = this.getInputById('firstName');
    const lastNameInput = this.getInputById('lastName');

    await expect(firstNameInput).toBeVisible();
    await expect(lastNameInput).toBeVisible();

    await firstNameInput.fill(firstName);
    await lastNameInput.fill(lastName);
  }

  async saveAndContinue(): Promise<void> {
    const saveAndContinueButton = this.getSaveAndContinueButton();
    await expect(saveAndContinueButton).toBeVisible();

    await Promise.all([
      this.page.waitForURL(this.nextPageUrl),
      saveAndContinueButton.click(),
    ]);
  }

  async fillDeceasedNameAndContinue(firstName: string, lastName: string): Promise<void> {
    await this.fillDeceasedName(firstName, lastName);
    await this.saveAndContinue();
  }
}
