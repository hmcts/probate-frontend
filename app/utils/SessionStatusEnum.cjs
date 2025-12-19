'use strict';

class SessionStatusEnum {

    static getActive() {
        return 'active';
    }

    static getLost() {
        return 'lost';
    }

    static getExpired() {
        return 'expired';
    }
}

module.exports = SessionStatusEnum;
