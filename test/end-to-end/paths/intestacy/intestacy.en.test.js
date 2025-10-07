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
const hmrcCode = ihtDataConfig.hmrcCode;

Feature('GOP Intestacy E2E');

Before(async () => {
    await TestConfigurator.initLaunchDarkly();
    await TestConfigurator.getBefore();
});

After(async () => {
    await TestConfigurator.getAfter();
});

getTestLanguages().forEach(language => {

    Scenario(TestConfigurator.idamInUseText(`${language.toUpperCase()} - GOP -Intestacy Journey - Digital iht`), async ({I}) => {
        const taskListContent = language === 'en' ? taskListContentEn : taskListContentCy;
        await I.retry(2).createAUser(TestConfigurator);

        // Eligibility Task (pre IdAM)
        await I.startApplication(language);

        // Probate Sceeners
        await I.selectDeathCertificate(language);

        await I.selectDeathCertificateInEnglish(language, optionNo);
        await I.selectDeathCertificateTranslation(language, optionYes);

        await I.selectDeceasedDomicile(language);
        await I.selectEEDeceasedDod(language, optionNo);
        await I.selectIhtCompleted(language, optionYes);
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
        await I.selectATask(language, 'deceasedTask', taskListContent.taskNotStarted);
        await I.chooseBiLingualGrant(language, optionNo);
        await I.enterDeceasedDetails(language, 'Deceased First Name', 'Deceased Last Name', '01', '01', '1950', '01', '01', '2017');
        await I.enterDeceasedAddress(language);

        await I.selectDiedEngOrWales(language, optionNo);
        await I.selectEnglishForeignDeathCert(language, optionNo);
        await I.selectForeignDeathCertTranslation(language, optionYes);

        if (TestConfigurator.getUseGovPay() === 'true') {
            await I.enterGrossAndNet(language, '205');
            await I.enterProbateAssetValues(language, '300000', '200000');
        } else {
            await I.enterGrossAndNet(language, '205');
            await I.enterProbateAssetValues(language, '500', '400');
        }

        await I.selectAssetsOutsideEnglandWales(language, optionYes);
        await I.enterValueAssetsOutsideEnglandWales(language, '400000');
        await I.selectDeceasedAlias(language, optionNo);
        await I.selectDeceasedMaritalStatus(language, maritalStatusMarried);

        // Executors Task
        await I.selectATask(language, 'applicantsTask', taskListContent.taskNotStarted);
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
        await I.selectATask(language, 'reviewAndConfirmTask', taskListContent.taskNotStarted);
        await I.seeSummaryPage(language, 'declaration');
        await I.acceptDeclaration(language, bilingualGOP);

        // Payment Task
        await I.selectATask(language, 'paymentTask', taskListContent.taskNotStarted);

        if (TestConfigurator.getUseGovPay() === 'true') {
            await I.enterUkCopies(language, '5');
            await I.selectOverseasAssets(language, optionNo);
        } else {
            await I.enterUkCopies(language, '0');
            await I.selectOverseasAssets(language, optionNo);
        }
        await I.seeCopiesSummary(language);
        await I.seePaymentBreakdownPage(language);
        if (TestConfigurator.getUseGovPay() === 'true') {
            await I.seeGovUkPaymentPage(language);
            await I.seeGovUkConfirmPage(language);
        }

        // Thank You
        await I.seeThankYouPage(language);
    }).tag('@e2enightly')
        .tag('@e2enightly-pr')
        .tag('@crossbrowser')
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
            await I.selectEEDeceasedDod(language, optionNo);
            await I.selectIhtCompleted(language, optionYes);
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
        await I.selectATask(language, 'deceasedTask', taskListContent.taskNotStarted);
        await I.chooseBiLingualGrant(language, optionNo);
        await I.enterDeceasedDetails(language, 'Deceased First Name', 'Deceased Last Name', '01', '01', '1950', '01', '01', '2017');
        await I.enterDeceasedAddress(language);

        await I.selectDiedEngOrWales(language, optionNo);
        await I.selectEnglishForeignDeathCert(language, optionNo);
        await I.selectForeignDeathCertTranslation(language, optionYes);

        if (TestConfigurator.getUseGovPay() === 'true') {
            await I.enterGrossAndNet(language, '400');
            await I.selectHmrcLetterComplete(language, optionYes);
            await I.enterHmrcCode(language, hmrcCode);
            await I.enterProbateAssetValues(language, '600000', '300000');
        } else {
            await I.enterGrossAndNet(language, '400');
            await I.selectHmrcLetterComplete(language, optionYes);
            await I.enterHmrcCode(language, hmrcCode);
            await I.enterProbateAssetValues(language, '500', '400');
        }

        await I.selectDeceasedAlias(language, optionNo);
        await I.selectDeceasedMaritalStatus(language, maritalStatusMarried);

        // Executors Task
        await I.selectATask(language, 'applicantsTask', taskListContent.taskNotStarted);
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
        await I.selectATask(language, 'reviewAndConfirmTask', taskListContent.taskNotStarted);
        await I.seeSummaryPage(language, 'declaration');
        await I.acceptDeclaration(language, bilingualGOP);

        // Payment Task
        await I.selectATask(language, 'paymentTask', taskListContent.taskNotStarted);
        if (TestConfigurator.getUseGovPay() === 'true') {
            await I.enterUkCopies(language, '5');
            await I.selectOverseasAssets(language, optionNo);
        } else {
            await I.enterUkCopies(language, '0');
            await I.selectOverseasAssets(language, optionNo);

        }
        await I.seeCopiesSummary(language);
        await I.seePaymentBreakdownPage(language);
        if (TestConfigurator.getUseGovPay() === 'true') {
            await I.seeGovUkPaymentPage(language);
            await I.seeGovUkConfirmPage(language);
        }

        // Thank You
        await I.seeThankYouPage(language);
    }).tag('@e2enightly')
        .tag('@e2enightly-pr')
        .retry(TestConfigurator.getRetryScenarios());
});
