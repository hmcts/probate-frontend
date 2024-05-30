'use strict';

const taskListContentEn = require('app/resources/en/translation/tasklist');
const taskListContentCy = require('app/resources/cy/translation/tasklist');
const {getTestLanguages} = require('../../helpers/GeneralHelpers');
const TestConfigurator = new (require('test/end-to-end/helpers/TestConfigurator'))();
const ihtDataConfig = require('test/end-to-end/pages/ee/ihtData');

const optionYes = ihtDataConfig.optionYes;
const optionNo = ihtDataConfig.optionNo;
const maritalStatusMarried = ihtDataConfig.maritalStatusMarried;
const spouseOfDeceased = ihtDataConfig.spouseOfDeceased;
const relationshipChildOfDeceased = ihtDataConfig.relationshipChildOfDeceased;
const optionRenouncing = ihtDataConfig.optionRenouncing;
const bilingualGOP = false;
const ihtOptionNotSubmitted = ihtDataConfig.ihtOptionNotSubmitted;

Feature('GOP Intestacy E2E - EE No Journey');

Before(async () => {
    await TestConfigurator.initLaunchDarkly();
    await TestConfigurator.getBefore();
});

After(async () => {
    await TestConfigurator.getAfter();
});

getTestLanguages().forEach(language => {

    Scenario(TestConfigurator.idamInUseText(`${language.toUpperCase()} - GOP -Intestacy Journey - EE No journey`), async ({I}) => {
        const taskListContent = language === 'en' ? taskListContentEn : taskListContentCy;
        await I.retry(2).createAUser(TestConfigurator);

        // Eligibility Task (pre IdAM)
        await I.startApplication(language);

        // Probate Sceeners
        await I.selectDeathCertificate(language);

        await I.selectDeathCertificateInEnglish(language, optionNo);
        await I.selectDeathCertificateTranslation(language, optionYes);

        await I.selectDeceasedDomicile(language);
        const isEEEnabled = await TestConfigurator.checkFeatureToggle('probate-excepted-estates');
        if (isEEEnabled) {
            await I.selectEEDeceasedDod(language);
            await I.selectEEvalue(language);
        } else {
            await I.selectIhtCompleted(language, optionYes);
        }
        await I.selectPersonWhoDiedLeftAWill(language, optionNo);

        // Intestacy Sceeners
        await I.selectDiedAfterOctober2014(language, optionYes);
        await I.selectRelatedToDeceased(language, optionYes);
        await I.selectOtherApplicants(language, optionNo);

        await I.startApply(language);

        // IdAM
        await I.authenticateWithIdamIfAvailable(language);

        // Dashboard

        // await I.chooseApplication(language);

        // Deceased Task
        await I.selectATask(language, taskListContent.taskNotStarted);
        await I.chooseBiLingualGrant(language, optionNo);
        await I.enterDeceasedDetails(language, 'Deceased First Name', 'Deceased Last Name', '01', '01', '1950', '02', '01', '2022');
        await I.enterDeceasedAddress(language);

        await I.selectDiedEngOrWales(language, optionNo);
        await I.selectEnglishForeignDeathCert(language, optionNo);
        await I.selectForeignDeathCertTranslation(language, optionYes);

        await I.selectEEComplete(language, optionYes);
        await I.selectSubmittedToHmrc(language, ihtOptionNotSubmitted);
        await I.enterEEValue(language, 500000, 400000, 400000);
        await I.selectLateSpouseCivilPartner(language, optionYes);
        await I.selectUnusedAllowance(language, optionYes);
        await I.enterProbateEstateValues(language, 400000, 400000);

        await I.selectAssetsOutsideEnglandWales(language, optionYes);
        await I.enterValueAssetsOutsideEnglandWales(language, '400000');
        await I.selectDeceasedAlias(language, optionNo);
        await I.selectDeceasedMaritalStatus(language, maritalStatusMarried);

        // Executors Task
        await I.selectATask(language, taskListContent.taskNotStarted);
        await I.selectRelationshipToDeceased(language, spouseOfDeceased);
        await I.enterAnyChildren(language, optionNo);
        await I.enterApplicantName(language, 'ApplicantFirstName', 'ApplicantLastName');
        await I.enterApplicantPhone(language);
        await I.enterAddressManually(language);
        if (TestConfigurator.equalityAndDiversityEnabled()) {
            await I.exitEqualityAndDiversity(language);
            await I.completeEqualityAndDiversity(language);
        }

        // Check your answers and declaration
        await I.selectATask(language, taskListContent.taskNotStarted);
        await I.seeSummaryPage(language, 'declaration');
        await I.acceptDeclaration(language, bilingualGOP);

        // Copies Task
        await I.selectATask(language, taskListContent.taskNotStarted);

        if (TestConfigurator.getUseGovPay() === 'true') {
            await I.enterUkCopies(language, '5');
            await I.selectOverseasAssets(language, optionNo);
        } else {
            await I.enterUkCopies(language, '0');
            await I.selectOverseasAssets(language, optionNo);
        }
        await I.seeCopiesSummary(language);

        // Payment Task
        await I.selectATask(language, taskListContent.taskNotStarted);
        await I.seePaymentBreakdownPage(language);
        if (TestConfigurator.getUseGovPay() === 'true') {
            await I.seeGovUkPaymentPage(language);
            await I.seeGovUkConfirmPage(language);
        }
        await I.seePaymentStatusPage(language);

        // Thank You
        await I.seeThankYouPage(language);
    }).tag('@e2enightly')
        .tag('@e2enightly-pr')
        .retry(TestConfigurator.getRetryScenarios());

    Scenario(TestConfigurator.idamInUseText(`${language.toUpperCase()} - GOP -Intestacy Child Journey - Paper iht, no death certificate uploaded and spouse renouncing`), async ({I}) => {
        const taskListContent = language === 'en' ? taskListContentEn : taskListContentCy;
        await I.retry(2).createAUser(TestConfigurator);

        // Eligibility Task (pre IdAM)
        await I.startApplication(language);

        // Probate Sceeners
        await I.selectDeathCertificate(language);

        await I.selectDeathCertificateInEnglish(language, optionNo);
        await I.selectDeathCertificateTranslation(language, optionYes);

        await I.selectDeceasedDomicile(language, optionYes);
        const isEEEnabled = await TestConfigurator.checkFeatureToggle('probate-excepted-estates');
        if (isEEEnabled) {
            await I.selectEEDeceasedDod(language);
            await I.selectEEvalue(language);
        } else {
            await I.selectIhtCompleted(language, optionYes);
        }
        await I.selectPersonWhoDiedLeftAWill(language, optionNo);

        // Intestacy Sceeners
        await I.selectDiedAfterOctober2014(language, optionYes);
        await I.selectRelatedToDeceased(language, optionYes);
        await I.selectOtherApplicants(language, optionNo);

        await I.startApply(language);

        // IdAM
        await I.authenticateWithIdamIfAvailable(language);

        // Dashboard
        // await I.chooseApplication(language);

        // Deceased Task
        await I.selectATask(language, taskListContent.taskNotStarted);
        await I.chooseBiLingualGrant(language, optionNo);
        await I.enterDeceasedDetails(language, 'Deceased First Name', 'Deceased Last Name', '01', '01', '1950', '02', '01', '2022');
        await I.enterDeceasedAddress(language);

        await I.selectDiedEngOrWales(language, optionNo);
        await I.selectEnglishForeignDeathCert(language, optionNo);
        await I.selectForeignDeathCertTranslation(language, optionYes);

        await I.selectEEComplete(language, optionYes);
        await I.selectSubmittedToHmrc(language, ihtOptionNotSubmitted);
        await I.enterEEValue(language, 500000, 400000, 400000);
        await I.selectLateSpouseCivilPartner(language, optionYes);
        await I.selectUnusedAllowance(language, optionYes);
        await I.enterProbateEstateValues(language, 400000, 400000);

        await I.selectAssetsOutsideEnglandWales(language, optionYes);
        await I.enterValueAssetsOutsideEnglandWales(language, '400000');
        await I.selectDeceasedAlias(language, optionNo);
        await I.selectDeceasedMaritalStatus(language, maritalStatusMarried);

        // Executors Task
        await I.selectATask(language, taskListContent.taskNotStarted);
        await I.selectRelationshipToDeceased(language, relationshipChildOfDeceased);
        await I.selectSpouseNotApplyingReason(language, optionRenouncing);
        await I.enterAnyOtherChildren(language, optionNo);
        await I.enterApplicantName(language, 'ApplicantFirstName', 'ApplicantLastName');
        await I.enterApplicantPhone(language);
        await I.enterAddressManually(language);
        if (TestConfigurator.equalityAndDiversityEnabled()) {
            await I.exitEqualityAndDiversity(language);
            await I.completeEqualityAndDiversity(language);
        }

        // Check your answers and declaration
        await I.selectATask(language, taskListContent.taskNotStarted);
        await I.seeSummaryPage(language, 'declaration');
        await I.acceptDeclaration(language, bilingualGOP);

        // Copies Task
        await I.selectATask(language, taskListContent.taskNotStarted);
        if (TestConfigurator.getUseGovPay() === 'true') {
            await I.enterUkCopies(language, '5');
            await I.selectOverseasAssets(language, optionNo);
        } else {
            await I.enterUkCopies(language, '0');
            await I.selectOverseasAssets(language, optionNo);

        }
        await I.seeCopiesSummary(language);

        // Payment Task
        await I.selectATask(language, taskListContent.taskNotStarted);
        await I.seePaymentBreakdownPage(language);
        if (TestConfigurator.getUseGovPay() === 'true') {
            await I.seeGovUkPaymentPage(language);
            await I.seeGovUkConfirmPage(language);
        }
        await I.seePaymentStatusPage(language);

        // Thank You
        await I.seeThankYouPage(language);
    }).tag('@e2enightly')
        .tag('@e2enightly-pr')
        .retry(TestConfigurator.getRetryScenarios());
});
