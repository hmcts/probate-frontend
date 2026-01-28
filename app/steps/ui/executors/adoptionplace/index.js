'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('../../../../utils/FormatName');
const ExecutorsWrapper = require('../../../../wrappers/Executors');
const pageUrl = '/coapplicant-adoption-place';

class CoApplicantAdoptionPlace extends ValidationStep {

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

    handleGet(ctx) {
        if (ctx.list?.[ctx.index]) {
            const rel = ctx.list[ctx.index].coApplicantRelationshipToDeceased;
            switch (rel) {
            case 'optionChild':
                ctx.adoptionPlace = ctx.list[ctx.index].childAdoptionInEnglandOrWales;
                break;
            case 'optionGrandchild':
                ctx.adoptionPlace = ctx.list[ctx.index].grandchildAdoptionInEnglandOrWales;
                break;
            case 'optionHalfBloodSibling':
                ctx.adoptionPlace = ctx.list[ctx.index].halfBloodSiblingAdoptionInEnglandOrWales;
                break;
            case 'optionHalfBloodNieceOrNephew':
                ctx.adoptionPlace = ctx.list[ctx.index].halfBloodNieceOrNephewAdoptionInEnglandOrWales;
                break;
            case 'optionWholeBloodSibling':
                ctx.adoptionPlace = ctx.list[ctx.index].wholeBloodSiblingAdoptionInEnglandOrWales;
                break;
            case 'optionWholeBloodNieceOrNephew':
                ctx.adoptionPlace = ctx.list[ctx.index].wholeBloodNieceOrNephewAdoptionInEnglandOrWales;
                break;
            default:
                ctx.adoptionPlace = ctx.list[ctx.index].childAdoptionInEnglandOrWales;
                break;
            }
        }
        return [ctx];
    }

    getContextData(req) {
        const formdata = req.session.form;
        const ctx = super.getContextData(req);
        ctx.deceasedName = FormatName.format(formdata.deceased);
        if (req.params && !isNaN(req.params[0])) {
            ctx.index = parseInt(req.params[0]);
        } else {
            const executorsWrapper = new ExecutorsWrapper(formdata.executors);
            ctx.index = executorsWrapper.getNextIndex();
            ctx.redirect = `${pageUrl}/${ctx.index}`;
        }

        ctx.applicantName = ctx.list?.[ctx.index]?.fullName;
        return ctx;
    }
    isComplete(ctx) {
        const adoptedPlaceFields = [
            'childAdoptionInEnglandOrWales',
            'grandchildAdoptionInEnglandOrWales',
            'halfBloodSiblingAdoptionInEnglandOrWales',
            'halfBloodNieceOrNephewAdoptionInEnglandOrWales',
            'wholeBloodSiblingAdoptionInEnglandOrWales',
            'wholeBloodNieceOrNephewAdoptionInEnglandOrWales'
        ];
        const hasAdoptedIn = adoptedPlaceFields.some(field => ctx.list[ctx.index]?.[field]);
        return [hasAdoptedIn, 'inProgress'];
    }

    nextStepUrl(req, ctx) {
        if ((ctx.list[ctx.index].coApplicantRelationshipToDeceased === 'optionChild' ||
                ctx.list[ctx.index].coApplicantRelationshipToDeceased === 'optionHalfBloodSibling' ||
                ctx.list[ctx.index].coApplicantRelationshipToDeceased === 'optionHalfBloodNieceOrNephew' ||
                ctx.list[ctx.index].coApplicantRelationshipToDeceased === 'optionWholeBloodSibling' ||
                ctx.list[ctx.index].coApplicantRelationshipToDeceased === 'optionWholeBloodNieceOrNephew') &&
            ctx.adoptionPlace === 'optionYes') {
            return `/coapplicant-email/${ctx.index}`;
        } else if (ctx.list[ctx.index].coApplicantRelationshipToDeceased === 'optionGrandchild' && ctx.adoptionPlace === 'optionYes') {
            return `/parent-adopted-in/${ctx.index}`;
        }
        return this.next(req, ctx)
            .constructor
            .getUrl('coApplicantAdoptionPlaceStop');
    }

    nextStepOptions(ctx) {
        const adoptedPlaceFields = [
            'childAdoptionInEnglandOrWales',
            'grandchildAdoptionInEnglandOrWales',
            'halfBloodSiblingAdoptionInEnglandOrWales',
            'halfBloodNieceOrNephewAdoptionInEnglandOrWales',
            'wholeBloodSiblingAdoptionInEnglandOrWales',
            'wholeBloodNieceOrNephewAdoptionInEnglandOrWales'
        ];
        const relationship = ctx.list[ctx.index].coApplicantRelationshipToDeceased;
        const hasAdoptionPlace = ctx.adoptionPlace === 'optionYes' || adoptedPlaceFields.some(field => ctx.list[ctx.index]?.[field] === 'optionYes');
        ctx.childOrSiblingOrNieceOrNephewAdoptedInEnglandOrWales = relationship !== 'optionGrandchild' && hasAdoptionPlace;
        ctx.grandChildAdoptedInEnglandOrWales = relationship === 'optionGrandchild' && hasAdoptionPlace;
        return {
            options: [
                {key: 'childOrSiblingOrNieceOrNephewAdoptedInEnglandOrWales', value: true, choice: 'childAdoptedInEnglandOrWales'},
                {key: 'grandChildAdoptedInEnglandOrWales', value: true, choice: 'grandChildAdoptedInEnglandOrWales'},
            ]
        };
    }

    handlePost(ctx, errors) {
        const rel = ctx.list[ctx.index].coApplicantRelationshipToDeceased;
        // eslint-disable-next-line default-case
        switch (rel) {
        case 'optionChild':
            ctx.list[ctx.index].childAdoptionInEnglandOrWales = ctx.adoptionPlace;
            break;
        case 'optionGrandchild':
            ctx.list[ctx.index].grandchildAdoptionInEnglandOrWales = ctx.adoptionPlace;
            break;
        case 'optionHalfBloodSibling':
            ctx.list[ctx.index].halfBloodSiblingAdoptionInEnglandOrWales = ctx.adoptionPlace;
            break;
        case 'optionHalfBloodNieceOrNephew':
            ctx.list[ctx.index].halfBloodNieceOrNephewAdoptionInEnglandOrWales = ctx.adoptionPlace;
            break;
        case 'optionWholeBloodSibling':
            ctx.list[ctx.index].wholeBloodSiblingAdoptionInEnglandOrWales = ctx.adoptionPlace;
            break;
        case 'optionWholeBloodNieceOrNephew':
            ctx.list[ctx.index].wholeBloodNieceOrNephewAdoptionInEnglandOrWales = ctx.adoptionPlace;
            break;
        }
        return [ctx, errors];
    }
}

module.exports = CoApplicantAdoptionPlace;
