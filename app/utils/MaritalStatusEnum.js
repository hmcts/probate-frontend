'use strict';

const content = require('app/resources/en/translation/deceased/maritalstatus');

class MaritalStatusEnum {

    static getWidowed() {
        return 'widowed';
    }
    static getMarriedCivilPartnerhip() {
        return 'marriedCivilPartnership';
    }
    static getDivorcedCivilPartnerShip() {
        return 'divorcedCivilPartnership';
    }
    static getJudicially() {
        return 'judicially';
    }
    static getNeverMarried() {
        return 'neverMarried';
    }

    static getCCDCode(value) {
        switch (value) {
        case content.optionWidowed:
            return this.getWidowed();
        case content.optionMarried:
            return this.getMarriedCivilPartnerhip();
        case content.optionDivorced:
            return this.getDivorcedCivilPartnerShip();
        case content.optionSeparated:
            return this.getJudicially();
        case content.optionNotMarried:
            return this.getNeverMarried();
        default:
            throw new Error(`Enumerator MaritalStatusEnum value: ${value} not found`);
        }
    }
}

module.exports = MaritalStatusEnum;
