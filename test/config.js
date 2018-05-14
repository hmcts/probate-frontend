module.exports = {
    TestIdamBaseUrl: process.env.TEST_IDAM_API_URL || 'http://localhost:8484',
    TestFrontendUrl_backup: process.env.TEST_E2E_FRONTEND_URL || 'http://localhost:3000',
    TestFrontendUrl: process.env.TEST_URL || 'http://localhost:3000',
    TestUseIdam: process.env.TEST_USE_IDAM || 'true',
    TestIdamLoginUrl: process.env.TEST_IDAM_LOGIN_URL || 'https://localhost:8000/login',
    TestIdamAddUserUrl: '/testing-support/accounts',
    TestIdamRole: 'probate-private-beta',
    TestCitizenDomain: '@probateTest.com',
    TestGovUkConfirmPaymentUrl: 'www.payments.service.gov.uk',
    TestEnvEmailAddress: 'test.probate.inbox@gmail.com',
    paymentEnvironments: ['test'],
    links: {
        cookies: '/cookies',
        privacy: '/privacy-policy',
        terms: '/terms-conditions',
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
        survey: 'http://www.smartsurvey.co.uk/',
        surveyEndOfApplication: 'http://www.smartsurvey.co.uk/',
        ihtNotCompleted: 'https://www.gov.uk/valuing-estate-of-someone-who-died/tell-hmrc-estate-value',
        renunciationForm: 'public/pdf/renunciation.pdf'
    },
    helpline: {
        number: '0300 303 0648',
        hours: 'Monday to Friday, 9am to 5pm'
    }
};
