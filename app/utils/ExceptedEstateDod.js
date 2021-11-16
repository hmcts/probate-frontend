'use strict';

const config = require('config');

class ExceptedEstateDod {
    static beforeEeDodThreshold(date) {
        if (!date) {
            throw new TypeError('no deceased date date of death found');
        }
        return date > config.exceptedEstateDateOfDeath;
    }
}

module.exports = ExceptedEstateDod;
