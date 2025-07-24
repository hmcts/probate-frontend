const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('../../../../utils/FormatName');

class DeceasedHadLateSpouseOrCivilPartner extends ValidationStep {
    static getUrl() {
        return '/deceased-late-spouse-civil-partner';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const session = req.session;
        const formdata = session.form;
        ctx.deceasedName = FormatName.format(formdata.deceased);
        return ctx;
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
