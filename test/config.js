module.exports = {

    TestIdamBaseUrl: process.env.IDAM_API_URL || 'https://preprod-idamapi.reform.hmcts.net:3511',
    TestFrontendUrl: process.env.TEST_URL || 'https://probate-frontend-aat.service.core-compute-aat.internal',
    TestE2EFrontendUrl: process.env.TEST_E2E_URL || 'https://probate-frontend-aat.service.core-compute-aat.internal',
    TestUseIdam: process.env.USE_IDAM || 'true',
    TestUseSidam: process.env.USE_SIDAM || 'false',
    TestIdamLoginUrl: process.env.IDAM_LOGIN_URL || 'https://idam.preprod.ccidam.reform.hmcts.net/login',
    TestUseGovPay: process.env.USE_GOV_PAY || 'false',
    TestInviteIdListUrl: process.env.INVITE_ID_LIST_URL || '/inviteIdList',
    TestPinUrl: process.env.PIN_URL || '/pin',
    TestInvitationUrl: process.env.INVITATION_URL || '/executors/invitation',
    TestIdamAddUserUrl: process.env.IDAM_ADD_USER_URL || '/testing-support/accounts',
    TestIdamUserGroup: process.env.IDAM_USER_GROUP || 'probate-private-beta',
    TestIdamRole: process.env.IDAM_CITIZEN_ROLE || 'citizen',
    TestCitizenDomain: process.env.CITIZEN_EMAIL_DOMAIN || '/@probateTest.com',
    TestRetryScenarios: process.env.RETRY_SCENARIOS || 0,
    TestWaitForDocumentUpload: 60,

    postcodeLookup: {
        token: process.env.ADDRESS_TOKEN || 'Token 39b85db32c6f41f27561c49bf348a1ec10c96117',
        url: process.env.POSTCODE_SERVICE_URL || 'https://postcodeinfo.service.justice.gov.uk',
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

    validation: {
        url: process.env.TEST_VALIDATION_SERVICE_URL || 'http://localhost:8080/validate'
    },

    businessDocument: {
        url: process.env.TEST_BUSINESS_DOCUMENT_URL || 'http://localhost:8080/businessDocument'
    },

    TestGovUkConfirmPaymentUrl: 'www.payments.service.gov.uk',

    TestEnvEmailAddress: process.env.TEST_EMAIL_ADDRESS || 'test.probate.inbox@gmail.com',
    TestEnvMobileNumber: process.env.TEST_MOBILE_NUMBER || '07952626390',
    s2sStubErrorSequence: '000',
    links: {
        cookies: '/cookies',
        terms: process.env.TERMS_AND_CONDITIONS|| '/terms-conditions',
        survey: process.env.SURVEY || 'http://www.smartsurvey.co.uk/s/CFZF7/',
        surveyEndOfApplication: process.env.SURVEY_END_OF_APPLICATION || 'http://www.smartsurvey.co.uk/s/A2LY8/',
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
    }
};
