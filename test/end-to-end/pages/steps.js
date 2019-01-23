'use strict';

const requireDirectory = require('require-directory');
const steps = requireDirectory(module);

module.exports = function () {
    return actor({
        // Stop page
        seeStopPage: steps.stoppage.stoppage,

        // Eligibility Task (pre IdAM)
        startEligibility: steps.screeners.starteligibility,
        selectPersonWhoDiedLeftAWill: steps.screeners.willleft,
        selectOriginalWill: steps.screeners.willoriginal,
        selectDeathCertificate: steps.screeners.deathcertificate,
        selectDeceasedDomicile: steps.screeners.deceaseddomicile,
        selectApplicantIsExecutor: steps.screeners.applicantexecutor,
        selectMentallyCapable: steps.screeners.mentalcapacity,
        selectIhtCompleted: steps.screeners.ihtcompleted,
        selectDiedAfterOctober2014: steps.screeners.diedafteroctober2014,
        selectRelationshipToDeceased: steps.screeners.relationshiptodeceased,
        selectOtherApplicants: steps.screeners.otherapplicants,
        startApply: steps.screeners.startapply,

        // Sign In to IDAM
        authenticateWithIdamIfAvailable: steps.IDAM.signIn,

        // Start application
        selectATask: steps.tasklist.tasklist,

        // Deceased Task
        enterDeceasedName: steps.deceased.name,
        enterDeceasedDateOfBirth: steps.deceased.dob,
        enterDeceasedDateOfDeath: steps.deceased.dod,
        enterDeceasedAddress: steps.deceased.address,
        selectInheritanceMethodPaper: steps.iht.method,
        enterGrossAndNet: steps.iht.paper,
        selectDeceasedAlias: steps.deceased.alias,
        selectOtherNames: steps.deceased.otherNames,
        selectDeceasedMarriedAfterDateOnWill: steps.deceased.married,
        selectWillCodicils: steps.will.codicils,
        selectWillNoOfCodicils: steps.will.codicilsnumber,

        // Executors Task
        enterApplicantName: steps.applicant.name,
        selectNameAsOnTheWill: steps.applicant.nameasonwill,
        enterApplicantAlias: steps.applicant.alias,
        enterApplicantAliasReason: steps.applicant.aliasreason,
        enterApplicantPhone: steps.applicant.phone,
        enterAddressManually: steps.applicant.address,
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

        // Review and Confirm Task
        seeSummaryPage: steps.summary.summary,
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

        // Thank You
        seeThankYouPage: steps.thankyou.thankyou,
    });
};
