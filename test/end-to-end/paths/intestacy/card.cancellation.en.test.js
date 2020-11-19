'use strict';

const taskListContent = require('app/resources/en/translation/tasklist');
const TestConfigurator = new (require('test/end-to-end/helpers/TestConfigurator'))();

const optionYes = '';
const optionNo = '-2';
const ihtOnline = '-2';
const maritalStatusMarried = '';
const spouseOfDeceased = '';
const bilingualGOP = false;
const uploadingDocuments = false;

Feature('Grant Of Probate Intestacy negative scenario E2E Tests...');

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
Scenario(TestConfigurator.idamInUseText('GOP -Intestacy Spouse Journey - Cancel Payment and Continue again'), function (I) {

    // Eligibility Task (pre IDAM)
    I.startApplication();

    // Probate Sceeners
    I.selectDeathCertificate(optionYes);
    I.selectDeceasedDomicile(optionYes);
    I.selectIhtCompleted(optionYes);
    I.selectPersonWhoDiedLeftAWill(optionNo);

    // Intestacy Sceeners
    I.selectDiedAfterOctober2014(optionYes);
    I.selectRelatedToDeceased(optionYes);
    I.selectOtherApplicants(optionNo);

    I.startApply();

    // IDAM
    I.authenticateWithIdamIfAvailable();

    // Dashboard
    I.chooseApplication();

    // Deceased Task
    I.selectATask(taskListContent.taskNotStarted);
    I.chooseBiLingualGrant(optionNo);
    I.enterDeceasedDetails('Deceased First Name', 'Deceased Last Name', '01', '01', '1950', '01', '01', '2017');
    I.enterDeceasedAddress();
    I.selectDocumentsToUpload(uploadingDocuments);
    I.selectInheritanceMethod(ihtOnline);
    I.enterIHTIdentifier();

    if (TestConfigurator.getUseGovPay() === 'true') {
        I.enterEstateValue('300000', '200000');
    } else {
        I.enterEstateValue('500', '400');
    }

    I.selectAssetsOutsideEnglandWales(optionYes);
    I.enterValueAssetsOutsideEnglandWales('400000');
    I.selectDeceasedAlias(optionNo);
    I.selectDeceasedMaritalStatus(maritalStatusMarried);

    // Executors Task
    I.selectATask(taskListContent.taskNotStarted);
    I.selectRelationshipToDeceased(spouseOfDeceased);
    I.enterAnyChildren(optionNo);
    I.enterApplicantName('ApplicantFirstName', 'ApplicantLastName');
    I.enterApplicantPhone();
    I.enterAddressManually();
    if (TestConfigurator.equalityAndDiversityEnabled()) {
        I.exitEqualityAndDiversity();
        I.completeEqualityAndDiversity();
    }

    // Check your answers and declaration
    I.selectATask(taskListContent.taskNotStarted);
    I.seeSummaryPage('declaration');
    I.acceptDeclaration(bilingualGOP);

    // Copies Task
    I.selectATask(taskListContent.taskNotStarted);

    if (TestConfigurator.getUseGovPay() === 'true') {
        I.enterUkCopies('5');
        I.selectOverseasAssets(optionNo);
    } else {
        I.enterUkCopies('0');
        I.selectOverseasAssets(optionNo);
    }
    I.seeCopiesSummary();

    // Payment Task
    I.selectATask(taskListContent.taskNotStarted);
    I.seePaymentBreakdownPage();
    if (TestConfigurator.getUseGovPay() === 'true') {
        I.seeGovUkPaymentPage();
        I.cancelPayment();
        I.seeCancellationStatusPage();
        I.seePaymentBreakdownPage();
        I.seeGovUkPaymentPage();
        I.seeGovUkConfirmPage();
    }
    I.seePaymentStatusPage();

    // Send Documents Task
    I.seeDocumentsPage();

    // Thank You
    I.seeThankYouPage();
}).retry(TestConfigurator.getRetryScenarios());
