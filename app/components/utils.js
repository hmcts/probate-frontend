'use strict';

const {auth: basicAuth} = require('basic-auth');

const NO_USERNAME_OR_PASSWORD_ERR_MESSAGE = '<h1>Error:</h1><p>Username or password not set.';

/**
 * Simple basic auth middleware for use with Express 4.x.
 *
 * Based on template found at: http://www.danielstjules.com/2014/08/03/basic-auth-with-express-4/
 *
 * @example
 * app.use('/api-requiring-auth', utils.basicAuth('username', 'password'));
 *
 * @param   {string}   username Expected username
 * @param   {string}   password Expected password
 * @returns {function} Express 4 middleware requiring the given credentials
 */
const basicAuthUtil = (username, password) => {
    return (req, res, next) => {
        if (!username || !password) {
            return res.send(NO_USERNAME_OR_PASSWORD_ERR_MESSAGE);
        }

        const user = basicAuth(req);

        if (!user || user.name !== username || user.pass !== password) {
            res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
            return res.sendStatus(401);
        }

        next();
    };
};

const forceHttps = (req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
    // 302 temporary - this is a feature that can be disabled
        return res.redirect(302, `https://${req.get('Host')}${req.url}`);
    }
    next();
};

const getStore = (redisConfig, session, ttl) => {
    if (redisConfig.enabled === 'true') {
        const Redis = require('ioredis');
        const RedisStore = require('connect-redis')(session);
        const tlsOptions = {
            password: redisConfig.password,
            tls: true
        };
        const redisOptions = redisConfig.useTLS === 'true' ? tlsOptions : {};
        const client = new Redis(redisConfig.port, redisConfig.host, redisOptions);
        return new RedisStore({client, ttl});
    }
    const MemoryStore = require('express-session').MemoryStore;
    return new MemoryStore();
};

const stringifyNumberBelow21 = (n, language = 'en') => {
    const commonContent = require(`app/resources/${language}/translation/common`);
    const stringNumbers = commonContent.numberBelow21;
    const special = stringNumbers.split(',');
    if (n <= 20) {
        return special[n];
    }
    return n;

};

module.exports = {
    basicAuthUtil,
    forceHttps,
    getStore,
    stringifyNumberBelow21
};
