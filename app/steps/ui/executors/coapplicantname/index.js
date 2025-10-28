'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const {findIndex, get, every, tail} = require('lodash');
const FormatName = require('../../../../utils/FormatName');
const FieldError = require('../../../../components/error');
const caseTypes = require('../../../../utils/CaseTypes');
const pageUrl = '/coapplicant-name';

class CoApplicantName extends ValidationStep {

    static getUrl(index = '*') {
        return `${pageUrl}/${index}`;
    }

    handleGet(ctx) {
        if (ctx.list?.[ctx.index]) {
            ctx.fullName = ctx.list[ctx.index].fullName;
        }
        console.log('handleGet-->', ctx.index);
        return [ctx];
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        ctx.appicantRelationshipToDeceased = get(formdata, 'applicant.relationshipToDeceased');
        if (req.params && !isNaN(req.params[0])) {
            ctx.index = parseInt(req.params[0]);
        } else {
            ctx.index = this.recalcIndex(ctx, 0);
            ctx.redirect = `${pageUrl}/${ctx.index}`;
        }
        ctx.deceasedName = FormatName.format(formdata.deceased);
        console.log('getContextData-->', ctx.index);
        return ctx;
    }

    recalcIndex(ctx, index) {
        if (ctx.appicantRelationshipToDeceased === 'optionParent') {
            return 1;
        }
        return findIndex(ctx.list, o => o.isApplying === true, index + 1);
    }
    nextStepUrl(req, ctx) {
        if (ctx.index === -1) {
            return this.next(req, ctx).constructor.getUrl();
        }
        if (ctx.appicantRelationshipToDeceased === 'optionParent') {
            return '/coapplicant-email/1';
        }
        return this.next(req, ctx).constructor.getUrl(ctx.index);
    }

    nextStepOptions(ctx) {
        if (ctx.caseType === caseTypes.INTESTACY) {
            ctx.isChildJointApplication = ctx.appicantRelationshipToDeceased === 'optionChild' || ctx.appicantRelationshipToDeceased === 'optionGrandchild';
            ctx.isParentJointApplication = ctx.appicantRelationshipToDeceased === 'optionParent';
            return {
                options: [
                    {key: 'isChildJointApplication', value: true, choice: 'isChildJointApplication'},
                    {key: 'isParentJointApplication', value: true, choice: 'isParentJointApplication'},
                ],
            };
        }
    }
    action(ctx, formdata) {
        super.action(ctx, formdata);
        return [ctx, formdata];
    }

    isComplete(ctx) {
        if (ctx.caseType === caseTypes.INTESTACY) {
            return [every(tail(ctx.list).filter(coApplicant => coApplicant.relationshipToDeceased === 'optionParent'), coApplicant => coApplicant.fullName), 'inProgress'];
        }
    }
    handlePost(ctx, errors, formdata, session) {
        if (ctx.fullName && ctx.fullName.length < 2) {
            errors.push(FieldError('fullName', 'minLength', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        } else if (ctx.fullName && ctx.fullName.length > 100) {
            errors.push(FieldError('fullName', 'maxLength', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        }
        if (ctx.appicantRelationshipToDeceased === 'optionParent' && ctx.index === 1) {
            ctx.list[1] = {
                ...ctx.list[1],
                coApplicantRelationshipToDeceased: 'optionParent',
                fullName: ctx.fullName,
                isApplying: true
            };
        } else {
            ctx.list[ctx.index].fullName = ctx.fullName;
        }
        return [ctx, errors];
    }
}

module.exports = CoApplicantName;
