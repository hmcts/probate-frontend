'use strict';

const ValidationStep = require('app/core/steps/ValidationStep.cjs');
const FormatName = require('app/utils/FormatName.cjs');
const WillWrapper = require('../../../../wrappers/Will.cjs');

class ExecutorsNames extends ValidationStep {

    static getUrl() {
        return '/executors-names';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        const applicant = formdata.applicant;
        this.setCodicilFlagInCtx(ctx, req.session.form);
        ctx.applicantCurrentName = FormatName.applicantWillName(applicant);
        return ctx;
    }

    setCodicilFlagInCtx(ctx, formdata) {
        ctx.codicilPresent = (new WillWrapper(formdata.will)).hasCodicils();
    }

    handleGet(ctx) {
        this.createExecutorFullNameArray(ctx);
        return [ctx];
    }

    createExecutorFullNameArray(ctx) {
        ctx.executorName = [];
    }

    handlePost(ctx, errors) {
        if (!ctx.list) {
            ctx.list = [];
        }
        if (ctx.executorName && ctx.executorName.length > 0) {
            ctx.list.push({fullName: ctx.executorName});
        }
        return [ctx, errors];
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.applicantCurrentName;
        delete ctx.executorName;
        return [ctx, formdata];
    }
}

module.exports = ExecutorsNames;
