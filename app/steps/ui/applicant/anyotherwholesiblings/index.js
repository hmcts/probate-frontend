'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('app/utils/FormatName');

class AnyOtherWholeSiblings extends ValidationStep {

    static getUrl() {
        return '/deceased-other-whole-siblings';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        ctx.deceasedName = FormatName.format(formdata.deceased);
        return ctx;
    }

    nextStepOptions(ctx) {
        ctx.hadOneParentSameAndHadNoWholeSiblings = ctx.anyOtherWholeSiblings === 'optionNo' && ctx.sameParents === 'optionOneParentsSame';
        return {
            options: [
                {key: 'anyOtherWholeSiblings', value: 'optionYes', choice: 'hadOtherWholeSiblings'},
                {key: 'hadOneParentSameAndHadNoWholeSiblings', value: true, choice: 'hadOneParentSameAndHadNoWholeSiblings'}
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

        if (formdata.deceased && formdata.deceased.anyOtherWholeSiblings && ctx.anyOtherWholeSiblings !== formdata.deceased.anyOtherWholeSiblings) {
            delete ctx.allWholeSiblingsOver18;
            delete ctx.anyPredeceasedWholeSiblings;
            delete ctx.anySurvivingWholeNiecesAndWholeNephews;
            delete ctx.allWholeNiecesAndWholeNephewsOver18;
        }

        return [ctx, formdata];
    }
}

module.exports = AnyOtherWholeSiblings;
