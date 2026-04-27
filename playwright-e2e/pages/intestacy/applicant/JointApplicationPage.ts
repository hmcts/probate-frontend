import { BasePage } from '../../base/BasePage';

export class JointApplicationPage extends BasePage {
  private readonly pageUrl = /\/intestacy\/joint-application$/;
  private readonly nextPageUrl = /https:\/\/pcq\.ithc\.platform\.hmcts\.net\/start-page/;

  async selectNo(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue(
      'hasCoApplicant-2',
      this.nextPageUrl,
    );
  }
}
