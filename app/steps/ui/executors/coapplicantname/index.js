'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const {get} = require('lodash');
const FormatName = require('../../../../utils/FormatName');
const FieldError = require('../../../../components/error');
const ExecutorsWrapper = require('app/wrappers/Executors');
const pageUrl = '/coapplicant-name';

class CoApplicantName extends ValidationStep {

    static getUrl(index = '*') {
        return `${pageUrl}/${index}`;
    }

    handleGet(ctx) {
        if (ctx.list?.[ctx.index]) {
            ctx.fullName = ctx.list[ctx.index].fullName;
        }
        return [ctx];
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        ctx.applicantRelationshipToDeceased = get(formdata, 'applicant.relationshipToDeceased');
        if (req.params && !isNaN(req.params[0])) {
            ctx.index = parseInt(req.params[0]);
        } else {
            ctx.index = this.recalcIndex(ctx, formdata);
            ctx.redirect = `${pageUrl}/${ctx.index}`;
        }
        ctx.deceasedName = FormatName.format(formdata.deceased);
        return ctx;
    }

    recalcIndex(ctx, formdata) {
        const executorsWrapper = new ExecutorsWrapper(formdata.executors);
        if (ctx.applicantRelationshipToDeceased === 'optionParent') {
            return 1;
        }
        return executorsWrapper.getNextIndex();
    }

    nextStepOptions(ctx) {
        ctx.isChildJointApplication = ctx.applicantRelationshipToDeceased === 'optionChild' || ctx.applicantRelationshipToDeceased === 'optionGrandchild' || ctx.applicantRelationshipToDeceased === 'optionSibling';
        ctx.isParentJointApplication = ctx.applicantRelationshipToDeceased === 'optionParent';
        return {
            options: [
                {key: 'isChildJointApplication', value: true, choice: 'isChildJointApplication'},
            ],
        };
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        return [ctx, formdata];
    }

    isComplete(ctx) {
        if (ctx.list[ctx.index]?.fullName) {
            return [true, 'inProgress'];
        }
        return [false, 'inProgress'];
    }
    handlePost(ctx, errors, formdata, session) {
        if (ctx.fullName && ctx.fullName.length < 2) {
            errors.push(FieldError('fullName', 'minLength', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        } else if (ctx.fullName && ctx.fullName.length > 100) {
            errors.push(FieldError('fullName', 'maxLength', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        }
        if (ctx.applicantRelationshipToDeceased === 'optionParent' && ctx.index === 1) {
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
