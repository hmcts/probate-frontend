'use strict';

class Will {
    constructor(will) {
        this.will = will || {};
    }

    hasCodicils() {
        return this.will.codicils === 'optionYes';
    }

    codicilsNumber() {
        return this.will.codicilsNumber ? this.will.codicilsNumber : 0;
    }
}

module.exports = Will;
