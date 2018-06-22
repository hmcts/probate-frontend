const ValidationStep = require('app/core/steps/ValidationStep');
const services = require('app/components/services');
const {get, dropRight, slice} = require('lodash');
module.exports = class ExecutorsNumber extends ValidationStep {

    static getUrl() {
        return '/executors-number';
    }

    getContextData(req) {
        let ctx = super.getContextData(req);
        ctx.executorsNumber = ctx.executorsNumber ? parseInt(ctx.executorsNumber) : ctx.executorsNumber;
        ctx = this.createExecutorList(ctx, req.session.form);
        ctx.invitesSent = get(req.session.form, 'executors.invitesSent');
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
                executorsRemoved: slice(ctx.list, 1, ctx.list.length),
                list: dropRight(ctx.list, ctx.list.length -1),
                executorsNumber: ctx.executorsNumber
            };
        }
        return ctx;
    }

    * handlePost(ctx) {
        if (ctx.executorsRemoved && ctx.invitesSent === 'true') {
            yield ctx.executorsRemoved
                .filter(exec => exec.isApplying && !exec.isApplicant && exec.inviteId)
                .map(exec => {
                    return services.removeExecutor(exec.inviteId)
                        .then(result => {
                            if (result.name === 'Error') {
                                throw new Error('Error while deleting executor from invitedata table.');
                            }
                        });
                });
        }
        delete ctx.executorsRemoved;
        return [ctx];
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
