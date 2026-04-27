import { BasePage } from '../../base/BasePage';

export type AnyPredeceasedChildren =
  | 'yesSome'
  | 'yesAll'
  | 'no';

export class AnyPredeceasedChildrenPage extends BasePage {
  private readonly pageUrl = /\/intestacy\/any-predeceased-children$/;
  private readonly nextPageUrl = /\/intestacy\/any-surviving-grandchildren$/;

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
