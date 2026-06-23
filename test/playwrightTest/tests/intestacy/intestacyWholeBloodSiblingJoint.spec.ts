import { test } from '../../fixtures/index.ts';
import { BasePage, getTestLanguages } from '../../pages/utility/basePage.ts';
import { Page, BrowserContext} from "@playwright/test";

import { TestConfigurator } from "../../pages/utility/testConfigurator.ts";
import ihtDataConfig from "../../data/ee/ihtData.json" with { type: "json" };
import applicantDetailConfig from "../../data/intestacy/sole/applicantDetails.json" with { type: "json" };
import deceasedDetailsConfig from "../../data/deceasedDetailsConfig.json" with { type: "json" };

const optionYes = ihtDataConfig.optionYes;
const optionNo = ihtDataConfig.optionNo;
const bilingualGOP = false;
const hmrcCode = ihtDataConfig.hmrcCode;

getTestLanguages().forEach(language => {
  test.describe('Intestacy whole-blood sibling joint application journey - IHT 400 @edge', () => {
    test.describe.configure({ mode: 'serial' });
    test.setTimeout(300000);
    test.use({ language });

    let testConfigurator: TestConfigurator;
    let context: BrowserContext;
    let page: Page;
    let basePage: BasePage;

    test.beforeEach(async () => {
      testConfigurator = new TestConfigurator();
      basePage = new BasePage(page, context, language);
      await testConfigurator.getBefore(); // creates unique user for this language
    });

    test.afterEach(async () => {
      await testConfigurator.getAfter(); // only deletes THIS language's user
    });

    test((`${language.toUpperCase()} Go to application task list page to complete deceased and applicant details`), async ({
      intestacyScreenerPage,
      apiCallback,
      signInPage,
      taskListPage,
      deceasedDetailsPage,
      applicantDetailsPage,
      coApplicantNotifyAndDeclarationPage,
      cyaAndDeclarationPage,
      paymentTaskPage
    }) => {
      const testConfigurator = new TestConfigurator();
      const scenarioName = `Intestacy whole-blood sibling co-applicant journey - IHT 400 - ${language}`;

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
      await intestacyScreenerPage.selectPersonWhoDiedLeftAWill(language, optionNo);

      // Intestacy Sceeners
      await intestacyScreenerPage.selectDiedAfterOctober2014(optionYes);
      await intestacyScreenerPage.selectRelatedToDeceased(language, applicantDetailConfig.relationshipSiblingOfDeceased);

      await intestacyScreenerPage.startApply(language);

      // IdAM
      await signInPage.authenticateWithIdamIfAvailable(language);

      // Deceased Task
      await basePage.logInfo(scenarioName, "Deceased Details Task", null);
      await taskListPage.selectATask(language, 'deceasedTask');
      await deceasedDetailsPage.chooseBiLingualGrant(optionNo);
      await deceasedDetailsPage.enterDeceasedDetails('Deceased First Name', 'Deceased Last Name');
      await deceasedDetailsPage.enterDobDetails(language, '01', '01', '1950');
      await deceasedDetailsPage.enterDodDetails(
        deceasedDetailsConfig.deceasedDodDay,
        deceasedDetailsConfig.deceasedDodMonth,
        deceasedDetailsConfig.deceasedDodYear
      );
      await deceasedDetailsPage.enterDeceasedAddress();

      await deceasedDetailsPage.selectDiedEngOrWales(optionNo);
      await deceasedDetailsPage.selectEnglishForeignDeathCert(language, optionNo);
      await deceasedDetailsPage.selectForeignDeathCertTranslation(language, optionYes);

      if (testConfigurator.getUseGovPay() === 'true') {
        await deceasedDetailsPage.enterGrossAndNet('400');
        await deceasedDetailsPage.selectHmrcLetterComplete(optionYes);
        await deceasedDetailsPage.enterHmrcCode(hmrcCode);
        await deceasedDetailsPage.enterProbateAssetValues('300000', '200000');
      } else {
        await deceasedDetailsPage.enterGrossAndNet('400');
         await deceasedDetailsPage.selectHmrcLetterComplete(optionYes);
        await deceasedDetailsPage.enterHmrcCode(hmrcCode);
        await deceasedDetailsPage.enterProbateAssetValues('500', '400');
      }

      await deceasedDetailsPage.selectAssetsOutsideEnglandWales(language, optionYes);
      await deceasedDetailsPage.enterValueAssetsOutsideEnglandWales('400000');

      await deceasedDetailsPage.selectDeceasedAlias(language, optionNo);
      await deceasedDetailsPage.selectDeceasedMaritalStatus(applicantDetailConfig.maritalStatusNotMarried);

      // Applicant Task
      await basePage.logInfo(scenarioName, "Applicant details task", null);
      await taskListPage.selectATask(language, 'applicantsTask');
      await applicantDetailsPage.selectRelationshipToDeceased(language, applicantDetailConfig.relationshipSiblingOfDeceased);
      await applicantDetailsPage.selectAnyLivingDescendants(optionNo);
      await applicantDetailsPage.selectAnyLivingParents(language, optionNo);

      await applicantDetailsPage.deceasedAdoptedIn(language, optionNo, 'sibling');
      await applicantDetailsPage.deceasedAdoptedOut(language, optionNo, 'sibling');

      await applicantDetailsPage.selectDeceasedSameParents(language, applicantDetailConfig.wholeBloodSiblingsOption);

      await applicantDetailsPage.mainApplicantAdoptedIn(language, optionNo, 'wholeBloodSibling');
      await applicantDetailsPage.mainApplicantAdoptedOut(language, optionNo, 'wholeBloodSibling');

      await applicantDetailsPage.anyOtherWholeSiblings(language, optionYes);
      await applicantDetailsPage.anyPredeceasedSiblings(language, applicantDetailConfig.optionSomeOfThem, 'whole');
      await applicantDetailsPage.anySurvivingNieceNephew(language, optionYes, 'whole');
      await applicantDetailsPage.anyNieceOrNephewOver18(language, optionYes, 'whole');
      await applicantDetailsPage.anySiblingsAbove18(language, optionYes, 'whole');

      await applicantDetailsPage.enterApplicantName(language, 'ApplicantFirstName', 'ApplicantLastName');
      await applicantDetailsPage.enterApplicantPhone(language);
      await applicantDetailsPage.enterAddressManually();

      //First co-applicant - whole-sibling
      await basePage.logInfo(scenarioName, "First co-applicant details", null);
      let coApplicantNumber = "1";
      await applicantDetailsPage.jointApplication(language, optionYes);
      await applicantDetailsPage.selectCoapplicantRelationship(applicantDetailConfig.coApplicantWholeBloodSibling, coApplicantNumber);
      await applicantDetailsPage.enterCoapplicantName(coApplicantNumber, applicantDetailConfig.firstCoApplicantName);
      await applicantDetailsPage.coApplicantAdoptedIn(coApplicantNumber, optionYes);
      await applicantDetailsPage.coApplicantAdoptionPlace(coApplicantNumber, optionYes);
      await applicantDetailsPage.enterCoApplicantEmail(coApplicantNumber, applicantDetailConfig.firstCoApplicantEmail);
      await applicantDetailsPage.enterCoApplicantAddress(coApplicantNumber);

      //Second co-applicant - whole-niece/nephew
      await basePage.logInfo(scenarioName, "Second co-applicant details", null);
      coApplicantNumber = "2";
      await applicantDetailsPage.jointApplication(language, optionYes);
      await applicantDetailsPage.selectCoapplicantRelationship(applicantDetailConfig.coApplicantWholeBloodNieceNephew, coApplicantNumber);
      await applicantDetailsPage.selectCoApplicantParentAlive(coApplicantNumber, optionYes);
      await applicantDetailsPage.enterCoapplicantName(coApplicantNumber, applicantDetailConfig.secondCoApplicantName);
      await applicantDetailsPage.coApplicantAdoptedIn(coApplicantNumber, optionNo);
      await applicantDetailsPage.coApplicantAdoptedOut(coApplicantNumber, optionNo);

      await applicantDetailsPage.enterCoApplicantEmail(coApplicantNumber, applicantDetailConfig.secondCoApplicantEmail);
      await applicantDetailsPage.enterCoApplicantAddress(coApplicantNumber);

      //Third co-applicant - whole-niece/nephew
      await basePage.logInfo(scenarioName, "Third co-applicant details", null);
      coApplicantNumber = "3";
      await applicantDetailsPage.jointApplication(language, optionYes);
      await applicantDetailsPage.selectCoapplicantRelationship(applicantDetailConfig.coApplicantWholeBloodNieceNephew, coApplicantNumber);
      await applicantDetailsPage.selectCoApplicantParentAlive(coApplicantNumber, optionYes);
      await applicantDetailsPage.enterCoapplicantName(coApplicantNumber, applicantDetailConfig.thirdCoApplicantName);
      await applicantDetailsPage.coApplicantAdoptedIn(coApplicantNumber, optionYes);
      await applicantDetailsPage.coApplicantAdoptionPlace(coApplicantNumber, optionYes);
      await applicantDetailsPage.enterCoApplicantEmail(coApplicantNumber, applicantDetailConfig.thirdCoApplicantEmail);
      await applicantDetailsPage.enterCoApplicantAddress(coApplicantNumber);

      await applicantDetailsPage.jointApplication(language, optionNo);

      if (testConfigurator.equalityAndDiversityEnabled()) {
        await applicantDetailsPage.exitEqualityAndDiversity(language);
        await applicantDetailsPage.completeEqualityAndDiversity(language, true);
      }

      // Check your answers and declaration
      await basePage.logInfo(scenarioName, "CYA and Legal Declaration - main applicant", null);
      await taskListPage.selectATask(language, 'reviewAndConfirmTask');
      await cyaAndDeclarationPage.seeSummaryPage(language, 'declaration');
      await cyaAndDeclarationPage.acceptDeclaration(language, bilingualGOP);

      // Notify additional executors Dealing with estate
      await basePage.logInfo(scenarioName, "CYA and Legal Declaration - co-applicants", null);
      await coApplicantNotifyAndDeclarationPage.notifyAdditionalExecutors(language, 'intestacyQuestion');
      await coApplicantNotifyAndDeclarationPage.notificationSent(language);

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
        await coApplicantNotifyAndDeclarationPage.seeCoApplicantStartPage(language, idList.ids[i]);
        await coApplicantNotifyAndDeclarationPage.coApplicantDeclarationPage2(
          deceasedDetailsConfig.deceasedDodDay,
          deceasedDetailsConfig.deceasedDodMonth,
          deceasedDetailsConfig.deceasedDodYear
        );
        await coApplicantNotifyAndDeclarationPage.agreeDeclaration(optionYes);
        await coApplicantNotifyAndDeclarationPage.seeAgreePage(language, 'intestacy');
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
