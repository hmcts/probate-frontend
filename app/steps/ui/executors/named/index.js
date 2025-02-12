'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const ExecutorsWrapper = require('app/wrappers/Executors');
const {get} = require('lodash');
const WillWrapper = require('../../../../wrappers/Will');
const FieldError = require('../../../../components/error');

class ExecutorsNamed extends ValidationStep {

    static getUrl() {
        return '/executors-named';
    }

    getContextData(req) {
        let ctx = super.getContextData(req);
        ctx = this.createExecutorList(ctx, req.session.form);
        this.setCodicilFlagInCtx(ctx, req.session.form);
        return ctx;
    }

    setCodicilFlagInCtx(ctx, formdata) {
        ctx.codicilPresent = (new WillWrapper(formdata.will)).hasCodicils();
    }

    handleGet(ctx) {
        ctx.executorsNamed = '';
        return [ctx];
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

    handlePost(ctx, errors, formdata, session) {
        const executorsNamedChecked = ctx.executorsNamedChecked;
        if (executorsNamedChecked === 'false' && ctx.codicilPresent) {
            errors.push(FieldError('executorsNamed', 'requiredCodicils', this.resourcePath,
                this.generateContent({}, {}, session.language), session.language));
        } else if (executorsNamedChecked === 'false') {
            errors.push(FieldError('executorsNamed', 'required', this.resourcePath,
                this.generateContent({}, {}, session.language), session.language));
        } else if (ctx.list.length < 1 || ctx.list.length > 20) {
            errors.push(FieldError('executorsNamed', 'invalid', this.resourcePath,
                this.generateContent({}, {}, session.language), session.language));
        }

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
        return [ctx, formdata];
    }

    nextStepOptions(ctx) {
        ctx.multiExec = ctx.executorsNamed === 'optionYes';
        ctx.multiExecOptionNo = ctx.list && ctx.list.length > 1 && ctx.executorsNamed === 'optionNo';
        ctx.singleExec = ctx.list && ctx.list.length === 1 && ctx.executorsNamed === 'optionNo';
        return {
            options: [
                {key: 'multiExec', value: true, choice: 'multiExec'},
                {key: 'multiExecOptionNo', value: true, choice: 'multiExecOptionNo'},
                {key: 'singleExec', value: true, choice: 'otherwise'}
            ]
        };
    }
}

module.exports = ExecutorsNamed;
