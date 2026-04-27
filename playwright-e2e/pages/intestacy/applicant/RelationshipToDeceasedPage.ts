import { BasePage } from '../../base/BasePage';

export type ApplicantRelationshipToDeceased =
  | 'spousePartner'
  | 'child'
  | 'grandchild'
  | 'none';

export class RelationshipToDeceasedPage extends BasePage {
  private readonly pageUrl = /\/intestacy\/relationship-to-deceased$/;
  private readonly nextPageUrl = /\/intestacy\/spouse-not-applying-reason$/;

  private readonly relationshipRadioIds: Record<ApplicantRelationshipToDeceased, string> = {
    spousePartner: 'relationshipToDeceased',
    child: 'relationshipToDeceased-2',
    grandchild: 'relationshipToDeceased-3',
    none: 'relationshipToDeceased-5',
  };

  async selectRelationship(relationship: ApplicantRelationshipToDeceased): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue(
      this.relationshipRadioIds[relationship],
      this.nextPageUrl,
      'Save and continue',
    );
  }

  async selectSpousePartner(): Promise<void> {
    await this.selectRelationship('spousePartner');
  }

  async selectChild(): Promise<void> {
    await this.selectRelationship('child');
  }

  async selectGrandchild(): Promise<void> {
    await this.selectRelationship('grandchild');
  }

  async selectNoneOfTheAbove(): Promise<void> {
    await this.selectRelationship('none');
  }
}
