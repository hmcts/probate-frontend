module.exports = {

    TestCitizenDomain: process.env.CITIZEN_EMAIL_DOMAIN || '/@probateTest.com',
    TestDocumentToUpload: 'uploadDocuments/test_file_for_document_upload.png',
    TestE2EFrontendUrl: process.env.TEST_URL || 'http://localhost:3000',
    TestFrontendUrl: process.env.TEST_URL || 'http://localhost:3000',
    TestIdamAddUserUrl: process.env.IDAM_ADD_USER_URL || '/testing-support/accounts',
    TestIdamBaseUrl: process.env.IDAM_API_URL || 'http://localhost:5000',
    TestIdamLoginUrl: process.env.IDAM_LOGIN_URL || 'https://localhost:3501/login',
    TestIdamRole: process.env.IDAM_CITIZEN_ROLE || 'citizen',
    TestIdamUserGroup: process.env.IDAM_USER_GROUP || 'caseworker',
    TestInvitationUrl: process.env.INVITATION_URL,
    TestInviteIdListUrl: process.env.INVITE_ID_LIST_URL,
    TestOutputDir: process.env.E2E_OUTPUT_DIR || './output',
    TestPathToRun: process.env.FE_E2E_TEST_PATH_TO_RUN || './paths/**/*.test.js',
    TestPinUrl: process.env.PIN_URL,
    TestProxy: process.env.TEST_PROXY || 'socks5:proxyout.reform.hmcts.net:8080',
    TestRetryFeatures: process.env.RETRY_FEATURES || 4,
    TestRetryScenarios: process.env.RETRY_SCENARIOS || 4,
    TestRetrySteps: process.env.RETRY_STEPS || 4,
    TestShowBrowser: true,
    TestUseGovPay: process.env.USE_GOV_PAY || 'true',
    TestUseIdam: process.env.USE_IDAM || 'true',
    TestUseProxy: process.env.TEST_USE_PROXY || 'false',
    TestWaitForDocumentUpload: 60,
    TestWaitForTextToAppear: 60,
    TestWaitForElementToAppear: 60,
    TestOneMilliSecond: 1000,

    postcodeLookup: {
        token: process.env.ADDRESS_TOKEN,
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
        url: process.env.TEST_VALIDATION_SERVICE_URL || 'http://localhost:8081/validate'
    },

    TestGovUkConfirmPaymentUrl: 'www.payments.service.gov.uk',
    TestGovUkCardPaymentsUrl: '/card_details',

    TestEnvEmailAddress: process.env.TEST_EMAIL_ADDRESS || 'test.probate.inbox@gmail.com',
    TestEnvMobileNumber: process.env.TEST_MOBILE_NUMBER || '07765453421',
    s2sStubErrorSequence: '000',
    links: {
        cookies: '/cookies',
        terms: process.env.TERMS_AND_CONDITIONS,
        survey: process.env.SURVEY,
        surveyEndOfApplication: process.env.SURVEY_END_OF_APPLICATION,
        privacy: '/privacy-policy',
        contact: '/contact-us',
        callCharges: 'https://www.gov.uk/call-charges',
        howToManageCookies: 'https://www.aboutcookies.org',
        googlePrivacyPolicy: 'https://www.google.com/policies/privacy/partners/',
        googleAnalyticsOptOut: 'https://tools.google.com/dlpage/gaoptout/',
        mojPersonalInformationCharter: 'https://www.gov.uk/government/organisations/ministry-of-justice/about/personal-information-charter',
        goodThingsFoundation: 'https://www.goodthingsfoundation.org',
        subjectAccessRequest: 'https://www.gov.uk/government/publications/request-your-personal-data-from-moj',
        complaintsProcedure: 'https://www.gov.uk/government/organisations/hm-courts-and-tribunals-service/about/complaints-procedure',
        informationCommissionersOffice: 'https://ico.org.uk/global/contact-us',
        ihtNotCompleted: 'https://www.gov.uk/valuing-estate-of-someone-who-died/tell-hmrc-estate-value',
        applicationFormPA15: 'https://www.gov.uk/government/publications/form-pa15-apply-for-renunciation-will'
    },
    helpline: {
        number: '0300 303 0648',
        hours: 'Monday to Friday, 8:00am to 8:00pm. Saturday, 8:00am to 2:00pm.'
    },

    pact: {
        pactBrokerUrl: process.env.PACT_BROKER_URL || 'http://localhost:80'
    }
};
