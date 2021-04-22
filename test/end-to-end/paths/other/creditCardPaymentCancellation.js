'use strict';

const taskListContentEn = require('app/resources/en/translation/tasklist');
const taskListContentCy = require('app/resources/cy/translation/tasklist');
const TestConfigurator = new (require('test/end-to-end/helpers/TestConfigurator'))();
const optionYes = '';
const ihtPost = '';
const optionNo = '-2';
const bilingualGOP = false;
const uploadingDocuments = false;
const config = require('config');
const languages = ['en', 'cy'];

Feature('Credit Card Payment Cancellation').retry(TestConfigurator.getRetryFeatures());

Before(async () => {
    await TestConfigurator.initLaunchDarkly();
    await TestConfigurator.getBefore();
});

After(async () => {
    await TestConfigurator.getAfter();
});

languages.forEach(language => {

    Scenario(TestConfigurator.idamInUseText(`${language.toUpperCase()} -Credit Card Payment Cancellation`), async (I) => {
        if (TestConfigurator.getUseGovPay() === 'true') {

            const taskListContent = language === 'en' ? taskListContentEn : taskListContentCy;
            await I.retry(2).createAUser(TestConfigurator);

            const useNewDeathCertFlow = await TestConfigurator.checkFeatureToggle(config.featureToggles.ft_new_deathcert_flow);

            // Eligibility Task (pre IdAM)
            await I.startApplication(language);

            await I.selectDeathCertificate(language, optionYes);

            if (useNewDeathCertFlow) {
                await I.selectDeathCertificateInEnglish(language, optionNo);
                await I.selectDeathCertificateTranslation(language, optionYes);
            }

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

            if (useNewDeathCertFlow) {
                await I.selectDiedEngOrWales(language, optionNo);
                await I.selectEnglishForeignDeathCert(language, optionNo);
                await I.selectForeignDeathCertTranslation(language, optionYes);
            } else {
                await I.selectDocumentsToUpload(language, uploadingDocuments);
            }

            await I.selectInheritanceMethod(language, ihtPost);

            if (TestConfigurator.getUseGovPay() === 'true') {
                await I.enterGrossAndNet(language, '205', '600000', '300000');
            } else {
                await I.enterGrossAndNet(language, '205', '500', '400');
            }

            await I.selectDeceasedAlias(language, optionNo);
            await I.selectDeceasedMarriedAfterDateOnWill(language, optionNo);
            await I.selectWillCodicils(language, optionNo);

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
            await I.seeGovUkPaymentPage(language);
            await I.seeGovUkCancelPage(language);
            await I.seeCancellationPage(language);
            await I.seePaymentClosePage(language);
            await I.seeSignOut(language);

        }
    }).tag('@e2e')
        .retry(TestConfigurator.getRetryScenarios());
});
