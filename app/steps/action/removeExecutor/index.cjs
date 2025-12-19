'use strict';

const ExecutorsNamed = require('app/steps/ui/executors/named');
const {set, isEmpty} = require('lodash');
const ActionStepRunner = require('app/core/runners/ActionStepRunner.cjs');

class RemoveExecutor extends ExecutorsNamed {

    static getUrl(index = '*') {
        return `/executor-names/remove/${index}`;
    }

    constructor(steps, section, templatePath, i18next, schema, language) {
        super(steps, section, templatePath, i18next, schema, language);
        this.section = 'executors';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        ctx.index = req.params[0];
        ctx.list.splice(ctx.index, 1);
        return ctx;
    }

    runner() {
        return new ActionStepRunner();
    }

    handlePost(ctx, errors, formdata) {
        set(formdata, 'executors.list', ctx.list);
        if (!isEmpty(errors)) {
            set(formdata, 'executors.errors', errors);
        }
        return [ctx, errors];
    }
}

module.exports = RemoveExecutor;
