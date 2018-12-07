'use strict';

const config = {
    environment: process.env.REFORM_ENVIRONMENT || 'prod',
    nodeEnvironment: process.env.NODE_ENV,
    gitRevision: process.env.GIT_REVISION,
    frontendPublicHttpProtocol: process.env.PUBLIC_PROTOCOL || 'http',
    featureToggles: {
        url: process.env.FEATURE_TOGGLES_API_URL || 'http://localhost:8282',
        path: process.env.FEATURE_TOGGLES_PATH || '/api/ff4j/check',
        fe_shutter_toggle: 'probate-fe-shutter',
        screening_questions: 'probate-screening-questions',
        document_upload: 'probate-document-upload'
    },
    app: {
        username: process.env.USERNAME,
        password: process.env.PASSWORD,
        useAuth: process.env.USE_AUTH || 'false',
        useHttps: process.env.USE_HTTPS || 'false',
        useIDAM: process.env.USE_IDAM || 'false',
        port: process.env.PORT || '3000',
        useCSRFProtection: 'true'
    },
    services: {
        postcode: {
            url: process.env.POSTCODE_SERVICE_URL || 'http://localhost:8585/find-address',
            token: process.env.POSTCODE_SERVICE_TOKEN,
            proxy: process.env.http_proxy,
            port: 8585,
            path: '/find-address'
        },
        validation: {
            url: process.env.VALIDATION_SERVICE_URL || 'http://localhost:8080/validate'
        },
        submit: {
            url: process.env.SUBMIT_SERVICE_URL || 'http://localhost:8181',
            port: 8181
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
            service_key: process.env.IDAM_SERVICE_KEY || 'AAAAAAAAAAAAAAAA',
            probate_oauth2_client: 'probate',
            probate_oauth2_secret: process.env.IDAM_API_OAUTH2_CLIENT_CLIENT_SECRETS_PROBATE || '123456',
            probate_oauth_callback_path: '/oauth2/callback'
        },
        payment: {
            createPaymentUrl: process.env.PAYMENT_CREATE_URL || 'http://localhost:8383/card-payments',
            authorization: process.env.PAYMENT_AUTHORIZATION || 'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJ0bGdxYXFraXBwYmo5bzNjb3QxajlmcDZmMCIsInN1YiI6IjM0IiwiaWF0IjoxNTQ0MTg4ODQ0LCJleHAiOjE1NDQyMTc2NDQsImRhdGEiOiJjYXNld29ya2VyLXByb2JhdGUsY2l0aXplbixjYXNld29ya2VyLGNhc2V3b3JrZXItcHJvYmF0ZS1sb2ExLGNpdGl6ZW4tbG9hMSxjYXNld29ya2VyLWxvYTEiLCJ0eXBlIjoiQUNDRVNTIiwiaWQiOiIzNCIsImZvcmVuYW1lIjoiVXNlciIsInN1cm5hbWUiOiJUZXN0IiwiZGVmYXVsdC1zZXJ2aWNlIjoiQ0NEIiwibG9hIjoxLCJkZWZhdWx0LXVybCI6Imh0dHBzOi8vbG9jYWxob3N0OjkwMDAvcG9jL2NjZCIsImdyb3VwIjoiY2FzZXdvcmtlciJ9.Y1aJmrSPiL_cveh_TmEWhURMAoJrNn9fSPDyhSn0MGQ',
            serviceAuthorization: process.env.PAYMENT_SERVICE_AUTHORIZATION || 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJwcm9iYXRlX2Zyb250ZW5kIiwiZXhwIjoxNTQ0MjAzMjQ0fQ.xBj1Xd9dSWuTB3T-g09N-waS-9c-Si7W7OZLPRRCnzpMQsYHxiJRgN046j0I9QeDOv-3jVeRmDEY9GNdzQpS7Q',
            userId: process.env.PAYMENT_USER_ID || 34,
            returnUrlPath: '/payment-status'
        },
        businessDocument: {
            url: process.env.BUSINESS_DOCUMENT_URL || 'http://localhost:8080/businessDocument'
        }
    },
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD || 'dummy_password',
        useTLS: process.env.REDIS_USE_TLS || 'false',
        enabled: process.env.USE_REDIS || 'false',
        secret: process.env.REDIS_SECRET || 'OVERWRITE_THIS',
        resave: false,
        saveUninitialized: true,
        cookie: {
            httpOnly: true,
            secure: true
        },
        eligibilityCookie: {
            name: '__eligibility',
            redirectUrl: '/new-start-eligibility'
        }
    },
    dateFormat: 'DD/MM/YYYY',
    payloadVersion: '4.1.1',
    gaTrackingId: process.env.GA_TRACKING_ID || 'UA-93598808-3',
    enableTracking: process.env.ENABLE_TRACKING || 'true',
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
        survey: process.env.SURVEY || 'https://www.smartsurvey.co.uk/',
        surveyEndOfApplication: process.env.SURVEY_END_OF_APPLICATION || 'https://www.smartsurvey.co.uk/',
        ihtNotCompleted: 'https://www.gov.uk/valuing-estate-of-someone-who-died/tell-hmrc-estate-value',
        renunciationForm: '/public/pdf/renunciation.pdf',
        applicationFormPA1A: '/public/pdf/probate-application-form-pa1a.pdf',
        applicationFormPA1P: '/public/pdf/probate-application-form-pa1p.pdf',
        guidance: '/public/pdf/probate-guidance-pa2sot.pdf',
        registryInformation: '/public/pdf/probate-registries-pa4sot.pdf',
        deathCertificate: 'https://www.gov.uk/order-copy-birth-death-marriage-certificate',
        deathReportedToCoroner: 'https://www.gov.uk/after-a-death/when-a-death-is-reported-to-a-coroner',
        findOutNext: 'https://www.gov.uk/wills-probate-inheritance/once-the-grants-been-issued'
    },
    helpline: {
        number: '0300 303 0648',
        hours: 'Monday to Friday, 9:30am to 5pm'
    },
    utils: {
        api: {
            retries: process.env.RETRIES_NUMBER || 10,
            retryDelay: process.env.RETRY_DELAY || 1000
        }
    },
    payment: {
        applicationFee: 215,
        applicationFeeThreshold: 5000,
        applicationFeeCode: process.env.APPLICATION_FEE_CODE || 'FEE0226',
        copies: {
            uk: {
                fee: 0.5,
                code: process.env.UK_COPIES_FEE_CODE || 'FEE0003',
                version: '3'
            },
            overseas: {
                fee: 0.5,
                code: process.env.OVERSEAS_COPIES_FEE_CODE || 'FEE003',
                version: '3'
            }
        },
        serviceId: process.env.SERVICE_ID || 'PROBATE',
        siteId: process.env.SITE_ID || 'P223',
        version: process.env.version || '1',
        currency: process.env.currency || 'GBP'
    },
    whitelistedPagesAfterSubmission: ['/documents', '/thankyou', '/check-answers-pdf', '/declaration-pdf', '/sign-out'],
    whitelistedPagesAfterPayment: ['/tasklist', '/payment-status', '/documents', '/thankyou', '/check-answers-pdf', '/declaration-pdf', '/sign-out'],
    whitelistedPagesAfterDeclaration: ['/tasklist', '/executors-invites-sent', '/copies-uk', '/assets-overseas', '/copies-overseas', '/copies-summary', '/payment-breakdown', '/payment-breakdown?status=failure', '/payment-status', '/documents', '/thankyou', '/check-answers-pdf', '/declaration-pdf', '/sign-out'],
    hardStopParams: ['will.left', 'will.original', 'iht.completed', 'applicant.executor'],
    nonIdamPages: ['stop-page/*', 'error', 'sign-in', 'pin-resend', 'pin-sent', 'co-applicant-*', 'pin', 'inviteIdList', 'start-eligibility', 'start-apply', 'new-start-eligibility', 'new-will-left', 'new-will-original', 'new-death-certificate', 'new-deceased-domicile', 'new-applicant-executor', 'new-mental-capacity', 'new-iht-completed', 'new-start-apply'],
    endpoints: {
        health: '/health',
        info: '/info'
    },
    appInsights: {
        instrumentationKey: process.env.APPINSIGHTS_INSTRUMENTATIONKEY
    },
    documentUpload: {
        validMimeTypes: ['image/jpeg', 'image/bmp', 'image/tiff', 'image/png', 'application/pdf'],
        maxFiles: 10,
        maxSizeBytes: 10485760,
        paths: {
            upload: '/document/upload',
            remove: '/document/delete'
        },
        error: {
            invalidFileType: 'Error: invalid file type',
            maxSize: 'Error: invalid file size',
            maxFilesExceeded: 'Error: too many files',
            nothingUploaded: 'Error: no files passed',
            uploadFailed: 'Error: upload failed',
            uploadTimeout: 'Error: upload timed out'
        },
        timeoutMs: 300000
    }
};

module.exports = config;
