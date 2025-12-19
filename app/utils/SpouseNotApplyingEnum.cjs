'use strict';

class SpouseNotApplyingEnum {

    static getRenouncing() {
        return 'renunciated';
    }

    static getOther() {
        return 'optionOther';
    }

    static getCCDCode(value) {
        switch (value) {
        case 'optionRenouncing':
            return this.getRenouncing();
        case 'optionOther':
            return this.getOther();
        default:
            throw new Error(`Enumerator SpouseNotApplyingEnum value: ${value} not found`);
        }
    }
}

module.exports = SpouseNotApplyingEnum;
