const ValidationStep = require('app/core/steps/ValidationStep');
const {get} = require('lodash');
const ExecutorsWrapper = require('app/wrappers/Executors');
module.exports = class ExecutorsNumber extends ValidationStep {

    static getUrl() {
        return '/executors-number';
    }

    getContextData(req) {
        let ctx = super.getContextData(req);
        ctx.executorsNumber = ctx.executorsNumber ? parseInt(ctx.executorsNumber) : ctx.executorsNumber;
        ctx = this.createExecutorList(ctx, req.session.form);
        return ctx;
    }

    createExecutorList(ctx, formdata) {
        const executorsWrapper = new ExecutorsWrapper(formdata.executors);
        ctx.list = get(ctx, 'list', []);
        ctx.list[0] = {
            firstName: get(formdata, 'applicant.firstName'),
            lastName: get(formdata, 'applicant.lastName'),
            isApplying: true,
            isApplicant: true
        };

        if (ctx.list.length > ctx.executorsNumber) {
            return {
                list: executorsWrapper.mainApplicant(),
                executorsNumber: ctx.executorsNumber
            };
        }
        return ctx;
    }

    isComplete(ctx) {
        return [ctx.executorsNumber >= 0, 'inProgress'];
    }

    nextStepOptions() {
        const nextStepOptions = {
            options: [
                {key: 'executorsNumber', value: 1, choice: 'deceasedName'}
            ]
        };
        return nextStepOptions;
    }
};
