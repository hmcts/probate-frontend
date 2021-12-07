'use strict';

const config = require('config');

class ExceptedEstateDod {
    static afterEeDodThreshold(date) {
        if (!date) {
            throw new TypeError('no deceased date date of death found');
        }
        console.log('*******' + config.exceptedEstateDateOfDeath);
        return new Date(date).getTime() >= new Date(config.exceptedEstateDateOfDeath).getTime();
    }
}

module.exports = ExceptedEstateDod;
