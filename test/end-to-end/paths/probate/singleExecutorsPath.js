'use strict';

const taskListContent = require('app/resources/en/translation/tasklist');
const TestConfigurator = new (require('test/end-to-end/helpers/TestConfigurator'))();
const optionYes = '';
const ihtPost = '';
const optionNo = '-2';
const applicantAliasOtherReason = '-4';
const bilingualGOP = false;
const uploadingDocuments = false;

Feature('Single Executor flow').retry(TestConfigurator.getRetryFeatures());

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

Scenario(TestConfigurator.idamInUseText('Single Executor Journey'), (I) => {

    // Eligibility Task (pre IdAM)
    I.startApplication();

    I.selectDeathCertificate(optionYes);

    I.selectDeceasedDomicile(optionYes);

    I.selectIhtCompleted(optionYes);

    I.selectPersonWhoDiedLeftAWill(optionYes);

    I.selectOriginalWill(optionYes);

    I.selectApplicantIsExecutor(optionYes);

    I.selectMentallyCapable(optionYes);

    I.startApply();

    // IdAM
    I.authenticateWithIdamIfAvailable();

    // Dashboard
    I.chooseApplication();

    // Deceased Details
    I.selectATask(taskListContent.taskNotStarted);
    I.chooseBiLingualGrant(optionNo);
    I.enterDeceasedName('Deceased First Name', 'Deceased Last Name');
    I.enterDeceasedDateOfBirth('01', '01', '1950');
    I.enterDeceasedDateOfDeath('01', '01', '2017');
    I.enterDeceasedAddress(optionNo);

    I.selectDocumentsToUpload(uploadingDocuments);
    I.selectInheritanceMethod(ihtPost);

    if (TestConfigurator.getUseGovPay() === 'true') {
        I.enterGrossAndNet('205', '600000', '300000');
    } else {
        I.enterGrossAndNet('205', '500', '400');
    }

    I.selectDeceasedAlias(optionYes);
    I.selectOtherNames('2');
    I.selectDeceasedMarriedAfterDateOnWill(optionNo);
    I.selectWillCodicils(optionYes);
    I.selectWillNoOfCodicils('3');

    // ExecutorsTask
    I.selectATask(taskListContent.taskNotStarted);
    I.enterApplicantName('Applicant First Name', 'Applicant Last Name');
    I.selectNameAsOnTheWill('-2');
    I.enterApplicantAlias('Applicant Alias');
    I.enterApplicantAliasReason(applicantAliasOtherReason, 'Applicant alias reason');
    I.enterApplicantPhone();
    I.enterAddressManually();

    const totalExecutors = '1';
    I.enterTotalExecutors(totalExecutors);

    // Review and Confirm Task
    I.selectATask(taskListContent.taskNotStarted);
    I.seeSummaryPage('declaration');
    I.acceptDeclaration(bilingualGOP);

    // Extra Copies Task
    I.selectATask(taskListContent.taskNotStarted);

    if (TestConfigurator.getUseGovPay() === 'true') {
        I.enterUkCopies('5');
        I.selectOverseasAssets(optionYes);
        I.enterOverseasCopies('7');
    } else {
        I.enterUkCopies('0');
        I.selectOverseasAssets(optionYes);
        I.enterOverseasCopies('0');
    }

    I.seeCopiesSummary();

    // Payment Task
    I.selectATask(taskListContent.taskNotStarted);
    I.seePaymentBreakdownPage();

    if (TestConfigurator.getUseGovPay() === 'true') {
        I.seeGovUkPaymentPage();
        I.seeGovUkConfirmPage();
    }

    I.seePaymentStatusPage();

    // Send Documents Task
    I.seeDocumentsPage();

    // Thank You
    I.seeThankYouPage();
}).retry(TestConfigurator.getRetryScenarios());
