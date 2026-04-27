import { BasePage } from '../../base/BasePage';

export type SpouseNotApplyingReason =
  | 'renouncing'
  | 'other';

export class SpouseNotApplyingReasonPage extends BasePage {
  private readonly pageUrl = /\/intestacy\/spouse-not-applying-reason$/;
  private readonly nextPageUrl = /\/intestacy\/main-applicant-adopted-in$/;

  private readonly reasonRadioIds: Record<SpouseNotApplyingReason, string> = {
    renouncing: 'spouseNotApplyingReason',
    other: 'spouseNotApplyingReason-2',
  };

  async selectReason(reason: SpouseNotApplyingReason): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue(
      this.reasonRadioIds[reason],
      this.nextPageUrl,
      'Save and continue',
    );
  }

  async selectGivingUpRightToApply(): Promise<void> {
    await this.selectReason('renouncing');
  }

  async selectOther(): Promise<void> {
    await this.selectReason('other');
  }
}
