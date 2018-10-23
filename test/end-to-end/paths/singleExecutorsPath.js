'use strict';

const taskListContent = require('app/resources/en/translation/tasklist');
const TestConfigurator = new (require('test/end-to-end/helpers/TestConfigurator'))();
const services = require('app/components/services');
const config = require('app/config');
let isAliasToggledEnabled;

Feature('Single Executor flow');

// eslint complains that the Before/After are not used but they are by codeceptjs
// so we have to tell eslint to not validate these
// eslint-disable-next-line no-undef
Before(function* () {
    TestConfigurator.getBefore();
    isAliasToggledEnabled = yield services.featureToggle(config.featureToggles.main_applicant_alias);
});

// eslint-disable-next-line no-undef
After(() => {
    TestConfigurator.getAfter();
});

Scenario(TestConfigurator.idamInUseText('Single Executor Journey'), function* (I) {

    //Pre-IDAM
//    I.startApplication();
    I.startApply();

    // IDAM
    I.authenticateWithIdamIfAvailable();

    // EligibilityTask
    I.selectATask(taskListContent.taskNotStarted);
    I.selectPersonWhoDiedLeftAWill();
    I.selectOriginalWill();
    I.selectWillCodicils('Yes');
    I.selectWillNoOfCodicils('3');
    I.selectDeathCertificate();
    I.selectIhtCompleted();
    I.selectInheritanceMethodPaper();

    if (TestConfigurator.getUseGovPay() === 'true') {
        I.enterGrossAndNet('205', '600000', '300000');
    } else {
        I.enterGrossAndNet('205', '500', '400');
    }

    I.selectApplicantIsExecutor();
    I.selectMentallyCapable();

    // ExecutorsTask
    //
    I.selectATask(taskListContent.taskNotStarted);
    I.enterApplicantName('Applicant First Name', 'Applicant Last Name');
    I.selectNameAsOnTheWill('optionNo');
    if (TestConfigurator.getIsAliasToggledOn() === 'true') {
        I.enterApplicantAlias('Bob Alias');
        I.enterApplicantAliasReason('aliasOther', 'Because YOLO');
    }
    I.enterApplicantPhone();
    I.enterAddressManually();

    const totalExecutors = '1';
    I.enterTotalExecutors(totalExecutors);

    I.enterDeceasedName('Deceased First Name', 'Deceased Last Name');
    I.selectDeceasedAlias('Yes');
    I.selectOtherNames('2');
    I.selectDeceasedMarriedAfterDateOnWill('optionNo');
    I.enterDeceasedDateOfDeath('01', '01', '2017');
    I.enterDeceasedDateOfBirth('01', '01', '1950');
    I.selectDeceasedDomicile();
    I.enterDeceasedAddress();
    I.seeSummaryPage();

    // Review and confirm Task
    I.selectATask(taskListContent.taskNotStarted);
    I.seeSummaryPage('declaration');
    I.acceptDeclaration();

    // Extra copies task
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

    // PaymentTask
    I.selectATask(taskListContent.taskNotStarted);
    I.seePaymentBreakdownPage();

    if (TestConfigurator.getUseGovPay() === 'true') {
        I.seeGovUkPaymentPage();
        I.seeGovUkConfirmPage();
    }

    I.seePaymentStatusPage();

    // Send Documents Task
    I.seeDocumentsPage();

    // Thank You - Application Complete Task
    I.seeThankYouPage();
}).retry(TestConfigurator.getRetryScenarios());
