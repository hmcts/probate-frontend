const ValidationStep = require('app/core/steps/ValidationStep');
const {get} = require('lodash');
const WillWrapper = require('app/wrappers/Will');

module.exports = class ApplicantNameAsOnWill extends ValidationStep {

    static getUrl() {
        return '/applicant-name-as-on-will';
    }

    isSoftStop (formdata, ctx) {
        return {
            'stepName': this.constructor.name,
            'isSoftStop': get(formdata, 'applicant.nameAsOnTheWill') === this.generateContent(ctx, formdata).optionNo
        }
    }

    * handleGet(ctx, formdata) {
        ctx.codicilPresent = (new WillWrapper(formdata.will)).hasCodicils()
        return [ctx];
    }

};
