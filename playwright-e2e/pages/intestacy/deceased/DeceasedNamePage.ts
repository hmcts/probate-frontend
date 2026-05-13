import { BasePage } from '../../base/BasePage.ts';
import { ROUTES } from '../../../constants/routes.ts';

export class DeceasedNamePage extends BasePage {
  private readonly pageUrl = ROUTES.intestacyDeceasedName;
  private readonly nextPageUrl = ROUTES.intestacyDeceasedDob;

  async fillDeceasedNameAndContinue(firstName: string, lastName: string): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.getInputById('firstName').fill(firstName);
    await this.getInputById('lastName').fill(lastName);
    await this.clickSaveAndContinue(this.nextPageUrl);
  }
}
