'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const DeceasedWrapper = require('app/wrappers/Deceased');
const FormatName = require('app/utils/FormatName');

class DeceasedAlias extends ValidationStep {

    static getUrl() {
        return '/deceased-alias*';
    }

    nextStepOptions() {
        return {
            options: [
                {key: 'alias', value: 'optionYes', choice: 'assetsInOtherNames'},
            ]
        };
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        ctx.deceasedName = FormatName.format(formdata.deceased);
        return ctx;
    }

    isSoftStop(formdata) {
        const softStopForAssetsInAnotherName = (new DeceasedWrapper(formdata.deceased)).hasAlias();
        return {
            stepName: this.constructor.name,
            isSoftStop: softStopForAssetsInAnotherName
        };
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.deceasedName;

        if (ctx.alias === 'optionNo') {
            ctx.otherNames = {};
        }

        return [ctx, formdata];
    }
}

module.exports = DeceasedAlias;
