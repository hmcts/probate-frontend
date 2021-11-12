'use strict';

const taskListContentEn = require('app/resources/en/translation/tasklist');
const taskListContentCy = require('app/resources/cy/translation/tasklist');
const TestConfigurator = new (require('test/end-to-end/helpers/TestConfigurator'))();
const optionYes = '';
const ihtPost = '';
const optionNo = '-2';
const bilingualGOP = false;
const languages = ['en', 'cy'];

Feature('GOP-Single Executor');

Before(async () => {
    await TestConfigurator.initLaunchDarkly();
    await TestConfigurator.getBefore();
});

After(async () => {
    await TestConfigurator.getAfter();
});

languages.forEach(language => {

    Scenario(TestConfigurator.idamInUseText(`${language.toUpperCase()} -GOP Single Executor E2E `), async ({I}) => {

        const taskListContent = language === 'en' ? taskListContentEn : taskListContentCy;
        await I.retry(2).createAUser(TestConfigurator);

        // Eligibility Task (pre IdAM)
        await I.startApplication(language);
        await I.selectDeathCertificate(language);
        await I.selectDeathCertificateInEnglish(language, optionNo);
        await I.selectDeathCertificateTranslation(language, optionYes);
        await I.selectDeceasedDomicile(language);
        await I.selectIhtCompleted(language, optionYes);
        await I.selectPersonWhoDiedLeftAWill(language, optionYes);
        await I.selectOriginalWill(language, optionYes);
        await I.selectApplicantIsExecutor(language, optionYes);
        await I.selectMentallyCapable(language, optionYes);
        await I.startApply(language);

        // IdAM
        await I.authenticateWithIdamIfAvailable(language);

        // Dashboard
        await I.chooseApplication(language);

        // Deceased Details
        await I.selectATask(language, taskListContent.taskNotStarted);
        await I.chooseBiLingualGrant(language, optionNo);
        await I.enterDeceasedName(language, 'Deceased First Name', 'Deceased Last Name');
        await I.enterDeceasedDateOfBirth(language, '01', '01', '1950', true);

        await I.seeSignOut(language);

        await I.authenticateWithIdamIfAvailable(language);

        // Dashboard
        await I.chooseApplication(language);

        // Deceased Details
        await I.selectATask(language, taskListContent.taskNotStarted);

        await I.enterDeceasedDateOfBirth(language, '01', '01', '1950');
        await I.enterDeceasedDateOfDeath(language, '01', '01', '2017');
        await I.enterDeceasedAddress(language);

        await I.selectDiedEngOrWales(language, optionNo);
        await I.selectEnglishForeignDeathCert(language, optionNo);
        await I.selectForeignDeathCertTranslation(language, optionYes);

        await I.selectInheritanceMethod(language, ihtPost);

        if (TestConfigurator.getUseGovPay() === 'true') {
            await I.enterGrossAndNet(language, '205', '600000', '300000');
        } else {
            await I.enterGrossAndNet(language, '205', '500', '400');
        }

        await I.selectDeceasedAlias(language, optionNo);
        await I.selectDeceasedMarriedAfterDateOnWill(language, optionNo);

        const isWillConditionEnabled = await TestConfigurator.checkFeatureToggle('probate-will-condition');
        if (isWillConditionEnabled) {
            await I.selectWillDamage(language, optionYes, 'test');
            await I.selectWillDamageReason(language, optionYes, 'test');
            await I.selectWillDamageWho(language, optionYes, 'test', 'test');
            await I.selectWillDamageDate(language, optionYes, 2017);
        }

        await I.selectWillCodicils(language, optionYes);
        await I.selectWillNoOfCodicils(language, 1);

        if (isWillConditionEnabled) {
            await I.selectCodicilsDamage(language, optionYes, 'test');
            await I.selectCodicilsReason(language, optionYes, 'test');
            await I.selectCodicilsWho(language, optionYes, 'test', 'test');
            await I.selectCodicilsDate(language, optionYes, 2000);
            await I.selectWrittenWishes(language, optionYes, 'test');
        }
        // ExecutorsTask
        await I.selectATask(language, taskListContent.taskNotStarted);
        await I.enterApplicantName(language, 'Applicant First Name', 'Applicant Last Name');
        await I.selectNameAsOnTheWill(language, optionYes);
        await I.enterApplicantPhone(language);
        await I.enterAddressManually(language);

        const totalExecutors = '1';
        await I.enterTotalExecutors(language, totalExecutors);

        // Skip Equality and Diversity questions
        if (TestConfigurator.equalityAndDiversityEnabled()) {
            await I.exitEqualityAndDiversity(language);
            await I.completeEqualityAndDiversity(language);
        }

        // Review and Confirm Task
        await I.selectATask(language, taskListContent.taskNotStarted);
        await I.seeSummaryPage(language, 'declaration');
        await I.acceptDeclaration(language, bilingualGOP);

        // Extra Copies Task
        await I.selectATask(language, taskListContent.taskNotStarted);

        if (TestConfigurator.getUseGovPay() === 'true') {
            await I.enterUkCopies(language, '5');
            await I.selectOverseasAssets(language, optionYes);
            await I.enterOverseasCopies(language, '7');
        } else {
            await I.enterUkCopies(language, '0');
            await I.selectOverseasAssets(language, optionYes);
            await I.enterOverseasCopies(language, '0');
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

        // Send Documents Task
        await I.seeDocumentsPage(language);

        // Thank You
        await I.seeThankYouPage(language);

    }).tag('@e2e')
        .retry(TestConfigurator.getRetryScenarios());
});
