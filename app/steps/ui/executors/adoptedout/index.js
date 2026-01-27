'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('../../../../utils/FormatName');
const ExecutorsWrapper = require('../../../../wrappers/Executors');
const pageUrl = '/coapplicant-adopted-out';

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
            case 'optionWholeBloodSibling':
                ctx.adoptedOut = ctx.list[ctx.index].wholeBloodSiblingAdoptedOut;
                break;
            case 'optionWholeBloodNieceOrNephew':
                ctx.adoptedOut = ctx.list[ctx.index].wholeBloodNieceOrNephewAdoptedOut;
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
        const adoptedOutFields = [
            'childAdoptedOut',
            'grandchildAdoptedOut',
            'halfBloodSiblingAdoptedOut',
            'halfBloodNieceOrNephewAdoptedOut',
            'wholeBloodSiblingAdoptedOut',
            'wholeBloodNieceOrNephewAdoptedOut'
        ];
        const hasAdoptedIn = adoptedOutFields.some(field => ctx.list[ctx.index]?.[field]);
        return [hasAdoptedIn, 'inProgress'];
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
            ctx.list[ctx.index].coApplicantRelationshipToDeceased === 'optionHalfBloodNieceOrNephew' ||
            ctx.list[ctx.index].coApplicantRelationshipToDeceased === 'optionWholeBloodSibling' ||
            ctx.list[ctx.index].coApplicantRelationshipToDeceased === 'optionWholeBloodNieceOrNephew') && ctx.adoptedOut === 'optionNo') {
            return `/coapplicant-email/${ctx.index}`;
        } else if (ctx.list[ctx.index].coApplicantRelationshipToDeceased === 'optionGrandchild' && ctx.adoptedOut === 'optionNo') {
            return `/parent-adopted-in/${ctx.index}`;
        }
        return this.next(req, ctx).constructor.getUrl('coApplicantAdoptedOutStop');
    }

    nextStepOptions(ctx) {
        const adoptedOutFields = [
            'childAdoptedOut',
            'grandchildAdoptedOut',
            'halfBloodSiblingAdoptedOut',
            'halfBloodNieceOrNephewAdoptedOut',
            'wholeBloodSiblingAdoptedOut',
            'wholeBloodNieceOrNephewAdoptedOut'
        ];
        const relationship = ctx.list[ctx.index].coApplicantRelationshipToDeceased;
        const hasAdoptedOut = ctx.adoptedOut === 'optionNo' || adoptedOutFields.some(field => ctx.list[ctx.index]?.[field] === 'optionNo');
        ctx.childOrSiblingOrNieceOrNephewNotAdoptedOut = relationship !== 'optionGrandchild' && hasAdoptedOut;
        ctx.grandChildNotAdoptedOut = relationship === 'optionGrandchild' && hasAdoptedOut;
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
        case 'optionWholeBloodSibling':
            ctx.list[ctx.index].wholeBloodSiblingAdoptedOut = ctx.adoptedOut;
            break;
        case 'optionWholeBloodNieceOrNephew':
            ctx.list[ctx.index].wholeBloodNieceOrNephewAdoptedOut = ctx.adoptedOut;
            break;
        }
        return [ctx, errors];
    }
}

module.exports = CoApplicantAdoptedOut;
