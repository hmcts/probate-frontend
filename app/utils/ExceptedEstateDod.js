'use strict';

const config = require('config');

class ExceptedEstateDod {
    static afterEeDodThreshold(date) {
        if (!date) {
            throw new TypeError('no deceased date date of death found');
        }
        return new Date(date).getTime() >= new Date(config.exceptedEstates.exceptedEstateDateOfDeath).getTime();
    }
}

module.exports = ExceptedEstateDod;
