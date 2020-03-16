'use strict';

const taskListContent = require('app/resources/en/translation/tasklist');
const TestConfigurator = new (require('test/end-to-end/helpers/TestConfigurator'))();
const optionYes = '';
const ihtOnline = '-2';
const optionNo = '-2';
const bilingualGOP = false;
const uploadingDocuments = false;

Feature('Intestacy spouse flow');

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
Scenario(TestConfigurator.idamInUseText('Intestacy Spouse Journey - Digital iht and death certificate uploaded'), (I) => {
    // set variables

    // Eligibility Task (pre IdAM)
    I.startApplication();

    // Probate Sceeners
    //I.selectDeathCertificate('No');
    // I.seeStopPage('deathCertificate');
    I.selectDeathCertificate(optionYes);

    //I.selectDeceasedDomicile('No');
    // I.seeStopPage('notInEnglandOrWales');
    I.selectDeceasedDomicile(optionYes);

    //I.selectIhtCompleted('No');
    // I.seeStopPage('ihtNotCompleted');
    I.selectIhtCompleted(optionYes);

    I.selectPersonWhoDiedLeftAWill(optionNo);

    // Intestacy Sceeners
    //I.selectDiedAfterOctober2014('No');
    //I.seeStopPage('notDiedAfterOctober2014');
    I.selectDiedAfterOctober2014(optionYes);

    //I.selectRelatedToDeceased('No');
    //I.seeStopPage('notRelated');
    I.selectRelatedToDeceased(optionYes);

    //I.selectOtherApplicants('Yes');
    //I.seeStopPage('otherApplicants');
    I.selectOtherApplicants(optionNo);
    //
    I.startApply();

    // IdAM
    I.authenticateWithIdamIfAvailable();

    // Dashboard
    I.chooseApplication();

    // Deceased Task
    I.selectATask(taskListContent.taskNotStarted);
    I.chooseBiLingualGrant();
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

    I.selectDeceasedMaritalStatus();

    // Executors Task
    I.selectATask(taskListContent.taskNotStarted);
    I.selectRelationshipToDeceased();
    I.enterAnyChildren(optionNo);
    I.enterApplicantName('ApplicantFirstName', 'ApplicantLastName');
    I.enterApplicantPhone();
    I.enterAddressManually();

    // Check your answers and declaration
    I.seeSummaryPage();

    // Review and Confirm Task
    I.selectATask(taskListContent.taskNotStarted);
    I.seeSummaryPage('declaration');
    I.acceptDeclaration(bilingualGOP);

    // Copies Task
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
    I.seeThankYouPage();
}).retry(TestConfigurator.getRetryScenarios());
