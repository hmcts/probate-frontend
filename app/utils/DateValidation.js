'use strict';

class DateValidation {
    static isPositive(dateArray) {
        if (!dateArray) {
            throw new TypeError(`no dateArray found: ${dateArray}`);
        }
        for (let i = 0; i < dateArray.length; i++) {
            if (parseInt(dateArray[i]) < 1) {
                return false;
            }
        }
        return true;
    }
}

module.exports = DateValidation;
