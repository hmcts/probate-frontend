'use strict';

const requireDirectory = require('require-directory');
const steps = requireDirectory(module);

module.exports = () => {
    return actor({
        // Stop page
        seeStopPage: steps.stoppage.stoppage,

        // Eligibility Task (pre IdAM)
        startApplication: steps.screeners.starteligibility,
        selectDeathCertificate: steps.screeners.deathcertificate,
        selectDeathCertificateInEnglish: steps.screeners.deathcertificateinenglish,
        selectDeathCertificateTranslation: steps.screeners.deathcertificatetranslation,
        selectDeceasedDomicile: steps.screeners.deceaseddomicile,
        selectEEDeceasedDod: steps.screeners.eedeceaseddod,
        selectEEvalue: steps.screeners.eevalue,
        selectIhtCompleted: steps.screeners.ihtcompleted,
        selectPersonWhoDiedLeftAWill: steps.screeners.willleft,
        selectOriginalWill: steps.screeners.willoriginal,
        selectApplicantIsExecutor: steps.screeners.applicantexecutor,
        selectMentallyCapable: steps.screeners.mentalcapacity,
        selectDiedAfterOctober2014: steps.screeners.diedafteroctober2014,
        selectRelatedToDeceased: steps.screeners.relatedtodeceased,
        selectOtherApplicants: steps.screeners.otherapplicants,
        startApply: steps.screeners.startapply,

        // Sign In to IDAM
        authenticateWithIdamIfAvailable: steps.IDAM.signIn,

        // Choose Application on Dashboard
        chooseApplication: steps.dashboard.chooseApplication,

        // Start application
        selectATask: steps.tasklist.tasklist,

        // Deceased
        chooseBiLingualGrant: steps.language.bilingualgrant,
        enterDeceasedName: steps.deceased.name,
        enterDeceasedNameOnWill: steps.deceased.nameonwill,
        enterDeceasedAlias: steps.deceased.aliasName,
        enterDeceasedDateOfBirth: steps.deceased.dob,
        enterDeceasedDateOfDeath: steps.deceased.dod,
        enterDeceasedAddress: steps.deceased.address,
        selectDiedEngOrWales: steps.deceased.diedengorwales,
        selectDeathCertificateInterim: steps.deceased.deathcertificate,
        selectEnglishForeignDeathCert: steps.deceased.englishforeigndeathcert,
        selectForeignDeathCertTranslation: steps.deceased.foreigndeathcerttranslation,
        selectDocumentsToUpload: steps.documentupload.documentupload,
        selectInheritanceMethod: steps.iht.method,
        enterGrossAndNet: steps.iht.paper,
        enterIHTIdentifier: steps.iht.identifier,
        enterEstateValue: steps.iht.value,
        reportEstateValue: steps.ee.hmrcReport,
        selectEEComplete: steps.ee.complete,
        enterEEValue: steps.ee.value,
        selectLateSpouseCivilPartner: steps.ee.latespousecivilpartner,
        selectUnusedAllowance: steps.ee.unusedallowance,
        enterProbateEstateValues: steps.ee.probateestatevalues,
        enterProbateAssetValues: steps.iht.value,
        selectSubmittedToHmrc: steps.ee.submittedToHmrc,
        selectHmrcLetterComplete: steps.ee.submittedHmrcLetter,
        enterHmrcCode: steps.ee.provideHmrcCode,
        selectForm: steps.ee.form,
        selectDeceasedAlias: steps.deceased.alias,
        selectDeceasedAliasGop: steps.deceased.aliasGOP,
        selectOtherNames: steps.deceased.otherNames,
        selectDeceasedMarriedAfterDateOnWill: steps.deceased.married,
        selectWillDamage: steps.will.willdamage,
        selectWrittenWishes: steps.will.writtenwishes,
        selectCodicilsDamage: steps.will.codicilsdamage,
        selectCodicilsReason: steps.will.codicilsreason,
        selectCodicilsWho: steps.will.codicilswho,
        selectCodicilsDate: steps.will.codicilsdate,
        selectWillDamageReason: steps.will.damagereason,
        selectWillDamageWho: steps.will.damagewho,
        selectWillDamageDate: steps.will.damagedate,
        selectWillCodicils: steps.will.codicils,
        selectWillNoOfCodicils: steps.will.codicilsnumber,
        enterAnyChildren: steps.deceased.anychildren,
        enterAnyOtherChildren: steps.deceased.anyotherchildren,
        goBackAndAddACodicil: steps.will.goBackAndAddACodicil,

        // Executors
        enterApplicantName: steps.applicant.name,
        selectNameAsOnTheWill: steps.applicant.nameasonwill,
        checkErrorForNameAsOnTheWill: steps.applicant.nameasonwill_checkerror,
        enterApplicantAlias: steps.applicant.alias,
        enterApplicantAliasReason: steps.applicant.aliasreason,
        enterApplicantPhone: steps.applicant.phone,
        enterAddressManually: steps.applicant.address,
        enterTotalExecutors: steps.executors.number,

        // Multiple Executors
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

        //Equality and diversity page
        exitEqualityAndDiversity: steps.equalityanddiversity.startpage,
        completeEqualityAndDiversity: steps.equalityanddiversity.completedpage,

        // Summary page
        checkSummaryCodicilStrings: steps.summary.summary_checkCodicilStrings,
        seeSummaryPage: steps.summary.summary,
        acceptDeclaration: steps.declaration.declaration,

        // Notify additional executors
        notifyAdditionalExecutors: steps.executors.invite,

        // Pin page for additional executor
        enterPinCode: steps.pin.signin,

        // Additional executors Agree/Disagree with Statement of Truth
        seeCoApplicantStartPage: steps.coapplicant.startPage,
        agreeDeclaration: steps.coapplicant.declaration,
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
        seeGovUkCancelPage: steps.payment.govukcancelpayment,
        seeCancellationPage: steps.payment.continuecancel,
        seePaymentClosePage: steps.payment.paymentclose,

        seePaymentStatusPage: steps.payment.paymentstatus,

        // Documents
        seeDocumentsPage: steps.documents.documents,

        // Thank You
        seeThankYouPage: steps.thankyou.thankyou,

        // Intestacy
        enterDeceasedDetails: steps.deceased.details,
        selectAssetsOutsideEnglandWales: steps.deceased.assetsoutsideenglandwales,
        enterValueAssetsOutsideEnglandWales: steps.deceased.valueassetsoutsideenglandwales,
        selectDeceasedMaritalStatus: steps.deceased.maritalstatus,
        selectDeceasedDivorcePlace: steps.deceased.divorceplace,
        selectRelationshipToDeceased: steps.applicant.relationshiptodeceased,
        selectSpouseNotApplyingReason: steps.applicant.spousenotapplyingreason,

        // Sign Out
        seeSignOut: steps.signout.signout
    });
};
