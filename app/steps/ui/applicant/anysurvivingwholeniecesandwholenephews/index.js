'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('app/utils/FormatName');

class AnySurvivingWholeNiecesAndWholeNephews extends ValidationStep {

    static getUrl() {
        return '/whole-siblings-surviving-children';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        ctx.deceasedName = FormatName.format(formdata.deceased);
        return ctx;
    }

    nextStepOptions(ctx) {
        ctx.hadOtherWholeSiblingAndHadNoSurvivingWholeNiecesOrNephews = ctx.anySurvivingWholeNiecesAndWholeNephews === 'optionNo' && ctx.anyPredeceasedWholeSiblings === 'optionYesSome';
        ctx.hadNoOtherWholeSiblingAndHadNoSurvivingWholeNiecesOrNephews = ctx.anySurvivingWholeNiecesAndWholeNephews === 'optionNo' && ctx.anyPredeceasedWholeSiblings === 'optionYesAll';
        return {
            options: [
                {key: 'anySurvivingWholeNiecesAndWholeNephews', value: 'optionYes', choice: 'hadSurvivingWholeNiecesAndWholeNephews'},
                {key: 'hadOtherWholeSiblingAndHadNoSurvivingWholeNiecesOrNephews', value: true, choice: 'hadOtherWholeSiblingAndHadNoSurvivingWholeNiecesOrNephews'},
                {key: 'hadNoOtherWholeSiblingAndHadNoSurvivingWholeNiecesOrNephews', value: true, choice: 'hadNoOtherWholeSiblingAndHadNoSurvivingWholeNiecesOrNephews'},
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

        if (formdata.deceased && formdata.deceased.anySurvivingWholeNiecesAndWholeNephews && ctx.anySurvivingWholeNiecesAndWholeNephews !== formdata.deceased.anySurvivingWholeNiecesAndWholeNephews) {
            delete ctx.allWholeNiecesAndWholeNephewsOver18;
        }

        return [ctx, formdata];
    }
}

module.exports = AnySurvivingWholeNiecesAndWholeNephews;
