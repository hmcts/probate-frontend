'use strict';
const taskListContent = require('app/resources/en/translation/tasklist');
const TestConfigurator = new (require('test/end-to-end/helpers/TestConfigurator'))();
const {forEach, head} = require('lodash');
const testConfig = require('test/config.js');
const services = require('app/components/services');
const config = require('app/config');
let isAliasToggledEnabled;

let grabIds;

Feature('Multiple Executors flow');
//eslint-disable-next-line no-undef
Before(function* () {
    TestConfigurator.getBefore();
    isAliasToggledEnabled = yield services.featureToggle(config.featureToggles.main_applicant_alias);
});

Scenario(TestConfigurator.idamInUseText('Multiple Executors Journey - Main applicant: 1st stage of completing application'), function* (I) {

    TestConfigurator.getBefore();
    // Pre-IDAM
    I.startApplication();
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
    I.selectATask(taskListContent.taskNotStarted);
    I.enterApplicantName('Applicant First Name', 'Applicant Last Name');
    I.selectNameAsOnTheWill('optionNo');
    I.enterApplicantAlias('Bob Alias');
    I.enterApplicantAliasReason('aliasOther', 'Because YOLO');
    I.enterApplicantPhone();
    I.enterAddressManually();

    const totalExecutors = '7';
    I.enterTotalExecutors(totalExecutors);
    I.enterExecutorNames(totalExecutors);
    I.selectExecutorsAllAlive('No');
    const executorsWhoDiedList = ['2', '7'];

    let diedBefore = true;
    I.selectExecutorsWhoDied(executorsWhoDiedList);

    forEach(executorsWhoDiedList, executorNumber => {
        I.selectExecutorsWhenDied(executorNumber, diedBefore, head(executorsWhoDiedList) === executorNumber);

        if (diedBefore) {
            diedBefore = false;
        } else {
            diedBefore = true;
        }
    });

    I.selectExecutorsApplying();
    const executorsApplyingList = ['3', '5'];
    I.selectExecutorsDealingWithEstate(executorsApplyingList);
    I.selectExecutorsWithDifferentNameOnWill();
    const executorsWithDifferentNameIdList = ['2']; // ie 1 is the HTML id for executor 3, 2 is the HTML id for executor 5
    I.selectWhichExecutorsWithDifferentNameOnWill(executorsWithDifferentNameIdList);
    const executorsWithDifferentNameList = ['5'];
    if (isAliasToggledEnabled === 1) {
        forEach(executorsWithDifferentNameList, executorNumber => {
            I.enterExecutorCurrentName(executorNumber, head(executorsWithDifferentNameList) === executorNumber);
            I.enterExecutorCurrentNameReason(executorNumber, 'aliasOther', 'Because YOLO');
        });
    }
    forEach(executorsApplyingList, executorNumber => {
        I.enterExecutorContactDetails(executorNumber, head(executorsApplyingList) === executorNumber);
        I.enterExecutorManualAddress(executorNumber);
    });

    const executorsAliveList = ['4', '6'];
    let powerReserved = true;
    forEach(executorsAliveList, executorNumber => {
        I.selectExecutorRoles(executorNumber, powerReserved, head(executorsAliveList) === executorNumber);

        if (powerReserved) {
            I.selectHasExecutorBeenNotified('Yes', executorNumber);
            powerReserved = false;
        } else {
            powerReserved = true;
        }
    });

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
    I.selectATask('Start');
    I.seeSummaryPage('declaration');
    I.acceptDeclaration();

    // Notify additional executors Dealing with estate
    I.notifyAdditionalExecutors();

    //Retrieve the email urls for additional executors
    I.amOnPage(testConfig.TestInviteIdListUrl);
    grabIds = yield I.grabTextFrom('pre');
}).retry(TestConfigurator.getRetryScenarios());

Scenario(TestConfigurator.idamInUseText('Additional Executor(s) Agree to Statement of Truth'), function* (I) {
    const idList = JSON.parse(grabIds);

    for (let i=0; i < idList.ids.length; i++) {
        I.amOnPage(testConfig.TestInvitationUrl + '/' + idList.ids[i]);
        I.amOnPage(testConfig.TestE2EFrontendUrl + '/pin');

        const grabPins = yield I.grabTextFrom('pre');
        const pinList = JSON.parse(grabPins);

        yield I.clickBrowserBackButton();

        I.enterPinCode(pinList.pin.toString());
        I.seeCoApplicantStartPage();

        I.agreeDisagreeDeclaration('Agree');

        I.seeAgreePage(i);

    }
});

Scenario(TestConfigurator.idamInUseText('Continuation of Main applicant journey: final stage of application'), function* (I) {

    // Pre-IDAM
    I.startApplication();
    I.startApply();

    // IDAM
    I.authenticateWithIdamIfAvailable();

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
});
