'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('../../../../utils/FormatName');
const {findIndex} = require('lodash');
const pageUrl = '/coapplicant-adopted-in';

class CoApplicantAdoptedIn extends ValidationStep {

    static getUrl(index = '*') {
        return `${pageUrl}/${index}`;
    }

    getUrlWithContext(ctx) {
        const noCtxUrl = this.constructor.getUrl(ctx?.index);
        if (ctx?.caseType === 'intestacy') {
            return `/intestacy${noCtxUrl}`;
        }
        return noCtxUrl;
    }

    getContextData(req) {
        const formdata = req.session.form;
        const ctx = super.getContextData(req);
        if (req.params && !isNaN(req.params[0])) {
            ctx.index = parseInt(req.params[0]);
        } else {
            ctx.index = this.recalcIndex(ctx, 0);
            ctx.redirect = `${pageUrl}/${ctx.index}`;
        }
        ctx.deceasedName = FormatName.format(formdata.deceased);
        ctx.applicantName = ctx.list?.[ctx.index]?.fullName;
        return ctx;
    }

    handleGet(ctx) {
        if (ctx.list?.[ctx.index]) {
            const rel = ctx.list[ctx.index].coApplicantRelationshipToDeceased;
            switch (rel) {
            case 'optionChild':
                ctx.adoptedIn = ctx.list[ctx.index].childAdoptedIn;
                break;
            case 'optionGrandchild':
                ctx.adoptedIn = ctx.list[ctx.index].grandchildAdoptedIn;
                break;
            case 'optionHalfBloodSibling':
                ctx.adoptedIn = ctx.list[ctx.index].halfBloodSiblingAdoptedIn;
                break;
            case 'optionHalfBloodNieceOrNephew':
                ctx.adoptedIn = ctx.list[ctx.index].halfBloodNieceOrNephewAdoptedIn;
                break;
            case 'optionWholeBloodSibling':
                ctx.adoptedIn = ctx.list[ctx.index].wholeBloodSiblingAdoptedIn;
                break;
            case 'optionWholeBloodNieceOrNephew':
                ctx.adoptedIn = ctx.list[ctx.index].wholeBloodNieceOrNephewAdoptedIn;
                break;
            default:
                ctx.adoptedIn = ctx.list[ctx.index].childAdoptedIn;
                break;
            }
        }
        return [ctx];
    }

    recalcIndex(ctx, index) {
        return findIndex(ctx.list, o => o.isApplying === true, index + 1);
    }

    generateFields(language, ctx, errors) {
        const fields = super.generateFields(language, ctx, errors);
        if (fields.deceasedName && errors) {
            errors[0].msg = errors[0].msg.replace('{deceasedName}', fields.deceasedName.value).replace('{applicantName}', fields.applicantName.value);
        }
        return fields;
    }

    nextStepUrl(req, ctx) {
        if (ctx.adoptedIn === 'optionYes') {
            return `/coapplicant-adoption-place/${ctx.index}`;
        }
        return `/coapplicant-adopted-out/${ctx.index}`;
    }

    handlePost(ctx, errors) {
        const rel = ctx.list[ctx.index].coApplicantRelationshipToDeceased;
        // eslint-disable-next-line default-case
        switch (rel) {
        case 'optionChild':
            ctx.list[ctx.index].childAdoptedIn = ctx.adoptedIn;
            break;
        case 'optionGrandchild':
            ctx.list[ctx.index].grandchildAdoptedIn = ctx.adoptedIn;
            break;
        case 'optionHalfBloodSibling':
            ctx.list[ctx.index].halfBloodSiblingAdoptedIn = ctx.adoptedIn;
            break;
        case 'optionHalfBloodNieceOrNephew':
            ctx.list[ctx.index].halfBloodNieceOrNephewAdoptedIn = ctx.adoptedIn;
            break;
        case 'optionWholeBloodSibling':
            ctx.list[ctx.index].wholeBloodSiblingAdoptedIn = ctx.adoptedIn;
            break;
        case 'optionWholeBloodNieceOrNephew':
            ctx.list[ctx.index].wholeBloodNieceOrNephewAdoptedIn = ctx.adoptedIn;
            break;
        }
        return [ctx, errors];
    }
}

module.exports = CoApplicantAdoptedIn;
