const basicAuth = require('basic-auth');
const common = require('app/resources/en/translation/common.json');
const logger = require('app/components/logger')();

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
exports.basicAuth = function(username, password) {
	return function(req, res, next) {

		if (!username || !password) {
			return res.send('<h1>Error:</h1><p>Username or password not set.');
		}

		const user = basicAuth(req);

		if (!user || user.name !== username || user.pass !== password) {
			res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
			return res.sendStatus(401);
		}

		next();
	};
};

exports.forceHttps = function(req, res, next) {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    // 302 temporary - this is a feature that can be disabled
    return res.redirect(302, 'https://' + req.get('Host') + req.url);
  }
  next();
};

exports.getStore = function (redisConfig, session) {
    logger.info('REDIS LOGGING: called getStore');
    if (redisConfig.enabled === 'true') {
        logger.info(`REDIS LOGGING: redisConfig.enabled: ${redisConfig.enabled}`);
        const Redis = require('ioredis');
        logger.info('REDIS LOGGING: loaded Redis');
        const RedisStore = require('connect-redis')(session);
        logger.info('REDIS LOGGING: loaded RedisStore');
        const tlsOptions = {
            password: redisConfig.password,
            tls: true
        };
        logger.info(`REDIS LOGGING: tlsOptions: ${tlsOptions}`);
        const redisOptions = redisConfig.useTLS === 'true' ? tlsOptions : {};
        logger.info(`REDIS LOGGING: redisOptions: ${redisOptions}`);
        const client = new Redis(redisConfig.port, redisConfig.host, redisOptions);
        logger.info('REDIS LOGGING: loaded client');
        return new RedisStore({client});
    }
    const MemoryStore = require('express-session').MemoryStore;
    return new MemoryStore();
};

exports.stringifyNumberBelow21 = function(n) {
    const stringNumbers = common.numberBelow21;
    const special = stringNumbers.split(',');
    if (n <= 20) {
        return special[n];
    }
        return n;

};
