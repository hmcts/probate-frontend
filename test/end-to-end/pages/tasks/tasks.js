'use strict';

const taskListContent = require('app/resources/en/translation/tasklist');

exports.completeEligibilityTask = function () {
    const I = this;
    I.startApplication();
    I.selectATask(taskListContent.taskNotStarted);
    I.selectPersonWhoDiedLeftAWill();
    I.selectOriginalWill();
    I.selectAndEnterWillDate('1', '1', '2017');
    I.selectWillCodicils();
    I.selectApplicantIsExecutor();
};

exports.completeExecutorsTask = function () {
    const I = this;
    I.selectATask(taskListContent.taskNotStarted);
    I.enterApplicantName('Applicant First Name', 'Applicant Last Name');
    I.selectNameAsOnTheWill();
    I.enterApplicantPhone();
    I.enterAddressManually();
    I.selectThereAreNoOtherExecutors();
    I.enterDeceasedName('Deceased First Name', 'Deceased Last Name');
    I.selectDeceasedAlias();
    I.selectDeceasedMarriedAfterDateOnWill('No');
    I.enterDeceasedDateOfDeath('1', '1', '2017');
    I.enterDeceasedDateOfBirth('1', '1', '1955');
    I.selectDeceasedDomicile();
    I.enterDeceasedAddress();
    I.selectInheritanceMethodPaper();
    I.enterGrossAndNet();
    I.seeSummaryPage();
    I.acceptDeclaration();
};
