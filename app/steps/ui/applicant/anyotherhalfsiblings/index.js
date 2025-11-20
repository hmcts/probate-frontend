'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('app/utils/FormatName');

class AnyOtherHalfSiblings extends ValidationStep {

    static getUrl() {
        return '/deceased-other-half-siblings';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        ctx.deceasedName = FormatName.format(formdata.deceased);
        return ctx;
    }

    nextStepOptions() {
        return {
            options: [
                {key: 'anyOtherHalfSiblings', value: 'optionYes', choice: 'hadOtherOtherHalfSiblings'}
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

    action(ctx, formdata) {//check after other pages are done
        super.action(ctx, formdata);

        if (formdata.deceased && formdata.deceased.anyOtherHalfSiblings && ctx.anyOtherHalfSiblings !== formdata.deceased.anyOtherHalfSiblings) {
            delete ctx.allHalfSiblingsOver18;
            delete ctx.anyPredeceasedHalfSiblings;
            delete ctx.anySurvivingHalfNiecesAndHalfNephews;
            delete ctx.allHalfNiecesAndHalfNephewsOver18;
        }

        return [ctx, formdata];
    }
}

module.exports = AnyOtherHalfSiblings;
