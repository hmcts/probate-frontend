'use strict';

const taskListContent = require('app/resources/en/translation/tasklist');
const TestConfigurator = new (require('test/end-to-end/helpers/TestConfigurator'))();
const {head} = require('lodash');
const testConfig = require('test/config.js');

const optionYes = '';
const ihtPost = '';
const optionNo = '-2';
const bilingualGOP = false;
const uploadingDocuments = false;

let grabIds;
let stage1retries = -1;

Feature('Multiple Executors flow').retry(TestConfigurator.getRetryFeatures());

// eslint complains that the Before/After are not used but they are by codeceptjs
// so we have to tell eslint to not validate these
// eslint-disable-next-line no-undef
BeforeSuite(() => {
    TestConfigurator.getBefore();
});

// eslint-disable-next-line no-undef
AfterSuite(() => {
    TestConfigurator.getAfter();
});

Scenario(TestConfigurator.idamInUseText('Multiple Executors Journey - Main applicant; Stage 1: Enter deceased and executor details'), async (I) => {
    stage1retries += 1;

    if (stage1retries >= 1) {
        TestConfigurator.getBefore();
    }

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
    I.authenticateWithIdamIfAvailable(true);

    // Dashboard
    I.chooseApplication();

    // Deceased Task
    I.selectATask(taskListContent.taskNotStarted);
    I.chooseBiLingualGrant(optionNo);
    I.enterDeceasedName('Deceased First Name', 'Deceased Last Name');
    I.enterDeceasedDateOfBirth('01', '01', '1950');
    I.enterDeceasedDateOfDeath('01', '01', '2017');
    I.enterDeceasedAddress();

    I.selectDocumentsToUpload(uploadingDocuments);
    I.selectInheritanceMethod(ihtPost);

    if (TestConfigurator.getUseGovPay() === 'true') {
        I.enterGrossAndNet('205', '600000', '300000');
    } else {
        I.enterGrossAndNet('205', '500', '400');
    }

    I.selectDeceasedAlias(optionNo);
    I.selectDeceasedMarriedAfterDateOnWill(optionNo);
    I.selectWillCodicils(optionNo);

    // ExecutorsTask
    I.selectATask(taskListContent.taskNotStarted);
    I.enterApplicantName('Applicant First Name', 'Applicant Last Name');
    I.selectNameAsOnTheWill(optionYes);
    I.enterApplicantPhone();
    I.enterAddressManually();

    //const totalExecutors = '7';
    const totalExecutors = '4';
    I.enterTotalExecutors(totalExecutors);
    I.enterExecutorNames(totalExecutors);
    I.selectExecutorsAllAlive(optionNo);

    //const executorsWhoDiedList = ['2', '7']; // exec2 and exec7
    const executorsWhoDiedList = ['2']; // exec2
    let diedBefore = optionYes;
    I.selectExecutorsWhoDied(executorsWhoDiedList);

    executorsWhoDiedList.forEach((executorNumber) => {
        I.selectExecutorsWhenDied(executorNumber, diedBefore, head(executorsWhoDiedList) === executorNumber);

        diedBefore = optionNo;
    });

    I.selectExecutorsApplying(optionYes);

    //const executorsApplyingList = ['3', '5']; // exec3 and exec5
    const executorsApplyingList = ['3']; // exec3
    I.selectExecutorsDealingWithEstate(executorsApplyingList);

    //I.selectExecutorsWithDifferentNameOnWill(optionYes);
    I.selectExecutorsWithDifferentNameOnWill(optionNo);
    //const executorsWithDifferentNameIdList = ['2']; // ie 1 is the HTML id for executor 3, 2 is the HTML id for executor 5
    //I.selectWhichExecutorsWithDifferentNameOnWill(executorsWithDifferentNameIdList);

    // const executorNumber = '5'; // 5 is the number in the name of the executor ie exec5
    // I.enterExecutorCurrentName(executorNumber);
    // I.enterExecutorCurrentNameReason(executorNumber, 'executor_alias_reason');

    for (let i= 1; i <= executorsApplyingList.length; i++) {
        I.enterExecutorContactDetails();
        I.enterExecutorManualAddress(i);
    }

    //const executorsAliveList = ['4', '6'];
    const executorsAliveList = ['4'];
    // let powerReserved = true;
    // let answer = optionYes;
    let powerReserved = false;
    let answer = optionNo;
    executorsAliveList.forEach((executorNumber) => {
        I.selectExecutorRoles(executorNumber, answer, head(executorsAliveList) === executorNumber);

        if (powerReserved) {
            I.selectHasExecutorBeenNotified(optionYes, executorNumber);
        }

        powerReserved = false;
        answer = optionNo;
    });

    // Review and Confirm Task
    I.selectATask(taskListContent.taskNotStarted);
    I.seeSummaryPage('declaration');
    I.acceptDeclaration(bilingualGOP);

    // Notify additional executors Dealing with estate
    I.notifyAdditionalExecutors();

    //Retrieve the email urls for additional executors
    I.amOnPage(testConfig.TestInviteIdListUrl);
    I.wait(10);
    grabIds = await I.grabTextFrom('pre');

}).retry(TestConfigurator.getRetryScenarios());

Scenario(TestConfigurator.idamInUseText('Stage 2: Additional Executor(s) Agree to Statement of Truth'), async (I) => {
    const idList = JSON.parse(grabIds);

    for (let i=0; i < idList.ids.length; i++) {

        I.amOnLoadedPage(testConfig.TestInvitationUrl + '/' + idList.ids[i]);
        I.amOnLoadedPage(testConfig.TestE2EFrontendUrl + '/pin');

        const grabPins = await I.grabTextFrom('pre'); // eslint-disable-line no-await-in-loop
        const pinList = JSON.parse(grabPins);

        await I.clickBrowserBackButton(); // eslint-disable-line no-await-in-loop

        I.enterPinCode(pinList.pin.toString());
        I.seeCoApplicantStartPage();

        I.agreeDeclaration(optionYes);

        I.seeAgreePage();

    }
}).retry(TestConfigurator.getRetryScenarios());

Scenario(TestConfigurator.idamInUseText('Stage 3: Continuation of Main applicant journey: final stage of application'), (I) => {

    // IDAM
    I.authenticateWithIdamIfAvailable(true);

    // Dashboard
    I.chooseApplication();

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
