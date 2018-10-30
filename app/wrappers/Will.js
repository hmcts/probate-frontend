'use strict';

const commonContent = require('app/resources/en/translation/common');

class Will {
    constructor(will) {
        this.will = will || {};
    }

    hasCodicils() {
        return this.will.codicils === commonContent.yes;
    }

    codicilsNumber() {
        return this.will.codicilsNumber ? this.will.codicilsNumber : 0;
    }
}

module.exports = Will;
