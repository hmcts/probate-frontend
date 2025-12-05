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

    nextStepUrl(req, ctx) {
        return this.next(req, ctx).constructor.getUrl('hasSurvivingChildrenWithOneParent');
    }

    nextStepOptions(ctx) {
        ctx.hasBothParentsSameAndHasSurvivors = ctx.anySurvivingWholeNiecesAndWholeNephews === 'optionYes' && ctx.sameParents === 'optionBothParentsSame' && (ctx.anyPredeceasedWholeSiblings === 'optionYesAll' || ctx.anyPredeceasedWholeSiblings === 'optionYesSome');
        ctx.hasBothParentsSameAndHadOtherWholeSiblingAndHadNoSurvivors = ctx.anySurvivingWholeNiecesAndWholeNephews === 'optionNo' && ctx.anyPredeceasedWholeSiblings === 'optionYesSome' && ctx.sameParents === 'optionBothParentsSame';
        ctx.hasBothParentsSameAndHadNoOtherWholeSiblingAndHadNoSurvivors = ctx.anySurvivingWholeNiecesAndWholeNephews === 'optionNo' && ctx.anyPredeceasedWholeSiblings === 'optionYesAll' && ctx.sameParents === 'optionBothParentsSame';
        ctx.hasOneParentsSameAndHadAllPredeceasedWholeSiblingAndNoSurvivors = ctx.anySurvivingWholeNiecesAndWholeNephews === 'optionNo' && ctx.anyPredeceasedWholeSiblings === 'optionYesAll' && ctx.sameParents === 'optionOneParentsSame';
        return {
            options: [
                {key: 'hasBothParentsSameAndHasSurvivors', value: true, choice: 'hasBothParentsSameAndHasSurvivors'},
                {key: 'hasBothParentsSameAndHadOtherWholeSiblingAndHadNoSurvivors', value: true, choice: 'hasBothParentsSameAndHadOtherWholeSiblingAndHadNoSurvivors'},
                {key: 'hasBothParentsSameAndHadNoOtherWholeSiblingAndHadNoSurvivors', value: true, choice: 'hasBothParentsSameAndHadNoOtherWholeSiblingAndHadNoSurvivors'},
                {key: 'hasOneParentsSameAndHadAllPredeceasedWholeSiblingAndNoSurvivors', value: true, choice: 'hasOneParentsSameAndHadAllPredeceasedWholeSiblingAndNoSurvivors'}
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
