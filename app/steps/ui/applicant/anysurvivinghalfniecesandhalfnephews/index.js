'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('app/utils/FormatName');

class AnySurvivingHalfNiecesAndHalfNephews extends ValidationStep {

    static getUrl() {
        return '/half-siblings-surviving-children';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        ctx.deceasedName = FormatName.format(formdata.deceased);
        return ctx;
    }

    nextStepOptions(ctx) {
        ctx.hadOtherHalfSiblingAndHadNoSurvivingHalfNiecesOrNephews = ctx.anySurvivingHalfNiecesAndHalfNephews === 'optionNo' && ctx.anyPredeceasedHalfSiblings === 'optionYesSome';
        ctx.hadNoOtherHalfSiblingAndHadNoSurvivingHalfNiecesOrNephews = ctx.anySurvivingHalfNiecesAndHalfNephews === 'optionNo' && ctx.anyPredeceasedHalfSiblings === 'optionYesAll';
        return {
            options: [
                {key: 'anySurvivingHalfNiecesAndHalfNephews', value: 'optionYes', choice: 'hadSurvivingHalfNiecesAndHalfNephews'},
                {key: 'hadOtherHalfSiblingAndHadNoSurvivingHalfNiecesOrNephews', value: true, choice: 'hadOtherHalfSiblingAndHadNoSurvivingHalfNiecesOrNephews'},
                {key: 'hadNoOtherHalfSiblingAndHadNoSurvivingHalfNiecesOrNephews', value: true, choice: 'hadNoOtherHalfSiblingAndHadNoSurvivingHalfNiecesOrNephews'},
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

    action(ctx, formdata) {
        super.action(ctx, formdata);

        if (formdata.deceased?.anySurvivingHalfNiecesAndHalfNephews && ctx.anySurvivingHalfNiecesAndHalfNephews !== formdata.deceased.anySurvivingHalfNiecesAndHalfNephews) {
            delete ctx.allHalfNiecesAndHalfNephewsOver18;
        }

        return [ctx, formdata];
    }
}

module.exports = AnySurvivingHalfNiecesAndHalfNephews;
