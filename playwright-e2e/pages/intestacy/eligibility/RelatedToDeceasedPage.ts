import { BasePage } from '../../base/BasePage';

export type RelationshipToDeceased =
  | 'partner'
  | 'child'
  | 'grandchild'
  | 'parent'
  | 'sibling'
  | 'none';

export class RelatedToDeceasedPage extends BasePage {
  private readonly pageUrl = /\/related-to-deceased$/;
  private readonly nextPageUrl = /\/task-list$/;

  private readonly relationshipRadioIds: Record<RelationshipToDeceased, string> = {
    partner: 'related',
    child: 'related-2',
    grandchild: 'related-3',
    parent: 'related-4',
    sibling: 'related-5',
    none: 'related-7',
  };

  async selectRelationship(relationship: RelationshipToDeceased): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue(this.relationshipRadioIds[relationship], this.nextPageUrl, 'Continue');
  }

  async selectPartner(): Promise<void> {
    await this.selectRelationship('partner');
  }

  async selectChild(): Promise<void> {
    await this.selectRelationship('child');
  }

  async selectGrandchild(): Promise<void> {
    await this.selectRelationship('grandchild');
  }

  async selectParent(): Promise<void> {
    await this.selectRelationship('parent');
  }

  async selectSibling(): Promise<void> {
    await this.selectRelationship('sibling');
  }

  async selectNoneOfTheAbove(): Promise<void> {
    await this.selectRelationship('none');
  }
}
