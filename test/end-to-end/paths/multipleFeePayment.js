/* eslint-disable no-undef */
'use strict';

const randomstring = require('randomstring');
const taskListContent = require('app/resources/en/translation/tasklist');
const commonContent = require('app/resources/en/translation/common');
const data = require('test/data/payments/multiple-fee-payment');
const TestConfigurator = new (require('test/end-to-end/helpers/TestConfigurator'))();
const emailId = randomstring.generate(9).toLowerCase()+'@example.com';

Feature('Multiple Executors flow');

Before(() => {
    TestConfigurator.createAUser(emailId);
});

After(() => {
    TestConfigurator.getAfter();
});

Scenario(TestConfigurator.idamInUseText('Multiple Executors Journey - Main applicant: 1st stage of completing application'), function* (I) {

    TestConfigurator.injectFormData(data, emailId);

    I.amOnPage('https://probate-frontend-aat.service.core-compute-aat.internal');
    I.signInWith(emailId, 'Probate123');

    // Review and confirm Task
    I.selectATask(taskListContent.taskNotStarted);
    I.seeSummaryPage('declaration');
    I.waitForNavigation();
    I.acceptDeclaration();
    I.waitForNavigation();
    I.click(commonContent.saveAndClose);
    I.waitForNavigation();
    I.click('sign back in');
    I.waitForNavigation();
    I.signInWith(emailId, 'Probate123');
    I.click(taskListContent.taskStarted);
    I.waitForNavigation();
    I.click(locate('a')
        .withAttr({href: '/other-executors-applying'})
        .withText(commonContent.change));
    I.waitForNavigation();
    I.selectExecutorsApplying('No');
    I.waitForNavigation();

    I.selectExecutorRoles('2', true, true);
    I.waitForNavigation();
    I.selectHasExecutorBeenNotified('Yes', '2');
    I.waitForNavigation();
    I.selectExecutorRoles('3', false, false);
    I.waitForNavigation();
    I.click(commonContent.signOut);
    I.waitForNavigation();
});

Scenario(TestConfigurator.idamInUseText('Continuation of Main applicant journey: final stage of application'), function* (I) {

    I.amOnPage('https://probate-frontend-aat.service.core-compute-aat.internal');
    I.signInWith(emailId, 'Probate123');

    // Review and confirm Task
    I.selectATask(taskListContent.taskNotStarted);
    I.seeSummaryPage('declaration');
    I.waitForNavigation();
    I.acceptDeclaration();
    I.waitForNavigation();

    //Extra Copies Task
    I.selectATask(taskListContent.taskNotStarted);
    I.enterUkCopies('1');
    I.waitForNavigation();
    I.selectOverseasAssets();
    I.waitForNavigation();
    I.enterOverseasCopies('1');
    I.waitForNavigation();
    I.seeCopiesSummary();
    I.waitForNavigation();

    //PaymentTask
    I.selectATask(taskListContent.taskNotStarted);
    I.seePaymentBreakdownPage('1', '1', '8000');
    I.seeGovUkPaymentPage();
    I.seeGovUkConfirmPage();
    I.seePaymentStatusPage();

    // Send Documents Task
    I.seeDocumentsPage();

    // Thank You - Application Complete Task
    I.seeCurrentUrlEquals('https://probate-frontend-aat.service.core-compute-aat.internal/thankyou');
});
