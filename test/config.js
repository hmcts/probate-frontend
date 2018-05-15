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
    s2sStubErrorSequence: '000',
    links: {
        cookies: 'https://www.gov.uk/help/cookies',
        terms: '/terms-conditions',
        survey: 'http://www.smartsurvey.co.uk/',
        surveyEndOfApplication: 'http://www.smartsurvey.co.uk/'
    }
};
