const taskListContent = require('app/resources/en/translation/tasklist.json');
const TestConfigurator = new (require('test/end-to-end/helpers/TestConfigurator'))();

Feature('Single Executor flow');

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

Scenario(TestConfigurator.idamInUseText('Single Executor Journey'), function* (I) {

    // Eligibility Task
    I.startApplication();
    I.selectPersonWhoDiedLeftAWill();
    I.selectOriginalWill();
    I.selectDeathCertificate();
    I.selectDeceasedDomicile();
    I.selectApplicantIsExecutor();
    I.selectMentallyCapable();
    I.selectIhtCompleted();
    I.startApply();

    // IDAM
    I.authenticateWithIdamIfAvailable();

    // Deceased Task
    I.selectATask(taskListContent.taskNotStarted);
    I.enterDeceasedName('Deceased First Name', 'Deceased Last Name');
    I.enterDeceasedDateOfBirth('01', '01', '1950');
    I.enterDeceasedDateOfDeath('01', '01', '2017');
    I.enterDeceasedAddress();
    I.selectInheritanceMethodPaper();

    if (TestConfigurator.getUseGovPay() === 'true') {
        I.enterGrossAndNet('205', '600000', '300000');
    } else {
        I.enterGrossAndNet('205', '500', '400');
    }

    I.selectDeceasedAlias('Yes');
    I.selectOtherNames('2');
    I.selectDeceasedMarriedAfterDateOnWill('optionNo');
    I.selectWillCodicils('Yes');
    I.selectWillNoOfCodicils('3');

    // Executors Task
    I.selectATask(taskListContent.taskNotStarted);
    I.enterApplicantName('Applicant First Name', 'Applicant Last Name');
    I.selectNameAsOnTheWill('optionNo');
    I.enterApplicantPhone();
    I.enterAddressManually();

    const totalExecutors = '1';
    I.enterTotalExecutors(totalExecutors);

    // Declaration Task
    I.selectATask(taskListContent.taskNotStarted);
    I.seeSummaryPage('declaration');
    I.acceptDeclaration();

    // Copies Task
    I.selectATask(taskListContent.taskNotStarted);

    if (TestConfigurator.getUseGovPay() === 'true') {
        I.enterUkCopies('5');
        I.selectOverseasAssets();
        I.enterOverseasCopies('7');
    } else {
        I.enterUkCopies('0');
        I.selectOverseasAssets();
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

    // Documents Task
    I.seeDocumentsPage();
    I.seeThankYouPage();
}).retry(TestConfigurator.getRetryScenarios());
