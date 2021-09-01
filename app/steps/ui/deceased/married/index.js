'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const WillWrapper = require('app/wrappers/Will');
const DeceasedWrapper = require('app/wrappers/Deceased');

class DeceasedMarried extends ValidationStep {

    static getUrl() {
        return '/deceased-married*';
    }

    isSoftStop(formdata) {
        const softStopForMarriedAfterWill = (new DeceasedWrapper(formdata.deceased)).isMarried();
        return {
            'stepName': this.constructor.name,
            'isSoftStop': softStopForMarriedAfterWill
        };
    }

    handleGet(ctx, formdata) {
        ctx.codicilPresent = (new WillWrapper(formdata.will)).hasCodicils();
        return [ctx];
    }
}

module.exports = DeceasedMarried;
