'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('app/utils/FormatName');

class AnyGrandchildrenUnder18 extends ValidationStep {

    static getUrl() {
        return '/any-grandchildren-under-18';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        ctx.deceasedName = FormatName.format(formdata.deceased);
        return ctx;
    }

    nextStepUrl(req, ctx) {
        return this.next(req, ctx).constructor.getUrl('grandchildrenUnder18');
    }

    nextStepOptions(ctx) {
        ctx.allGrandchildrenOver18AndSomePredeceasedChildren = ctx.anyGrandchildrenUnder18 === 'optionNo' && ctx.anyPredeceasedChildren === 'optionYesSome';
        ctx.allGrandchildrenOver18AndAllPredeceasedChildren = ctx.anyGrandchildrenUnder18 === 'optionNo' && ctx.anyPredeceasedChildren === 'optionYesAll';
        return {
            options: [
                {key: 'allGrandchildrenOver18AndSomePredeceasedChildren', value: true, choice: 'allGrandchildrenOver18AndSomePredeceasedChildren'},
                {key: 'allGrandchildrenOver18AndAllPredeceasedChildren', value: true, choice: 'allGrandchildrenOver18AndAllPredeceasedChildren'}
            ]
        };
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.deceasedName;
        return [ctx, formdata];
    }
}

module.exports = AnyGrandchildrenUnder18;
