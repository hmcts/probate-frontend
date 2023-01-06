'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');

class IhtMethod extends ValidationStep {

    static getUrl() {
        return '/iht-method';
    }

    nextStepOptions() {
        return {
            options: [
                {key: 'method', value: 'optionOnline', choice: 'online'}
            ]
        };
    }

    handleGet(ctx) {
        if (new Date() > new Date('2023-03-31')) {
            ctx.paragraph2 = '';
        }

        return [ctx];
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);

        if (formdata.iht && formdata.iht.method && ctx.method !== formdata.iht.method) {
            if (ctx.method === 'optionPaper') {
                delete ctx.identifier;

                delete ctx.grossValue;
                delete ctx.grossValueField;

                delete ctx.netValue;
                delete ctx.netValueField;
            } else {
                delete ctx.form;
                delete ctx.ihtFormId;

                delete ctx.grossValueIHT205;
                delete ctx.grossValueFieldIHT205;

                delete ctx.grossValueIHT207;
                delete ctx.grossValueFieldIHT207;

                delete ctx.grossValueIHT400421;
                delete ctx.grossValueFieldIHT400421;

                delete ctx.netValueIHT205;
                delete ctx.netValueFieldIHT205;

                delete ctx.netValueIHT207;
                delete ctx.netValueFieldIHT207;

                delete ctx.netValueIHT400421;
                delete ctx.netValueFieldIHT400421;
            }

            delete ctx.assetsOutside;
            delete ctx.netValueAssetsOutsideField;
            delete ctx.netValueAssetsOutside;

            if (formdata.deceased) {
                delete formdata.deceased.anyChildren;
                delete formdata.deceased.allChildrenOver18;
                delete formdata.deceased.anyDeceasedChildren;
                delete formdata.deceased.anyGrandchildrenUnder18;
            }
        }

        return [ctx, formdata];
    }
}

module.exports = IhtMethod;
