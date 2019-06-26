'use strict';

const content = require('app/resources/en/translation/applicant/relationshiptodeceased');

class RelationshipToTheDeceasedEnum {
    static getPartner() {
        return 'partner';
    }
    static getChild() {
        return 'child';
    }
    static getAdoptedChild() {
        return 'adoptedChild';
    }
    static getOther() {
        return 'other';
    }

    static getCCDCode(value) {
        switch (value) {
        case content.optionSpousePartner:
            return this.getPartner();
        case content.optionChild:
            return this.getChild();
        case content.optionAdoptedChild:
            return this.getAdoptedChild();
        case content.optionOther:
            return this.getOther();
        default:
            throw new Error(`Enumerator RelationshipToDeceasedEnum value: ${value} not found`);
        }
    }
}

module.exports = RelationshipToTheDeceasedEnum;
