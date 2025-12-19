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

    hasAllChildrenOver18() {
        return this.deceased.allChildrenOver18 === 'optionYes';
    }

    hasAnyDeceasedChildren() {
        return this.deceased.anyDeceasedChildren === 'optionYes';
    }

    hasAnyGrandChildrenUnder18() {
        return this.deceased.anyGrandchildrenUnder18 === 'optionYes';
    }

    hasDeathCertificate() {
        return this.deceased.deathCertificate === 'optionDeathCertificate';
    }

    hasInterimDeathCertificate() {
        return this.deceased.deathCertificate === 'optionInterimCertificate';
    }

    hasForeignDeathCertificate() {
        return this.deceased.diedEngOrWales === 'optionNo';
    }

}

module.exports = Deceased;
