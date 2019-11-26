'use strict';

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
        case 'optionWidowed':
            return this.getWidowed();
        case 'optionMarried':
            return this.getMarriedCivilPartnerhip();
        case 'optionDivorced':
            return this.getDivorcedCivilPartnerShip();
        case 'optionSeparated':
            return this.getJudicially();
        case 'optionNotMarried':
            return this.getNeverMarried();
        default:
            throw new Error(`Enumerator MaritalStatusEnum value: ${value} not found`);
        }
    }
}

module.exports = MaritalStatusEnum;
