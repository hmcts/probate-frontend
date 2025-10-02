'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('../../../../utils/FormatName');

class AnyPredeceasedChildren extends ValidationStep {

    static getUrl() {
        return '/any-predeceased-children';
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
        ctx.hadSomeOrAllPredeceasedChildren = ctx.anyPredeceasedChildren === 'optionYesSome' || ctx.anyPredeceasedChildren === 'optionYesAll';
        return {
            options: [
                {key: 'hadSomeOrAllPredeceasedChildren', value: true, choice: 'hadSomeOrAllPredeceasedChildren'},
                {key: 'anyPredeceasedChildren', value: 'optionNo', choice: 'optionNo'}
            ]
        };
    }
    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.deceasedName;

        if (formdata.deceased && formdata.deceased.anyPredeceasedChildren && ctx.anyPredeceasedChildren !== formdata.deceased.anyPredeceasedChildren) {
            delete ctx.anySurvivingGrandchildren;
            delete ctx.anyGrandchildrenUnder18;
            delete ctx.allChildrenOver18;
        }

        return [ctx, formdata];
    }
}

module.exports = AnyPredeceasedChildren;
