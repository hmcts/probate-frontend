'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('app/utils/FormatName');

class AllWholeNiecesAndWholeNephewsOver18 extends ValidationStep {

    static getUrl() {
        return '/whole-nieces-whole-nephews-age';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        ctx.deceasedName = FormatName.format(formdata.deceased);
        return ctx;
    }

    nextStepUrl(req, ctx) {
        return this.next(req, ctx).getUrlWithContext(ctx, 'anyoneUnder18');
    }
    nextStepOptions(ctx) {
        ctx.allWholeNiecesAndWholeNephewsOver18AndSomePredeceasedWholeSiblings = ctx.allWholeNiecesAndWholeNephewsOver18 === 'optionYes' && ctx.anyPredeceasedWholeSiblings === 'optionYesSome';
        ctx.allWholeNiecesAndWholeNephewsOver18AndAllPredeceasedWholeSiblings = ctx.allWholeNiecesAndWholeNephewsOver18 === 'optionYes' && ctx.anyPredeceasedWholeSiblings === 'optionYesAll';
        return {
            options: [
                {key: 'allWholeNiecesAndWholeNephewsOver18AndSomePredeceasedWholeSiblings', value: true, choice: 'allWholeNiecesAndWholeNephewsOver18AndSomePredeceasedWholeSiblings'},
                {key: 'allWholeNiecesAndWholeNephewsOver18AndAllPredeceasedWholeSiblings', value: true, choice: 'allWholeNiecesAndWholeNephewsOver18AndAllPredeceasedWholeSiblings'}
            ]
        };
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.deceasedName;
        return [ctx, formdata];
    }
}

module.exports = AllWholeNiecesAndWholeNephewsOver18;
