'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const WillWrapper = require('../../../../wrappers/Will');
const FormatName = require('../../../../utils/FormatName');

class ExecutorCheckWill extends ValidationStep {

    static getUrl() {
        return '/check-will-executors';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        this.setCodicilFlagInCtx(ctx, req.session.form);
        ctx.deceasedName = FormatName.format(req.session.form.deceased);
        return ctx;
    }

    setCodicilFlagInCtx(ctx, formdata) {
        ctx.codicilPresent = (new WillWrapper(formdata.will)).hasCodicils();
    }
}

module.exports = ExecutorCheckWill;
