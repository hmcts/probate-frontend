'use strict';

const ValidationStep = require('app/core/steps/ValidationStep.cjs');
const {get} = require('lodash');
const FormatName = require('app/utils/FormatName.cjs');

class DeceasedNameAsOnWill extends ValidationStep {

    static getUrl() {
        return '/deceased-name-as-on-will';
    }

    isSoftStop (formdata) {
        return {
            stepName: this.constructor.name,
            isSoftStop: get(formdata, 'deceased.nameAsOnTheWill') === 'optionNo'
        };
    }

    handlePost(ctx, errors) {
        if (ctx.nameAsOnTheWill !== 'optionNo') {
            delete ctx.alias;
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
            delete formdata.alias;
        }

        return [ctx, formdata];
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        ctx.deceasedName = FormatName.format(req.session.form.deceased);
        return ctx;
    }
}

module.exports = DeceasedNameAsOnWill;
