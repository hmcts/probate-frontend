module.exports = {

    TestIdamBaseUrl: process.env.IDAM_API_URL || 'http://localhost:8484',
    TestFrontendUrl: process.env.TEST_URL || 'https://localhost:3000',
    TestUseIdam: process.env.USE_IDAM || 'true',
    TestIdamLoginUrl: process.env.IDAM_LOGIN_URL || 'https://localhost:8000/login',

    TestInviteIdListUrl: process.env.INVITE_ID_LIST_URL,
    TestPinUrl: process.env.PIN_URL,
    TestInvitationUrl: process.env.INVITATION_URL,
    TestIdamAddUserUrl: process.env.IDAM_ADD_USER_URL,
    TestIdamRole: process.env.IDAM_CITIZEN_ROLE,
    TestCitizenDomain: process.env.CITIZEN_EMAIL_DOMAIN,

    TestGovUkConfirmPaymentUrl: 'www.payments.service.gov.uk',

    TestEnvEmailAddress: process.TEST_EMAIL_ADDRESS,
    TestEnvMobileNumber: process.env.TEST_MOBILE_NUMBER,

    links: {
        cookies: 'https://www.gov.uk/help/cookies',
        terms: process.env.TERMS_AND_CONDITIONS,
        survey: process.env.SURVEY,
        surveyEndOfApplication: process.env.SURVEY_END_OF_APPLICATION
    },

};
