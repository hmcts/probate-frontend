'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const ExecutorsWrapper = require('app/wrappers/Executors');
const {get, set} = require('lodash');
const FormatName = require('../../../../utils/FormatName');
const WillWrapper = require('../../../../wrappers/Will');
const FieldError = require('../../../../components/error');

class JointApplication extends ValidationStep {

    static getUrl() {
        return '/joint-application';
    }

    getContextData(req) {
        const formdata = req.session.form;
        let ctx = super.getContextData(req);
        ctx = this.createExecutorList(ctx, req.session.form);
        this.setCodicilFlagInCtx(ctx, req.session.form);
        ctx.deceasedName = FormatName.format(formdata.deceased);
        return ctx;
    }

    setCodicilFlagInCtx(ctx, formdata) {
        ctx.codicilPresent = (new WillWrapper(formdata.will)).hasCodicils();
    }

    handleGet(ctx) {
        ctx.hasCoApplicant = '';
        return [ctx];
    }

    createExecutorList(ctx, formdata) {
        const executorsWrapper = new ExecutorsWrapper(formdata.coApplicants);
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
        ctx.executorsNumber = ctx.list.length;
        const applicant = formdata.applicant;
        ctx.applicantName= applicant?.alias ?? FormatName.format(applicant);

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
        return [ctx.hasCoApplicant === 'optionYes' || ctx.hasCoApplicant === 'optionNo', 'inProgress'];
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        return [ctx, formdata];
    }

    nextStepOptions() {
        return {
            options: [
                {key: 'hasCoApplicant', value: 'optionYes', choice: 'hasCoApplicant'},
                {key: 'hasCoApplicant', value: 'optionNo', choice: 'hasNoCoApplicant'},
            ]
        };
    }
    handlePost(ctx, errors, formdata, session) {
        const isSaveAndClose = typeof get(ctx, 'isSaveAndClose') !== 'undefined' && get(ctx, 'isSaveAndClose') === 'true';
        if (!isSaveAndClose) {
            const hasCoApplicantChecked = ctx.hasCoApplicantChecked === 'true';
            if (hasCoApplicantChecked === false) {
                errors.push(FieldError('hasCoApplicant', 'required', this.resourcePath,
                    this.generateContent({}, {}, session.language), session.language));
            } else if (ctx.list.length > 4) {
                errors.push(FieldError('hasCoApplicant', 'invalid', this.resourcePath,
                    this.generateContent({}, {}, session.language), session.language));
            }
            formdata.coApplicants.hasCoApplicant = ctx.hasCoApplicant;
            set(formdata, 'coApplicants.list', ctx.list);
        }
        return [ctx, errors];
    }
}

module.exports = JointApplication;
