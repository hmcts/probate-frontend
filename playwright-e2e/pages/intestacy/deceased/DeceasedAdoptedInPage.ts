import { expect } from '@playwright/test';
import { BasePage } from '../../base/BasePage';
import { ROUTES } from '../../../constants/routes';

export class DeceasedAdoptedInPage extends BasePage {
  private readonly pageUrl = ROUTES.intestacyDeceasedAdoptedIn;
  private readonly nextPageUrl = ROUTES.intestacyDeceasedAdoptionPlace;

  async selectYes(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    const radio = this.page.getByLabel('Yes', { exact: true });
    await expect(radio).toBeVisible();
    await radio.click();
    await this.clickSaveAndContinue(this.nextPageUrl);
  }

  async selectNo(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    const radio = this.page.getByLabel('No', { exact: true });
    await expect(radio).toBeVisible();
    await radio.click();
    await this.clickSaveAndContinue(this.nextPageUrl);
  }
}
