'use strict';

const taskListContent = require('app/resources/en/translation/tasklist');
const TestConfigurator = new (require('test/end-to-end/helpers/TestConfigurator'))();

Feature('Intestacy flow');

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
Scenario(TestConfigurator.idamInUseText('Intestacy Journey'), function (I) {

    // Eligibility Task (pre IdAM)
    I.startApplication();

    // Probate and Intestacy Sceeners
    I.selectDeathCertificate('Yes');
    I.selectDeceasedDomicile('Yes');
    I.selectIhtCompleted('Yes');
    I.selectPersonWhoDiedLeftAWill('No');

    // Intestacy Sceeners
    I.selectDiedAfterOctober2014('Yes');
    I.selectRelatedToDeceased('Yes');
    I.selectOtherApplicants('No');

    I.startApply();

    // IdAM
    I.authenticateWithIdamIfAvailable();

    // Deceased Task
    I.selectATask(taskListContent.taskNotStarted);
    I.enterDeceasedDetails('Deceased First Name', 'Deceased Last Name', '01', '01', '1950', '01', '01', '2017');
    I.enterDeceasedAddress();
    I.selectDocumentsToUpload();
    I.selectInheritanceMethodPaper('Online');
    I.enterIHTIdentifier();

    if (TestConfigurator.getUseGovPay() !== 'true') {
        I.enterEstateValue('300000', '200000');
    } else {
        I.enterEstateValue('500', '400');
    }

    I.selectAssetsOutsideEnglandWales('Yes');
    I.enterValueAssetsOutsideEnglandWales('400000');
    I.selectDeceasedAlias('No');
    I.selectDeceasedMaritalStatus('Married');

    // Executors Task
    I.selectATask(taskListContent.taskNotStarted);
    I.selectRelationshipToDeceased('SpousePartner');
    I.enterAnyChildren('No');
    I.enterApplicantName('ApplicantFirstName', 'ApplicantLastName');
    I.enterApplicantPhone();
    I.enterAddressManually();

    // Check your answers and declaration
    I.seeSummaryPage('declaration');
    I.acceptDeclaration();

    // Copies Task
    I.selectATask(taskListContent.taskNotStarted);
    pause();
});
