'use strict';

/* eslint no-console: 0  no-unused-vars: 0 */

const logger = require('app/components/logger');

const path = require('path');
const express = require('express');
const session = require('express-session');
const nunjucks = require('express-nunjucks');
const routes = require(__dirname + '/app/routes');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require(__dirname + '/app/config.js');
const utils = require(__dirname + '/app/components/utils.js');
const packageJson = require(__dirname + '/package.json');
const Security = require(__dirname + '/app/components/security');
const helmet = require('helmet');
const csrf = require('csurf');
const healthcheck = require(__dirname + '/app/healthcheck.js');
const InviteSecurity = require(__dirname + '/app/invite.js');
const fs = require('fs');
const https = require('https');

exports.init = function() {

    const app = express();
    const port = (process.env.PORT || config.port);
    const releaseVersion = packageJson.version;
    const username = process.env.USERNAME;
    const password = process.env.PASSWORD;
    const useAuth = (process.env.USE_AUTH || config.useAuth).toLowerCase();
    const useHttps = (process.env.USE_HTTPS || config.useHttps).toLowerCase();
    const useIDAM = (process.env.USE_IDAM || config.useIDAM).toLowerCase();
    const security = new Security(config.services.idam.loginUrl);
    const inviteSecurity = new InviteSecurity();

// Enable/Disable form validation
    process.argv.forEach(function (arg) {
        if (arg.indexOf('DISABLE_VALIDATION') > 0) {
            process.env.DISABLE_VALIDATION = true;
        }
    });

// Authenticate against the environment-provided credentials, if running
// the app in production (Heroku, effectively)
    if (useAuth === 'true') {
        app.use(utils.basicAuth(username, password));
    }

// Application settings
    app.set('view engine', 'html');
    app.set('views', ['app/steps', 'app/views', 'node_modules/govuk_template_jinja/views/layouts']);

    const filters = require('app/components/filters.js');
    const globals = {
    'currentYear': new Date().getFullYear(),
        'gaTrackingId': config.gaTrackingId,
        'enableTracking': config.enableTracking,
        'links': config.links
    };

    const njk = nunjucks(app, {
        autoescape: true,
        watch: true,
        noCache: true,
        globals: globals
    });
    filters(njk.env);

    app.enable('trust proxy');

//security library helmet to verify 11 smaller middleware functions
    app.use(helmet());

//content security policy to allow only assets from same domain
    app.use(helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ['\'self\''],
            fontSrc: ['\'self\' data:'],
            scriptSrc: ['\'self\'', '\'sha256-+6WnXIl4mbFTCARd8N3COQmT3bJJmo32N8q8ZSQAIcU=\'', '\'sha256-AaA9Rn5LTFZ5vKyp3xOfFcP4YbyOjvWn2up8IKHVAKk=\'', '\'sha256-G29/qSW/JHHANtFhlrZVDZW1HOkCDRc78ggbqwwIJ2g=\'', 'www.google-analytics.com'],
            connectSrc: ['\'self\''],
            mediaSrc: ['\'self\''],
            frameSrc: ['\'none\''],
            imgSrc: ['\'self\'', 'www.google-analytics.com'],
            frameAncestors: ['\'self\'']
        },
        browserSniff: true,
        setAllHeaders: true
    }));
// http public key pinning
    app.use(helmet.hpkp({
        maxAge: 900,
        sha256s: ['AbCdEf123=', 'XyzABC123=']
    }));

//Referrer policy for helmet
    app.use(helmet.referrerPolicy({
        policy: 'origin'
    }));

    app.use(helmet.xssFilter({setOnOldIE: true}))

// Middleware to serve static assets
    app.use('/public/stylesheets', express.static(__dirname + '/public/stylesheets'));
    app.use('/public/images', express.static(__dirname + '/app/assets/images'));
    app.use('/public/javascripts', express.static(__dirname + '/app/assets/javascripts'));
    app.use('/public/pdf', express.static(__dirname + '/app/assets/pdf'));
    app.use('/public', express.static(__dirname + '/node_modules/govuk_template_jinja/assets'));
    app.use('/public', express.static(__dirname + '/node_modules/govuk_frontend_toolkit'));
    app.use('/public/images/icons', express.static(__dirname + '/node_modules/govuk_frontend_toolkit/images'));



// Elements refers to icon folder instead of images folder
    app.use(favicon(path.join(__dirname, 'node_modules', 'govuk_template_jinja', 'assets', 'images', 'favicon.ico')));

// Support for parsing data in POSTs
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(cookieParser());

// send assetPath to all views
    app.use(function (req, res, next) {
        res.locals.asset_path = '/public/';
        next();
    });

// Support session data
    app.use(session({
        proxy: true,
        resave: false,
        saveUninitialized: false,
        secret: process.env.REDIS_SECRET || 'OVERWRITE_THIS',
        cookie: {
            secure: false,
            httpOnly: true,
            sameSite: 'lax'
        },
        store: utils.getStore(process.env.USE_REDIS, session)
    }));

    app.use(function (req, res, next) {
        if (!req.session) {
            return next(new Error('Unable to reach redis'))
        }
        next() // otherwise continue
    });

    app.use(config.services.idam.probate_oauth_callback_path, security.oAuth2CallbackEndpoint());

    if (config.useCSRFProtection === 'true') {
        app.use(csrf(), (req, res, next) => {
            res.locals.csrfToken = req.csrfToken();
            next();
        });
    }


// Add variables that are available in all views
    app.use(function (req, res, next) {
        res.locals.serviceName = config.service.name;
        res.locals.serviceVersion = config.service.version;
        res.locals.cookieText = config.cookieText;
        res.locals.releaseVersion = 'v' + releaseVersion;
        next();
    });

// Force HTTPs on production connections
    if (useHttps === 'true') {
        app.use(utils.forceHttps);
    }

    app.get('/executors/invitation/:inviteId', inviteSecurity.verify());

    app.use('/co-applicant-*', inviteSecurity.checkCoApplicant(useIDAM));

    app.use('/health', healthcheck);

    if (useIDAM === 'true') {
        app.use(/\/((?!error)(?!sign-in)(?!pin-resend)(?!pin-sent)(?!co-applicant-*)(?!pin)(?!inviteIdList).)*/, security.protect(config.services.idam.roles));
        app.use('/', routes);
    } else {
        app.use('/', function (req, res, next) {

            if (req.query.id && req.query.id !== req.session.regId) {
                delete req.session.form;
            }
            req.session.regId = req.query.id || req.session.regId || req.sessionID;
            req.authToken = config.services.payment.authorization;
            req.userId= config.services.payment.userId;
            next();
        }, routes);
    }

// start the app
    let http;
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'testing') {
        const sslDirectory = path.join(__dirname, 'app', 'resources', 'localhost-ssl');

        const sslOptions = {
            key: fs.readFileSync(path.join(sslDirectory, 'localhost.key')),
            cert: fs.readFileSync(path.join(sslDirectory, 'localhost.crt'))
        };

        const server = https.createServer(sslOptions, app);
        http = server.listen(port, () => {
            console.log('Application started: https://localhost:' + port);
        });

    } else {
        http = app.listen(port, () => {
            console.log('Application started: http://localhost:' + port);
        });
    }

    app.all('*', function (req, res) {
        logger(req.sessionID).error('Unhandled request ' + req.url);
        res.status(404).render('errors/404');
    });

    app.use(function (err, req, res, next) {
        logger(req.sessionID).error(err);
        res.status(500).render('errors/500');
    });

    return {app, http};
};

