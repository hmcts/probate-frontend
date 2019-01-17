/* eslint-disable no-undef */
'use strict';

const randomstring = require('randomstring');
const taskListContent = require('app/resources/en/translation/tasklist');
const commonContent = require('app/resources/en/translation/common');
const data = require('test/data/multiple-executors-section-3');
const TestConfigurator = new (require('test/end-to-end/helpers/TestConfigurator'))();
let emailId;

Feature('Cancel Multiple Executors Flow');

After(() => {
    TestConfigurator.getAfter();
});

Scenario(TestConfigurator.idamInUseText('Multiple Executors Journey - Main applicant: 1st stage of completing application'), function* (I) {

    emailId = randomstring.generate(9).toLowerCase()+'@example.com';
    TestConfigurator.createAUser(emailId);
    TestConfigurator.injectFormData(data, emailId);

    I.amOnPage('https://probate-frontend-aat.service.core-compute-aat.internal');
    I.signInWith(emailId, 'Probate123');

    // Review and confirm Task
    I.selectATask(taskListContent.taskNotStarted);
    I.seeSummaryPage('declaration');
    I.acceptDeclaration();
    I.awaitNavigation(() => I.click(commonContent.saveAndClose));
    I.awaitNavigation(() => I.click('sign back in'));

    I.signInWith(emailId, 'Probate123');
    I.awaitNavigation(() => I.click(taskListContent.taskStarted));

    I.awaitNavigation(() => I.click(locate('a')
        .withAttr({href: '/other-executors-applying'})
        .withText(commonContent.change)));
    I.selectExecutorsApplying('No');
    I.selectExecutorRoles('2', true, true);
    I.selectHasExecutorBeenNotified('Yes', '2');
    I.selectExecutorRoles('3', false, false);
    I.awaitNavigation(() => I.click(commonContent.signOut));
}).retry(TestConfigurator.getRetryScenarios());

Scenario(TestConfigurator.idamInUseText('Continuation of Main applicant journey: final stage of application'), function* (I) {

    I.amOnPage('https://probate-frontend-aat.service.core-compute-aat.internal');
    I.signInWith(emailId, 'Probate123');

    // Review and confirm Task
    I.selectATask(taskListContent.taskNotStarted);
    I.seeSummaryPage('declaration');
    I.acceptDeclaration();

    //Extra Copies Task
    I.selectATask(taskListContent.taskNotStarted);
    I.enterUkCopies('1');
    I.selectOverseasAssets();
    I.enterOverseasCopies('1');
    I.seeCopiesSummary();

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
