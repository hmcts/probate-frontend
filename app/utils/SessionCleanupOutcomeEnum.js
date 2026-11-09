'use strict';

class SessionCleanupOutcomeEnum {

    static getCompleted() {
        return 'COMPLETED';
    }

    static getSkipped() {
        return 'SKIPPED';
    }

    static getFailed() {
        return 'FAILED';
    }
}

module.exports = SessionCleanupOutcomeEnum;
