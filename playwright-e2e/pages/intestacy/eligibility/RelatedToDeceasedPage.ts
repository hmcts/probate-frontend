import { BasePage } from '../../base/BasePage';
import { ROUTES } from '../../../constants/routes';

export class RelatedToDeceasedPage extends BasePage {
  private readonly pageUrl = ROUTES.relatedToDeceased;

  async selectSpouse(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue('related', ROUTES.taskList, 'Save and continue');
  }

  async selectChild(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue('related-2', ROUTES.taskList, 'Save and continue');
  }

  async selectGrandchild(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue('related-3', ROUTES.taskList, 'Save and continue');
  }

  async selectParent(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue('related-4', ROUTES.taskList, 'Save and continue');
  }

  async selectSibling(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue('related-5', ROUTES.taskList, 'Save and continue');
  }

  async selectOther(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue('related-7', ROUTES.taskList, 'Save and continue');
  }
}
