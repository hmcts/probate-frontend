'use strict';

const taskListContent = require('app/resources/en/translation/tasklist');
const TestConfigurator = new (require('test/end-to-end/helpers/TestConfigurator'))();
const testConfig = require('test/config.js');
const paymentType = testConfig.paymentType;

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
xScenario(TestConfigurator.idamInUseText('Intestacy Journey'), function (I) {

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

    I.selectPersonWhoDiedLeftAWill('No');

    I.selectDiedAfterOctober2014('No');
    I.seeStopPage('notDiedAfterOctober2014');
    I.selectDiedAfterOctober2014('Yes');

    I.selectRelatedToDeceased('No');
    I.seeStopPage('notRelated');
    I.selectRelatedToDeceased('Yes');

    I.selectOtherApplicants('Yes');
    I.seeStopPage('otherApplicants');
    I.selectOtherApplicants('No');

    I.startApply();

    // IdAM
    I.authenticateWithIdamIfAvailable();

    // Deceased Task
    I.selectATask(taskListContent.taskNotStarted);
    I.enterDeceasedDetails('Deceased First Name', 'Deceased Last Name', '01', '01', '1950', '01', '01', '2017');
    I.enterDeceasedAddress();
    I.selectDocumentsToUpload();
    I.selectInheritanceMethodPaper();

    if (TestConfigurator.getUseGovPay() === 'true') {
        I.enterGrossAndNet(paymentType.form, paymentType.pay.gross, '200000');
    } else {
        I.enterGrossAndNet(paymentType.form, paymentType.noPay.gross, paymentType.noPay.net);
    }

    I.selectAssetsOutsideEnglandWales('Yes');
    I.enterValueAssetsOutsideEnglandWales('400000');
    I.selectDeceasedAlias('Yes');
    I.selectOtherNames('2');
    I.selectDeceasedMaritalStatus('Divorced');
    I.selectDeceasedDivorcePlace('No');
    I.seeStopPage('divorcePlace');
    I.selectDeceasedDivorcePlace('Yes');

});
