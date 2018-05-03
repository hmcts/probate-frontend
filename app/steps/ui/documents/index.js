const ValidationStep = require('app/core/steps/ValidationStep');
const ExecutorsWrapper = require('app/wrappers/Executors');
const WillWrapper = require('app/wrappers/Will');
const RegistryWrapper = require('app/wrappers/Registry');

module.exports = class Documents extends ValidationStep {

    static getUrl() {
        return '/documents';
    }

    handleGet(ctx, formdata) {
        const executorsWrapper = new ExecutorsWrapper(formdata.executors);
        const registryAddress = (new RegistryWrapper(formdata.registry)).address();
        const content = this.generateContent(ctx, formdata);

        ctx.registryAddress = registryAddress ? registryAddress : content.sendDocumentsAddress;
        ctx.codicilsNumber = (new WillWrapper(formdata.will)).codicilsNumber();
        ctx.hasMultipleApplicants = executorsWrapper.hasMultipleApplicants();
        ctx.hasRenunciated = executorsWrapper.hasRenunciated();

        return [ctx];
    }
};
