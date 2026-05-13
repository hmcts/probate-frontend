import { BasePage } from '../../base/BasePage';
import { ROUTES } from '../../../constants/routes';

export type AnyPredeceasedChildren =
  | 'yesSome'
  | 'yesAll'
  | 'no';

export class AnyPredeceasedChildrenPage extends BasePage {
  private readonly pageUrl = ROUTES.intestacyAnyPredeceasedChildren;
  private readonly nextPageUrl = ROUTES.intestacyAnySurvivingGrandchildren;

  private readonly predeceasedRadioIds: Record<AnyPredeceasedChildren, string> = {
    yesSome: 'anyPredeceasedChildren',
    yesAll: 'anyPredeceasedChildren-2',
    no: 'anyPredeceasedChildren-3',
  };

  async selectPredeceasedChildren(option: AnyPredeceasedChildren): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue(
      this.predeceasedRadioIds[option],
      this.nextPageUrl,
      'Save and continue',
    );
  }

  async selectYesSome(): Promise<void> {
    await this.selectPredeceasedChildren('yesSome');
  }

  async selectYesAll(): Promise<void> {
    await this.selectPredeceasedChildren('yesAll');
  }

  async selectNo(): Promise<void> {
    await this.selectPredeceasedChildren('no');
  }
}
