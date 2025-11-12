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
        ctx.relationshipToDeceased = formdata.applicant && formdata.applicant.relationshipToDeceased;
        return ctx;
    }

    nextStepUrl(req, ctx) {
        return this.next(req, ctx).constructor.getUrl('grandchildrenUnder18');
    }

    nextStepOptions(ctx) {
        ctx.allGrandchildrenOver18AndSomePredeceasedChildren = ctx.anyGrandchildrenUnder18 === 'optionNo' && ctx.anyPredeceasedChildren === 'optionYesSome';
        ctx.childAndGrandchildrenOver18AndAllPredeceasedChildren = ctx.relationshipToDeceased === 'optionChild' && ctx.anyGrandchildrenUnder18 === 'optionNo' && ctx.anyPredeceasedChildren === 'optionYesAll';
        ctx.grandchildAndGrandchildrenOver18AndAllPredeceasedChildren = ctx.relationshipToDeceased === 'optionGrandchild' && ctx.anyGrandchildrenUnder18 === 'optionNo' && ctx.anyPredeceasedChildren === 'optionYesAll';
        return {
            options: [
                {key: 'allGrandchildrenOver18AndSomePredeceasedChildren', value: true, choice: 'allGrandchildrenOver18AndSomePredeceasedChildren'},
                {key: 'childAndGrandchildrenOver18AndAllPredeceasedChildren', value: true, choice: 'childAndGrandchildrenOver18AndAllPredeceasedChildren'},
                {key: 'grandchildAndGrandchildrenOver18AndAllPredeceasedChildren', value: true, choice: 'grandchildAndGrandchildrenOver18AndAllPredeceasedChildren'}
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
