'use strict';

const content = require('app/resources/en/translation/applicant/spousenotapplyingreason');

class SpouseNotApplyingEnum {

    static getRenouncing() {
        return 'renunciated';
    }

    static getOther() {
        return 'other';
    }

    static getCCDCode(value) {
        switch (value) {
        case content.optionRenouncing:
            return this.getRenouncing();
        case content.optionOther:
            return this.getOther();
        default:
            throw new Error(`Enumerator SpouseNotApplyingEnum value: ${value} not found`);
        }
    }
}

module.exports = SpouseNotApplyingEnum;
