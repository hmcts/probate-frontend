'use strict';

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
        return 'optionOther';
    }

    static getCCDCode(value) {
        switch (value) {
        case 'optionSpousePartner':
            return this.getPartner();
        case 'optionChild':
            return this.getChild();
        case 'optionAdoptedChild':
            return this.getAdoptedChild();
        case 'optionOther':
            return this.getOther();
        default:
            throw new Error(`Enumerator RelationshipToDeceasedEnum value: ${value} not found`);
        }
    }
}

module.exports = RelationshipToTheDeceasedEnum;
