'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const ExceptedEstateDod = require('app/utils/ExceptedEstateDod');

class IhtEstateForm extends ValidationStep {

    static getUrl() {
        return '/estate-form';
    }
    nextStepOptions() {
        return {
            options: [
                {key: 'ihtFormId', value: 'optionIHT400', choice: 'optionIHT400'},
                {key: 'ihtFormId', value: 'optionIHT205', choice: 'optionIHT205'}
            ]
        };
    }

    isComplete(ctx, formdata) {
        const dod = formdata && formdata.deceased && formdata.deceased['dod-date'];
        const isDodBeforeThreshold = dod ? ExceptedEstateDod.beforeEeDodThreshold(dod) : false;
        const selectedIht400WithoutHmrcYes = ctx.ihtFormId === 'optionIHT400' && ctx.hmrcLetterId !== 'optionYes';

        if (isDodBeforeThreshold && selectedIht400WithoutHmrcYes) {
            return [false, 'inProgress'];
        }

        return [this.validate(ctx, formdata)[0], 'inProgress'];
    }
}

module.exports = IhtEstateForm;
