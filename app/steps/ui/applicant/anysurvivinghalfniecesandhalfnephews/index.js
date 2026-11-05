'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('app/utils/FormatName');
const {set} = require('lodash');

class AnySurvivingHalfNiecesAndHalfNephews extends ValidationStep {

    static getUrl() {
        return '/half-siblings-surviving-children';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        ctx.deceasedName = FormatName.format(formdata.deceased);
        ctx.list = formdata.executors?.list;
        return ctx;
    }

    nextStepOptions(ctx) {
        ctx.hadOtherHalfSiblingAndHadNoSurvivingHalfNiecesOrNephews = ctx.anySurvivingHalfNiecesAndHalfNephews === 'optionNo' && ctx.anyPredeceasedHalfSiblings === 'optionYesSome';
        ctx.hadNoOtherHalfSiblingAndHadNoSurvivingHalfNiecesOrNephews = ctx.anySurvivingHalfNiecesAndHalfNephews === 'optionNo' && ctx.anyPredeceasedHalfSiblings === 'optionYesAll';
        return {
            options: [
                {key: 'anySurvivingHalfNiecesAndHalfNephews', value: 'optionYes', choice: 'hadSurvivingHalfNiecesAndHalfNephews'},
                {key: 'hadOtherHalfSiblingAndHadNoSurvivingHalfNiecesOrNephews', value: true, choice: 'hadOtherHalfSiblingAndHadNoSurvivingHalfNiecesOrNephews'},
            ]
        };
    }

    generateFields(language, ctx, errors) {
        const fields = super.generateFields(language, ctx, errors);
        if (fields.deceasedName && errors) {
            errors[0].msg = errors[0].msg.replace('{deceasedName}', fields.deceasedName.value);
        }
        return fields;
    }

    handlePost(ctx, errors, formdata) {
        if (ctx.list?.length > 1 && formdata.applicant?.anySurvivingHalfNiecesAndHalfNephews && ctx.anySurvivingHalfNiecesAndHalfNephews !== formdata.applicant.anySurvivingHalfNiecesAndHalfNephews) {
            if (ctx.anySurvivingHalfNiecesAndHalfNephews === 'optionNo') {
                if (formdata.applicant.anyPredeceasedHalfSiblings === 'optionYesSome') {
                    ctx.list = ctx.list.filter(coApplicant => coApplicant.coApplicantRelationshipToDeceased !== 'optionHalfBloodNieceOrNephew');
                } else if (formdata.applicant.anyPredeceasedHalfSiblings === 'optionYesAll') {
                    ctx.list.splice(1);
                }
                set(formdata, 'executors.list', ctx.list);
            }
        }
        return super.handlePost(ctx, errors);
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);

        if (formdata.applicant?.anySurvivingHalfNiecesAndHalfNephews && ctx.anySurvivingHalfNiecesAndHalfNephews !== formdata.applicant.anySurvivingHalfNiecesAndHalfNephews) {
            delete ctx.allHalfNiecesAndHalfNephewsOver18;
        }

        return [ctx, formdata];
    }
}

module.exports = AnySurvivingHalfNiecesAndHalfNephews;
