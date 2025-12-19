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

    static mapOptionToValue(optionValue) {
        switch (optionValue) {
        case 'optionChild':
            return 'child';
        case 'optionGrandchild':
            return 'grandchild';
        case 'optionSpousePartner':
            return 'spouse or civil partner';
        case 'optionSpouseOrCivilPartner':
            return 'spouse or civil partner';
        case 'optionSibling':
            return 'sibling';
        case 'optionAdoptedChild':
            return 'adopted child';
        default:
            throw new Error(`Enumerator RelationshipToDeceasedEnum value: ${optionValue} not found`);
        }
    }
}

module.exports = RelationshipToTheDeceasedEnum;
