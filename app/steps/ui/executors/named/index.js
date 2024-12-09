'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const ExecutorsWrapper = require('app/wrappers/Executors');
const {get} = require('lodash');

class ExecutorsNamed extends ValidationStep {

    static getUrl() {
        return '/executors-named';
    }

    getContextData(req) {
        let ctx = super.getContextData(req);
        ctx.executorsNumber = ctx.executorsNumber ? parseFloat(ctx.executorsNumber) : ctx.executorsNumber;
        ctx = this.createExecutorList(ctx, req.session.form);
        return ctx;
    }

    createExecutorList(ctx, formdata) {
        const executorsWrapper = new ExecutorsWrapper(formdata.executors);
        ctx.list = executorsWrapper.executors();
        ctx.list[0] = {
            firstName: get(formdata, 'applicant.firstName'),
            lastName: get(formdata, 'applicant.lastName'),
            nameAsOnTheWill: get(formdata, 'applicant.nameAsOnTheWill'),
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

    nextStepOptions(ctx) {
        ctx.multiExec = ctx.executorsNamed === 'optionYes';
        ctx.multiExecOptionNo = ctx.list.length > 1 && ctx.executorsNamed === 'optionNo';
        ctx.singleExec = ctx.list.length === 1 && ctx.executorsNamed === 'optionNo';
        return {
            options: [
                {key: 'multiExec', value: true, choice: 'multiExec'},
                {key: 'multiExecOptionNo', value: true, choice: 'multiExecOptionNo'},
                {key: 'singleExec', value: false, choice: 'otherwise'}
            ]
        };
    }
}

module.exports = ExecutorsNamed;
