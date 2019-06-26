'use strict';

const taskListContent = require('app/resources/en/translation/tasklist');
const TestConfigurator = new (require('test/end-to-end/helpers/TestConfigurator'))();

Feature('Intestacy child flow');

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
Scenario(TestConfigurator.idamInUseText('Intestacy Child Journey - Digital iht and death certificate uploaded'), function (I) {

    // Eligibility Task (pre IdAM)
    I.startApplication();

    // Probate Sceeners
    I.selectDeathCertificate('No');
    I.seeStopPage('deathCertificate');
    I.selectDeathCertificate('Yes');

    I.selectDeceasedDomicile('No');
    I.seeStopPage('notInEnglandOrWales');
    I.selectDeceasedDomicile('Yes');

    I.selectIhtCompleted('No');
    I.seeStopPage('ihtNotCompleted');
    I.selectIhtCompleted('Yes');

    I.selectPersonWhoDiedLeftAWill('No');

    // Intestacy Sceeners
    I.selectDiedAfterOctober2014('No');
    I.seeStopPage('notDiedAfterOctober2014');
    I.selectDiedAfterOctober2014('Yes');

    I.selectRelatedToDeceased('No');
    I.seeStopPage('notRelated');
    I.selectRelatedToDeceased('Yes');

    I.selectOtherApplicants('Yes');
    I.seeStopPage('otherApplicants');
    I.selectOtherApplicants('No');
    //
    I.startApply();

    // IdAM
    I.authenticateWithIdamIfAvailable();

    // Deceased Task
    I.selectATask(taskListContent.taskNotStarted);
    I.enterDeceasedDetails('Deceased First Name', 'Deceased Last Name', '01', '01', '1950', '01', '01', '2017');
    I.enterDeceasedAddress();
    I.selectDocumentsToUpload(true);
    I.selectInheritanceMethodPaper('Online');
    I.enterIHTIdentifier();

    if (TestConfigurator.getUseGovPay() === 'true') {
        I.enterEstateValue('300000', '200000');
    } else {
        I.enterEstateValue('500', '400');
    }

    I.selectAssetsOutsideEnglandWales('Yes');
    I.enterValueAssetsOutsideEnglandWales('400000');
    I.selectDeceasedAlias('No');
    I.selectDeceasedMaritalStatus('NotMarried');

    // Executors Task
    I.selectATask(taskListContent.taskNotStarted);
    I.selectRelationshipToDeceased('Child');
    I.enterAnyOtherChildren('No');
    I.enterApplicantName('ApplicantFirstName', 'ApplicantLastName');
    I.enterApplicantPhone();
    I.enterAddressManually();

    // Check your answers and declaration
    I.seeSummaryPage('declaration');
    I.acceptDeclaration();

    // Copies Task
    I.selectATask(taskListContent.taskNotStarted);

    if (TestConfigurator.getUseGovPay() === 'true') {
        I.enterUkCopies('5');
        I.selectOverseasAssets();
        I.enterOverseasCopies('7');
    } else {
        I.enterUkCopies('0');
        I.selectOverseasAssets();
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
});
