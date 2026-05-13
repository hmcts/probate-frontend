import { expect } from '@playwright/test';
import { BasePage } from '../../base/BasePage';
import { ROUTES } from '../../../constants/routes';

export class DeceasedOtherWholeSiblingsPage extends BasePage {
  private readonly pageUrl = ROUTES.intestacyDeceasedOtherWholeSiblings;
  private readonly nextPageUrl = ROUTES.intestacyDeceasedWholeSiblings;

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
