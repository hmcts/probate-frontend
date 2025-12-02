'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('../../../../utils/FormatName');
const pageUrl = '/coapplicant-adoption-place';
const {findIndex} = require('lodash');

class CoApplicantAdoptionPlace extends ValidationStep {

    static getUrl(index = '*') {
        return `${pageUrl}/${index}`;
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
            ctx.index = this.recalcIndex(ctx, 0);
            ctx.redirect = `${pageUrl}/${ctx.index}`;
        }

        ctx.applicantName = ctx.list?.[ctx.index]?.fullName;
        return ctx;
    }

    recalcIndex(ctx, index) {
        return findIndex(ctx.list, o => o.isApplying === true, index + 1);
    }

    nextStepUrl(req, ctx) {
        if ((ctx.list[ctx.index].coApplicantRelationshipToDeceased === 'optionChild' ||
            ctx.list[ctx.index].coApplicantRelationshipToDeceased === 'optionHalfBloodSibling' ||
            ctx.list[ctx.index].coApplicantRelationshipToDeceased === 'optionHalfBloodNieceOrNephew') && ctx.adoptionPlace === 'optionYes') {
            return `/coapplicant-email/${ctx.index}`;
        } else if (ctx.list[ctx.index].coApplicantRelationshipToDeceased === 'optionGrandchild' && ctx.adoptionPlace === 'optionYes') {
            return `/parent-adopted-in/${ctx.index}`;
        }
        return this.next(req, ctx).constructor.getUrl('coApplicantAdoptionPlaceStop');
    }

    nextStepOptions(ctx) {
        ctx.childOrSiblingOrNieceOrNephewAdoptedInEnglandOrWales = (ctx.list[ctx.index].coApplicantRelationshipToDeceased === 'optionChild' ||
            ctx.list[ctx.index].coApplicantRelationshipToDeceased === 'optionHalfBloodSibling' ||
            ctx.list[ctx.index].coApplicantRelationshipToDeceased === 'optionHalfBloodNieceOrNephew') && ctx.adoptionPlace === 'optionYes';
        ctx.grandChildAdoptedInEnglandOrWales = ctx.list[ctx.index].coApplicantRelationshipToDeceased === 'optionGrandchild' && ctx.adoptionPlace === 'optionYes';
        return {
            options: [
                {key: 'childAdoptedInEnglandOrWales', value: true, choice: 'childAdoptedInEnglandOrWales'},
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
        }
        return [ctx, errors];
    }
}

module.exports = CoApplicantAdoptionPlace;
