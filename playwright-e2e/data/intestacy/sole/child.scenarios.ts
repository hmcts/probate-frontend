import { IntestacyEligibilityScenario } from '../../../types/journey.types';

export const soleChildScenario: IntestacyEligibilityScenario = {
  description: 'Sole applicant intestacy happy path as child',
  applicantType: 'sole',
  journeyType: 'intestacy',
  relationship: 'child',
};

export const deceased = {
  firstName: 'John',
  lastName: 'Smith',
  dob: { day: '15', month: '06', year: '1950' },
  dod: { day: '20', month: '03', year: '2024' },
  address: {
    line1: 'Buckingham Palace',
    line2: '',
    line3: '',
    town: 'London',
    postcode: 'SW1A 1AA',
    country: 'United Kingdom',
  },
};
