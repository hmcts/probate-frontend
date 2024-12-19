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
            isApplicant: true,
            fullName: `${get(formdata, 'applicant.firstName')} ${get(formdata, 'applicant.lastName')}`
        };

        ctx.list = [...executorsWrapper.executors().map(executor => ({
            ...executor,
            fullName: executor.fullName
        }))];
        console.log('ctx.list', ctx.list);
        console.log('ctx.map', ctx.list.map(executor => executor.fullName));
        ctx.executorsNumber = ctx.list.length;

        if (ctx.list.length > ctx.executorsNumber) {
            return {
                executorsRemoved: executorsWrapper.executorsInvited(),
                list: executorsWrapper.mainApplicant(),
                executorsNumber: ctx.executorsNumber
            };
        }
        return ctx;
    }

    removeExecutor(ctx, executorId) {
        const executorIndex = ctx.list.findIndex(executor => executor.id === executorId);
        if (executorIndex !== -1) {
            ctx.list.splice(executorIndex, 1);
        }
        return ctx;
    }

    handlePost(ctx, errors) {
        if (ctx.executorsNamed === 'optionYes') {
            ctx.executorName = ctx.list.map(executor => executor.fullName) || [];
        }
        ctx.executorsNumber = ctx.list.length;
        return [ctx, errors];
    }

    isComplete(ctx) {
        return [ctx.executorsNamed === 'optionYes' || ctx.executorsNamed === 'optionNo', 'inProgress'];
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.executorsNamed;
        return [ctx, formdata];
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
