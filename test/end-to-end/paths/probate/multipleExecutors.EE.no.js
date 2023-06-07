/* eslint-disable no-await-in-loop */
'use strict';

const taskListContentEn = require('app/resources/en/translation/tasklist');
const taskListContentCy = require('app/resources/cy/translation/tasklist');
const TestConfigurator = new (require('test/end-to-end/helpers/TestConfigurator'))();
const testConfig = require('config');
const {getTestLanguages} = require('../../helpers/GeneralHelpers');

const optionYes = '';
const optionNo = '-2';
const bilingualGOP = false;

Feature('GOP Multiple Executors E2E - EE No Journey');

Before(async () => {
    await TestConfigurator.initLaunchDarkly();
    await TestConfigurator.getBefore();
});

After(async () => {
    await TestConfigurator.getAfter();
});

getTestLanguages().forEach(language => {

    Scenario(TestConfigurator.idamInUseText(`${language.toUpperCase()} - Multiple Executors Journey - Main applicant EE no journey`), async ({I}) => {
        const taskListContent = language === 'en' ? taskListContentEn : taskListContentCy;
        await I.retry(2).createAUser(TestConfigurator);

        // Eligibility Task (pre IdAM)
        await I.startApplication(language);
        await I.selectDeathCertificate(language);
        await I.selectDeathCertificateInEnglish(language, optionNo);
        await I.selectDeathCertificateTranslation(language, optionYes);
        await I.selectDeceasedDomicile(language);
        const isEEEnabled = await TestConfigurator.checkFeatureToggle('probate-excepted-estates');
        if (isEEEnabled) {
            await I.selectEEDeceasedDod(language);
            await I.selectEEvalue(language);
        } else {
            await I.selectIhtCompleted(language, optionYes);
        }
        await I.selectPersonWhoDiedLeftAWill(language, optionYes);
        await I.selectOriginalWill(language, optionYes);
        await I.selectApplicantIsExecutor(language, optionYes);
        await I.selectMentallyCapable(language, optionYes);
        await I.startApply(language);

        // IdAM
        await I.authenticateWithIdamIfAvailable(language);

        // Dashboard
        await I.chooseApplication(language);

        // Deceased Task
        await I.selectATask(language, taskListContent.taskNotStarted);
        await I.chooseBiLingualGrant(language, optionNo);
        await I.enterDeceasedName(language, 'Deceased First Name', 'Deceased Last Name');
        await I.enterDeceasedDateOfBirth(language, '01', '01', '1950');
        await I.enterDeceasedDateOfDeath(language, '02', '01', '2022');
        await I.enterDeceasedAddress(language);

        await I.selectDiedEngOrWales(language, optionNo);
        await I.selectEnglishForeignDeathCert(language, optionNo);
        await I.selectForeignDeathCertTranslation(language, optionYes);

        await I.selectEEComplete(language, optionNo);
        await I.enterEEValue(language, 500000, 400000, 400000);
        await I.selectLateSpouseCivilPartner(language, optionYes);
        await I.selectUnusedAllowance(language, optionYes);
        await I.enterProbateEstateValues(language, 400000, 400000);

        await I.selectDeceasedAlias(language, optionNo);
        await I.selectDeceasedMarriedAfterDateOnWill(language, optionNo);
        const isWillConditionEnabled = await TestConfigurator.checkFeatureToggle('probate-will-condition');
        if (isWillConditionEnabled) {
            await I.selectWillDamage(language, optionYes, 'test');
            await I.selectWillDamageReason(language, optionYes, 'test');
            await I.selectWillDamageWho(language, optionYes, 'test', 'test');
            await I.selectWillDamageDate(language, optionYes, 2017);
        }

        await I.selectWillCodicils(language, optionYes);
        await I.selectWillNoOfCodicils(language, 1);

        if (isWillConditionEnabled) {
            await I.selectCodicilsDamage(language, optionYes, 'test');
            await I.selectCodicilsReason(language, optionYes, 'test');
            await I.selectCodicilsWho(language, optionYes, 'test', 'test');
            await I.selectCodicilsDate(language, optionYes, 2000);
            await I.selectWrittenWishes(language, optionYes, 'test');
        }

        // ExecutorsTask
        await I.selectATask(language, taskListContent.taskNotStarted);
        await I.enterApplicantName(language, 'Applicant First Name', 'Applicant Last Name');
        await I.selectNameAsOnTheWill(language, optionYes);
        await I.enterApplicantPhone(language);
        await I.enterAddressManually(language);

        //const totalExecutors = '7';
        const totalExecutors = '4';
        await I.enterTotalExecutors(language, totalExecutors);
        await I.enterExecutorNames(language, totalExecutors);
        await I.selectExecutorsAllAlive(language, optionNo);

        //const executorsWhoDiedList = ['2', '7']; // exec2 and exec7
        const executorsWhoDiedList = ['2']; // exec2
        let diedBefore = optionYes;
        await I.selectExecutorsWhoDied(executorsWhoDiedList);

        if (executorsWhoDiedList) {
            for (let i = 0; i < executorsWhoDiedList.length; i++) {
                const executorNum = executorsWhoDiedList[i];
                await I.selectExecutorsWhenDied(language, executorNum, diedBefore, executorsWhoDiedList[0] === executorNum);
                diedBefore = optionNo;
            }
        }

        await I.selectExecutorsApplying(language, optionYes);

        //const executorsApplyingList = ['3', '5']; // exec3 and exec5
        const executorsApplyingList = ['3']; // exec3
        await I.selectExecutorsDealingWithEstate(language, executorsApplyingList);

        //I.selectExecutorsWithDifferentNameOnWill(optionYes);
        await I.selectExecutorsWithDifferentNameOnWill(optionNo);
        //const executorsWithDifferentNameIdList = ['2']; // ie 1 is the HTML id for executor 3, 2 is the HTML id for executor 5
        //I.selectWhichExecutorsWithDifferentNameOnWill(executorsWithDifferentNameIdList);

        // const executorNumber = '5'; // 5 is the number in the name of the executor ie exec5
        // I.enterExecutorCurrentName(executorNumber);
        // I.enterExecutorCurrentNameReason(executorNumber, 'executor_alias_reason');

        for (let i = 1; i <= executorsApplyingList.length; i++) {
            await I.enterExecutorContactDetails();
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
                await I.selectExecutorRoles(language, executorNumber, answer, executorsAliveList[0] === executorNumber);

                if (powerReserved) {
                    await I.selectHasExecutorBeenNotified(language, optionYes);
                }

                powerReserved = false;
                answer = optionNo;
            }
        }

        // Complete Equality & Diversity Questionnaire
        if (TestConfigurator.equalityAndDiversityEnabled()) {
            await I.exitEqualityAndDiversity(language);
            await I.completeEqualityAndDiversity(language);
        }

        // Review and Confirm Task
        await I.selectATask(language, taskListContent.taskNotStarted);
        await I.seeSummaryPage(language, 'declaration');
        await I.acceptDeclaration(language, bilingualGOP);

        // Notify additional executors Dealing with estate
        await I.notifyAdditionalExecutors(language);
        await I.waitForText(taskListContent.introduction, testConfig.TestWaitForTextToAppear);

        //Retrieve the email urls for additional executors
        await I.amOnPage(testConfig.TestInviteIdListUrl);
        await I.waitForElement('pre');

        const grabIds = await I.grabTextFrom('pre');

        let idList = null;
        try {
            idList = JSON.parse(grabIds);
        } catch (err) {
            console.error(err.message);
        }
        console.log('idList:', idList);

        for (let i = 0; i < idList.ids.length; i++) {
            await I.amOnPage(testConfig.TestInvitationUrl + '/' + idList.ids[i], language);
            const signInOrProbatePageLocator = {xpath: '//*[@name="loginForm" or @id="main-content"]'};
            await I.waitForElement(signInOrProbatePageLocator, testConfig.TestWaitForTextToAppear);
            await I.amOnPage(testConfig.TestE2EFrontendUrl + '/pin');
            await I.waitForElement('pre');

            const grabPins = await I.grabTextFrom('pre'); // eslint-disable-line no-await-in-loop
            const pinList = JSON.parse(grabPins);

            await I.clickBrowserBackButton(); // eslint-disable-line no-await-in-loop

            await I.enterPinCode(pinList.pin.toString());
            await I.seeCoApplicantStartPage(language);

            await I.agreeDeclaration(optionYes);
            await I.seeAgreePage(language);
        }

        // IDAM
        await I.authenticateWithIdamIfAvailable(language, true);

        // Dashboard
        await I.chooseApplication(language);

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

        if (TestConfigurator.getUseGovPay() === 'true') {
            await I.seeGovUkPaymentPage(language);
            await I.seeGovUkConfirmPage(language);
        }

        await I.seePaymentStatusPage(language);

        // Thank You
        await I.seeThankYouPage(language);

    }).tag('@e2enightly')
        .tag('@e2enightly-pr')
        .retry(TestConfigurator.getRetryScenarios());
});
