'use strict';

const REDIS_KEY_PREFIX = 'session:active:user:';

class SessionConcurrency {
    constructor(options = {}) {
        this.enabled = options.redisEnabled === true || String(options.redisEnabled) === 'true';
        this.mappingTtlSeconds = Number(options.sessionTtl) || 28800;
        this.redisKeyPrefix = REDIS_KEY_PREFIX;
    }

    canManageSession(sessionStore) {
        if (!this.enabled) {
            return false;
        }

        this._getRedisClient(sessionStore);
        return true;
    }

    // Only completed OAuth callbacks may replace ownership; protected requests may only verify or refresh
    // that ownership, and cleanup must compare session IDs atomically so old requests or logouts cannot
    // displace the newest login.
    async activateLatest(sessionStore, userId, currentSessionId) {
        if (!this.canManageSession(sessionStore)) {
            return {previousSessionId: null};
        }

        if (!userId || !currentSessionId) {
            throw new Error('Cannot activate latest session without user ID and session ID.');
        }

        const previousSessionId = await this.setActiveSessionId(sessionStore, userId, currentSessionId);
        if (previousSessionId && previousSessionId !== currentSessionId) {
            try {
                await this.destroySessionById(sessionStore, previousSessionId);
            } catch (err) {
                return {previousSessionId, destroyError: err};
            }
        }

        return {previousSessionId};
    }

    async assertAndTouch(sessionStore, userId, currentSessionId) {
        if (!this.canManageSession(sessionStore)) {
            return true;
        }

        if (!userId || !currentSessionId) {
            return false;
        }

        return this.assertAndTouchActiveSessionId(sessionStore, userId, currentSessionId);
    }

    async clearIfCurrent(sessionStore, userId, sessionIdToClear) {
        if (!this.canManageSession(sessionStore) || !userId || !sessionIdToClear) {
            return 0;
        }

        return this.deleteActiveSessionIdIfCurrent(sessionStore, userId, sessionIdToClear);
    }

    async setActiveSessionId(sessionStore, userId, sessionId) {
        const redisClient = this._getRedisClient(sessionStore);
        return redisClient.eval(
            `
                local previous = redis.call('GET', KEYS[1])
                redis.call('SET', KEYS[1], ARGV[1], 'EX', ARGV[2])
                return previous
            `,
            1,
            this._buildRedisKey(userId),
            sessionId,
            this.mappingTtlSeconds
        );
    }

    async assertAndTouchActiveSessionId(sessionStore, userId, sessionId) {
        const redisClient = this._getRedisClient(sessionStore);
        const result = await redisClient.eval(
            `
                local active = redis.call('GET', KEYS[1])
                if active == ARGV[1] then
                    redis.call('SET', KEYS[1], ARGV[1], 'EX', ARGV[2])
                    return 1
                end
                if not active then
                    local claimed = redis.call('SET', KEYS[1], ARGV[1], 'EX', ARGV[2], 'NX')
                    if claimed then
                        return 1
                    end
                end
                return 0
            `,
            1,
            this._buildRedisKey(userId),
            sessionId,
            this.mappingTtlSeconds
        );
        return Number(result) === 1;
    }

    async deleteActiveSessionIdIfCurrent(sessionStore, userId, sessionId) {
        const redisClient = this._getRedisClient(sessionStore);
        return redisClient.eval(
            `
                if redis.call('GET', KEYS[1]) == ARGV[1] then
                    return redis.call('DEL', KEYS[1])
                end
                return 0
            `,
            1,
            this._buildRedisKey(userId),
            sessionId
        );
    }

    destroySessionById(sessionStore, sessionId) {
        return new Promise((resolve, reject) => {
            if (!sessionStore || typeof sessionStore.destroy !== 'function') {
                reject(new Error('Session store does not support destroy.'));
                return;
            }

            sessionStore.destroy(sessionId, err => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    _buildRedisKey(userId) {
        return `${this.redisKeyPrefix}${userId}`;
    }

    _getRedisClient(sessionStore) {
        if (!sessionStore || !sessionStore.client) {
            throw new Error('Redis-backed session concurrency is enabled, but the session store has no Redis client.');
        }

        const hasRedisCommands = ['eval'].every(command => typeof sessionStore.client[command] === 'function');
        if (!hasRedisCommands) {
            throw new Error('Redis-backed session concurrency is enabled, but required Redis commands are unavailable.');
        }

        return sessionStore.client;
    }
}

module.exports = SessionConcurrency;
