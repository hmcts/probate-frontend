'use strict';

const config = {
    environment: process.env.REFORM_ENVIRONMENT || 'prod',
    nodeEnvironment: process.env.NODE_ENV,
    gitRevision: process.env.GIT_REVISION,
    frontendPublicHttpProtocol: process.env.PUBLIC_PROTOCOL || 'http',
    featureToggles: {
        url: process.env.FEATURE_TOGGLES_API_URL || 'http://localhost:8292',
        path: process.env.FEATURE_TOGGLES_PATH || '/api/ff4j/check',
        port: 8292,
        fe_shutter_toggle: 'probate-fe-shutter',
        fees_api: 'probate-fees-api',
        appwideToggles: []
    },
    app: {
        username: process.env.USERNAME,
        password: process.env.PASSWORD,
        useAuth: process.env.USE_AUTH || 'false',
        useHttps: process.env.USE_HTTPS || 'false',
        useIDAM: process.env.USE_IDAM || 'false',
        requreCcdCaseId: process.env.REQUIRE_CCD_CASE_ID || 'false',
        port: process.env.PORT || '3000',
        useCSRFProtection: 'true',
        session: {
            expires: 3600000, // ms (60 mins)
            ttl: 28800 // ms (8 hours)
        }
    },
    services: {
        postcode: {
            token: process.env.POSTCODE_SERVICE_TOKEN
        },
        orchestrator: {
            url: process.env.ORCHESTRATOR_SERVICE_URL || 'http://localhost:8888',
            paths: {
                forms: '/forms/case/{ccdCaseId}',
                create: '/forms/newcase/',
                submissions: '/forms/{ccdCaseId}/submissions',
                payments: '/forms/{ccdCaseId}/payments',
                payment_updates: '/payment-updates',
                payment_submissions: '/forms/{ccdCaseId}/payment-submissions',
                fees: '/forms/{ccdCaseId}/fees',
                validations: '/forms/{ccdCaseId}/validations',
                applications: '/forms/cases',
                declarationStatuses: '/invites/{ccdCaseId}'
            },
            port: 8888
        },
        validation: {
            url: process.env.VALIDATION_SERVICE_URL || 'http://localhost:8081/validate'
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
            loginUrl: process.env.IDAM_LOGIN_URL || 'http://localhost:3501/login',
            apiUrl: process.env.IDAM_API_URL || 'http://localhost:5000',
            roles: ['probate-private-beta', 'citizen'],
            s2s_url: process.env.IDAM_S2S_URL || 'http://localhost:4502',
            service_name: 'probate_frontend',
            service_key: process.env.IDAM_SERVICE_KEY || 'AAAAAAAAAAAAAAAA',
            probate_oauth2_client: process.env.IDAM_CLIENT_NAME || 'ccd_gateway',
            probate_oauth2_secret: process.env.IDAM_API_OAUTH2_CLIENT_CLIENT_SECRETS_PROBATE || 'ccd_gateway_secret',
            probate_oauth_callback_path: '/oauth2/callback',
            probate_oauth_token_path: '/oauth2/token',
            probate_user_email: process.env.PROBATE_USER_EMAIL || 'pacaseworker@probate.com',
            probate_user_password: process.env.PROBATE_USER_PASSWORD || 'password',
            probate_redirect_base_url: process.env.PROBATE_REDIRECT_BASE_URL || 'http://localhost:3000',
        },
        payment: {
            url: process.env.PAYMENT_API_URL || 'http://localhost:8383',
            authorization: process.env.PAYMENT_AUTHORIZATION || 'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI4aDNlbWc4dmhqazVhMjFzYWE4Y2MzM3YzZyIsInN1YiI6IjQyIiwiaWF0IjoxNTU3OTk5MTIxLCJleHAiOjE1NTgwMjc5MjEsImRhdGEiOiJjYXNld29ya2VyLXByb2JhdGUsY2l0aXplbixjYXNld29ya2VyLGNhc2V3b3JrZXItcHJvYmF0ZS1sb2ExLGNpdGl6ZW4tbG9hMSxjYXNld29ya2VyLWxvYTEiLCJ0eXBlIjoiQUNDRVNTIiwiaWQiOiI0MiIsImZvcmVuYW1lIjoiVXNlciIsInN1cm5hbWUiOiJUZXN0IiwiZGVmYXVsdC1zZXJ2aWNlIjoiQ0NEIiwibG9hIjoxLCJkZWZhdWx0LXVybCI6Imh0dHBzOi8vbG9jYWxob3N0OjkwMDAvcG9jL2NjZCIsImdyb3VwIjoiY2FzZXdvcmtlciJ9.5sT0KGtWsPC-Ol6RKV6gHFJl5b-OsL7HGKqdScFdOdQ',
            serviceAuthorization: process.env.PAYMENT_SERVICE_AUTHORIZATION || 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJwcm9iYXRlX2Zyb250ZW5kIiwiZXhwIjoxNTU4MDEzNTIyfQ.YEiOlFZleoA8u9fZ4iEqcrVKvOTaCRPfzM6W_DptlV63V-euNNGpJlMlz-9JWRoTQ0ZYIF9RWskTe_PlAZHJvg',
            userId: process.env.PAYMENT_USER_ID || 46,
            paths: {
                payments: '/payments',
                createPayment: '/card-payments',
                returnUrlPath: '/payment-status'
            },
        },
        pact: {
            brokerUrl: process.env.PACT_BROKER_URL || 'http://localhost:80',
            tag: process.env.PACT_BRANCH_NAME || 'Dev',
            pactDirectory: 'pacts'
        },
        feesRegister: {
            url: process.env.FEES_REGISTRY_URL || 'http://localhost:4411/fees-register',
            port: 4411,
            paths: {
                fees: '/fees',
                feesLookup: '/fees/lookup'
            },
            ihtMinAmt: 5000
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
    webChat: {
        chatId: process.env.WEBCHAT_CHAT_ID || '3077733355d19fd430f23c7.02555395',
        tenant: process.env.WEBCHAT_TENANT || 'c2FuZGJveGhtY3RzMDE',
        buttonNoAgents: process.env.WEBCHAT_BUTTON_NO_AGENTS || '20599210435d19f59cdc3e95.94551214',
        buttonAgentsBusy: process.env.WEBCHAT_BUTTON_AGENTS_BUSY || '8752254635d19f5bb21ff07.71234899',
        buttonServiceClosed: process.env.WEBCHAT_BUTTON_SERVICE_CLOSED || '4639879315d19f67c3c1055.15174024',
    },
    links: {
        accessibility: '/accessibility-statement',
        cookies: '/cookies',
        privacy: '/privacy-policy',
        terms: '/terms-conditions',
        contact: '/contact-us',
        contactEmailAddress: 'contactprobate@justice.gov.uk',
        callCharges: 'https://www.gov.uk/call-charges',
        howToManageCookies: 'https://www.aboutcookies.org',
        googlePrivacyPolicy: 'https://www.google.com/policies/privacy/partners/',
        googleAnalyticsOptOut: 'https://tools.google.com/dlpage/gaoptout/',
        mojPersonalInformationCharter: 'https://www.gov.uk/government/organisations/ministry-of-justice/about/personal-information-charter',
        goodThingsFoundation: 'https://www.goodthingsfoundation.org',
        subjectAccessRequest: 'https://www.gov.uk/government/publications/request-your-personal-data-from-moj',
        complaintsProcedure: 'https://www.gov.uk/government/organisations/hm-courts-and-tribunals-service/about/complaints-procedure',
        informationCommissionersOffice: 'https://ico.org.uk/global/contact-us',
        survey: process.env.SURVEY || 'https://www.smartsurvey.co.uk/s/Probate_Feedback/',
        surveyEndOfApplication: process.env.SURVEY_END_OF_APPLICATION || 'https://www.smartsurvey.co.uk/s/Probate_ExitSurvey/',
        ihtNotCompleted: 'https://www.gov.uk/valuing-estate-of-someone-who-died/tell-hmrc-estate-value',
        applicationFormPA15: 'https://www.gov.uk/government/publications/form-pa15-apply-for-renunciation-will',
        applicationFormPA1A: 'https://www.gov.uk/government/publications/form-pa1a-apply-for-probate-deceased-did-not-leave-a-will',
        applicationFormPA1P: 'https://www.gov.uk/government/publications/form-pa1p-apply-for-probate-the-deceased-had-a-will',
        deathCertificate: 'https://www.gov.uk/order-copy-birth-death-marriage-certificate',
        deathReportedToCoroner: 'https://www.gov.uk/after-a-death/when-a-death-is-reported-to-a-coroner',
        findOutNext: 'https://www.gov.uk/wills-probate-inheritance/once-the-grants-been-issued',
        whoInherits: 'https://www.gov.uk/inherits-someone-dies-without-will',
        ifYoureAnExecutor: 'https://www.gov.uk/wills-probate-inheritance/if-youre-an-executor',
        renunciationForm: 'https://www.gov.uk/government/publications/form-pa15-apply-for-renunciation-will',
        assessingMentalCapacity: 'https://www.gov.uk/make-decisions-for-someone/assessing-mental-capacity',
        myAbilityLink: 'https://mcmw.abilitynet.org.uk/',
        equalityAdvisorLink: 'https://www.equalityadvisoryservice.com/',
        wcag21Link: 'https://www.w3.org/TR/WCAG21/'
    },
    helpline: {
        number: '0300 303 0648',
        email: 'contactprobate@justice.gov.uk',
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
    noHeaderLinksPages: ['/sign-out', '/co-applicant-start-page', '/co-applicant-declaration', '/co-applicant-agree-page', '/co-applicant-disagree-page', '/co-applicant-all-agreed-page', '/pin-resend', '/pin-sent', '/sign-in'],
    whitelistedPagesAfterSubmission: ['/documents', '/thank-you', '/check-answers-pdf', '/declaration-pdf', '/sign-out'],
    whitelistedPagesAfterPayment: ['/task-list', '/payment-status', '/documents', '/thank-you', '/check-answers-pdf', '/declaration-pdf', '/sign-out'],
    whitelistedPagesAfterDeclaration: ['/task-list', '/executors-invites-sent', '/copies-uk', '/assets-overseas', '/copies-overseas', '/copies-summary', '/payment-breakdown', '/payment-breakdown?status=failure', '/payment-status', '/documents', '/thank-you', '/check-answers-pdf', '/declaration-pdf', '/sign-out'],
    eligibilityQuestionsProbate: {
        deathCertificate: 'Yes',
        domicile: 'Yes',
        completed: 'Yes',
        left: 'Yes',
        original: 'Yes',
        executor: 'Yes',
        mentalCapacity: 'Yes'
    },
    eligibilityQuestionsIntestacy: {
        deathCertificate: 'Yes',
        domicile: 'Yes',
        completed: 'Yes',
        left: 'No',
        diedAfter: 'Yes',
        related: 'Yes',
        otherApplicants: 'No'
    },
    hardStopParams: {
        gop: [],
        intestacy: []
    },
    nonIdamPages: ['health/*', 'stop-page/*', 'error', 'sign-in', 'pin-resend', 'pin-sent', 'co-applicant-*', 'pin', 'inviteIdList', 'start-eligibility', 'death-certificate', 'deceased-domicile', 'iht-completed', 'will-left', 'will-original', 'applicant-executor', 'mental-capacity', 'died-after-october-2014', 'related-to-deceased', 'other-applicants', 'start-apply', 'contact-us', 'accessibility-statement', 'terms-conditions', 'privacy-policy', 'cookies'],
    noCcdCaseIdPages: ['health/*', 'stop-page/*', 'error', 'sign-in', 'pin-resend', 'pin-sent', 'co-applicant-*', 'pin', 'inviteIdList', 'start-eligibility', 'death-certificate', 'deceased-domicile', 'iht-completed', 'will-left', 'will-original', 'applicant-executor', 'mental-capacity', 'died-after-october-2014', 'related-to-deceased', 'other-applicants', 'start-apply', 'contact-us', 'accessibility-statement', 'terms-conditions', 'privacy-policy', 'cookies', 'dashboard', 'sign-out', 'time-out'],
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
        maxSizeBytes: 10485760, // 10 MB
        maxSizeBytesTest: 10240, // 10 KB
        paths: {
            upload: '/documents/upload',
            remove: '/documents/delete'
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
            checkAnswers: 'checkAnswersSummary',
            declaration: 'legalDeclaration',
            coverSheet: 'bulkScanCoversheet'
        },
        path: '/documents/generate'
    },
    assetsValueThreshold: 250000
};

module.exports = config;
