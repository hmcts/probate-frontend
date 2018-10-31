'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const ExecutorsWrapper = require('app/wrappers/Executors');
const WillWrapper = require('app/wrappers/Will');
const RegistryWrapper = require('app/wrappers/Registry');
const ihtContent = require('app/resources/en/translation/iht/method');
const featureToggle = require('app/utils/FeatureToggle');

class Documents extends ValidationStep {

    static getUrl() {
        return '/documents';
    }

    handleGet(ctx, formdata, featureToggles) {
        const executorsWrapper = new ExecutorsWrapper(formdata.executors);
        const registryAddress = (new RegistryWrapper(formdata.registry)).address();
        const content = this.generateContent(ctx, formdata);

        ctx.registryAddress = registryAddress ? registryAddress : content.old_sendDocumentsAddress;
        ctx.hasCodicils = (new WillWrapper(formdata.will)).hasCodicils();
        ctx.codicilsNumber = (new WillWrapper(formdata.will)).codicilsNumber();
        ctx.hasMultipleApplicants = executorsWrapper.hasMultipleApplicants();
        ctx.hasRenunciated = executorsWrapper.hasRenunciated();
        ctx.is205 = formdata.iht && formdata.iht.method === ihtContent.paperOption && formdata.iht.form === 'IHT205';
        ctx.executorsNameChangedByDeedPollList = executorsWrapper.executorsNameChangedByDeedPoll();
        ctx.ccdReferenceNumber = (formdata.ccdCase && formdata.ccdCase.id) ? formdata.ccdCase.id : '';

        ctx.isDocumentUploadToggleEnabled = featureToggle.isEnabled(featureToggles, 'document_upload');

        return [ctx];
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.registryAddress;
        delete ctx.hasCodicils;
        delete ctx.codicilsNumber;
        delete ctx.hasMultipleApplicants;
        delete ctx.hasRenunciated;
        delete ctx.is205;
        delete ctx.executorsNameChangedByDeedPollList;
        delete ctx.ccdReferenceNumber;
        delete ctx.isDocumentUploadToggleEnabled;
        return [ctx, formdata];
    }
}

module.exports = Documents;
