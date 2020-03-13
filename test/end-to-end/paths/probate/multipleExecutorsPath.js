'use strict';

//const taskListContent = require('app/resources/en/translation/tasklist');
const TestConfigurator = new (require('test/end-to-end/helpers/TestConfigurator'))();
const {head} = require('lodash');
const testConfig = require('test/config.js');
const optionYes = '';
const ihtPost = '';
const optionNo = '-2';
const applicantAliasOtherReason = '-4';
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

    // IdAM
    // I.authenticateWithIdamIfAvailable(true);
    //
    // // Eligibility Task (pre IdAM)
    // I.startApplication();
    //
    // I.selectDeathCertificate(optionYes);
    // // I.seeStopPage('deathCertificate');
    // // I.selectDeathCertificate(optionNo);
    //
    // I.selectDeceasedDomicile(optionYes);
    // // I.seeStopPage('notInEnglandOrWales');
    // // I.selectDeceasedDomicile(optionNo);
    //
    // I.selectIhtCompleted(optionYes);
    // // I.seeStopPage('ihtNotCompleted');
    // // I.selectIhtCompleted(optionNo);
    //
    // I.selectPersonWhoDiedLeftAWill(optionYes);
    //
    // I.selectOriginalWill(optionYes);
    // // I.seeStopPage('notOriginal');
    // // I.selectOriginalWill(optionNo);
    //
    // I.selectApplicantIsExecutor(optionYes);
    // // I.seeStopPage('notExecutor');
    // // I.selectApplicantIsExecutor(optionNo);
    //
    // I.selectMentallyCapable(optionYes);
    // // I.seeStopPage('mentalCapacity');
    // // I.selectMentallyCapable(optionNo);
    //
    // // Dashboard
    // I.chooseApplication();

    // Eligibility Task (pre IdAM)
    I.startApplication();

    I.selectDeathCertificate(optionYes);
    // I.seeStopPage('deathCertificate');
    // I.selectDeathCertificate(optionNo);

    I.selectDeceasedDomicile(optionYes);
    // I.seeStopPage('notInEnglandOrWales');
    // I.selectDeceasedDomicile(optionNo);

    I.selectIhtCompleted(optionYes);
    // I.seeStopPage('ihtNotCompleted');
    // I.selectIhtCompleted(optionNo);

    I.selectPersonWhoDiedLeftAWill(optionYes);

    I.selectOriginalWill(optionYes);
    // I.seeStopPage('notOriginal');
    // I.selectOriginalWill(optionNo);

    I.selectApplicantIsExecutor(optionYes);
    // I.seeStopPage('notExecutor');
    // I.selectApplicantIsExecutor(optionNo);

    I.selectMentallyCapable(optionYes);
    // I.seeStopPage('mentalCapacity');
    // I.selectMentallyCapable(optionNo);

    I.startApply();

    // IdAM
    I.authenticateWithIdamIfAvailable();

    // Dashboard
    I.chooseApplication();

    // Deceased Task
    I.selectATask();
    I.chooseBiLingualGrant();
    I.enterDeceasedName('Deceased First Name', 'Deceased Last Name');
    I.enterDeceasedDateOfBirth('01', '01', '1950');
    I.enterDeceasedDateOfDeath('01', '01', '2017');
    I.enterDeceasedAddress();
    const uploadingDocuments = false;
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
    I.selectATask();
    I.enterApplicantName('Applicant First Name', 'Applicant Last Name');
    I.selectNameAsOnTheWill(optionNo);
    I.enterApplicantAlias('applicant_alias');
    I.enterApplicantAliasReason(applicantAliasOtherReason, 'Applicant alias reason');
    I.enterApplicantPhone();
    I.enterAddressManually();

    const totalExecutors = '7';
    I.enterTotalExecutors(totalExecutors);
    I.enterExecutorNames(totalExecutors);
    I.selectExecutorsAllAlive(optionNo);

    const executorsWhoDiedList = ['2', '7'];
    let diedBefore = true;
    I.selectExecutorsWhoDied(executorsWhoDiedList);

    executorsWhoDiedList.forEach((executorNumber) => {
        I.selectExecutorsWhenDied(executorNumber, diedBefore, head(executorsWhoDiedList) === executorNumber, optionYes, optionNo);

        diedBefore = !diedBefore;
    });

    I.selectExecutorsApplying(optionYes);

    const executorsApplyingList = ['3', '5'];
    I.selectExecutorsDealingWithEstate(executorsApplyingList);

    I.selectExecutorsWithDifferentNameOnWill(optionYes);

    const executorsWithDifferentNameIdList = ['2']; // ie 1 is the HTML id for executor 3, 2 is the HTML id for executor 5
    I.selectWhichExecutorsWithDifferentNameOnWill(executorsWithDifferentNameIdList);

    const executorsWithDifferentNameList = ['5'];
    executorsWithDifferentNameList.forEach((executorNumber) => {
        I.enterExecutorCurrentName(executorNumber, head(executorsWithDifferentNameList) === executorNumber);
        I.enterExecutorCurrentNameReason(executorNumber, 'currentNameReason-4', 'executor_other_alias_reason');
    });

    executorsApplyingList.forEach((executorNumber) => {
        I.enterExecutorContactDetails(executorNumber, head(executorsApplyingList) === executorNumber);
        I.enterExecutorManualAddress(executorNumber, head(executorsApplyingList) === executorNumber);
    });

    const executorsAliveList = ['4', '6'];
    let powerReserved = true;
    executorsAliveList.forEach((executorNumber) => {
        I.selectExecutorRoles(executorNumber, powerReserved, head(executorsAliveList) === executorNumber);

        if (powerReserved) {
            I.selectHasExecutorBeenNotified(optionYes, executorNumber);
            powerReserved = false;
        } else {
            powerReserved = true;
        }
    });

    // Review and Confirm Task
    I.selectATask();
    I.seeSummaryPage('declaration');
    I.acceptDeclaration();

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
        I.amOnPage(testConfig.TestInvitationUrl + '/' + idList.ids[i]);
        I.amOnPage(testConfig.TestE2EFrontendUrl + '/pin');

        const grabPins = await I.grabTextFrom('pre'); // eslint-disable-line no-await-in-loop
        const pinList = JSON.parse(grabPins);

        await I.clickBrowserBackButton(); // eslint-disable-line no-await-in-loop

        I.enterPinCode(pinList.pin.toString());
        I.seeCoApplicantStartPage();

        I.agreeDisagreeDeclaration('Agree');

        I.seeAgreePage();

    }
}).retry(TestConfigurator.getRetryScenarios());

Scenario(TestConfigurator.idamInUseText('Stage 3: Continuation of Main applicant journey: final stage of application'), (I) => {

    // IDAM
    I.authenticateWithIdamIfAvailable(true);

    // Dashboard
    I.chooseApplication();

    // Extra Copies Task
    I.selectATask();

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
    I.selectATask();
    I.seePaymentBreakdownPage();

    if (TestConfigurator.getUseGovPay() === 'true') {
        I.seeGovUkPaymentPage();
        I.seeGovUkConfirmPage();
    }

    I.seePaymentStatusPage();

    // Send Documents Task
    I.retry({retries: 5, maxTimeout: 30000}).seeDocumentsPage();

    // Thank You
    I.retry({retries: 5, maxTimeout: 30000}).seeThankYouPage();
}).retry(TestConfigurator.getRetryScenarios());
