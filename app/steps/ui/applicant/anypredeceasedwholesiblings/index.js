'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('app/utils/FormatName');

class AnyPredeceasedWholeSiblings extends ValidationStep {

    static getUrl() {
        return '/deceased-whole-siblings';
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
        ctx.hadSomeOrAllPredeceasedWholeSibling = ctx.anyPredeceasedWholeSiblings === 'optionYesSome' || ctx.anyPredeceasedWholeSiblings === 'optionYesAll';
        return {
            options: [
                {key: 'hadSomeOrAllPredeceasedWholeSibling', value: true, choice: 'hadSomeOrAllPredeceasedWholeSibling'},
                {key: 'anyPredeceasedWholeSiblings', value: 'optionNo', choice: 'optionNo'}
            ]
        };
    }
    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.deceasedName;

        if (formdata.deceased && formdata.deceased.anyPredeceasedWholeSiblings && ctx.anyPredeceasedWholeSiblings !== formdata.deceased.anyPredeceasedWholeSiblings) {
            delete ctx.anySurvivingWholeNiecesAndWholeNephews;
            delete ctx.allWholeNiecesAndWholeNephewsOver18;
            delete ctx.allWholeSiblingsOver18;
        }

        return [ctx, formdata];
    }
}

module.exports = AnyPredeceasedWholeSiblings;
