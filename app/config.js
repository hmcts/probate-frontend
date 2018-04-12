
module.exports = {
    environment: 'development',
    service: {
        name: 'Apply for probate',
        version: ''
    },
    port: process.env.PORT || '3000',
    useAuth: 'false',
    useIDAM: 'false',
    useHttps: 'false',
    useCSRFProtection: 'true',
    cookieText: 'GOV.UK uses cookies to make the site simpler. <a href="http://gov.uk/help/cookies" title="Find out more about cookies">Find out more about cookies</a>',
    services: {
        postcode: {
            url: process.env.POSTCODE_SERVICE_URL,
            token: process.env.POSTCODE_SERVICE_TOKEN,
            proxy: process.env.http_proxy
        },
        validation: {
            url: process.env.VALIDATION_SERVICE_URL || 'http://localhost:8080/validate'
        },
        submit: {
            url: process.env.SUBMIT_SERVICE_URL || 'http://localhost:8181/submit',
            port: 8181,
            path: '/submit'
        },
        persistence: {
            url: process.env.PERSISTENCE_SERVICE_URL || 'http://localhost:8282/formdata',
            port: 8282,
            path: '/formdata'
        },
        idam: {
            loginUrl: process.env.IDAM_LOGIN_URL || 'https://localhost:8000/login',
            apiUrl: process.env.IDAM_API_URL || 'http://localhost:8484',
            roles: ['probate-private-beta', 'citizen'],
            s2s_url: process.env.IDAM_S2S_URL || 'http://localhost:4502',
            service_name: 'probate_frontend',
            service_key: process.env.IDAM_SERVICE_KEY || 'dummy_key',
            probate_oauth2_client: 'probate',
            probate_oauth2_secret: process.env.IDAM_API_OAUTH2_CLIENT_CLIENT_SECRETS_PROBATE || '123456',
            probate_oauth_callback_path: '/oauth2/callback'
        },
        payment: {
            createPaymentUrl: process.env.PAYMENT_CREATE_URL || 'http://localhost:8383/users/userId/payments',
            authorization: process.env.PAYMENT_AUTHORIZATION || 'dummy_token',
            serviceAuthorization: process.env.PAYMENT_SERVICE_AUTHORIZATION || 'dummy_token',
            userId: process.env.PAYMENT_USER_ID || 999999999,
            returnUrl: process.env.PAYMENT_RETURN_URL || 'https://localhost:3000/payment-status'
        }
    },
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379
    },
    dateFormat: 'DD/MM/YYYY',

    payloadVersion: '3.0.0',

    hostname: process.env.FRONTEND_HOSTNAME || 'localhost:3000',
    gaTrackingId: process.env.GA_TRACKING_ID || '',
    enableTracking: process.env.ENABLE_TRACKING || 'true',
    links: {
        cookies: 'http://gov.uk/help/cookies',
        terms: '/terms-conditions',
        survey: process.env.SURVEY || 'http://www.smartsurvey.co.uk/',
        surveyEndOfApplication: process.env.SURVEY_END_OF_APPLICATION || 'http://www.smartsurvey.co.uk/',
        ihtNotCompleted: 'https://www.gov.uk/valuing-estate-of-someone-who-died/tell-hmrc-estate-value',
        renunciationForm: 'public/pdf/renunciation.pdf'
    },
    payment: {
        applicationFee: 215,
        applicationFeeThreshold: 5000,
        applicationFeeCode: process.env.APPLICATION_FEE_CODE || 'CODE1',
        copies: {
            uk: {
                fee: 0.5,
                code: process.env.UK_COPIES_FEE_CODE || 'CODE2'
            },
            overseas: {
                 fee: 0.5,
                 code: process.env.OVERSEAS_COPIES_FEE_CODE || 'CODE3'
            }
        },
        serviceId: process.env.SERVICE_ID || 'CODE4',
        siteId: process.env.SITE_ID || 'CODE5'
    },
    whitelistedPagesAfterSubmission: ['/documents', '/thankyou'],
    whitelistedPagesAfterPayment: ['/tasklist', '/payment-status', '/documents', '/thankyou'],
    whitelistedPagesAfterDeclaration: ['/tasklist', '/copies-uk', '/assets-overseas', '/copies-overseas', '/copies-summary', '/payment-breakdown', '/payment-breakdown?status=failure', '/payment-status', '/documents', '/thankyou'],
    hardStopParams: ['will.left', 'will.original', 'iht.completed', 'applicant.executor'],
    nonCachedPages: ['summary', 'tasklist']
};