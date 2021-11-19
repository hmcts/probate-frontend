'use strict';

const config = require('config');

class ExceptedEstateDod {
    static beforeEeDodThreshold(date) {
        if (!date) {
            throw new TypeError('no deceased date date of death found');
        }
        return new Date(date).getTime() >= new Date(config.exceptedEstateDateOfDeath).getTime();
    }
}

module.exports = ExceptedEstateDod;
