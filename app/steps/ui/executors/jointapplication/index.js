'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const ExecutorsWrapper = require('app/wrappers/Executors');
const {get, set} = require('lodash');
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
            executor.wholeBloodSiblingAdoptionInEnglandOrWales !== 'optionNo' &&
            executor.halfBloodSiblingAdoptionInEnglandOrWales !== 'optionNo' &&
            executor.wholeBloodNieceOrNephewAdoptionInEnglandOrWales !== 'optionNo' &&
            executor.childAdoptedOut !== 'optionYes' &&
            executor.grandchildAdoptedOut !== 'optionYes' &&
            executor.wholeBloodSiblingAdoptedOut !== 'optionYes' &&
            executor.halfBloodSiblingAdoptedOut !== 'optionYes' &&
            executor.wholeBloodNieceOrNephewAdoptedOut !== 'optionYes' &&
            executor.halfBloodNieceOrNephewAdoptedOut !== 'optionYes' &&
            executor.childDieBeforeDeceased !== 'optionNo' &&
            executor.wholeBloodSiblingDiedBeforeDeceased !== 'optionNo' &&
            executor.halfBloodSiblingDiedBeforeDeceased !== 'optionNo'
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
        if (ctx.hasCoApplicant === 'optionYes' && ctx.list.length > 1 && !this.areLastExecutorValid(ctx)) {
            return [true, 'inProgress'];
        } else if (ctx.hasCoApplicant === 'optionNo') {
            return [true, 'inProgress'];
        } else if (ctx.hasCoApplicant === 'optionYes' && this.areLastExecutorValid(ctx) && ctx.applicantRelationshipToDeceased === 'optionParent') {
            return [true, 'inProgress'];
        }
        return [false, 'inProgress'];
    }
    areLastExecutorValid(ctx) {
        const lastIndex = ctx.list.length - 1;
        const executor = ctx.list[lastIndex];
        return executor?.isApplicant !== true && executor?.coApplicantRelationshipToDeceased && executor?.fullName &&
            executor?.email &&
            executor?.address?.formattedAddress;
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
            if (hasCoApplicantChecked === false && ctx.applicantRelationshipToDeceased !== 'optionParent') {
                errors.push(FieldError('hasCoApplicant', 'required', this.resourcePath,
                    this.generateContent({}, {}, session.language), session.language));
            } else if (hasCoApplicantChecked === false && ctx.applicantRelationshipToDeceased === 'optionParent') {
                errors.push(FieldError('hasCoApplicant', 'requiredParent', this.resourcePath,
                    this.generateContent({}, {}, session.language), session.language));
            } else if (ctx.list.length > 3 && ctx.hasCoApplicant === 'optionYes') {
                errors.push(FieldError('hasCoApplicant', 'invalid', this.resourcePath,
                    this.generateContent({}, {}, session.language), session.language));
            }
        }
        if (ctx.caseType === caseTypes.INTESTACY && ctx.hasCoApplicant === 'optionNo' &&
            ctx.applicantRelationshipToDeceased === 'optionParent' && ctx.list.length === 2) {
            const lastIndex = ctx.list.length - 1;
            ctx.list.splice(lastIndex, 1);
            set(formdata, 'executors.list', ctx.list);
        }
        return [ctx, errors];
    }

    generateFields(language, ctx, errors) {
        const fields = super.generateFields(language, ctx, errors);
        if (fields.deceasedName && errors) {
            errors[0].msg = errors[0].msg.replace('{deceasedName}', fields.deceasedName.value);
        }
        return fields;
    }
}

module.exports = JointApplication;
