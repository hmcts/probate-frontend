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

    static mapOptionToValue(optionValue, language) {
        if (optionValue !== null && typeof optionValue !== 'undefined') {
            if (language === 'en') {
                switch (optionValue) {
                case 'optionChild':
                    return 'child';
                case 'optionGrandchild':
                    return 'grandchild';
                case 'optionSpousePartner':
                    return 'husband, wife or civil partner';
                case 'optionSibling':
                    return 'sibling';
                case 'optionAdoptedChild':
                    return 'adopted child';
                case 'optionParent':
                    return 'parent';
                case 'optionNieceOrNephew':
                    return 'niece or nephew';
                default:
                    throw new Error(`Enumerator RelationshipToDeceasedEnum English value: ${optionValue} not found`);
                }
            } else {
                switch (optionValue) {
                case 'optionChild':
                    return 'plentyn';
                case 'optionGrandchild':
                    return 'ŵyr/wyres';
                case 'optionSpousePartner':
                    return 'gŵr, gwraig neu bartner sifil';
                case 'optionSibling':
                    return 'brawd/chwaer';
                case 'optionAdoptedChild':
                    return 'plentyn mabwysiedig';
                case 'optionParent':
                    return 'rhiant';
                case 'optionNieceOrNephew':
                    return 'nith neu nai';
                default:
                    throw new Error(`Enumerator RelationshipToDeceasedEnum Welsh value: ${optionValue} not found`);
                }
            }
        }
    }
}

module.exports = RelationshipToTheDeceasedEnum;
