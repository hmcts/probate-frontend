'use strict';

class Deceased {
    constructor(deceased) {
        this.deceased = deceased || {};
    }

    hasAlias() {
        return this.deceased.alias === 'optionYes';
    }

    isMarried() {
        return this.deceased.married === 'optionYes';
    }

    hasMarriedStatus() {
        return this.deceased.maritalStatus === 'optionMarried';
    }

    hasAnyOtherChildren() {
        return this.deceased.anyOtherChildren === 'optionYes';
    }
}

module.exports = Deceased;
