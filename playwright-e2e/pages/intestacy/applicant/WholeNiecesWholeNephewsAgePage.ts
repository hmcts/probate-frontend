import { expect } from '@playwright/test';
import { BasePage } from '../../base/BasePage.ts';
import { ROUTES } from '../../../constants/routes.ts';

export class WholeNiecesWholeNephewsAgePage extends BasePage {
  private readonly pageUrl = ROUTES.intestacyWholeNiecesWholeNephewsAge;
  private readonly nextPageUrl = ROUTES.intestacyWholeSiblingsAge;

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
