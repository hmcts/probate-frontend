/* eslint-disable no-undef */
'use strict';

const taskListContent = require('app/resources/en/translation/tasklist');
const data = require('test/data/payments/fee-payment');
const TestConfigurator = new (require('test/end-to-end/helpers/TestConfigurator'))();
let emailId;

Feature('Fee Payment');

Before(() => {
    TestConfigurator.getBefore();
});

After(() => {
    TestConfigurator.getAfter();
});

Data(TestConfigurator.createFeeInfoTable()).Scenario('Check multiple application fees', function* (I, current) {
    data.copies.uk = current.noUKCopies;
    data.copies.overseas = current.noOverseasCopies;
    data.iht.grossValue = current.grossValue;
    data.iht.netValue = current.netValue;

    emailId = process.env.testCitizenEmail;
    TestConfigurator.injectFormData(data, emailId);

    I.amOnPage('https://probate-frontend-aat.service.core-compute-aat.internal');

    // IdAM
    I.authenticateWithIdamIfAvailable();

    //PaymentTask
    I.selectATask(taskListContent.taskNotStarted);
    I.seePaymentBreakdownPage(current.noUKCopies, current.noOverseasCopies, current.netValue);
    if (current.noUKCopies > 0 || current.noOverseasCopies > 0 || current.netValue > 5000) {
        I.seeGovUkPaymentPage();
        I.seeGovUkConfirmPage();
    }
    I.seePaymentStatusPage();

    // Send Documents Task
    I.seeDocumentsPage();

    // Thank You - Application Complete Task
    I.seeThankYouPage();
});

// Data(TestConfigurator.createFeeInfoTableFor1Copy()).Scenario('Check can pay after cancel payment', function* (I, current) {
//     data.copies.uk = current.noUKCopies;
//     data.copies.overseas = current.noOverseasCopies;
//     data.iht.grossValue = current.grossValue;
//     data.iht.netValue = current.netValue;

//     emailId = process.env.testCitizenEmail;
//     TestConfigurator.injectFormData(data, emailId);

//     I.amOnPage('https://probate-frontend-aat.service.core-compute-aat.internal');

//     // IdAM
//     I.authenticateWithIdamIfAvailable();

//     //PaymentTask
//     I.selectATask(taskListContent.taskNotStarted);
//     I.seePaymentBreakdownPage(current.noUKCopies, current.noOverseasCopies, current.netValue, false);
//     pause();
//     I.waitForNavigationToComplete('input[value="Cancel payment"]');
//     I.waitForNavigationToComplete(`input[value="${taskListContent.taskStarted}"]`);
//     I.seePaymentBreakdownPage(current.noUKCopies, current.noOverseasCopies, current.netValue, true);
//     I.seeGovUkPaymentPage();
//     I.seeGovUkConfirmPage();
//     I.seePaymentStatusPage();

//     // Send Documents Task
//     I.seeDocumentsPage();

//     // Thank You - Application Complete Task
//     I.seeThankYouPage();
// });
