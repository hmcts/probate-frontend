import * as dotenv from 'dotenv';

dotenv.config({path: './test/playwrightTest/.env'});

export const testConfig = {
  environment: 'sandbox',
  featureToggles: {
    enabled: true,
    launchDarklyKey: 'sdk-4d50eb6e-8400-4aa7-b4c5-8bdfc8b1d844',
    launchDarklyUser: {
      firstName: 'Marian',
      lastName: 'Local',
      key: 'Marian.Irudayanathan@justice.gov.uk'
    }
  },

  configFeatureToggles: {
    webchatEnabled: false,
    gaEnabled: false
  },

  TestCitizenDomain: '/@probateTest.com',
  TestDocumentToUpload: 'uploadDocuments/test_file_for_document_upload.png',
  TestE2EFrontendUrl: 'https://probate-frontend-pr-2734.preview.platform.hmcts.net',
  TestFrontendUrl: 'https://probate-frontend-pr-2734.preview.platform.hmcts.net',
  TestIdamAddUserUrl: '/testing-support/accounts',
  TestIdamBaseUrl: 'https://idam-api.aat.platform.hmcts.net',
  TestIdamLoginUrl: 'https://idam-web-public.aat.platform.hmcts.net/login',
  TestIdamRole: 'citizen',
  TestIdamUserGroup: 'caseworker',
  TestOutputDir: './functional-output',
  TestPathToRun: './paths/**/*.js',
  TestProxy: 'socks5:proxyout.reform.hmcts.net:8080',
  TestRetryFeatures: 0,
  TestRetryScenarios: 0,
  TestRetrySteps: 0,
  TestShowBrowser: 'true',
  TestUseGovPay: 'true',
  TestUseIdam: 'true',
  TestUseProxy: false,
  TestWaitForDocumentUpload: 60,
  TestWaitForTextToAppear: 120,
  TestWaitForElementToAppear: 60,
  TestOneMilliSecond: 1000,
  TestEnvEmailAddress: 'test.probate.inbox@gmail.com',
  TestEnvMobileNumber: '07771900900',
  TestEnvEmailAddress1: 'test1.probate.inbox@gmail.com',
  TestEnvMobileNumber1: '07771900901',
  TestEnvEmailAddress2: 'test2.probate.inbox@gmail.com',
  TestEnvMobileNumber2: '07771900902',
  TestEnvEmailAddress3: 'test3.probate.inbox@gmail.com',
  TestEnvMobileNumber3: '07771900903',
  TestInviteIdListUrl: '/inviteIdList',
  TestInvitationUrl: '/executors/invitation',
  TestIntestacyInvitationUrl: '/executors/intestacy-invitation',

  postcodeLookup: {
    contentType: 'application/json',
    singleAddressPostcode: 'SW1A 1AA',
    singleOrganisationName: 'BUCKINGHAM PALACE',
    singleFormattedAddress: 'BUCKINGHAM PALACE, LONDON, SW1A 1AA',
    multipleAddressPostcode: 'N145JY',
    partialAddressPostcode: 'N14',
    invalidAddressPostcode: 'Z99 9ZZ',
    emptyAddressPostcode: ''
  },

  govPayTestCardNos: {
    validCardNo: '4242424242424242'
  },

  govPayTestCardDetails: {
    expiryMonth: '06',
    expiryYear: '99',
    cardholderName: 'Test Payment',
    cvc: '123',
    addressLine1: '1',
    addressCity: 'London',
    addressPostcode: 'SW1A1AA'
  },

  validation: {
    url: 'http://localhost:8081/validate'
  },

  TestGovUkConfirmPaymentUrl: 'www.payments.service.gov.uk',
  TestGovUkCardPaymentsUrl: '/card_details',

  s2sStubErrorSequence: '000',

  pact: {
    pactBrokerUrl: 'http://localhost:80'
  }

};
