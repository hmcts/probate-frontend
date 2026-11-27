export type ApplicantType = 'sole' | 'joint';
export type JourneyType = 'intestacy' | 'probate';
export type RelationshipType =
  | 'child'
  | 'grandchild'
  | 'parent'
  | 'sibling-whole-blood'
  | 'sibling-half-blood'
  | 'niece-nephew-whole-blood'
  | 'niece-nephew-half-blood'
  | 'spouse';

export interface UserCredentials {
  email: string;
  password: string;
}

export interface IntestacyEligibilityScenario {
  description: string;
  applicantType: ApplicantType;
  journeyType: 'intestacy';
  relationship: RelationshipType;
}
