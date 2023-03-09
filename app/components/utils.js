'use strict';

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
    getStore,
    stringifyNumberBelow21
};
