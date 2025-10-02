'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('app/utils/FormatName');

class AnySurvivingGrandchildren extends ValidationStep {

    static getUrl() {
        return '/any-surviving-grandchildren';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        ctx.deceasedName = FormatName.format(formdata.deceased);
        return ctx;
    }

    nextStepOptions(ctx) {
        ctx.hadOtherChildrenAndHadNoSurvivingGrandchildren = ctx.anySurvivingGrandchildren === 'optionNo' && ctx.anyPredeceasedChildren === 'optionYesSome';
        ctx.hadNoOtherChildrenAndHadNoSurvivingGrandchildren = ctx.anySurvivingGrandchildren === 'optionNo' && ctx.anyPredeceasedChildren === 'optionYesAll';
        return {
            options: [
                {key: 'anySurvivingGrandchildren', value: 'optionYes', choice: 'hadSurvivingGrandchildren'},
                {key: 'hadOtherChildrenAndHadNoSurvivingGrandchildren', value: true, choice: 'hadOtherChildrenAndHadNoSurvivingGrandchildren'},
                {key: 'hadNoOtherChildrenAndHadNoSurvivingGrandchildren', value: true, choice: 'hadNoOtherChildrenAndHadNoSurvivingGrandchildren'},
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

        if (formdata.deceased && formdata.deceased.anySurvivingGrandchildren && ctx.anySurvivingGrandchildren !== formdata.deceased.anySurvivingGrandchildren) {
            delete ctx.anyGrandchildrenUnder18;
        }

        return [ctx, formdata];
    }
}

module.exports = AnySurvivingGrandchildren;
