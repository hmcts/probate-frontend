'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('../../../../utils/FormatName');
const {findIndex} = require('lodash');
const ExecutorsWrapper = require('../../../../wrappers/Executors');
const pageUrl = '/coapplicant-adopted-in';

class CoApplicantAdoptedIn extends ValidationStep {

    static getUrl(index = '*') {
        return `${pageUrl}/${index}`;
    }

    getContextData(req) {
        const formdata = req.session.form;
        const ctx = super.getContextData(req);
        if (req.params && !isNaN(req.params[0])) {
            ctx.index = parseInt(req.params[0]);
        } else {
            const executorsWrapper = new ExecutorsWrapper(formdata.executors);
            ctx.index = executorsWrapper.getNextIndex();
            ctx.redirect = `${pageUrl}/${ctx.index}`;
        }
        ctx.deceasedName = FormatName.format(formdata.deceased);
        ctx.applicantName = ctx.list?.[ctx.index]?.fullName;
        return ctx;
    }
    isComplete(ctx) {
        const adoptedInFields = [
            'childAdoptedIn',
            'grandchildAdoptedIn',
            'halfBloodSiblingAdoptedIn',
            'halfBloodNieceOrNephewAdoptedIn',
            'wholeBloodSiblingAdoptedIn',
            'wholeBloodNieceOrNephewAdoptedIn'
        ];
        const hasAdoptedIn = adoptedInFields.some(field => ctx.list[ctx.index]?.[field]);
        return [hasAdoptedIn, 'inProgress'];
    }

    nextStepOptions(ctx) {
        const adoptedInFields = [
            'childAdoptedIn',
            'grandchildAdoptedIn',
            'halfBloodSiblingAdoptedIn',
            'halfBloodNieceOrNephewAdoptedIn',
            'wholeBloodSiblingAdoptedIn',
            'wholeBloodNieceOrNephewAdoptedIn'
        ];
        const applicant = ctx.list?.at(ctx.index);
        ctx.isAdoptedIn = ctx.adoptedIn === 'optionYes' ||
            adoptedInFields.some(field => applicant?.[field] === 'optionYes');
        return {
            options: [
                {key: 'isAdoptedIn', value: true, choice: 'adoptedIn'},
            ]
        };
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

    handlePost(ctx, errors, formdata) {
        if (formdata.executors && formdata.executors.list && ctx.adoptedIn !== this.currentAdoptedInValue(formdata, ctx)) {
            this.clearAdoptionRelatedFields(ctx, formdata);
        }
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

    action(ctx, formdata) {
        super.action(ctx, formdata);
        // Keep journey-only values out of persisted executor payload.
        delete ctx.isAdoptedIn;
        delete ctx.deceasedName;
        delete ctx.applicantName;
        return [ctx, formdata];
    }

    currentAdoptedInValue(formdata, ctx) {
        const rel = formdata.executors?.list?.[ctx.index]?.coApplicantRelationshipToDeceased;
        switch (rel) {
        case 'optionChild':
            return formdata.executors.list[ctx.index].childAdoptedIn;
        case 'optionGrandchild':
            return formdata.executors.list[ctx.index].grandchildAdoptedIn;
        case 'optionHalfBloodSibling':
            return formdata.executors.list[ctx.index].halfBloodSiblingAdoptedIn;
        case 'optionHalfBloodNieceOrNephew':
            return formdata.executors.list[ctx.index].halfBloodNieceOrNephewAdoptedIn;
        case 'optionWholeBloodSibling':
            return formdata.executors.list[ctx.index].wholeBloodSiblingAdoptedIn;
        case 'optionWholeBloodNieceOrNephew':
            return formdata.executors.list[ctx.index].wholeBloodNieceOrNephewAdoptedIn;
        default:
            return null;
        }
    }

    clearAdoptionRelatedFields(ctx, formdata) {
        const rel = formdata.executors.list[ctx.index]?.coApplicantRelationshipToDeceased;
        switch (rel) {
        case 'optionChild':
            delete ctx.list[ctx.index].childAdoptionInEnglandOrWales;
            delete ctx.list[ctx.index].childAdoptedOut;
            break;
        case 'optionGrandchild':
            delete ctx.list[ctx.index].grandchildAdoptionInEnglandOrWales;
            delete ctx.list[ctx.index].grandchildAdoptedOut;
            break;
        case 'optionHalfBloodSibling':
            delete ctx.list[ctx.index].halfBloodSiblingAdoptionInEnglandOrWales;
            delete ctx.list[ctx.index].halfBloodSiblingAdoptedOut;
            break;
        case 'optionHalfBloodNieceOrNephew':
            delete ctx.list[ctx.index].halfBloodNieceOrNephewAdoptionInEnglandOrWales;
            delete ctx.list[ctx.index].halfBloodNieceOrNephewAdoptedOut;
            break;
        case 'optionWholeBloodSibling':
            delete ctx.list[ctx.index].wholeBloodSiblingAdoptionInEnglandOrWales;
            delete ctx.list[ctx.index].wholeBloodSiblingAdoptedOut;
            break;
        case 'optionWholeBloodNieceOrNephew':
            delete ctx.list[ctx.index].wholeBloodNieceOrNephewAdoptionInEnglandOrWales;
            delete ctx.list[ctx.index].wholeBloodNieceOrNephewAdoptedOut;
            break;
        default:
            break;
        }
    }
}

module.exports = CoApplicantAdoptedIn;
