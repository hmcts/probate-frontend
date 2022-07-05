'use strict';

const config = require('config');

class IhtEstateValuesUtil {
    static withinRange(netQualifyingValue) {
        const range = config.estateQualifyingValueRange;
        return netQualifyingValue > range.min && netQualifyingValue < range.max;
    }
    static isPositiveInteger(value) {
        const pattern = /^[0-9]\d*$/g;
        if (value && value.toString().search(pattern) >= 0) {
            return true;
        }
        return false;
    }
}

module.exports = IhtEstateValuesUtil;
