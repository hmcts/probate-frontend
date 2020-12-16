'use strict';

const taskListContent = require('app/resources/en/translation/tasklist');
const TestConfigurator = new (require('test/end-to-end/helpers/TestConfigurator'))();
const testConfig = require('config');

const optionYes = '';
const ihtPost = '';
const optionNo = '-2';
const bilingualGOP = false;
const uploadingDocuments = false;

Feature('Multiple Executors flow').retry(TestConfigurator.getRetryFeatures());

// eslint complains that the Before/After are not used but they are by codeceptjs
// so we have to tell eslint to not validate these
// eslint-disable-next-line no-undef
Before(async () => {
    await TestConfigurator.getBefore();
});

// eslint-disable-next-line no-undef
After(() => {
    TestConfigurator.getAfter();
});

Scenario(TestConfigurator.idamInUseText('Multiple Executors Journey - Main applicant; Stage 1: Enter deceased and executor details'), async (I) => {
    await I.retry(2).createAUser(TestConfigurator);

    // Eligibility Task (pre IdAM)
    await I.startApplication();

    await I.selectDeathCertificate(optionYes);

    await I.selectDeceasedDomicile(optionYes);

    await I.selectIhtCompleted(optionYes);

    await I.selectPersonWhoDiedLeftAWill(optionYes);

    await I.selectOriginalWill(optionYes);

    await I.selectApplicantIsExecutor(optionYes);

    await I.selectMentallyCapable(optionYes);

    await I.startApply();

    // IdAM
    await I.authenticateWithIdamIfAvailable(true);

    // Dashboard
    await I.chooseApplication();

    // Deceased Task
    await I.selectATask(taskListContent.taskNotStarted);
    await I.chooseBiLingualGrant(optionNo);
    await I.enterDeceasedName('Deceased First Name', 'Deceased Last Name');
    await I.enterDeceasedDateOfBirth('01', '01', '1950');
    await I.enterDeceasedDateOfDeath('01', '01', '2017');
    await I.enterDeceasedAddress();

    await I.selectDocumentsToUpload(uploadingDocuments);
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

    //const totalExecutors = '7';
    const totalExecutors = '4';
    await I.enterTotalExecutors(totalExecutors);
    await I.enterExecutorNames(totalExecutors);
    await I.selectExecutorsAllAlive(optionNo);

    //const executorsWhoDiedList = ['2', '7']; // exec2 and exec7
    const executorsWhoDiedList = ['2']; // exec2
    let diedBefore = optionYes;
    await I.selectExecutorsWhoDied(executorsWhoDiedList);

    if (executorsWhoDiedList) {
        for (let i = 0; i < executorsWhoDiedList.length; i++) {
            const executorNum = executorsWhoDiedList[i];
            // eslint-disable-next-line no-await-in-loop
            await I.selectExecutorsWhenDied(executorNum, diedBefore, executorsWhoDiedList[0] === executorNum);
            diedBefore = optionNo;
        }
    }

    await I.selectExecutorsApplying(optionYes);

    //const executorsApplyingList = ['3', '5']; // exec3 and exec5
    const executorsApplyingList = ['3']; // exec3
    await I.selectExecutorsDealingWithEstate(executorsApplyingList);

    //I.selectExecutorsWithDifferentNameOnWill(optionYes);
    await I.selectExecutorsWithDifferentNameOnWill(optionNo);
    //const executorsWithDifferentNameIdList = ['2']; // ie 1 is the HTML id for executor 3, 2 is the HTML id for executor 5
    //I.selectWhichExecutorsWithDifferentNameOnWill(executorsWithDifferentNameIdList);

    // const executorNumber = '5'; // 5 is the number in the name of the executor ie exec5
    // I.enterExecutorCurrentName(executorNumber);
    // I.enterExecutorCurrentNameReason(executorNumber, 'executor_alias_reason');

    for (let i= 1; i <= executorsApplyingList.length; i++) {
        // eslint-disable-next-line no-await-in-loop
        await I.enterExecutorContactDetails();
        // eslint-disable-next-line no-await-in-loop
        await I.enterExecutorManualAddress(i);
    }

    //const executorsAliveList = ['4', '6'];
    const executorsAliveList = ['4'];
    // let powerReserved = true;
    // let answer = optionYes;
    let powerReserved = false;
    let answer = optionNo;

    if (executorsAliveList) {
        for (let i = 0; i < executorsAliveList.length; i++) {
            const executorNumber = executorsAliveList[i];
            // eslint-disable-next-line no-await-in-loop
            await I.selectExecutorRoles(executorNumber, answer, executorsAliveList[0] === executorNumber);

            if (powerReserved) {
                // eslint-disable-next-line no-await-in-loop
                await I.selectHasExecutorBeenNotified(optionYes);
            }

            powerReserved = false;
            answer = optionNo;
        }
    }

    // Complete Equality & Diversity Questionnaire
    if (TestConfigurator.equalityAndDiversityEnabled()) {
        await I.exitEqualityAndDiversity();
        await I.completeEqualityAndDiversity();
    }

    // Review and Confirm Task
    await I.selectATask(taskListContent.taskNotStarted);
    await I.seeSummaryPage('declaration');
    await I.acceptDeclaration(bilingualGOP);

    // Notify additional executors Dealing with estate
    await I.notifyAdditionalExecutors();

    //Retrieve the email urls for additional executors
    await I.amOnPage(testConfig.TestInviteIdListUrl);

    const grabIds = await I.grabTextFrom('pre');

    let idList = null;
    try {
        idList = JSON.parse(grabIds);
    } catch (err) {
        console.error(err.message);
    }

    for (let i=0; i < idList.ids.length; i++) {

        // eslint-disable-next-line no-await-in-loop
        await I.amOnPage(testConfig.TestInvitationUrl + '/' + idList.ids[i]);
        // eslint-disable-next-line no-await-in-loop
        await I.amOnPage(testConfig.TestE2EFrontendUrl + '/pin');
        // eslint-disable-next-line no-await-in-loop
        await I.waitForElement('pre');

        const grabPins = await I.grabTextFrom('pre'); // eslint-disable-line no-await-in-loop
        const pinList = JSON.parse(grabPins);

        // eslint-disable-next-line no-await-in-loop
        await I.clickBrowserBackButton(); // eslint-disable-line no-await-in-loop

        // eslint-disable-next-line no-await-in-loop
        await I.enterPinCode(pinList.pin.toString());
        // eslint-disable-next-line no-await-in-loop
        await I.seeCoApplicantStartPage();

        // eslint-disable-next-line no-await-in-loop
        await I.agreeDeclaration(optionYes);

        // eslint-disable-next-line no-await-in-loop
        await I.seeAgreePage();
    }

    // IDAM
    await I.authenticateWithIdamIfAvailable(true);

    // Dashboard
    await I.chooseApplication();

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
