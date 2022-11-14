'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const ExecutorsWrapper = require('app/wrappers/Executors');
const {get} = require('lodash');

class ExecutorsNumber extends ValidationStep {

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
        ctx.list = executorsWrapper.executors();
        ctx.list[0] = {
            firstName: get(formdata, 'applicant.firstName'),
            lastName: get(formdata, 'applicant.lastName'),
            nameAsOnTheWill: (get(formdata, 'applicant.nameAsOnTheWill', 'optionYes') === 'optionYes'),
            alias: get(formdata, 'applicant.alias'),
            aliasReason: get(formdata, 'applicant.aliasReason'),
            otherReason: get(formdata, 'applicant.otherReason'),
            isApplying: true,
            isApplicant: true
        };

        if (ctx.list.length > ctx.executorsNumber) {
            return {
                executorsRemoved: executorsWrapper.executorsInvited(),
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
        return {
            options: [
                {key: 'executorsNumber', value: 1, choice: 'oneExecutor'}
            ]
        };
    }
}

module.exports = ExecutorsNumber;
