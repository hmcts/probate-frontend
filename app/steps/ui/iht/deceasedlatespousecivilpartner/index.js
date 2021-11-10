const ValidationStep = require('app/core/steps/ValidationStep');

class DeceasedHadLateSpouseOrCivilPartner extends ValidationStep {
    static getUrl() {
        return '/deceased-late-spouse-civil-partner';
    }
}

module.exports = DeceasedHadLateSpouseOrCivilPartner;
