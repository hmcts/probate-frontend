'use strict';

class DeathCertificate {
    constructor(deceased) {
        this.deceased = deceased || {};
    }

    hasInterimDeathCertificate() {
        return this.deceased.deathCertificate === 'optionInterimDeathCertificate';
    }

    hasForeignDeathCertificate() {
        return this.deceased.diedEngOrWales === 'optionNo';
    }

    isForeignDeathCertTranslatedSeparately() {
        return this.deceased.foreignDeathCertTranslation === 'optionNo';
    }
}

module.exports = DeathCertificate;
