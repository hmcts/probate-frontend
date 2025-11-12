const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('../../../../utils/FormatName');

class IhtUnusedAllowanceClaimed extends ValidationStep {
    static getUrl() {
        return '/unused-allowance-claimed';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const session = req.session;
        const formdata = session.form;
        ctx.deceasedName = FormatName.format(formdata.deceased);
        return ctx;
    }
}

module.exports = IhtUnusedAllowanceClaimed;
