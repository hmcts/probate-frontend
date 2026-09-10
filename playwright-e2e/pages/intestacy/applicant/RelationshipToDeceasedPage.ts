import { BasePage } from '../../base/BasePage.ts';
import { ROUTES } from '../../../constants/routes.ts';

export class RelationshipToDeceasedPage extends BasePage {
  private readonly pageUrl = ROUTES.intestacyRelationshipToDeceased;

  async selectSpouse(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.page
      .locator('input[name="relationshipToDeceased"][value="optionSpousePartner"]')
      .setChecked(true);
    await this.clickSaveAndContinue(ROUTES.intestacyApplicantName);
  }

  async selectChild(
    nextPageUrl: RegExp = ROUTES.intestacySpouseNotApplyingReason
  ): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.page
      .locator('input[name="relationshipToDeceased"][value="optionChild"]')
      .setChecked(true);

    await this.clickSaveAndContinue(nextPageUrl);
  }

  async selectGrandchild(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.page
      .locator('input[name="relationshipToDeceased"][value="optionGrandchild"]')
      .setChecked(true);
    await this.clickSaveAndContinue(ROUTES.intestacySpouseNotApplyingReason);
  }

  async selectParent(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.page
      .locator('input[name="relationshipToDeceased"][value="optionParent"]')
      .setChecked(true);
    await this.clickSaveAndContinue(ROUTES.intestacyAnyLivingDescendants);
  }

  async selectSibling(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.page
      .locator('input[name="relationshipToDeceased"][value="optionSibling"]')
      .setChecked(true);
    await this.clickSaveAndContinue(ROUTES.intestacyAnyLivingDescendants);
  }

  async selectOther(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.page
      .locator('input[name="relationshipToDeceased"][value="optionOther"]')
      .setChecked(true);
  }
}
