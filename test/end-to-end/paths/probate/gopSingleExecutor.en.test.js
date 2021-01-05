'use strict';

const taskListContent = require('app/resources/en/translation/tasklist');
const TestConfigurator = new (require('test/end-to-end/helpers/TestConfigurator'))();
const optionYes = '';
const ihtPost = '';
const optionNo = '-2';
const bilingualGOP = false;
const uploadingDocuments = false;
const config = require('config');

Feature('GOP-Single Executor flow...').retry(TestConfigurator.getRetryFeatures());

// eslint complains that the Before/After are not used but they are by codeceptjs
// so we have to tell eslint to not validate these
// eslint-disable-next-line no-undef
Before(async () => {
    await TestConfigurator.initLaunchDarkly();
    await TestConfigurator.getBefore();
});

// eslint-disable-next-line no-undef
After(() => {
    TestConfigurator.getAfter();
});

Scenario(TestConfigurator.idamInUseText('Single Executor Journey with sign out/in and survey link'), async (I) => {
    await I.retry(2).createAUser(TestConfigurator);

    const useNewDeathCertFlow = await TestConfigurator.checkFeatureToggle(config.featureToggles.ft_new_deathcert_flow);

    // Eligibility Task (pre IdAM)
    await I.startApplication();

    await I.selectDeathCertificate(optionYes);

    if (useNewDeathCertFlow) {
        await I.selectDeathCertificateInEnglish(optionNo);
        await I.selectDeathCertificateTranslation(optionYes);
    }

    await I.selectDeceasedDomicile(optionYes);

    await I.selectIhtCompleted(optionYes);

    await I.selectPersonWhoDiedLeftAWill(optionYes);

    await I.selectOriginalWill(optionYes);

    await I.selectApplicantIsExecutor(optionYes);

    await I.selectMentallyCapable(optionYes);

    await I.startApply();

    // IdAM
    await I.authenticateWithIdamIfAvailable();

    // Dashboard
    await I.chooseApplication();

    // Deceased Details
    await I.selectATask(taskListContent.taskNotStarted);
    await I.chooseBiLingualGrant(optionNo);
    await I.enterDeceasedName('Deceased First Name', 'Deceased Last Name');
    await I.enterDeceasedDateOfBirth('01', '01', '1950', true);

    await I.seeSignOut();

    await I.authenticateWithIdamIfAvailable();

    // Dashboard
    await I.chooseApplication();

    // Deceased Details
    await I.selectATask(taskListContent.taskNotStarted);

    await I.enterDeceasedDateOfBirth('01', '01', '1950');
    await I.enterDeceasedDateOfDeath('01', '01', '2017');
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
    await I.selectDeceasedMarriedAfterDateOnWill(optionNo);
    await I.selectWillCodicils(optionNo);

    // ExecutorsTask
    await I.selectATask(taskListContent.taskNotStarted);
    await I.enterApplicantName('Applicant First Name', 'Applicant Last Name');
    await I.selectNameAsOnTheWill(optionYes);
    await I.enterApplicantPhone();
    await I.enterAddressManually();

    const totalExecutors = '1';
    await I.enterTotalExecutors(totalExecutors);

    // Skip Equality and Diversity questions
    if (TestConfigurator.equalityAndDiversityEnabled()) {
        await I.exitEqualityAndDiversity();
        await I.completeEqualityAndDiversity();
    }

    // Review and Confirm Task
    await I.selectATask(taskListContent.taskNotStarted);
    await I.seeSummaryPage('declaration');
    await I.acceptDeclaration(bilingualGOP);

    // Extra Copies Task
    await I.selectATask(taskListContent.taskNotStarted);

    if (TestConfigurator.getUseGovPay() === 'true') {
        await I.enterUkCopies('5');
        await I.selectOverseasAssets(optionYes);
        await I.enterOverseasCopies('7');
    } else {
        await I.enterUkCopies('0');
        await I.selectOverseasAssets(optionYes);
        await I.enterOverseasCopies('0');
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
