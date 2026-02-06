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

    nextStepUrl(req, ctx) {
        return this.next(req, ctx).getUrlWithContext(ctx, 'hasOtherSiblingsWithSameParents');
    }

    nextStepOptions(ctx) {
        ctx.hadSomeOrAllPredeceasedWholeSibling = ((ctx.anyPredeceasedWholeSiblings === 'optionYesSome' || ctx.anyPredeceasedWholeSiblings === 'optionYesAll') && ctx.sameParents === 'optionBothParentsSame') ||
            (ctx.anyPredeceasedWholeSiblings === 'optionYesAll' && ctx.sameParents === 'optionOneParentsSame');
        ctx.hadNoPredeceasedWholeSiblings = ctx.anyPredeceasedWholeSiblings === 'optionNo' && ctx.sameParents === 'optionBothParentsSame';
        return {
            options: [
                {key: 'hadSomeOrAllPredeceasedWholeSibling', value: true, choice: 'hadSomeOrAllPredeceasedWholeSibling'},
                {key: 'hadNoPredeceasedWholeSiblings', value: true, choice: 'hadNoPredeceasedWholeSiblings'}
            ]
        };
    }
    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.deceasedName;

        if (formdata.deceased?.anyPredeceasedWholeSiblings && ctx.anyPredeceasedWholeSiblings !== formdata.deceased.anyPredeceasedWholeSiblings) {
            delete ctx.anySurvivingWholeNiecesAndWholeNephews;
            delete ctx.allWholeNiecesAndWholeNephewsOver18;
            delete ctx.allWholeSiblingsOver18;
        }

        return [ctx, formdata];
    }
}

module.exports = AnyPredeceasedWholeSiblings;
