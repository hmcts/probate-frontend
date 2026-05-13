import { expect } from '@playwright/test';
import { BasePage } from '../../base/BasePage';
import { ROUTES } from '../../../constants/routes';

export class EqualityAndDiversityPage extends BasePage {
  private readonly pageUrl = ROUTES.equalityAndDiversity;

  async optOut(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    const button = this.page.getByRole('button', { name: "I don't want to answer these questions", exact: true });
    await expect(button).toBeVisible();
    await expect(button).toBeEnabled();
    await button.click();
  }
}
