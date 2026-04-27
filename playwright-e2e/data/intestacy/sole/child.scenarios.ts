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

  export const mainApplicant = {
  firstName: 'Ellie Main',
  lastName: 'Applicant',
  phoneNumber: '07771 900 900',
  address: {
    line1: '22 Applicant Road',
    line2: 'Flat 4',
    line3: '',
    town: 'Croydon',
    postcode: 'CR0 2AA',
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
  email: '24042026ITHCAN1@mailinator.com',
};
