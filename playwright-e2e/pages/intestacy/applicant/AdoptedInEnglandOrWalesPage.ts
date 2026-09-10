import { expect } from '@playwright/test';
import { BasePage } from '../../base/BasePage.ts';
import { ROUTES } from '../../../constants/routes.ts';

export class AdoptedInEnglandOrWalesPage extends BasePage {
  private readonly pageUrl = ROUTES.intestacyAdoptedInEnglandOrWales;

  async selectYes(nextPageUrl: RegExp): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    const radio = this.page.getByLabel('Yes', { exact: true });
    await expect(radio).toBeVisible();
    await radio.click();
    await this.clickSaveAndContinue(nextPageUrl);
  }

  async selectNo(nextPageUrl: RegExp): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    const radio = this.page.getByLabel('No', { exact: true });
    await expect(radio).toBeVisible();
    await radio.click();
    await this.clickSaveAndContinue(nextPageUrl);
  }
}
