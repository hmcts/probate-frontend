'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const RedirectRunner = require('app/core/runners/RedirectRunner');
const ExecutorsWrapper = require('app/wrappers/Executors');
const WillWrapper = require('app/wrappers/Will');
const RegistryWrapper = require('app/wrappers/Registry');
const DeathCertificateWrapper = require('app/wrappers/DeathCertificate');
const DocumentsWrapper = require('app/wrappers/Documents');
const ApplicantWrapper = require('app/wrappers/Applicant');
const DeceasedWrapper = require('app/wrappers/Deceased');
const FormatCcdCaseId = require('app/utils/FormatCcdCaseId');
const caseTypes = require('app/utils/CaseTypes');
const DocumentPageUtil = require('app/utils/DocumentPageUtil');

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
        const documentsWrapper = new DocumentsWrapper(formdata);
        ctx.documentsRequired = documentsWrapper.documentsRequired();
        const executorsWrapper = new ExecutorsWrapper(formdata.executors);
        const willWrapper = new WillWrapper(formdata.will);
        const deathCertWrapper = new DeathCertificateWrapper(formdata.deceased);
        const registryAddress = (new RegistryWrapper(formdata.registry)).address();
        const applicantWrapper = new ApplicantWrapper(formdata);
        const deceasedWrapper = new DeceasedWrapper(formdata.deceased);
        const content = this.generateContent(ctx, formdata, language);

        ctx.registryAddress = registryAddress ? registryAddress : content.address;
        ctx.headerContent = ctx.caseType === caseTypes.INTESTACY ? content.intestacyHeader : content.header;
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
            ctx.spouseRenouncing = deceasedWrapper.hasMarriedStatus() && applicantWrapper.isApplicantChild();
            ctx.isSpouseGivingUpAdminRights = ctx.spouseRenouncing && applicantWrapper.isSpouseRenouncing() && !deceasedWrapper.hasAnyOtherChildren();
        }

        if (formdata.will && formdata.will.deceasedWrittenWishes) {
            ctx.deceasedWrittenWishes = formdata.will.deceasedWrittenWishes;
        }

        ctx.is205 = formdata.iht && formdata.iht.method === 'optionPaper' && formdata.iht.form === 'optionIHT205';
        ctx.is207 = formdata.iht && ((formdata.iht.method === 'optionPaper' && formdata.iht.form === 'optionIHT207') || (formdata.iht.ihtFormEstateId === 'optionIHT207'));
        ctx.ccdReferenceNumber = FormatCcdCaseId.format(formdata.ccdCase);

        ctx.checkListItems = DocumentPageUtil.getCheckListItems(ctx, content);

        return [ctx];
    }

    getContextData(req) {
        const session = req.session;
        const ctx = super.getContextData(req);
        ctx.ccdReferenceNumber = FormatCcdCaseId.format(req.session.form.ccdCase);
        ctx.caseType = caseTypes.getCaseType(session);
        return ctx;
    }

}

module.exports = Documents;
