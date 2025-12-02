'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('../../../../utils/FormatName');
const pageUrl = '/coapplicant-adopted-out';
const {findIndex} = require('lodash');

class CoApplicantAdoptedOut extends ValidationStep {

    static getUrl(index = '*') {
        return `${pageUrl}/${index}`;
    }

    handleGet(ctx) {
        if (ctx.list?.[ctx.index]) {
            const rel = ctx.list[ctx.index].coApplicantRelationshipToDeceased;
            switch (rel) {
            case 'optionChild':
                ctx.adoptedOut = ctx.list[ctx.index].childAdoptedOut;
                break;
            case 'optionGrandchild':
                ctx.adoptedOut = ctx.list[ctx.index].grandchildAdoptedOut;
                break;
            case 'optionHalfBloodSibling':
                ctx.adoptedOut = ctx.list[ctx.index].halfBloodSiblingAdoptedOut;
                break;
            case 'optionHalfBloodNieceOrNephew':
                ctx.adoptedOut = ctx.list[ctx.index].halfBloodNieceOrNephewAdoptedOut;
                break;
            default:
                ctx.adoptedOut = ctx.list[ctx.index].childAdoptedOut;
                break;
            }
        }
        return [ctx];
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        ctx.applicantName = ctx.list?.[ctx.index]?.fullName;
        ctx.deceasedName = FormatName.format(formdata.deceased);
        if (req.params && !isNaN(req.params[0])) {
            ctx.index = parseInt(req.params[0]);
        } else {
            ctx.index = this.recalcIndex(ctx, 0);
            ctx.redirect = `${pageUrl}/${ctx.index}`;
        }
        return ctx;
    }

    recalcIndex(ctx, index) {
        return findIndex(ctx.list, o => o.isApplying === true, index + 1);
    }

    generateFields(language, ctx, errors) {
        const fields = super.generateFields(language, ctx, errors);
        if (fields.deceasedName && fields.applicantName && errors) {
            errors[0].msg = errors[0].msg.replace('{deceasedName}', fields.deceasedName.value).replace('{applicantName}', fields.applicantName.value);
        }
        return fields;
    }

    nextStepUrl(req, ctx) {
        if ((ctx.list[ctx.index].coApplicantRelationshipToDeceased === 'optionChild' ||
            ctx.list[ctx.index].coApplicantRelationshipToDeceased === 'optionHalfBloodSibling' ||
            ctx.list[ctx.index].coApplicantRelationshipToDeceased === 'optionHalfBloodNieceOrNephew') && ctx.adoptedOut === 'optionNo') {
            return `/coapplicant-email/${ctx.index}`;
        } else if (ctx.list[ctx.index].coApplicantRelationshipToDeceased === 'optionGrandchild' && ctx.adoptedOut === 'optionNo') {
            return `/parent-adopted-in/${ctx.index}`;
        }
        return this.next(req, ctx).constructor.getUrl('coApplicantAdoptedOutStop');
    }

    nextStepOptions(ctx) {
        ctx.childOrSiblingOrNieceOrNephewNotAdoptedOut = (ctx.list[ctx.index].coApplicantRelationshipToDeceased === 'optionChild' ||
            ctx.list[ctx.index].coApplicantRelationshipToDeceased === 'optionHalfBloodSibling' ||
            ctx.list[ctx.index].coApplicantRelationshipToDeceased === 'optionHalfBloodNieceOrNephew') && ctx.adoptedOut === 'optionNo';
        ctx.grandChildNotAdoptedOut = ctx.list[ctx.index].coApplicantRelationshipToDeceased === 'optionGrandchild' && ctx.adoptedOut === 'optionNo';
        return {
            options: [
                {key: 'childOrSiblingOrNieceOrNephewNotAdoptedOut', value: true, choice: 'childOrSiblingOrNieceOrNephewNotAdoptedOut'},
                {key: 'grandChildNotAdoptedOut', value: true, choice: 'grandChildNotAdoptedOut'}
            ]
        };
    }

    handlePost(ctx, errors) {
        const rel = ctx.list[ctx.index].coApplicantRelationshipToDeceased;
        // eslint-disable-next-line default-case
        switch (rel) {
        case 'optionChild':
            ctx.list[ctx.index].childAdoptedOut = ctx.adoptedOut;
            break;
        case 'optionGrandchild':
            ctx.list[ctx.index].grandchildAdoptedOut = ctx.adoptedOut;
            break;
        case 'optionHalfBloodSibling':
            ctx.list[ctx.index].halfBloodSiblingAdoptedOut = ctx.adoptedOut;
            break;
        case 'optionHalfBloodNieceOrNephew':
            ctx.list[ctx.index].halfBloodNieceOrNephewAdoptedOut = ctx.adoptedOut;
            break;
        }
        return [ctx, errors];
    }
}

module.exports = CoApplicantAdoptedOut;
