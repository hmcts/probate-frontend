import { expect } from '@playwright/test';
import { BasePage } from '../../base/BasePage.ts';
import { ROUTES } from '../../../constants/routes.ts';

export class WholeSiblingsSurvivingChildrenPage extends BasePage {
  private readonly pageUrl = ROUTES.intestacyWholeSiblingsSurvivingChildren;
  private readonly nextPageUrl = ROUTES.intestacyWholeNiecesWholeNephewsAge;

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
