import { BasePage } from '../../base/BasePage';
import { ROUTES } from '../../../constants/routes';

export type DeceasedMaritalStatus =
  | 'married'
  | 'divorced'
  | 'separated'
  | 'widowed'
  | 'neverMarried';

export class DeceasedMaritalStatusPage extends BasePage {
  private readonly pageUrl = ROUTES.intestacyDeceasedMaritalStatus;

  private readonly maritalStatusRadioIds: Record<DeceasedMaritalStatus, string> = {
    married: 'maritalStatus',
    divorced: 'maritalStatus-2',
    separated: 'maritalStatus-3',
    widowed: 'maritalStatus-4',
    neverMarried: 'maritalStatus-5',
  };

  async selectMaritalStatus(status: DeceasedMaritalStatus): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue(
      this.maritalStatusRadioIds[status],
      undefined,
      'Save and continue',
    );
  }

  async selectMarried(): Promise<void> {
    await this.selectMaritalStatus('married');
  }

  async selectDivorced(): Promise<void> {
    await this.selectMaritalStatus('divorced');
  }

  async selectSeparated(): Promise<void> {
    await this.selectMaritalStatus('separated');
  }

  async selectWidowed(): Promise<void> {
    await this.selectMaritalStatus('widowed');
  }

  async selectNeverMarried(): Promise<void> {
    await this.selectMaritalStatus('neverMarried');
  }
}
