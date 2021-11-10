'use strict';

const config = require('config');

class IhtEstateValuesUtil {
    static withinRange(netQualifyingValue) {
        const range = config.estateQualifyingValueRange;
        return netQualifyingValue > range.min && netQualifyingValue < range.max;
    }
}

module.exports = IhtEstateValuesUtil;
