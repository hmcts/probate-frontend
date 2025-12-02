'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('app/utils/FormatName');

class AllHalfNiecesAndHalfNephewsOver18 extends ValidationStep {

    static getUrl() {
        return '/half-nieces-half-nephews-age';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        ctx.deceasedName = FormatName.format(formdata.deceased);
        return ctx;
    }

    nextStepUrl(req, ctx) {
        return this.next(req, ctx).constructor.getUrl('anyoneUnder18');
    }
    nextStepOptions(ctx) {
        ctx.allHalfNiecesAndHalfNephewsOver18AndSomePredeceasedHalfSiblings = ctx.allHalfNiecesAndHalfNephewsOver18 === 'optionYes' && ctx.anyPredeceasedHalfSiblings === 'optionYesSome';
        ctx.allHalfNiecesAndHalfNephewsOver18AndAllPredeceasedHalfSiblings = ctx.allHalfNiecesAndHalfNephewsOver18 === 'optionYes' && ctx.anyPredeceasedHalfSiblings === 'optionYesAll';
        return {
            options: [
                {key: 'allHalfNiecesAndHalfNephewsOver18AndSomePredeceasedHalfSiblings', value: true, choice: 'allHalfNiecesAndHalfNephewsOver18AndSomePredeceasedHalfSiblings'},
                {key: 'allHalfNiecesAndHalfNephewsOver18AndAllPredeceasedHalfSiblings', value: true, choice: 'allHalfNiecesAndHalfNephewsOver18AndAllPredeceasedHalfSiblings'}
            ]
        };
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.deceasedName;
        return [ctx, formdata];
    }
}

module.exports = AllHalfNiecesAndHalfNephewsOver18;
