module.exports = {

    TestIdamBaseUrl: process.env.IDAM_API_URL || 'https://idam-api.aat.platform.hmcts.net',
    TestFrontendUrl: process.env.TEST_URL || 'https://probate-frontend-aat.service.core-compute-aat.internal',
    TestE2EFrontendUrl: process.env.TEST_E2E_URL || 'https://probate-frontend-aat.service.core-compute-aat.internal',
    TestUseIdam: process.env.USE_IDAM || 'true',
    TestIdamLoginUrl: process.env.IDAM_LOGIN_URL || 'https://localhost:8000/login',
    TestUseGovPay: process.env.USE_GOV_PAY || 'true',
    TestInviteIdListUrl: process.env.INVITE_ID_LIST_URL || '/inviteIdList',
    TestPinUrl: process.env.PIN_URL || '/pin',
    TestInvitationUrl: process.env.INVITATION_URL || '/executors/invitation',
    TestIdamAddUserUrl: process.env.IDAM_ADD_USER_URL || '/testing-support/accounts',
    TestIdamUserGroup: process.env.IDAM_USER_GROUP || 'probate-private-beta',
    TestIdamRole: process.env.IDAM_CITIZEN_ROLE || 'citizen',
    TestCitizenDomain: process.env.CITIZEN_EMAIL_DOMAIN || '/@probateTest.com',
    TestUseProxy: process.env.TEST_USE_PROXY || 'true',
    TestProxy: process.env.TEST_PROXY || 'socks5:proxyout.reform.hmcts.net:8080',
    TestRetryFeatures: process.env.RETRY_FEATURES || 3,
    TestRetryScenarios: process.env.RETRY_SCENARIOS || 0,
    TestDocumentToUpload: 'uploadDocuments/test_file_for_document_upload.png',
    TestShowBrowserWindow: process.env.SHOW_BROWSER_WINDOW || true,
    TestWaitForDocumentUpload: 60,
    TestOutputDir: process.env.E2E_OUTPUT_DIR || './output',
    TestPathToRun: './paths/**/singleExecutorsPath.js',

    postcodeLookup: {
        token: process.env.ADDRESS_TOKEN,
        url: process.env.POSTCODE_SERVICE_URL,
        endpoint: process.env.POSTCODE_SERVICE_ENDPOINT || '/addresses',
        contentType: 'application/json',
        singleAddressPostcode: 'SW1A 1AA',
        singleOrganisationName: 'BUCKINGHAM PALACE',
        singleFormattedAddress: 'Buckingham Palace\nLondon\nSW1A 1AA',
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
        url: process.env.TEST_VALIDATION_SERVICE_URL || 'http://localhost:8080/validate'
    },

    TestGovUkConfirmPaymentUrl: 'www.payments.service.gov.uk',

    TestEnvEmailAddress: process.env.TEST_EMAIL_ADDRESS || 'douglas.rice@hmcts.net',
    TestEnvMobileNumber: process.env.TEST_MOBILE_NUMBER || '07773055642',
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
        hours: 'Monday to Friday, 9:30am to 5pm'
    },

    pact: {
        pactBrokerUrl: process.env.PACT_BROKER_URL || 'http://localhost:80'
    },
};
