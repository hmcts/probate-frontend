/* eslint-disable max-lines */
/* eslint no-console: 0 no-unused-vars: 0 */

'use strict';

const logger = require('app/components/logger');
const path = require('path');
const express = require('express');
const session = require('express-session');
const nunjucks = require('nunjucks');
const routes = require(`${__dirname}/app/routes`);
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('config');
const utils = require(`${__dirname}/app/components/utils`);
const packageJson = require(`${__dirname}/package`);
const Security = require(`${__dirname}/app/services/Security`);
const helmet = require('helmet');
const hpkp = require('hpkp');
const nocache = require('nocache');
const csrf = require('csurf');
const declaration = require(`${__dirname}/app/declaration`);
const InviteSecurity = require(`${__dirname}/app/invite`);
const additionalInvite = require(`${__dirname}/app/routes/additionalInvite`);
const fs = require('fs');
const https = require('https');
const {v4: uuidv4} = require('uuid');
const nonce = uuidv4().replace(/-/g, '');
const EligibilityCookie = require('app/utils/EligibilityCookie');
const eligibilityCookie = new EligibilityCookie();
const caseTypes = require('app/utils/CaseTypes');
const featureToggles = require('app/featureToggles');
const sanitizeRequestBody = require('app/middleware/sanitizeRequestBody');
const isEmpty = require('lodash').isEmpty;
const setupHealthCheck = require('app/utils/setupHealthCheck');

exports.init = function (isA11yTest = false, a11yTestSession = {}, ftValue) {
    const app = express();
    const port = config.app.port;
    const releaseVersion = packageJson.version;
    const useIDAM = config.app.useIDAM.toLowerCase();
    const security = new Security(config.services.idam.loginUrl);
    const inviteSecurity = new InviteSecurity();

    // Application settings
    app.set('view engine', 'html');
    app.set('views', ['app/steps', 'app/views']);

    const isDev = app.get('env') === 'development';

    const njkEnv = nunjucks.configure([
        'app/steps',
        'app/views',
        'node_modules/govuk-frontend/'
    ], {
        noCache: isDev,
        express: app
    });

    const globals = {
        currentYear: new Date().getFullYear(),
        enableTracking: config.enableTracking,
        links: config.links,
        nonce: nonce,
        documentUpload: {
            validMimeTypes: config.documentUpload.validMimeTypes,
            maxFiles: config.documentUpload.maxFiles,
            maxSizeBytes: config.documentUpload.maxSizeBytes
        },
        webchat: {
            avayaUrl: config.webchat.avayaUrl,
            avayaClientUrl: config.webchat.avayaClientUrl,
            avayaService: config.webchat.avayaService
        },
        caseTypes: {
            gop: caseTypes.GOP,
            intestacy: caseTypes.INTESTACY
        },
        dynatrace: {
            dynatraceUrl: config.dynatrace.dynatraceUrl
        }
    };
    njkEnv.addGlobal('globals', globals);

    app.enable('trust proxy');

    // Security library helmet to verify 11 smaller middleware functions
    app.use(helmet());

    app.use(globals.dynatrace.dynatraceUrl, (req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
        res.header(
            'Access-Control-Allow-Headers',
            'Origin, X-Requested-With, Content-Type, Accept, Authorization',
        );
        next();
    });

    // Content security policy to allow just assets from same domain
    app.use(helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [
                '\'self\'',
                'webchat.ctsc.hmcts.net',
                'webchat-client.ctsc.hmcts.net',
                'webchat.pp.ctsc.hmcts.net',
                'webchat-client.pp.ctsc.hmcts.net'
            ],
            fontSrc: [
                '\'self\' data:',
                'fonts.gstatic.com',
            ],
            scriptSrc: [
                '\'self\'',
                '\'sha256-+6WnXIl4mbFTCARd8N3COQmT3bJJmo32N8q8ZSQAIcU=\'',
                '\'sha256-AaA9Rn5LTFZ5vKyp3xOfFcP4YbyOjvWn2up8IKHVAKk=\'',
                '\'sha256-G29/qSW/JHHANtFhlrZVDZW1HOkCDRc78ggbqwwIJ2g=\'',
                '\'sha256-BWhcmwio/4/QdqKNw5PKmTItWBjkevCaOUbLkgW5cHs=\'',
                '\'sha256-L7viC3kUpXu9uCOi97VqCR2bLlMwSQlmLmSuuQ93ngU=\'',
                '*.google-analytics.com',
                'https://*.dynatrace.com',
                '*.googletagmanager.com',
                'webchat.ctsc.hmcts.net',
                'webchat.pp.ctsc.hmcts.net',
                'webchat-client.pp.ctsc.hmcts.net',
                'webchat-client.ctsc.hmcts.net',
                `'nonce-${nonce}'`,
                'tagmanager.google.com'
            ],
            connectSrc: [
                '\'self\'',
                '*.google-analytics.com',
                '*.googletagmanager.com',
                'https://*.dynatrace.com',
                'https://webchat.ctsc.hmcts.net',
                'https://webchat-client.ctsc.hmcts.net',
                'wss://webchat.ctsc.hmcts.net',
                'wss://webchat.pp.ctsc.hmcts.net',
                'https://webchat.pp.ctsc.hmcts.net',
                'https://webchat-client.pp.ctsc.hmcts.net',
                '*.g.doubleclick.net',
                'tagmanager.google.com'
            ],
            mediaSrc: [
                '\'self\''
            ],
            imgSrc: [
                '\'self\'',
                '\'self\' data:',
                '*.google-analytics.com',
                '*.g.doubleclick.net',
                'ssl.gstatic.com',
                'www.gstatic.com',
                'fonts.gstatic.com',
                'lh3.googleusercontent.com',
                '*.googletagmanager.com'
            ],
            styleSrc: [
                '\'self\'',
                '\'unsafe-inline\'',
                'tagmanager.google.com',
                'fonts.googleapis.com',
                '*.googletagmanager.com'
            ],
            frameAncestors: ['\'self\'']
        },
        browserSniff: true,
        setAllHeaders: true
    }));

    // Http public key pinning
    app.use(hpkp({
        maxAge: 900,
        sha256s: ['AbCdEf123=', 'XyzABC123=']
    }));

    // Referrer policy for helmet
    app.use(helmet.referrerPolicy({
        policy: 'origin'
    }));

    app.use(nocache());
    app.use(helmet.xssFilter({setOnOldIE: true}));

    const caching = {cacheControl: true, setHeaders: (res) => res.setHeader('Cache-Control', 'max-age=604800')};

    // Middleware to serve static assets
    app.use('/public/stylesheets', express.static(`${__dirname}/public/stylesheets`, caching));
    app.use('/public/images', express.static(`${__dirname}/app/assets/images`, caching));
    app.use('/public/locales', express.static(`${__dirname}/app/assets/locales`, caching));
    app.use('/public/javascripts/govuk-frontend', express.static(`${__dirname}/node_modules/govuk-frontend`, caching));
    app.use('/public/javascripts/jquery', express.static(`${__dirname}/node_modules/jquery/dist`, caching));
    app.use('/public/javascripts', express.static(`${__dirname}/app/assets/javascripts`, caching));
    app.use('/public/pdf', express.static(`${__dirname}/app/assets/pdf`));
    app.use('/assets', express.static(`${__dirname}/node_modules/govuk-frontend/govuk/assets`, caching));
    app.use('/assets/locale', express.static(`${__dirname}/app/assets/locales/avaya-webchat`, caching));

    // Elements refers to icon folder instead of images folder
    app.use(favicon(path.join(__dirname, 'node_modules', 'govuk-frontend', 'govuk', 'assets', 'images', 'favicon.ico')));

    // Support for parsing data in POSTs
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(cookieParser());

    // Send assetPath to all views
    app.use((req, res, next) => {
        res.locals.asset_path = '/public/';
        next();
    });

    // Support session data
    app.use(session({
        proxy: config.redis.proxy,
        resave: config.redis.resave,
        saveUninitialized: config.redis.saveUninitialized,
        secret: config.redis.secret,
        cookie: {
            httpOnly: config.redis.cookie.httpOnly,
            sameSite: config.redis.cookie.sameSite
        },
        store: utils.getStore(config.redis, config.app.session.ttl)
    }));

    // health
    setupHealthCheck(app);

    app.use((req, res, next) => {
        if (!req.session) {
            return next(new Error('Unable to reach redis'));
        }

        if (isA11yTest && !isEmpty(a11yTestSession)) {
            req.session = Object.assign(req.session, a11yTestSession);
        }

        next();
    });

    app.use((req, res, next) => {
        if (!req.session.language) {
            req.session.language = 'en';
        }

        if (req.query) {
            const getLangFromQuery = (queryVal) => {
                if (queryVal) {
                    if (!Array.isArray(queryVal)) {
                        queryVal = [queryVal];
                    }

                    return queryVal.find((l) => config.languages.includes(l));
                }
            };
            const fromLng = getLangFromQuery(req.query.lng);
            const fromLocale = getLangFromQuery(req.query.locale);
            if (fromLng) {
                req.session.language = fromLng;
            } else if (fromLocale) {
                req.session.language = fromLocale;
            }
        }

        if (isA11yTest && !isEmpty(a11yTestSession)) {
            req.session = Object.assign(req.session, a11yTestSession);
        }

        req.session.uuid = uuidv4();

        next();
    });

    app.use((req, res, next) => {
        req.session.cookie.secure = req.protocol === 'https';
        next();
    });

    app.use(config.services.idam.probate_oauth_callback_path, security.oAuth2CallbackEndpoint());

    if (config.app.useCSRFProtection === 'true') {
        app.use((req, res, next) => {
            // Exclude Dynatrace Beacon POST requests from CSRF check
            if (req.method === 'POST' && req.path.startsWith('/rb_')) {
                next();
            } else {
                csrf({})(req, res, next);
            }
        });

        app.use((req, res, next) => {
            if (req.csrfToken) {
                res.locals.csrfToken = req.csrfToken();
            }
            next();
        });
    }

    // Add variables that are available in all views
    app.use((req, res, next) => {
        const commonContent = require(`app/resources/${req.session.language}/translation/common`);
        njkEnv.addGlobal('currentHost', req?.headers?.host?.toLowerCase());
        res.locals.serviceName = commonContent.serviceName;
        res.locals.cookieText = commonContent.cookieText;
        res.locals.releaseVersion = `v${releaseVersion}`;
        next();
    });

    app.post('*', sanitizeRequestBody);

    app.get('/executors/invitation/:inviteId', inviteSecurity.verify());
    app.use('/co-applicant-*', inviteSecurity.checkCoApplicant(useIDAM));
    app.use('/executors-additional-invite', additionalInvite);
    app.use('/declaration', declaration);

    app.use((req, res, next) => {
        res.locals.launchDarkly = {};
        if (ftValue) {
            res.locals.launchDarkly.ftValue = ftValue;
        }

        next();
    });

    app.use(featureToggles);

    if (useIDAM === 'true') {
        const idamPages = new RegExp(`/((?!${config.nonIdamPages.join('|')}).)*`);
        app.use(idamPages, security.protect(config.services.idam.roles));
        app.use('/', routes);
    } else {
        app.use('/', (req, res, next) => {
            if (req.query.id && req.query.id !== req.session.regId) {
                delete req.session.form;
            }
            req.session.regId = req.query.id || req.session.regId || req.sessionID;
            req.authToken = config.services.payment.authorization;
            req.session.authToken = req.authToken;
            req.userId = config.services.payment.userId;
            next();
        }, routes);
    }

    app.get('/deceased-domicile', eligibilityCookie.checkCookie());
    app.get('/iht-completed', eligibilityCookie.checkCookie());
    app.get('/will-left', eligibilityCookie.checkCookie());
    app.get('/will-original', eligibilityCookie.checkCookie());
    app.get('/applicant-executor', eligibilityCookie.checkCookie());
    app.get('/mental-capacity', eligibilityCookie.checkCookie());
    app.get('/died-after-october-2014', eligibilityCookie.checkCookie());
    app.get('/related-to-deceased', eligibilityCookie.checkCookie());
    app.get('/other-applicants', eligibilityCookie.checkCookie());
    app.get('/start-apply', eligibilityCookie.checkCookie());

    // Start the app
    let http;

    if (['development', 'testing', 'testing-unit', 'testing-component'].includes(config.nodeEnvironment)) {
        const sslDirectory = path.join(__dirname, 'app', 'resources', 'localhost-ssl');
        const sslOptions = {
            key: fs.readFileSync(path.join(sslDirectory, 'localhost.key')),
            cert: fs.readFileSync(path.join(sslDirectory, 'localhost.crt')),
            secureProtocol: 'TLSv1_2_method'
        };
        const server = https.createServer(sslOptions, app);

        http = server.listen(port, () => {
            console.log(`Application started: https://localhost:${port}`);
        });
    } else {
        http = app.listen(port, () => {
            console.log(`Application started: http://localhost:${port}`);
        });
    }

    app.all('*', (req, res) => {
        const commonContent = require(`app/resources/${req.session.language}/translation/common`);
        const content = require(`app/resources/${req.session.language}/translation/errors/404`);

        logger(req.sessionID).error(`Unhandled request ${req.url}`);
        res.status(404).render('errors/error', {
            common: commonContent,
            content: content,
            error: '404',
            userLoggedIn: req.userLoggedIn
        });
    });

    app.use((err, req, res, next) => {
        const commonContent = require(`app/resources/${req.session.language}/translation/common`);
        const content = require(`app/resources/${req.session.language}/translation/errors/500`);

        logger(req.sessionID).error(err);
        res.status(500).render('errors/error', {
            common: commonContent,
            content: content,
            error: '500',
            userLoggedIn: req.userLoggedIn
        });
    });

    return {app, http};
};
