import { test } from '../../fixtures/index.ts';
import { BasePage, getTestLanguages } from '../../pages/utility/basePage.ts';

import { TestConfigurator } from "../../pages/utility/testConfigurator.ts";
import ihtDataConfig from "../../data/ee/ihtData.json" with { type: "json" };
import deceasedDetailsConfig from "../../data/deceasedDetailsConfig.json" with { type: "json" };
import {BrowserContext} from "@playwright/test";

const optionYes = ihtDataConfig.optionYes;
const optionNo = ihtDataConfig.optionNo;
const bilingualGOP = false;

getTestLanguages().forEach(language => {
  test.describe('GOP Multiple Executors journey - EE Yes', () => {
    test.use({ language });
    let testConfigurator: TestConfigurator;
    let context: BrowserContext;
    let basePage: BasePage;

    test.beforeEach(async ({ browser }) => {
      testConfigurator = new TestConfigurator();
      await testConfigurator.getBefore(); // creates unique user for this language
      context = await browser.newContext({ locale: language });
      await context.newPage();
    });

    test.afterEach(async () => {
      await testConfigurator.getAfter(); // only deletes THIS language's user
      await context.close();
    });

    test((`${language.toUpperCase()} Go to application task list page to complete deceased and applicant details`),
      async ({
               intestacyScreenerPage,
               gopScreenerPage,
               apiCallback,
               signInPage,
               taskListPage,
               deceasedDetailsPage,
               applicantDetailsPage,
               executorDetailsPage,
               cyaAndDeclarationPage,
               coApplicantNotifyAndDeclarationPage,
               paymentTaskPage
      }) => {
      const testConfigurator = new TestConfigurator();
        const scenarioName = `GOP co-executor journey - EE Yes - ${language}`;

      await apiCallback.createAUser(testConfigurator);

      // Eligibility Task (pre IdAM)
      await basePage.logInfo(scenarioName, "Intestacy screener questions", null);
      await intestacyScreenerPage.startApplication(language);

      // Probate Sceeners
      await intestacyScreenerPage.selectDeathCertificate(language);

      await intestacyScreenerPage.selectDeathCertificateInEnglish(language, optionNo);
      await intestacyScreenerPage.selectDeathCertificateTranslation(language, optionYes);

      await intestacyScreenerPage.selectDeceasedDomicile(language);
      await intestacyScreenerPage.selectEEDeceasedDod(language, optionNo);
      await intestacyScreenerPage.selectIhtCompleted(language, optionYes);
      await intestacyScreenerPage.selectPersonWhoDiedLeftAWill(language, optionYes);

      // GOP Sceeners
      await gopScreenerPage.selectOriginalWill(language, optionYes);
      await gopScreenerPage.selectApplicantIsExecutor(language, optionYes);
      await gopScreenerPage.selectMentallyCapable(language, optionYes);

      await intestacyScreenerPage.startApply(language);

      // IdAM
      await signInPage.authenticateWithIdamIfAvailable(language);

      // Deceased Task
      await basePage.logInfo(scenarioName, "Deceased Details Task", null);
      await taskListPage.selectATask(language, 'deceasedTask');
      await deceasedDetailsPage.chooseBiLingualGrant(optionNo);
      await deceasedDetailsPage.enterDeceasedDetails('Deceased First Name', 'Deceased Last Name');
      await deceasedDetailsPage.enterDeceasedNameOnWill(language, optionYes);
      await deceasedDetailsPage.enterDobDetails(language, '01', '01', '1950');
      await deceasedDetailsPage.enterDodDetails(
        deceasedDetailsConfig.deceasedDodDay,
        deceasedDetailsConfig.deceasedDodMonth,
        deceasedDetailsConfig.deceasedDodYearEE
      );
      await deceasedDetailsPage.enterDeceasedAddress();

      await deceasedDetailsPage.selectDiedEngOrWales(optionNo);
      await deceasedDetailsPage.selectEnglishForeignDeathCert(language, optionNo);
      await deceasedDetailsPage.selectForeignDeathCertTranslation(language, optionYes);

      await deceasedDetailsPage.selectEEComplete(optionYes);
      await deceasedDetailsPage.selectSubmittedToHmrc(optionYes);
      await deceasedDetailsPage.selectHmrcLetterComplete(optionYes);
      await deceasedDetailsPage.enterHmrcCode(ihtDataConfig.hmrcCode);
      await deceasedDetailsPage.enterProbateAssetValues('400000', '400000');

      await deceasedDetailsPage.selectDeceasedAliasGop(language, optionNo);
      await deceasedDetailsPage.selectDeceasedMarriedAfterDateOnWill(optionNo)
      await deceasedDetailsPage.selectWillDamage(optionYes, 'test');
      await deceasedDetailsPage.selectWillDamageReason(optionYes, 'test');
      await deceasedDetailsPage.selectWillDamageWho(optionYes, 'test', 'test');
      await deceasedDetailsPage.selectWillDamageDate(optionYes, '2017');

      await deceasedDetailsPage.selectWillCodicils(optionYes);
      await deceasedDetailsPage.selectWillNoOfCodicils('1');

      await deceasedDetailsPage.selectCodicilsDamage(optionYes, 'test');
      await deceasedDetailsPage.selectCodicilsReason(optionYes, 'test');
      await deceasedDetailsPage.selectCodicilsWho(optionYes, 'test', 'test');
      await deceasedDetailsPage.selectCodicilsDate(optionYes, '2000');
      await deceasedDetailsPage.selectWrittenWishes(optionYes);

      // ExecutorsTask
      await basePage.logInfo(scenarioName, "Executor details task", null);
      await taskListPage.selectATask(language, 'executorsTask');
      await applicantDetailsPage.enterApplicantName(language, 'Applicant First Name', 'Applicant Last Name');
      await executorDetailsPage.selectNameAsOnTheWill(optionYes);
      await applicantDetailsPage.enterApplicantPhone(language);
      await applicantDetailsPage.enterAddressManually();
      await executorDetailsPage.checkWillCodicils();

      const totalExecutors = '8';
      // const totalExecutors = '4';
      await executorDetailsPage.enterExecutorNamed(totalExecutors, optionYes);
      await executorDetailsPage.selectAnyExecutorsDied(optionYes);

      await basePage.logInfo(scenarioName, "Co-executors details", null);
      const executorsWhoDiedList = ['2', '7']; // exec2 and exec7
      //const executorsWhoDiedList = ['2']; // exec2
      let diedBefore = optionYes;
      await executorDetailsPage.selectExecutorsWhoDied(executorsWhoDiedList);

        if (executorsWhoDiedList) {
          for (let i = 0; i < executorsWhoDiedList.length; i++) {
            const executorNum = executorsWhoDiedList[i];
            await executorDetailsPage.selectExecutorsWhenDied(executorNum, diedBefore, executorsWhoDiedList[0] === executorNum);
            diedBefore = optionNo;
          }
        }

        const executorsApplyingList = ['3', '4', '5']; // exec1, exec3 and exec5
        await executorDetailsPage.selectExecutorsDealingWithEstate(executorsApplyingList);

        for (let i = 1; i <= executorsApplyingList.length; i++) {
          await executorDetailsPage.selectExecutorsWithDifferentNameOnWill(optionNo, i);
        }

        for (let i = 1; i <= executorsApplyingList.length; i++) {
          await executorDetailsPage.enterExecutorContactDetails(i);
          await executorDetailsPage.enterExecutorManualAddress(i);
        }

        const executorsAliveList = ['4', '8'];
        let powerReserved = false;
        let answer = optionNo;

        if (executorsAliveList) {
          for (let i = 0; i < executorsAliveList.length; i++) {
            const executorNumber = executorsAliveList[i];
            await executorDetailsPage.selectExecutorRoles(executorNumber, answer, executorsAliveList[0] === executorNumber);

            if (powerReserved) {
              await executorDetailsPage.selectHasExecutorBeenNotified(optionYes);
            }

            powerReserved = true;
            answer = optionYes;
          }
        }

      if (testConfigurator.equalityAndDiversityEnabled()) {
        await applicantDetailsPage.exitEqualityAndDiversity(language);
        await applicantDetailsPage.completeEqualityAndDiversity(language);
      }

      // Check your answers and declaration
      await basePage.logInfo(scenarioName, "CYA and Legal Declaration - main executor", null);
      await taskListPage.selectATask(language, 'reviewAndConfirmTask');
      await cyaAndDeclarationPage.seeSummaryPage(language, 'declaration');
      await cyaAndDeclarationPage.acceptDeclaration(language, bilingualGOP);

      // Notify additional executors Dealing with estate
      await basePage.logInfo(scenarioName, "CYA and Legal Declaration - co-executors", null);
      await coApplicantNotifyAndDeclarationPage.notifyAdditionalExecutors(language);
      // await coApplicantNotifyAndDeclarationPage.notificationSent(language);

      //Retrieve the email urls for additional executors
      const grabIds = await coApplicantNotifyAndDeclarationPage.getIdList();

      let idList = null;
      try {
        idList = JSON.parse(grabIds);
      } catch (err) {
        console.error(err.message);
      }
      console.log('idList:', idList);

      for (let i = 0; i < idList.ids.length; i++) {
        await coApplicantNotifyAndDeclarationPage.seeCoExecutorLaunchPage(idList.ids[i]);
        await coApplicantNotifyAndDeclarationPage.seeCoExecutorStartPage(language);
        await coApplicantNotifyAndDeclarationPage.agreeDeclaration(optionYes);
        await coApplicantNotifyAndDeclarationPage.seeAgreePage(language);
      }

      // IDAM
      await signInPage.authenticateWithIdamIfAvailable(language, true);

      // Dashboard
      await taskListPage.chooseApplication(language);

      // Payment Task
      await basePage.logInfo(scenarioName, "Payment details task", null);
      await taskListPage.selectATask(language, 'paymentTask');

      if (testConfigurator.getUseGovPay() === 'true') {
        await paymentTaskPage.enterUkCopies(language, '5');
        await paymentTaskPage.selectOverseasAssets(optionYes);
        await paymentTaskPage.enterOverseasCopies('2');
      } else {
        await paymentTaskPage.enterUkCopies(language, '0');
        await paymentTaskPage.selectOverseasAssets(optionNo);
      }
      await paymentTaskPage.seeCopiesSummary(language);
      await paymentTaskPage.seePaymentBreakdownPage(language);
      if (testConfigurator.getUseGovPay() === 'true') {
        await paymentTaskPage.seeGovUkPaymentPage(language);
        await paymentTaskPage.seeGovUkConfirmPage(language);
      }

      // Thank You
      const caseId = await paymentTaskPage.seeThankYouPage(language);
      await basePage.logInfo(scenarioName, "Application submitted successfully", `${caseId}`);
    });
  });
});
