'use strict';

const taskListContent = require('app/resources/en/translation/tasklist');
const TestConfigurator = new (require('test/end-to-end/helpers/TestConfigurator'))();

const optionYes = '';
const ihtPost = '';
const optionNo = '-2';
const ihtOnline = '-2';
const maritalStatusMarried = '';
const spouseOfDeceased = '';
const relationshipChildOfDeceased = '-2';
const optionRenouncing = '';
const bilingualGOP = false;
const uploadingDocuments = false;
const config = require('test/config');

Feature('Grant Of Probate Intestacy E2E Tests...');

// eslint complains that the Before/After are not used but they are by codeceptjs
// so we have to tell eslint to not validate these
// eslint-disable-next-line no-undef
Before(() => {
    TestConfigurator.getBefore();
});

// eslint-disable-next-line no-undef
After(() => {
    TestConfigurator.getAfter();
});

// eslint-disable-next-line no-undef
Scenario(TestConfigurator.idamInUseText('GOP -Intestacy Spouse Journey - Digital iht'), async(I) => {
    const useNewDeathCertFlow = await TestConfigurator.checkFeatureToggle(config.featureToggles.ft_new_deathcert_flow);

    // Eligibility Task (pre IdAM)
    await I.startApplication();

    // Probate Sceeners
    await I.selectDeathCertificate(optionYes);

    if (useNewDeathCertFlow) {
        await I.selectDeathCertificateInEnglish(optionNo);
        await I.selectDeathCertificateTranslation(optionYes);
    }

    await I.selectDeceasedDomicile(optionYes);
    await I.selectIhtCompleted(optionYes);
    await I.selectPersonWhoDiedLeftAWill(optionNo);

    // Intestacy Sceeners
    await I.selectDiedAfterOctober2014(optionYes);
    await I.selectRelatedToDeceased(optionYes);
    await I.selectOtherApplicants(optionNo);

    // we do need a wait here as it takes time to populate ccd, and storing data in the ccd database gives a success before is actually populated,
    // so is async. To be more scientific, and to allow to continue as soon as available, we could potentially poll, we have the caseid at this point. 
    await I.wait(3); 

    await I.startApply();

    // IdAM
    await I.authenticateWithIdamIfAvailable();

    // Dashboard
    await I.chooseApplication();

    // Deceased Task
    await I.selectATask(taskListContent.taskNotStarted);
    await I.chooseBiLingualGrant(optionNo);
    await I.enterDeceasedDetails('Deceased First Name', 'Deceased Last Name', '01', '01', '1950', '01', '01', '2017');
    await I.enterDeceasedAddress();

    if (useNewDeathCertFlow) {
        await I.selectDiedEngOrWales(optionNo);
        await I.selectEnglishForeignDeathCert(optionNo);
        await I.selectForeignDeathCertTranslation(optionYes);
    } else {
        await I.selectDocumentsToUpload(uploadingDocuments);
    }

    await I.selectInheritanceMethod(ihtOnline);
    await I.enterIHTIdentifier();

    if (TestConfigurator.getUseGovPay() === 'true') {
        await I.enterEstateValue('300000', '200000');
    } else {
        await I.enterEstateValue('500', '400');
    }

    await I.selectAssetsOutsideEnglandWales(optionYes);
    await I.enterValueAssetsOutsideEnglandWales('400000');
    await I.selectDeceasedAlias(optionNo);
    await I.selectDeceasedMaritalStatus(maritalStatusMarried);

    // Executors Task
    await I.selectATask(taskListContent.taskNotStarted);
    await I.selectRelationshipToDeceased(spouseOfDeceased);
    await I.enterAnyChildren(optionNo);
    await I.enterApplicantName('ApplicantFirstName', 'ApplicantLastName');
    await I.enterApplicantPhone();
    await I.enterAddressManually();
    if (TestConfigurator.equalityAndDiversityEnabled()) {
        await I.exitEqualityAndDiversity();
        await I.completeEqualityAndDiversity();
    }

    // Check your answers and declaration
    await I.selectATask(taskListContent.taskNotStarted);
    await I.seeSummaryPage('declaration');
    await I.acceptDeclaration(bilingualGOP);

    // Copies Task
    await I.selectATask(taskListContent.taskNotStarted);

    if (TestConfigurator.getUseGovPay() === 'true') {
        await I.enterUkCopies('5');
        await I.selectOverseasAssets(optionNo);
    } else {
        await I.enterUkCopies('0');
        await I.selectOverseasAssets(optionNo);
    }
    await I.seeCopiesSummary();

    // Payment Task
    await I.selectATask(taskListContent.taskNotStarted);
    await I.seePaymentBreakdownPage();
    if (TestConfigurator.getUseGovPay() === 'true') {
        await I.seeGovUkPaymentPage();
        await I.seeGovUkConfirmPage();
    }
    await I.seePaymentStatusPage();

    // Send Documents Task
    await I.seeDocumentsPage();

    // Thank You
    await I.seeThankYouPage();
}).retry(TestConfigurator.getRetryScenarios());

// eslint-disable-next-line no-undef
Scenario(TestConfigurator.idamInUseText('GOP -Intestacy Child Journey - Paper iht, no death certificate uploaded and spouse renouncing'), async (I) => {

    const useNewDeathCertFlow = await TestConfigurator.checkFeatureToggle(config.featureToggles.ft_new_deathcert_flow);

    // Eligibility Task (pre IdAM)
    await I.startApplication();

    // Probate Sceeners
    await I.selectDeathCertificate(optionYes);

    if (useNewDeathCertFlow) {
        await I.selectDeathCertificateInEnglish(optionNo);
        await I.selectDeathCertificateTranslation(optionYes);
    }

    await I.selectDeceasedDomicile(optionYes);
    await I.selectIhtCompleted(optionYes);
    await I.selectPersonWhoDiedLeftAWill(optionNo);

    // Intestacy Sceeners
    await I.selectDiedAfterOctober2014(optionYes);
    await I.selectRelatedToDeceased(optionYes);
    await I.selectOtherApplicants(optionNo);

    await I.startApply();

    // IdAM
    await I.authenticateWithIdamIfAvailable();

    // Dashboard
    await I.chooseApplication();

    // Deceased Task
    await I.selectATask(taskListContent.taskNotStarted);
    await I.chooseBiLingualGrant(optionNo);
    await I.enterDeceasedDetails('Deceased First Name', 'Deceased Last Name', '01', '01', '1950', '01', '01', '2017');
    await I.enterDeceasedAddress();

    if (useNewDeathCertFlow) {
        await I.selectDiedEngOrWales(optionNo);
        await I.selectEnglishForeignDeathCert(optionNo);
        await I.selectForeignDeathCertTranslation(optionYes);
    } else {
        await I.selectDocumentsToUpload(uploadingDocuments);
    }

    await I.selectInheritanceMethod(ihtPost);
    if (TestConfigurator.getUseGovPay() === 'true') {
        await I.enterGrossAndNet('205', '600000', '300000');
    } else {
        await I.enterGrossAndNet('205', '500', '400');
    }

    await I.selectDeceasedAlias(optionNo);
    await I.selectDeceasedMaritalStatus(maritalStatusMarried);

    // Executors Task
    await I.selectATask(taskListContent.taskNotStarted);
    await I.selectRelationshipToDeceased(relationshipChildOfDeceased);
    await I.selectSpouseNotApplyingReason(optionRenouncing);
    await I.enterAnyOtherChildren(optionNo);
    await I.enterApplicantName('ApplicantFirstName', 'ApplicantLastName');
    await I.enterApplicantPhone();
    await I.enterAddressManually();
    if (TestConfigurator.equalityAndDiversityEnabled()) {
        await I.exitEqualityAndDiversity();
        await I.completeEqualityAndDiversity();
    }

    // Check your answers and declaration
    await I.selectATask(taskListContent.taskNotStarted);
    await I.seeSummaryPage('declaration');
    await I.acceptDeclaration(bilingualGOP);

    // Copies Task
    await I.selectATask(taskListContent.taskNotStarted);
    if (TestConfigurator.getUseGovPay() === 'true') {
        await I.enterUkCopies('5');
        await I.selectOverseasAssets(optionNo);
    } else {
        await I.enterUkCopies('0');
        await I.selectOverseasAssets(optionNo);

    }
    await I.seeCopiesSummary();

    // Payment Task
    await I.selectATask(taskListContent.taskNotStarted);
    await I.seePaymentBreakdownPage();
    if (TestConfigurator.getUseGovPay() === 'true') {
        await I.seeGovUkPaymentPage();
        await I.seeGovUkConfirmPage();
    }
    await I.seePaymentStatusPage();

    // Send Documents Task
    await I.seeDocumentsPage();

    // Thank You
    await I.seeThankYouPage();
}).retry(TestConfigurator.getRetryScenarios());
