'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('app/utils/FormatName');

class SameParents extends ValidationStep {

    static getUrl() {
        return '/same-parents';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        ctx.deceasedName = FormatName.format(formdata.deceased);
        return ctx;
    }

    nextStepOptions() {
        return {
            options: [
                {key: 'sameParents', value: 'optionYes', choice: 'bothParentsSame'},
                {key: 'sameParents', value: 'optionYes', choice: 'oneParentsSame'},
                {key: 'sameParents', value: 'optionYes', choice: 'noParentsSame'}
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
        return [ctx, formdata];
    }
}

module.exports = SameParents;
