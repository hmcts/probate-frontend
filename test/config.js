module.exports = {

    // TestIdamBaseUrl: process.env.TEST_IDAM_API_URL || 'http://localhost:8484',
    // TestFrontendUrl: process.env.TEST_E2E_FRONTEND_URL || 'https://localhost:3000',
    // TestUseIdam: process.env.TEST_USE_IDAM || 'true',
    // TestIdamLoginUrl: process.env.TEST_IDAM_LOGIN_URL || 'https://localhost:8000/login',


    TestIdamBaseUrl: process.env.TEST_IDAM_API_URL || 'https://idam.dev.ccidam.reform.hmcts.net',
    TestFrontendUrl: process.env.TEST_E2E_FRONTEND_URL || 'https://www-dev.probate.reform.hmcts.net',
    TestUseIdam: process.env.TEST_USE_IDAM || 'true',
    TestIdamLoginUrl: process.env.TEST_IDAM_LOGIN_URL || 'https://idam.dev.ccidam.reform.hmcts.net/login',


    TestInviteIdListUrl: '/inviteIdList',
    TestPinUrl: '/pin',
    TestInvitiationUrl: '/executors/invitation',
    TestIdamAddUserUrl: '/testing-support/accounts',
    TestIdamRole: 'probate-private-beta',
    TestCitizenDomain: '@probateTest.com',

    TestGovUkConfirmPaymentUrl: 'www.payments.service.gov.uk',

    TestEnvEmailAddress: 'test.probate.inbox@gmail.com',
    TestEnvMobileNumber: '07952626390',

    paymentEnvironments: ['test'],


    links: {
        cookies: 'https://www.gov.uk/help/cookies',
        terms: '/terms-conditions',
        survey: 'http://www.smartsurvey.co.uk/s/CFZF7/',
        surveyEndOfApplication: 'http://www.smartsurvey.co.uk/s/A2LY8/'
    },


};
