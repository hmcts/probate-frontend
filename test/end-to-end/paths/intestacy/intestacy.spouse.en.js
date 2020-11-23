'use strict';

const taskListContent = require('app/resources/en/translation/tasklist');
const TestConfigurator = new (require('test/end-to-end/helpers/TestConfigurator'))();

const optionYes = '';
const optionNo = '-2';
const ihtOnline = '-2';
const maritalStatusMarried = '';
const spousePartner = '';
const uploadingDocuments = false;
const bilingualGOP = false;

Feature('GOP Intestacy spouse journey...');

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

// eslint-disable-next-line no-undef
Scenario(TestConfigurator.idamInUseText('GOP -Intestacy Spouse Journey - Digital iht and death certificate uploaded'), async (I) => {
    // Eligibility Task (pre IdAM)
    await I.startApplication();

    // Probate Sceeners
    await I.selectDeathCertificate(optionYes);
    await I.selectDeceasedDomicile(optionYes);
    await I.selectIhtCompleted(optionYes);
    await I.selectPersonWhoDiedLeftAWill(optionNo);

    // Intestacy Sceeners
    await I.selectDiedAfterOctober2014(optionYes);
    await I.selectRelatedToDeceased(optionYes);
    await I.selectOtherApplicants(optionNo);

    await I.startApply();

    // IdAM
    await I.authenticateWithIdamIfAvailable();

    // Dashboard
    await I.chooseApplication();

    // Deceased Task
    await I.selectATask(taskListContent.taskNotStarted);
    await I.chooseBiLingualGrant(optionNo);
    await I.enterDeceasedDetails('Deceased First Name', 'Deceased Last Name', '01', '01', '1950', '01', '01', '2017');
    await I.enterDeceasedAddress();
    await I.selectDocumentsToUpload(uploadingDocuments);
    await I.selectInheritanceMethod(ihtOnline);
    await I.enterIHTIdentifier();
    if (TestConfigurator.getUseGovPay() === 'true') {
        await I.enterEstateValue('300000', '200000');
    } else {
        await I.enterEstateValue('500', '400');
    }
    await I.selectAssetsOutsideEnglandWales(optionYes);
    await I.enterValueAssetsOutsideEnglandWales('400000');
    await I.selectDeceasedAlias(optionNo);
    await I.selectDeceasedMaritalStatus(maritalStatusMarried);

    // Executors Task
    await I.selectATask(taskListContent.taskNotStarted);
    await I.selectRelationshipToDeceased(spousePartner);
    await I.enterAnyChildren(optionNo);
    await I.enterApplicantName('ApplicantFirstName', 'ApplicantLastName');
    await I.enterApplicantPhone();
    await I.enterAddressManually();
    if (TestConfigurator.equalityAndDiversityEnabled()) {
        await I.exitEqualityAndDiversity();
        await I.completeEqualityAndDiversity();
    }

    // Check your answers and declaration
    await I.selectATask(taskListContent.taskNotStarted);
    await I.seeSummaryPage('declaration');
    await I.acceptDeclaration(bilingualGOP);

    // Copies Task
    await I.selectATask(taskListContent.taskNotStarted);
    if (TestConfigurator.getUseGovPay() === 'true') {
        await I.enterUkCopies('5');
        await I.selectOverseasAssets(optionNo);
    } else {
        await I.enterUkCopies('0');
        await I.selectOverseasAssets();
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
