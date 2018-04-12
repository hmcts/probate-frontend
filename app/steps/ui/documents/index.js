const ValidationStep = require('app/core/steps/ValidationStep'),
    {get} = require('lodash'),
    ExecutorsWrapper = require('app/wrappers/Executors');

module.exports = class Documents extends ValidationStep {

    static getUrl() {
        return '/documents';
    }

    * handleGet(ctx, formdata) {
        const executors = get(formdata, 'executors');
        const executorsWrapper = new ExecutorsWrapper(executors);

        ctx.codicilsNumber = get(formdata, 'will.codicilsNumber');
        ctx.hasMultipleApplicants = executorsWrapper.hasMultipleApplicants();
        ctx.hasRenunciated = executorsWrapper.hasRenunciated();

        return [ctx];
    }
};
