'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const RedirectRunner = require('app/core/runners/RedirectRunner');
const ExecutorsWrapper = require('app/wrappers/Executors');
const WillWrapper = require('app/wrappers/Will');
const RegistryWrapper = require('app/wrappers/Registry');
const DeathCertificateWrapper = require('app/wrappers/DeathCertificate');
const DocumentsWrapper = require('app/wrappers/Documents');
const FormatCcdCaseId = require('app/utils/FormatCcdCaseId');
const caseTypes = require('app/utils/CaseTypes');

class Documents extends ValidationStep {

    runner() {
        return new RedirectRunner();
    }

    static getUrl() {
        return '/documents';
    }

    runnerOptions(ctx, session) {
        const formdata = session.form;
        const options = {};
        const documentsWrapper = new DocumentsWrapper(formdata);
        const documentsRequired = documentsWrapper.documentsRequired();

        if (!documentsRequired) {
            options.redirect = true;
            options.url = '/thank-you';
        }
        return options;
    }

    handleGet(ctx, formdata, featureToggles, language) {
        const executorsWrapper = new ExecutorsWrapper(formdata.executors);
        const willWrapper = new WillWrapper(formdata.will);
        const deathCertWrapper = new DeathCertificateWrapper(formdata.deceased);
        const registryAddress = (new RegistryWrapper(formdata.registry)).address();
        const content = this.generateContent(ctx, formdata, language);

        ctx.registryAddress = registryAddress ? registryAddress : content.address;
        ctx.interimDeathCertificate = deathCertWrapper.hasInterimDeathCertificate();
        ctx.foreignDeathCertificate = deathCertWrapper.hasForeignDeathCertificate();
        ctx.foreignDeathCertTranslatedSeparately = deathCertWrapper.isForeignDeathCertTranslatedSeparately();

        if (ctx.caseType === caseTypes.GOP) {
            ctx.hasCodicils = willWrapper.hasCodicils();
            ctx.codicilsNumber = willWrapper.codicilsNumber();
            ctx.hasMultipleApplicants = executorsWrapper.hasMultipleApplicants();
            ctx.hasRenunciated = executorsWrapper.hasRenunciated();
            ctx.executorsNameChangedByDeedPollList = executorsWrapper.executorsNameChangedByDeedPoll();
        } else {
            ctx.spouseRenouncing = formdata.deceased.maritalStatus === 'optionMarried' && (formdata.applicant.relationshipToDeceased === 'optionChild' || formdata.applicant.relationshipToDeceased === 'optionAdoptedChild');
        }

        if (formdata.will && formdata.will.deceasedWrittenWishes) {
            ctx.deceasedWrittenWishes = formdata.will.deceasedWrittenWishes;
        }

        ctx.is205 = formdata.iht && formdata.iht.method === 'optionPaper' && formdata.iht.form === 'optionIHT205';
        ctx.ccdReferenceNumber = FormatCcdCaseId.format(formdata.ccdCase);

        return [ctx];
    }

}

module.exports = Documents;
