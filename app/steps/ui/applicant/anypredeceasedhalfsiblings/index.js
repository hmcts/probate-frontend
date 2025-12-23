'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('app/utils/FormatName');

class AnyPredeceasedHalfSiblings extends ValidationStep {

    static getUrl() {
        return '/deceased-half-siblings';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        ctx.deceasedName = FormatName.format(formdata.deceased);
        return ctx;
    }

    generateFields(language, ctx, errors) {
        const fields = super.generateFields(language, ctx, errors);
        if (fields.deceasedName && errors) {
            errors[0].msg = errors[0].msg.replace('{deceasedName}', fields.deceasedName.value);
        }
        return fields;
    }

    nextStepOptions(ctx) {
        ctx.hadSomeOrAllPredeceasedHalfSibling = ctx.anyPredeceasedHalfSiblings === 'optionYesSome' || ctx.anyPredeceasedHalfSiblings === 'optionYesAll';
        return {
            options: [
                {key: 'hadSomeOrAllPredeceasedHalfSibling', value: true, choice: 'hadSomeOrAllPredeceasedHalfSibling'},
                {key: 'anyPredeceasedHalfSiblings', value: 'optionNo', choice: 'optionNo'}
            ]
        };
    }
    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.deceasedName;

        if (formdata.deceased?.anyPredeceasedHalfSiblings && ctx.anyPredeceasedHalfSiblings !== formdata.deceased.anyPredeceasedHalfSiblings) {
            delete ctx.anySurvivingHalfNiecesAndHalfNephews;
            delete ctx.allHalfNiecesAndHalfNephewsOver18;
            delete ctx.allHalfSiblingsOver18;
        }

        return [ctx, formdata];
    }
}

module.exports = AnyPredeceasedHalfSiblings;
