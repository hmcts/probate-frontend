'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const ExecutorsWrapper = require('app/wrappers/Executors');
const {get} = require('lodash');
const FormatName = require('../../../../utils/FormatName');
const FieldError = require('../../../../components/error');
const caseTypes = require('../../../../utils/CaseTypes');

class JointApplication extends ValidationStep {

    static getUrl() {
        return '/joint-application';
    }

    getContextData(req) {
        const formdata = req.session.form;
        let ctx = super.getContextData(req);
        ctx = this.createExecutorList(ctx, req.session.form);
        ctx.deceased = formdata.deceased;
        ctx.deceasedName = FormatName.format(ctx.deceased);
        ctx.applicantRelationshipToDeceased = get(formdata, 'applicant.relationshipToDeceased');
        return ctx;
    }

    handleGet(ctx) {
        ctx.hasCoApplicant = '';
        return [ctx];
    }

    createExecutorList(ctx, formdata) {
        const executorsWrapper = new ExecutorsWrapper(formdata.executors);
        ctx.list = executorsWrapper.executors();
        ctx.list[0] = {
            firstName: get(formdata, 'applicant.firstName'),
            lastName: get(formdata, 'applicant.lastName'),
            isApplying: true,
            isApplicant: true,
            fullName: `${get(formdata, 'applicant.firstName')} ${get(formdata, 'applicant.lastName')}`
        };

        ctx.list = [...executorsWrapper.executors().map(executor => ({
            ...executor,
            fullName: executor.fullName
        }))];
        ctx.list = ctx.list.filter(executor =>
            executor.childAdoptionInEnglandOrWales !== 'optionNo' &&
            executor.grandchildAdoptionInEnglandOrWales !== 'optionNo' &&
            executor.childAdoptedOut !== 'optionYes' &&
            executor.grandchildAdoptedOut !== 'optionYes' &&
            executor.childDieBeforeDeceased !== 'optionNo'
        );
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

    nextStepOptions(ctx) {
        ctx.isJointApplication = ctx.caseType === caseTypes.INTESTACY && ctx.applicantRelationshipToDeceased !== 'optionParent' && ctx.hasCoApplicant === 'optionYes';
        ctx.isParentJointApplication = ctx.caseType === caseTypes.INTESTACY && ctx.applicantRelationshipToDeceased === 'optionParent' &&
            ctx.hasCoApplicant === 'optionYes' && ctx.deceased.anyOtherParentAlive === 'optionYes';
        ctx.notJointApplication = ctx.caseType === caseTypes.INTESTACY && ctx.hasCoApplicant === 'optionNo';
        return {
            options: [
                {key: 'isJointApplication', value: true, choice: 'isJointApplication'},
                {key: 'isParentJointApplication', value: true, choice: 'isParentJointApplication'},
                {key: 'notJointApplication', value: true, choice: 'notJointApplication'}

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
        }
        return [ctx, errors];
    }
}

module.exports = JointApplication;
