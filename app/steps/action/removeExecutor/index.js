'use strict';

const ExecutorsNamed = require('app/steps/ui/executors/named');
const {set, isEmpty} = require('lodash');
const ActionStepRunner = require('app/core/runners/ActionStepRunner');

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
        const formdata = req.session.form;
        ctx.executorsEn = formdata.declaration?.legalStatement?.en?.executorsApplying;
        ctx.executorsCy = formdata.declaration?.legalStatement?.cy?.executorsApplying;
        ctx.list.splice(ctx.index, 1);
        ctx.executorsEn?.splice(ctx.index, 1);
        ctx.executorsCy?.splice(ctx.index, 1);
        return ctx;
    }

    runner() {
        return new ActionStepRunner();
    }

    handlePost(ctx, errors, formdata) {
        set(formdata, 'executors.list', ctx.list);
        set(formdata, 'legalStatement.en.executorsApplying', ctx.executorsEn);
        set(formdata, 'legalStatement.cy.executorsApplying', ctx.executorsCy);
        if (!isEmpty(errors)) {
            set(formdata, 'executors.errors', errors);
        }
        return [ctx, errors];
    }
}

module.exports = RemoveExecutor;
