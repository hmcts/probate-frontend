import { expect } from '@playwright/test';
import { BasePage } from '../../base/BasePage';
import { ROUTES } from '../../../constants/routes';

export class JointApplicationPage extends BasePage {
  private readonly pageUrl = ROUTES.intestacyJointApplication;
  private readonly nextPageUrl = ROUTES.equalityAndDiversity;

  async selectYes(): Promise<void> {
    await expect(this.page).toHaveURL(this.pageUrl);
    await this.selectRadioByIdAndContinue(
      'hasCoApplicant',
      this.nextPageUrl,
      'Save and continue',
    );
  }

  async selectNo(): Promise<void> {
  if (this.page.url().includes('/start-page')) {
    await expect(this.page).toHaveURL(ROUTES.equalityAndDiversity);
    return;
  }

  await this.waitForPageUrl(this.pageUrl);
  await this.selectRadioByIdAndContinue(
    'hasCoApplicant-2',
    ROUTES.equalityAndDiversity,
    'Save and continue',
  );
  }
}
