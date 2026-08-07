import { BasePage } from '../../base/BasePage.ts';
import { ROUTES } from '../../../constants/routes.ts';

export type SpouseNotApplyingReason =
  | 'renouncing'
  | 'other';

export class SpouseNotApplyingReasonPage extends BasePage {
  private readonly pageUrl = ROUTES.intestacySpouseNotApplyingReason;
  private readonly nextPageUrl = ROUTES.intestacyMainApplicantsParentAlive;

  private readonly reasonRadioIds: Record<SpouseNotApplyingReason, string> = {
    renouncing: 'spouseNotApplyingReason',
    other: 'spouseNotApplyingReason-2',
  };

  async selectReason(reason: SpouseNotApplyingReason): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue(
      this.reasonRadioIds[reason],
      undefined,
      'Save and continue',
    );
  }

  async selectGivingUpRightToApply(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioById('spouseNotApplyingReason');
    await this.clickSaveAndContinue();
  }

  async selectOther(): Promise<void> {
    await this.selectReason('other');
  }
}
