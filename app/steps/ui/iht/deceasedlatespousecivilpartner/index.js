const ValidationStep = require('app/core/steps/ValidationStep');

class DeceasedHadLateSpouseOrCivilPartner extends ValidationStep {
    static getUrl() {
        return '/deceased-late-spouse-civil-partner';
    }

    nextStepOptions() {
        return {
            options: [
                {key: 'deceasedHadLateSpouseOrCivilPartner', value: 'optionYes', choice: 'deceasedHadLateSpouseOrCivilPartner'}
            ]
        };
    }
}

module.exports = DeceasedHadLateSpouseOrCivilPartner;
