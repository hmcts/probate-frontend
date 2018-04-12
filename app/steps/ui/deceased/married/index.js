const ValidationStep = require('app/core/steps/ValidationStep');
const {get} = require('lodash');
const WillWrapper = require('app/wrappers/Will');

module.exports = class DeceasedMarried extends ValidationStep {

    static getUrl() {
        return '/deceased-married';
    }

    isSoftStop(formdata, ctx) {
        const marriedAfterWill = get(formdata, 'deceased.married', {});
        const softStopForMarriedAfterWill = marriedAfterWill === this.generateContent(ctx, formdata).optionYes;

        return {
            'stepName': this.constructor.name,
            'isSoftStop': softStopForMarriedAfterWill
        }
    }

    * handleGet(ctx, formdata) {
        ctx.codicilPresent = (new WillWrapper(formdata.will)).hasCodicilsDate();
        return [ctx];
    }
};
