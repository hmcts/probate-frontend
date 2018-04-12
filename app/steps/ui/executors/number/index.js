const ValidationStep = require('app/core/steps/ValidationStep');
const {get, dropRight} = require('lodash');
module.exports = class ExecutorsNumber extends ValidationStep {

    static getUrl() {
        return '/executors-number'
    }

    getContextData(req) {
        let ctx = super.getContextData(req);
        ctx.executorsNumber = ctx.executorsNumber ? parseInt(ctx.executorsNumber) : ctx.executorsNumber;
        ctx = this.createExecutorList(ctx, req.session.form);
        return ctx;
    }

    createExecutorList(ctx, formdata) {
        ctx.list = get(ctx, 'list', []);
        ctx.list[0] = {
            firstName: get(formdata, 'applicant.firstName'),
            lastName: get(formdata, 'applicant.lastName'),
            isApplying: true,
            isApplicant: true
        };

        if (ctx.list.length > ctx.executorsNumber) {
            return {
                list: dropRight(ctx.list, ctx.list.length -1),
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
}