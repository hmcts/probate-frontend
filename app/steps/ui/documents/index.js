'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const RedirectRunner = require('app/core/runners/RedirectRunner');
const ExecutorsWrapper = require('app/wrappers/Executors');
const WillWrapper = require('app/wrappers/Will');
const RegistryWrapper = require('app/wrappers/Registry');
const FormatCcdCaseId = require('app/utils/FormatCcdCaseId');
const caseTypes = require('app/utils/CaseTypes');

class Documents extends ValidationStep {

    runner() {
        return new RedirectRunner();
    }

    static getUrl() {
        return '/documents';
    }

    runnerOptions(ctx, formdata) {
        const options = {};

        if (ctx.caseType === caseTypes.INTESTACY) {
            const deceasedMarried = Boolean(formdata.deceased && formdata.deceased.maritalStatus === 'optionMarried');
            const applicantIsChild = Boolean(formdata.applicant && (formdata.applicant.relationshipToDeceased === 'optionChild' || formdata.applicant.relationshipToDeceased === 'optionAdoptedChild'));
            const noDocumentsUploaded = !(formdata.documents && formdata.documents.uploads && formdata.documents.uploads.length);
            const iht205Used = Boolean(formdata.iht && formdata.iht.method === 'optionPaper' && formdata.iht.form === 'optionIHT205');

            if (!((deceasedMarried && applicantIsChild) || noDocumentsUploaded || iht205Used)) {
                options.redirect = true;
                options.url = '/thank-you';
            }
        }

        return options;
    }

    handleGet(ctx, formdata) {
        const executorsWrapper = new ExecutorsWrapper(formdata.executors);
        const willWrapper = new WillWrapper(formdata.will);
        const registryAddress = (new RegistryWrapper(formdata.registry)).address();
        const content = this.generateContent(ctx, formdata);

        ctx.registryAddress = registryAddress ? registryAddress : content.address;

        if (ctx.caseType === caseTypes.GOP) {
            ctx.hasCodicils = willWrapper.hasCodicils();
            ctx.codicilsNumber = willWrapper.codicilsNumber();
            ctx.hasMultipleApplicants = executorsWrapper.hasMultipleApplicants();
            ctx.hasRenunciated = executorsWrapper.hasRenunciated();
            ctx.executorsNameChangedByDeedPollList = executorsWrapper.executorsNameChangedByDeedPoll();
        } else {
            ctx.spouseRenouncing = formdata.deceased.maritalStatus === 'optionMarried' && (formdata.applicant.relationshipToDeceased === 'optionChild' || formdata.applicant.relationshipToDeceased === 'optionAdoptedChild');
        }

        ctx.is205 = formdata.iht && formdata.iht.method === 'optionPaper' && formdata.iht.form === 'optionIHT205';
        ctx.ccdReferenceNumber = FormatCcdCaseId.format(formdata.ccdCase);

        return [ctx];
    }

}

module.exports = Documents;
