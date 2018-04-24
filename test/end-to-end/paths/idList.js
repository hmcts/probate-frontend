const scenario = 'End-to-end journey - Multiple Executors';
const taskListContent = require('app/resources/en/translation/tasklist.json');
const TestConfigurator = new (require('test/end-to-end/helpers/TestConfigurator'))(scenario);
const {forEach, head, size} = require('lodash');
const testConfig = require('test/config.js');

let grabIds;

Feature('Multiple Executor flow');

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


Scenario(TestConfigurator.getScenarioName(), function* (I) {

    // let ids = '{"ids":["deceased-first-name-deceased-last-name-f365b2e6-3806-450f-931b-36557bde451c","deceased-first-name-deceased-last-name-7eaf7c06-8cea-4f40-a147-cc5b1ac43df0"]}';
    //
    // let jsonObject = JSON.parse(ids);
    //
    // console.log('size>>>',size(jsonObject.ids));
    //
    // forEach(jsonObject.ids, id => {
    //         console.log(id);
    //        });
    //
    // I.amOnPage(testConfig.TestInvitiationUrl + '/deceased_first_names-deceased_last_names-3c2288e8-f819-4455-8da1-5210eb25377f');
    // I.amOnPage('/pin');
    // pause();
    // IDAM
    I.authenticateWithIdamIfAvailable();

    // EligibilityTask

    I.startApplication();

    I.selectATask(taskListContent.taskNotStarted);
    I.selectPersonWhoDiedLeftAWill();

    I.selectOriginalWill();
    I.selectAndEnterWillDate('01', '01', '1970');
    //I.selectWillCodicils('Yes');
    I.selectWillCodicils('no');
    //I.selectWillNoOfCodicils('3');
    //I.selectAndEnterCodicilsDate('02', '02', '2010');
    I.selectIhtCompleted();
    I.selectInheritanceMethodPaper();

    if (TestConfigurator.isFullPaymentEnvironment()) {
        I.enterGrossAndNet('205', '600000', '300000');
    } else {
        I.enterGrossAndNet('205', '500', '400');
    }

    I.selectApplicantIsExecutor();


    // ExecutorsTask
    //
    I.selectATask(taskListContent.taskNotStarted);
    I.enterApplicantName('Applicant First Name', 'Applicant Last Name');
    I.selectNameAsOnTheWill();
    I.enterApplicantPhone();
    I.enterAddressManually();

    const totalExecutors = '7';
    I.enterTotalExecutors(totalExecutors);
    I.enterExecutorNames(totalExecutors);

    I.selectExecutorsAllAlive('No');

    const executorsWhoDiedList = ['2', '7'];
    let diedBefore = true;
    I.selectExecutorsWhoDied(executorsWhoDiedList);

    forEach(executorsWhoDiedList, executorNumber => {
        I.selectExecutorsWhenDied(executorNumber, diedBefore, head(executorsWhoDiedList) === executorNumber);

        if (diedBefore) {
            diedBefore = false;
        } else {
            diedBefore = true;
        }
    });

    I.selectExecutorsApplying();

    const executorsApplyingList = ['3', '5'];
    I.selectExecutorsDealingWithEstate(executorsApplyingList);

    I.selectExecutorsWithDifferentNameOnWill();

    const executorsWithDifferentNameIdList = ['2']; // ie 1 is the HTML id for executor 3, 2 is the HTML id for executor 5
    I.selectWhichExecutorsWithDifferentNameOnWill(executorsWithDifferentNameIdList);

    const executorsWithDifferentNameList = ['5']
    forEach(executorsWithDifferentNameList, executorNumber => {
        I.enterExecutorCurrentName(executorNumber, head(executorsWithDifferentNameList) === executorNumber);
    });

    forEach(executorsApplyingList, executorNumber => {
        I.enterExecutorContactDetails(executorNumber, head(executorsApplyingList) === executorNumber);
        I.enterExecutorManualAddress(executorNumber);
    });


    const executorsAliveList = ['4', '6'];
    let powerReserved = true;
    forEach(executorsAliveList, executorNumber => {
        I.selectExecutorRoles(executorNumber, powerReserved, head(executorsAliveList) === executorNumber);

        if (powerReserved) {
            I.selectHasExecutorBeenNotified('Yes', executorNumber);
            powerReserved = false;
        } else {
            powerReserved = true;
        }
    });


    I.enterDeceasedName('Deceased First Name', 'Deceased Last Name');
    //I.selectDeceasedAlias('Yes');
    I.selectDeceasedAlias('No');
    //I.selectOtherNames('2');
    I.selectDeceasedMarriedAfterDateOnWill('optionNo');
    I.enterDeceasedDateOfDeath('01', '01', '2017');
    I.enterDeceasedDateOfBirth('01', '01', '1950');
    I.selectDeceasedDomicile();
    I.enterDeceasedAddress();

    I.seeSummaryPage();

    // Review and confirm Task
    I.selectATask('Start');
    I.seeSummaryPage('declaration');
    I.acceptDeclaration();

    // Notify additional executors Dealing with estate
    I.notifyAdditionalExecutors();

    //Retrieve the email urls for additional executors
    I.amOnPage(testConfig.TestInviteIdListUrl);
    grabIds = yield I.grabTextFrom('body');
});


//probably need the for loop around the scenario - so that it is a new session each time
Scenario('pin', function* (I) {


    let idList = JSON.parse(grabIds);

    for (let i=0; i < idList.ids.length; i++) {
        console.log('>>>>',testConfig.TestInvitiationUrl + '/' + idList.ids[i]);
        I.amOnPage(testConfig.TestInvitiationUrl + '/' + idList.ids[i]);

        I.amOnPage(testConfig.TestFrontendUrl + '/pin');

        let grabPins = yield I.grabTextFrom('body');
        let pinList = JSON.parse(grabPins);
        console.log('pin no>>>', pinList.pin);
        pause();
    }
});
    // Somehow need to get the pin id and then put that is into the webpage.....

    // let jsonObject = JSON.parse(grabIds);
    // for (let x=0; x < jsonObject.ids.length; x++ ){
    //     I.amOnPage(testConfig.TestInvitiationUrl + '/' + jsonObject.ids[x]);
    //
    //     //let response = yield I.doHttpGet('https://www-test.probate.reform.hmcts.net/pin')
    //     //let csrf = yield I.grabValueFrom('_csrf');
    //     //console.log('response>>>',response);
    //     //console.log('_csrf>>>>>',csrf);
    //     pause();
    // }




    // forEach(jsonObject.ids, id => {
    //     I.amOnPage(testConfig.TestInvitiationUrl + '/' + id);
    //     let csrf = yield I.grabValueFrom('_csrf');
    //     console.log('_csrf>>>>>',csrf);
    //     pause();
    //    // I.sendPostRequest(testConfig.TestInvitiationUrl, { "email": "user@user.com" });
    // });

  //   // pause();
  //   // I.seeCookie('__auth-token-3.0.0');
  //   // let authCookie = yield I.grabCookie('__auth-token-3.0.0');
  //   // let connectSidCookie = yield I.grabCookie('connect.sid');
  //   //
  //   // I.amOnPage('/inviteIdList', {'Cookie': authCookie + ';' + connectSidCookie});
  //   I.amOnPage('/inviteIdList');
  //   let grabTextFrom = yield I.grabTextFrom('body');
  // console.log('grabTextFrom>>>',grabTextFrom);
  //
  //
  //   console.log('size>>>>',size(grabTextFrom));
  //
  //    pause();
    //    // Need to add email/pin functionality testing here
    //    console.log('here1');
    //  //  pause();
    //    I.seeCookie('__auth-token-3.0.0');
    //    cookie = yield I.grabCookie('__auth-token-3.0.0');
    //    console.log('cookie val=',cookie.value);
    //    let body = yield I.doHttpGet('https://www-test.probate.reform.hmcts.net/inviteIdList');
    // //   pause();
    //    console.log('here2>>>', body);
    //
    //
    // // Extra copies task
    // I.selectATask(taskListContent.taskNotStarted);
    //
    // if (TestConfigurator.isFullPaymentEnvironment()) {
    //     I.enterUkCopies("5");
    //     I.selectOverseasAssets();
    //     I.enterOverseasCopies("7");
    // }
    // else {
    //     I.enterUkCopies("0");
    //     I.selectOverseasAssets();
    //     I.enterOverseasCopies("0");
    // }
    //
    // I.seeCopiesSummary();
    //
    // // PaymentTask
    // I.selectATask(taskListContent.taskNotStarted);
    // I.seePaymentBreakdownPage();
    //
    // if (TestConfigurator.isFullPaymentEnvironment()) {
    //     I.seeGovUkPaymentPage();
    //     I.seeGovUkConfirmPage();
    // }
    //
    // I.seePaymentStatusPage();
    //
    // // Send Documents Task
    // I.seeDocumentsPage();
    //
    // // Thank You - Application Complete Task
    // I.seeThankYouPage();
//});