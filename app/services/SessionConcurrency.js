'use strict';

class SessionConcurrency {
    constructor(options = {}) {
        this.enabled = options.enabled === true || String(options.enabled) === 'true';
        this.mappingTtlSeconds = Number(options.mappingTtlSeconds) || 28800;
        this.redisKeyPrefix = options.redisKeyPrefix || 'session:active:user:';
    }

    canManageSession(sessionStore) {
        return this.enabled && Boolean(this._getRedisClient(sessionStore));
    }

    async registerAndInvalidatePreviousSession(sessionStore, userKey, currentSessionId) {
        if (!this.canManageSession(sessionStore) || !userKey || !currentSessionId) {
            return;
        }

        const previousSessionId = await this.getActiveSessionId(sessionStore, userKey);
        if (previousSessionId && previousSessionId !== currentSessionId) {
            await this.destroySessionById(sessionStore, previousSessionId);
        }

        await this.setActiveSessionId(sessionStore, userKey, currentSessionId);
    }

    async isCurrentSessionActive(sessionStore, userKey, currentSessionId) {
        if (!this.canManageSession(sessionStore) || !userKey || !currentSessionId) {
            return true;
        }

        const activeSessionId = await this.getActiveSessionId(sessionStore, userKey);
        return !activeSessionId || activeSessionId === currentSessionId;
    }

    async clearActiveSessionIdIfCurrent(sessionStore, userKey, sessionIdToClear) {
        if (!this.canManageSession(sessionStore) || !userKey || !sessionIdToClear) {
            return;
        }

        const activeSessionId = await this.getActiveSessionId(sessionStore, userKey);
        if (activeSessionId === sessionIdToClear) {
            await this.deleteActiveSessionId(sessionStore, userKey);
        }
    }

    async getActiveSessionId(sessionStore, userKey) {
        const redisClient = this._getRedisClient(sessionStore);
        return redisClient.get(this._buildRedisKey(userKey));
    }

    async setActiveSessionId(sessionStore, userKey, sessionId) {
        const redisClient = this._getRedisClient(sessionStore);
        await redisClient.set(this._buildRedisKey(userKey), sessionId, 'EX', this.mappingTtlSeconds);
    }

    async deleteActiveSessionId(sessionStore, userKey) {
        const redisClient = this._getRedisClient(sessionStore);
        await redisClient.del(this._buildRedisKey(userKey));
    }

    destroySessionById(sessionStore, sessionId) {
        return new Promise((resolve, reject) => {
            sessionStore.destroy(sessionId, err => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    _buildRedisKey(userKey) {
        return `${this.redisKeyPrefix}${userKey}`;
    }

    _getRedisClient(sessionStore) {
        if (!sessionStore || !sessionStore.client) {
            return null;
        }

        const hasRedisCommands = ['get', 'set', 'del'].every(command => typeof sessionStore.client[command] === 'function');
        return hasRedisCommands ? sessionStore.client : null;
    }
}

module.exports = SessionConcurrency;

