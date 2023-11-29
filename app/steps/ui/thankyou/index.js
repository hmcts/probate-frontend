'use strict';

const Step = require('app/core/steps/Step');
const FormatCcdCaseId = require('app/utils/FormatCcdCaseId');
const DocumentsWrapper = require('app/wrappers/Documents');
const caseTypes = require('../../../utils/CaseTypes');
const CaseProgress = require('app/utils/CaseProgress');
const DocumentPageUtil = require('app/utils/DocumentPageUtil');
const ExecutorsWrapper = require('app/wrappers/Executors');
const WillWrapper = require('app/wrappers/Will');
const RegistryWrapper = require('app/wrappers/Registry');
const DeathCertificateWrapper = require('app/wrappers/DeathCertificate');
const ApplicantWrapper = require('app/wrappers/Applicant');
const DeceasedWrapper = require('app/wrappers/Deceased');
const ExceptedEstateDod = require('app/utils/ExceptedEstateDod');
const {get} = require('lodash');

class ThankYou extends Step {

    static getUrl () {
        return '/thank-you';
    }

    handleGet(ctx, formdata, featureToggles, language) {
        const documentsWrapper = new DocumentsWrapper(formdata);
        ctx.documentsRequired = documentsWrapper.documentsRequired();
        ctx.checkAnswersSummary = false;
        ctx.legalDeclaration = false;
        if (formdata.checkAnswersSummary) {
            ctx.checkAnswersSummary = true;
        }
        if (formdata.legalDeclaration) {
            ctx.legalDeclaration = true;
        }

        const executorsWrapper = new ExecutorsWrapper(formdata.executors);
        const willWrapper = new WillWrapper(formdata.will);
        const deathCertWrapper = new DeathCertificateWrapper(formdata.deceased);
        const registryAddress = (new RegistryWrapper(formdata.registry)).address();
        const applicantWrapper = new ApplicantWrapper(formdata);
        const deceasedWrapper = new DeceasedWrapper(formdata.deceased);

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
            ctx.spouseRenouncing = deceasedWrapper.hasMarriedStatus() && applicantWrapper.isApplicantChild();
            ctx.isSpouseGivingUpAdminRights = ctx.spouseRenouncing && applicantWrapper.isSpouseRenouncing() && !deceasedWrapper.hasAnyOtherChildren();
        }

        if (formdata.will && formdata.will.deceasedWrittenWishes) {
            ctx.deceasedWrittenWishes = formdata.will.deceasedWrittenWishes;
        }

        ctx.is205 = formdata.iht && ExceptedEstateDod.beforeEeDodThreshold(get(formdata, 'deceased.dod-date')) && ((formdata.iht.method === 'optionPaper' && formdata.iht.form === 'optionIHT205') || (formdata.iht.ihtFormId === 'optionIHT205'));
        ctx.is207 = formdata.iht && ((formdata.iht.method === 'optionPaper' && formdata.iht.form === 'optionIHT207') || (formdata.iht.ihtFormEstateId === 'optionIHT207'));
        ctx.checkListItems = DocumentPageUtil.getCheckListItems(ctx, content);
        return [ctx];
    }

    getContextData(req) {
        const session = req.session;
        const ctx = super.getContextData(req);
        ctx.ccdReferenceNumber = FormatCcdCaseId.format(req.session.form.ccdCase);
        ctx.ccdReferenceNumberAccessible = FormatCcdCaseId.formatAccessible(req.session.form.ccdCase);
        ctx.caseType = caseTypes.getCaseType(session);
        ctx.grantIssued = CaseProgress.grantIssued(req.session.form.ccdCase.state);
        ctx.applicationInReview = CaseProgress.applicationInReview(req.session.form.ccdCase.state);
        ctx.documentsReceived = CaseProgress.documentsReceived(req.session.form.ccdCase.state, req.session.form.documentsReceivedNotificationSent);
        return ctx;
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.ccdReferenceNumber;
        delete ctx.ccdReferenceNumberAccessible;
        return [ctx, formdata];
    }
}

module.exports = ThankYou;
