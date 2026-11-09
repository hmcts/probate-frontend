'use strict';

const REDIS_KEY_PREFIX = 'session:active:user:';
const SessionOwnershipStatusEnum = require('app/utils/SessionOwnershipStatusEnum');

class SessionConcurrency {
    constructor(options = {}) {
        this.isSingleActiveSessionEnabled = options.singleActiveSessionEnabled === true || String(options.singleActiveSessionEnabled) === 'true';
        this.isRedisSessionStoreEnabled = options.redisEnabled === true || String(options.redisEnabled) === 'true';
        this.mappingTtlSeconds = Number(options.mappingTtl) || 28800;
        this.redisKeyPrefix = REDIS_KEY_PREFIX;
    }

    canEnforceSessionOwnership(sessionStore) {
        // Disabled enforcement means callers should keep legacy pass-through behaviour.
        if (!this.isSingleActiveSessionEnabled || !this.isRedisSessionStoreEnabled) {
            return false;
        }

        // Enforcing ownership requires Redis scripting support; misconfiguration must fail loudly.
        this._getRedisClient(sessionStore);
        return true;
    }

    // Only a completed OAuth callback may establish ownership; protected requests may only verify or refresh it.
    async activateLatestSession(sessionStore, idamUserId, newlyAuthenticatedSessionId) {
        if (!this.canEnforceSessionOwnership(sessionStore)) {
            return {
                previousSessionId: null,
                ownershipStatus: SessionOwnershipStatusEnum.getNotEnforced()
            };
        }

        if (!idamUserId || !newlyAuthenticatedSessionId) {
            throw new Error('Cannot activate latest session without user ID and session ID.');
        }

        const previousSessionId = await this._replaceCurrentOwnerMapping(sessionStore, idamUserId, newlyAuthenticatedSessionId);
        if (previousSessionId && previousSessionId !== newlyAuthenticatedSessionId) {
            try {
                await this.destroySessionById(sessionStore, previousSessionId);
            } catch (err) {
                // Keep authoritative mapping even when old-session destruction fails.
                return {
                    previousSessionId,
                    ownershipStatus: SessionOwnershipStatusEnum.getCurrent(),
                    destroyError: err
                };
            }
        }

        return {
            previousSessionId,
            ownershipStatus: SessionOwnershipStatusEnum.getCurrent()
        };
    }

    async validateCurrentOwnerAndRefreshTtl(sessionStore, idamUserId, requestSessionId) {
        // Disabled ownership enforcement only bypasses Redis ownership checks; callers still run normal IDAM role authorisation.
        if (!this.canEnforceSessionOwnership(sessionStore)) {
            return SessionOwnershipStatusEnum.getNotEnforced();
        }

        // Missing user/session identity means caller cannot prove ownership and should be treated as not-current.
        if (!idamUserId || !requestSessionId) {
            return SessionOwnershipStatusEnum.getUnverifiable();
        }

        const redisClient = this._getRedisClient(sessionStore);
        const result = await redisClient.eval(
            `
                local active = redis.call('GET', KEYS[1])
                if active == ARGV[1] then
                    -- Only the current owner session may refresh TTL on the ownership mapping.
                    redis.call('SET', KEYS[1], ARGV[1], 'EX', ARGV[2])
                    return 1
                end
                if not active then
                    -- Protected requests must never create ownership; callback activation is the only creator.
                    return 2
                end
                -- Another browser owns the mapping, so leave it unchanged and report this session as superseded.
                return 0
            `,
            1,
            this._buildRedisKey(idamUserId),
            requestSessionId,
            this.mappingTtlSeconds
        );
        const numericResult = Number(result);
        if (numericResult === 1) {
            return SessionOwnershipStatusEnum.getCurrent();
        }
        if (numericResult === 2) {
            return SessionOwnershipStatusEnum.getUnverifiable();
        }
        return SessionOwnershipStatusEnum.getSuperseded();
    }

    async clearCurrentOwnerMappingOnSessionMatch(sessionStore, idamUserId, sessionIdToClear) {
        // Only the session that still owns the mapping may delete it, so older-browser sign-out cannot clear newer ownership.
        if (!this.canEnforceSessionOwnership(sessionStore) || !idamUserId || !sessionIdToClear) {
            return 0;
        }

        const redisClient = this._getRedisClient(sessionStore);
        return redisClient.eval(
            `
                if redis.call('GET', KEYS[1]) == ARGV[1] then
                    return redis.call('DEL', KEYS[1])
                end
                return 0
            `,
            1,
            this._buildRedisKey(idamUserId),
            sessionIdToClear
        );
    }

    async _replaceCurrentOwnerMapping(sessionStore, idamUserId, newOwnerSessionId) {
        const redisClient = this._getRedisClient(sessionStore);
        return redisClient.eval(
            `
                local previous = redis.call('GET', KEYS[1])
                redis.call('SET', KEYS[1], ARGV[1], 'EX', ARGV[2])
                return previous
            `,
            1,
            this._buildRedisKey(idamUserId),
            newOwnerSessionId,
            this.mappingTtlSeconds
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

    _buildRedisKey(idamUserId) {
        return `${this.redisKeyPrefix}${idamUserId}`;
    }

    _getRedisClient(sessionStore) {
        // Enforcement requires direct raw Redis client access for atomic Lua EVAL operations.
        if (!sessionStore || !sessionStore.redisClient) {
            throw new Error('Redis-backed session concurrency is enabled, but the session store has no raw Redis client.');
        }

        const hasRedisCommands = ['eval'].every(command => typeof sessionStore.redisClient[command] === 'function');
        // Missing EVAL support means ownership checks cannot remain atomic and must fail closed.
        if (!hasRedisCommands) {
            throw new Error('Redis-backed session concurrency is enabled, but required Redis commands are unavailable.');
        }

        return sessionStore.redisClient;
    }
}

module.exports = SessionConcurrency;
