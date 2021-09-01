'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const {get} = require('lodash');
const WillWrapper = require('app/wrappers/Will');

class ApplicantNameAsOnWill extends ValidationStep {

    static getUrl() {
        return '/applicant-name-as-on-will*';
    }

    isSoftStop (formdata) {
        return {
            stepName: this.constructor.name,
            isSoftStop: get(formdata, 'applicant.nameAsOnTheWill') === 'optionNo'
        };
    }

    handleGet(ctx, formdata) {
        ctx.codicilPresent = (new WillWrapper(formdata.will)).hasCodicils();
        return [ctx];
    }

    handlePost(ctx, errors) {
        if (ctx.nameAsOnTheWill !== 'optionNo') {
            delete ctx.alias;
            delete ctx.aliasReason;
            delete ctx.otherReason;
        }
        return [ctx, errors];
    }

    nextStepOptions() {
        return {
            options: [
                {key: 'nameAsOnTheWill', value: 'optionNo', choice: 'hasAlias'}
            ]
        };
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);

        if (ctx.nameAsOnTheWill === 'optionYes') {
            delete ctx.alias;
            delete ctx.aliasReason;
        }

        return [ctx, formdata];
    }
}

module.exports = ApplicantNameAsOnWill;
