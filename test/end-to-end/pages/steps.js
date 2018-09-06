'use strict';

const requireDirectory = require('require-directory'),
steps = requireDirectory(module);

module.exports = function () {

    return actor({
        // PreIdam
        startApplication: steps.startEligibility.startEligibility,
        continueApply: steps.continueApply.continueApply,

        // Eligibility
        selectPersonWhoDiedLeftAWill: steps.will.left,
        selectOriginalWill: steps.will.original,
        selectDeathCertificate: steps.deceased.deathcertificate,
        selectDeceasedDomicile: steps.deceased.domicile,
        selectApplicantIsExecutor: steps.applicant.executor,
        selectMentallyCapable: steps.executors.mentalcapacity,
        selectIhtCompleted: steps.iht.completed,
        startApply: steps.startApply.startApply,

        // Sign in to IDAM
        authenticateWithIdamIfAvailable: steps.IDAM.signIn,

        // Deceased
        selectATask: steps.tasklist.tasklist,
        enterDeceasedName: steps.deceased.name,
        enterDeceasedDateOfBirth: steps.deceased.dob,
        enterDeceasedDateOfDeath: steps.deceased.dod,
        enterDeceasedAddress: steps.deceased.address,
        selectInheritanceMethodPaper: steps.iht.method,
        selectDeceasedAlias: steps.deceased.alias,
        selectOtherNames: steps.deceased.otherNames,
        selectDeceasedMarriedAfterDateOnWill: steps.deceased.married,
        selectWillCodicils: steps.will.codicils,
        selectWillNoOfCodicils: steps.will.codicilsnumber,

        enterGrossAndNet: steps.iht.paper,

        // Applicant details
        enterApplicantName: steps.applicant.name,
        selectNameAsOnTheWill: steps.applicant.nameasonwill,
        enterApplicantPhone: steps.applicant.phone,
        enterAddressManually: steps.applicant.address,

        // Executors
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
        enterExecutorContactDetails: steps.executors.contactdetails,
        enterExecutorManualAddress: steps.executors.address,
        selectExecutorRoles: steps.executors.roles,
        selectHasExecutorBeenNotified: steps.executors.notified,

        // Summary page
        seeSummaryPage: steps.summary.summary,

        // Declaration page
        acceptDeclaration: steps.declaration.declaration,

        // Notify additional executors
        notifyAdditionalExecutors: steps.executors.invite,

        // Pin page for additional executor
        enterPinCode: steps.pin.signin,

        // Additional executors Agree/Disagree with Statement of Truth
        seeCoApplicantStartPage: steps.coapplicant.startPage,
        agreeDisagreeDeclaration: steps.coapplicant.declaration,
        seeAgreePage: steps.coapplicant.agree,

        // Asset pages
        selectOverseasAssets: steps.assets.overseas,

        // Copies pages
        enterUkCopies: steps.copies.uk,
        enterOverseasCopies: steps.copies.overseas,
        seeCopiesSummary: steps.copies.summary,

        // Payment
        seePaymentBreakdownPage: steps.payment.paymentbreakdown,
        seeGovUkPaymentPage: steps.payment.govukpayment,
        seeGovUkConfirmPage: steps.payment.govukconfirmpayment,
        seePaymentStatusPage: steps.payment.paymentstatus,

        // Documents
        seeDocumentsPage: steps.documents.documents,

        // Thank You Page
        seeThankYouPage: steps.thankyou.thankyou,

        // Eligibility task
        completeEligibilityTask: steps.tasks.tasks.completeEligibilityTask,
        completeExecutorsTask: steps.tasks.tasks.completeExecutorsTask

    });
};
