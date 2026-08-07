import { IntestacyEligibilityScenario } from '../../../types/journey.types.ts';

export const soleChildScenario: IntestacyEligibilityScenario = {
  description: 'Sole applicant intestacy happy path as child',
  applicantType: 'sole',
  journeyType: 'intestacy',
  relationship: 'child',
};

export const soleSpouseScenario: IntestacyEligibilityScenario = {
  description: 'Sole applicant intestacy happy path as spouse',
  applicantType: 'sole',
  journeyType: 'intestacy',
  relationship: 'spouse',
};

export const commonIntestacyScenario = {
  uniqueProbateCode: 'CTS 040523 1104 3tpp s8e9',
  probateEstateValues: {
    grossValue: '2500',
    netValue: '2000',
  },
};

export const soleGrandchildScenario: IntestacyEligibilityScenario = {
  description: 'Sole applicant intestacy happy path as grandchild',
  applicantType: 'sole',
  journeyType: 'intestacy',
  relationship: 'grandchild',
};

export const soleParentScenario: IntestacyEligibilityScenario = {
  description: 'Sole applicant intestacy happy path as parent',
  applicantType: 'sole',
  journeyType: 'intestacy',
  relationship: 'parent',
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

export const soleChildApplicant = {
  firstName: 'Ellie Main',
  lastName: 'Applicant',
  phoneNumber: '07771 900 900',
  email: 'ellie.main.applicant@example.com',
  address: {
    line1: '22 Applicant Road',
    line2: 'Flat 4',
    line3: '',
    town: 'Croydon',
    postcode: 'CR0 2AA',
    country: 'United Kingdom',
  },
};

export const soleSpouseApplicant = {
  firstName: 'Sarah',
  lastName: 'Smith',
  phoneNumber: '07771 900 901',
  email: 'sarah.smith@example.com',
  address: {
    line1: '10 Married Street',
    line2: '',
    line3: '',
    town: 'London',
    postcode: 'SW1A 2BB',
    country: 'United Kingdom',
  },
};

export const soleGrandchildApplicant = {
  firstName: 'Emma',
  lastName: 'Brown',
  phoneNumber: '07771 900 902',
  email: 'emma.brown@example.com',
  address: {
    line1: '18 Grand Avenue',
    line2: '',
    line3: '',
    town: 'Manchester',
    postcode: 'M1 1AA',
    country: 'United Kingdom',
  },
};

export const soleParentApplicant = {
  firstName: 'Michael',
  lastName: 'Johnson',
  phoneNumber: '07771 900 903',
  email: 'michael.johnson@example.com',
  address: {
    line1: '12 Parent Street',
    line2: '',
    line3: '',
    town: 'Birmingham',
    postcode: 'B1 1AA',
    country: 'United Kingdom',
  },
};

export const soleSiblingApplicant = {
  firstName: 'Sarah',
  lastName: 'Taylor',
  phoneNumber: '07771 900 900',
  email: 'sarah.taylor@example.com',
  address: {
    line1: '10 High Street',
    line2: '',
    line3: '',
    town: 'Leeds',
    postcode: 'LS1 1AA',
    country: 'United Kingdom',
  },
};

export const paymentDetails = {
  cardNumber: '4242424242424242',
  expiryMonth: '10',
  expiryYear: '2028',
  cardholderName: 'Name',
  cvc: '123',
  address: {
    line1: 'Buckingham Palace',
    line2: '',
    city: 'London',
    country: 'United Kingdom',
    postcode: 'SW1A 1AA',
  },
  email: '11052026ITHCTU1@mailinator.com',
};
