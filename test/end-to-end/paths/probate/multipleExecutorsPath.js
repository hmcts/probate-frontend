'use strict';

//const taskListContent = require('app/resources/en/translation/tasklist');
const TestConfigurator = new (require('test/end-to-end/helpers/TestConfigurator'))();
const {forEach, head} = require('lodash');
const testConfig = require('test/config.js');
const paymentType = testConfig.paymentType;
const copies = testConfig.copies;

let grabIds;
let retries = -1;

Feature('Multiple Executors flow');
// .retry(TestConfigurator.getRetryFeatures());

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

Scenario(TestConfigurator.idamInUseText('Multiple Executors Journey - Main applicant: 1st stage of completing application'), async function (I) {
    retries += 1;

    if (retries >= 1) {
        TestConfigurator.getBefore();
    }

    // Eligibility Task (pre IdAM)
    I.startApplication();

    I.selectDeathCertificate('No');
    I.seeStopPage('deathCertificate');
    I.selectDeathCertificate('Yes');

    I.selectDeceasedDomicile('No');
    I.seeStopPage('notInEnglandOrWales');
    I.selectDeceasedDomicile('Yes');

    I.selectIhtCompleted('No');
    I.seeStopPage('ihtNotCompleted');
    I.selectIhtCompleted('Yes');

    I.selectPersonWhoDiedLeftAWill('Yes');

    I.selectOriginalWill('No');
    I.seeStopPage('notOriginal');
    I.selectOriginalWill('Yes');

    I.selectApplicantIsExecutor('No');
    I.seeStopPage('notExecutor');
    I.selectApplicantIsExecutor('Yes');

    I.selectMentallyCapable('No');
    I.seeStopPage('mentalCapacity');
    I.selectMentallyCapable('Yes');

    I.startApply();

    // IdAM
    I.authenticateWithIdamIfAvailable();

    // Deceased Task
    I.selectATask();
    I.enterDeceasedName('Deceased First Name', 'Deceased Last Name');
    I.enterDeceasedDateOfBirth('01', '01', '1950');
    I.enterDeceasedDateOfDeath('01', '01', '2017');
    I.enterDeceasedAddress();
    I.selectDocumentsToUpload();
    I.selectInheritanceMethodPaper();

    if (TestConfigurator.getUseGovPay() === 'true') {
        I.enterGrossAndNet(paymentType.form, paymentType.pay.gross, paymentType.pay.net);
    } else {
        I.enterGrossAndNet(paymentType.form, paymentType.noPay.gross, paymentType.noPay.net);
    }

    I.selectDeceasedAlias('Yes');
    I.selectOtherNames('2');
    I.selectDeceasedMarriedAfterDateOnWill('No');
    I.selectWillCodicils('Yes');
    I.selectWillNoOfCodicils('3');

    // ExecutorsTask
    I.selectATask();
    I.enterApplicantName('Applicant First Name', 'Applicant Last Name');
    I.selectNameAsOnTheWill('No');
    I.enterApplicantAlias('applicant_alias');
    I.enterApplicantAliasReason('aliasOther', 'alias_other_reason');
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

        diedBefore = !diedBefore;
    });

    I.selectExecutorsApplying('Yes');

    const executorsApplyingList = ['3', '5'];
    I.selectExecutorsDealingWithEstate(executorsApplyingList, true);
    I.selectExecutorsWithDifferentNameOnWill('Yes');

    const executorsWithDifferentNameList = ['5'];
    I.selectWhichExecutorsWithDifferentNameOnWill(executorsApplyingList, executorsWithDifferentNameList);

    forEach(executorsWithDifferentNameList, executorNumber => {
        I.enterExecutorCurrentName(executorNumber, head(executorsWithDifferentNameList) === executorNumber);
        I.enterExecutorCurrentNameReason(executorNumber, 'aliasOther', 'executor_alias_reason');
    });

    forEach(executorsApplyingList, executorNumber => {
        I.enterExecutorContactDetails(executorNumber, head(executorsApplyingList) === executorNumber);
        I.enterExecutorManualAddress(executorNumber);
    });

    const executorsNotApplyingList = ['4', '6'];
    let powerReserved = true;
    forEach(executorsNotApplyingList, executorNumber => {
        I.selectExecutorRoles(executorNumber, powerReserved, head(executorsNotApplyingList) === executorNumber);

        if (powerReserved) {
            I.selectHasExecutorBeenNotified('Yes', executorNumber);
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

    grabIds = await I.grabTextFrom('pre');

}).retry(TestConfigurator.getRetryScenarios());

Scenario(TestConfigurator.idamInUseText('Additional Executor(s) Agree to Statement of Truth'), async function (I) {
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

        I.seeAgreePage(i);

    }
}).retry(TestConfigurator.getRetryScenarios());

Scenario(TestConfigurator.idamInUseText('Continuation of Main applicant journey: final stage of application'), function (I) {

    // Pre-IDAM
    I.startApplication();

    I.selectDeathCertificate('Yes');
    I.selectDeceasedDomicile('Yes');
    I.selectIhtCompleted('Yes');
    I.selectPersonWhoDiedLeftAWill('Yes');
    I.selectOriginalWill('Yes');
    I.selectApplicantIsExecutor('Yes');
    I.selectMentallyCapable('Yes');

    I.startApply();

    // IDAM
    I.authenticateWithIdamIfAvailable();

    // Extra Copies Task
    I.selectATask();

    if (TestConfigurator.getUseGovPay() === 'true') {
        I.enterUkCopies(copies.pay.uk);
        I.selectOverseasAssets();
        I.enterOverseasCopies(copies.pay.overseas);
    } else {
        I.enterUkCopies(copies.noPay.uk);
        I.selectOverseasAssets();
        I.enterOverseasCopies(copies.noPay.overseas);
    }

    I.seeCopiesSummary();

    // Payment Task
    I.selectATask();

    if (TestConfigurator.getUseGovPay() === 'true') {
        I.seePaymentBreakdownPage(copies.pay.uk, copies.pay.overseas, paymentType.pay.net);
    } else {
        I.seePaymentBreakdownPage(copies.noPay.uk, copies.noPay.overseas, paymentType.noPay.net);
    }

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
