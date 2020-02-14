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
}

module.exports = Deceased;
