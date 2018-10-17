'use strict';

const requireDirectory = require('require-directory');
const steps = requireDirectory(module);

module.exports = function () {

    return actor({
    //PreIdam
        startApplication: steps.startEligibility.startEligibility,
        startApply: steps.startApply.startApply,

        //Sign In to IDAM
        authenticateWithIdamIfAvailable: steps.IDAM.signIn,

        //Start application
        selectATask: steps.tasklist.tasklist,

        // Eligibility
        selectPersonWhoDiedLeftAWill: steps.will.left,
        selectOriginalWill: steps.will.original,
        selectWillCodicils: steps.will.codicils,
        selectWillNoOfCodicils: steps.will.codicilsnumber,
        selectDeathCertificate: steps.deceased.deathcertificate,
        selectIhtCompleted: steps.iht.completed,
        selectInheritanceMethodPaper: steps.iht.method,
        enterGrossAndNet: steps.iht.paper,
        selectApplicantIsExecutor: steps.applicant.executor,
        selectMentallyCapable: steps.executors.mentalcapacity,

        //applicant details
        enterApplicantName: steps.applicant.name,
        selectNameAsOnTheWill: steps.applicant.nameasonwill,
        enterApplicantAlias: steps.applicant.alias,
        enterApplicantAliasReason: steps.applicant.aliasreason,
        enterApplicantPhone: steps.applicant.phone,
        enterAddressManually: steps.applicant.address,

        //executors
        enterTotalExecutors: steps.executors.number,
        enterExecutorNames: steps.executors.names,
        selectExecutorsAllAlive: steps.executors.allalive,
        selectExecutorsWhoDied: steps.executors.whodied,
        selectExecutorsWhenDied: steps.executors.whendied,
        selectExecutorsApplying: steps.executors.applying,
        selectExecutorsDealingWithEstate: steps.executors.dealingwithestate,
        selectExecutorsWithDifferentNameOnWill: steps.executors.alias,
        selectWhichExecutorsWithDifferentNameOnWill: steps.executors.othername,
        enterExecutorCurrentName: steps.executors.currentname,
        enterExecutorCurrentNameReason: steps.executors.currentnamereason,
        enterExecutorContactDetails: steps.executors.contactdetails,
        enterExecutorManualAddress: steps.executors.address,
        selectExecutorRoles: steps.executors.roles,
        selectHasExecutorBeenNotified: steps.executors.notified,

        //deceased details
        enterDeceasedName: steps.deceased.name,
        selectDeceasedAlias: steps.deceased.alias,
        selectOtherNames: steps.deceased.otherNames,
        selectDeceasedMarriedAfterDateOnWill: steps.deceased.married,
        enterDeceasedDateOfBirth: steps.deceased.dob,
        enterDeceasedDateOfDeath: steps.deceased.dod,
        selectDeceasedDomicile: steps.deceased.domicile,
        enterDeceasedAddress: steps.deceased.address,

        //summary page
        seeSummaryPage: steps.summary.summary,

        //Declaration Page
        acceptDeclaration: steps.declaration.declaration,

        //Notify additional executors
        notifyAdditionalExecutors: steps.executors.invite,

        //Pin page for additional executor
        enterPinCode: steps.pin.signin,

        //Additional executors Agree/Disagree with Statement of Truth
        seeCoApplicantStartPage: steps.coapplicant.startPage,
        agreeDisagreeDeclaration: steps.coapplicant.declaration,
        seeAgreePage: steps.coapplicant.agree,

        //Asset pages
        selectOverseasAssets: steps.assets.overseas,

        //Copies pages
        enterUkCopies: steps.copies.uk,
        enterOverseasCopies: steps.copies.overseas,
        seeCopiesSummary: steps.copies.summary,

        //Payment
        seePaymentBreakdownPage: steps.payment.paymentbreakdown,
        seeGovUkPaymentPage: steps.payment.govukpayment,
        seeGovUkConfirmPage: steps.payment.govukconfirmpayment,
        seePaymentStatusPage: steps.payment.paymentstatus,

        // Documents
        seeDocumentsPage: steps.documents.documents,

        //Thank You Page
        seeThankYouPage: steps.thankyou.thankyou,

        //Eligibility task
        completeEligibilityTask: steps.tasks.tasks.completeEligibilityTask,
        completeExecutorsTask: steps.tasks.tasks.completeExecutorsTask

    });
};
