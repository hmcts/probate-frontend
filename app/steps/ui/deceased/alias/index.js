const ValidationStep = require('app/core/steps/ValidationStep');
const {get} = require('lodash');
const WillWrapper = require('app/wrappers/Will');

module.exports = class DeceasedAlias extends ValidationStep {

    static getUrl() {
        return '/deceased-alias';
    }

    nextStepOptions() {
        const nextStepOptions = {
            options: [
                {key: 'alias', value: this.content.optionYes, choice: 'assetsInOtherNames'},
                {key: 'deceasedMarriedAfterDateOnCodicilOrWill', value: true, choice: 'deceasedMarriedAfterDateOnCodicilOrWill'},
            ]
        };
        return nextStepOptions;
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        const willWrapper = new WillWrapper(formdata.will);
        const isWillDated = willWrapper.hasWillDate();
        const isCodicilDated = willWrapper.hasCodicilsDate();
        const codicils = willWrapper.hasCodicils();
        ctx.deceasedMarriedAfterDateOnCodicilOrWill = isCodicilDated || (!codicils && isWillDated);
        return ctx;
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.deceasedMarriedAfterDateOnCodicilOrWill;
        return [ctx, formdata];
    }

    isSoftStop(formdata, ctx) {
        const assetsInAnotherName = get(formdata, 'deceased.alias', {});
        const softStopForAssetsInAnotherName = assetsInAnotherName === this.generateContent(ctx, formdata).optionYes;
        return {
            'stepName': this.constructor.name,
            'isSoftStop': softStopForAssetsInAnotherName
        };
    }
};
