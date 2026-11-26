'use strict';

class SessionOwnershipStatusEnum {

    static getCurrent() {
        return 'current';
    }

    static getSuperseded() {
        return 'superseded';
    }

    static getNotEnforced() {
        return 'not_enforced';
    }

    static getUnverifiable() {
        return 'unverifiable';
    }
}

module.exports = SessionOwnershipStatusEnum;
