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
        document_upload: 'probate-document-upload',
        intestacy_questions: 'probate-screening-questions'
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
            url: 'http://localhost:8585/find-address123',
            token: process.env.POSTCODE_SERVICE_TOKEN,
            proxy: process.env.http_proxy,
            port: 8585,
            path: '/find-address'
        },
        orchestrator: {
            url: process.env.ORCHESTRATOR_SERVICE_URL || 'http://localhost:8080',
            paths: {
                forms: '/forms/{applicantEmail}',
                submissions: '/forms/{applicantEmail}/submissions',
                payments: '/forms/{applicantEmail}/payments'
            }
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
            probate_oauth_callback_path: '/oauth2/callback',
            probate_oauth_token_path: '/oauth2/token',
        },
        payment: {
            createPaymentUrl: process.env.PAYMENT_CREATE_URL || 'http://localhost:8383/card-payments',
            authorization: process.env.PAYMENT_AUTHORIZATION || 'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJvOGN0b3Bwbm9xcmFrOXNvaW5rZXUxMjBxZyIsInN1YiI6IjI4IiwiaWF0IjoxNTQ1MzE4MjU3LCJleHAiOjE1NDUzNDcwNTcsImRhdGEiOiJjYXNld29ya2VyLXByb2JhdGUsY2l0aXplbixjYXNld29ya2VyLGNhc2V3b3JrZXItcHJvYmF0ZS1sb2ExLGNpdGl6ZW4tbG9hMSxjYXNld29ya2VyLWxvYTEiLCJ0eXBlIjoiQUNDRVNTIiwiaWQiOiIyOCIsImZvcmVuYW1lIjoiVXNlciIsInN1cm5hbWUiOiJUZXN0IiwiZGVmYXVsdC1zZXJ2aWNlIjoiQ0NEIiwibG9hIjoxLCJkZWZhdWx0LXVybCI6Imh0dHBzOi8vbG9jYWxob3N0OjkwMDAvcG9jL2NjZCIsImdyb3VwIjoiY2FzZXdvcmtlciJ9.CTBjHrHGYmLmcwk47dAwqRRP_MpTx4MWlOu2ONnD_Y0',
            serviceAuthorization: process.env.PAYMENT_SERVICE_AUTHORIZATION || 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJwcm9iYXRlX2Zyb250ZW5kIiwiZXhwIjoxNTQ1MzMyNjU3fQ.dGYVilG7KFXhbIEtayoAQWHcA7EMlyRnptbgjCPFH7pdTKCfXkl-WeQ3gZ-8pCC4bk-kTNLohspP7uA0xqV8FQ',
            userId: process.env.PAYMENT_USER_ID || 28,
            returnUrlPath: '/payment-status'
        },
        pact: {
            brokerUrl: process.env.PACT_BROKER_URL || 'http://localhost:80',
            pactDirectory: 'pacts'
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
            redirectUrl: '/start-eligibility',
            expires: 1000 * 60 * 60 * 24 * 2
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
        applicationFormPA15: 'https://www.gov.uk/government/publications/form-pa15-apply-for-renunciation-will',
        applicationFormPA1A: 'https://www.gov.uk/government/publications/form-pa1a-apply-for-probate-deceased-did-not-leave-a-will',
        applicationFormPA1P: 'https://www.gov.uk/government/publications/form-pa1p-apply-for-probate-the-deceased-had-a-will',
        deathCertificate: 'https://www.gov.uk/order-copy-birth-death-marriage-certificate',
        deathReportedToCoroner: 'https://www.gov.uk/after-a-death/when-a-death-is-reported-to-a-coroner',
        findOutNext: 'https://www.gov.uk/wills-probate-inheritance/once-the-grants-been-issued',
        whoInherits: 'https://www.gov.uk/inherits-someone-dies-without-will',
        ifYoureAnExecutor: 'https://www.gov.uk/wills-probate-inheritance/if-youre-an-executor',
        renunciationForm: 'https://www.gov.uk/government/publications/form-pa15-apply-for-renunciation-will'
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
    nonIdamPages: ['stop-page/*', 'error', 'sign-in', 'pin-resend', 'pin-sent', 'co-applicant-*', 'pin', 'inviteIdList', 'start-eligibility', 'death-certificate', 'deceased-domicile', 'iht-completed', 'will-left', 'will-original', 'applicant-executor', 'mental-capacity', 'died-after-october-2014', 'relationship-to-deceased', 'other-applicants', 'start-apply'],
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
            maxFiles: 'Error: too many files',
            nothingUploaded: 'Error: no files passed',
            uploadFailed: 'Error: upload failed',
            uploadTimeout: 'Error: upload timed out'
        },
        timeoutMs: 300000
    },
    pdf: {
        template: {
            checkAnswers: 'generateCheckAnswersSummaryPDF',
            declaration: 'generateLegalDeclarationPDF',
            coverSheet: 'generateBulkScanCoverSheetPDF'
        },
        path: '/businessDocument'
    }
};

module.exports = config;
