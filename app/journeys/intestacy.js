'use strict';

const taskList = {
    DeceasedTask: {
        firstStep: 'DeceasedDetails',
        lastStep: 'TaskList',
        summary: 'Summary'
    },
    ApplicantsTask: {
        firstStep: 'RelationshipToDeceased',
        lastStep: 'TaskList',
        summary: 'Summary'
    },
    ReviewAndConfirmTask: {
        firstStep: 'Declaration',
        lastStep: 'TaskList',
        summary: 'Summary'
    },
    CopiesTask: {
        firstStep: 'CopiesStart',
        lastStep: 'CopiesSummary',
        summary: 'CopiesSummary'
    },
    PaymentTask: {
        firstStep: 'PaymentBreakdown',
        lastStep: 'TaskList',
        summary: 'Summary'
    },
    DocumentsTask: {
        firstStep: 'Documents',
        lastStep: 'TaskList',
        summary: 'Summary'
    }
};

const stepList = {
    StartEligibility: 'DeathCertificate',
    DeathCertificate: {
        hasCertificate: 'DeceasedDomicile',
        otherwise: 'StopPage'
    },
    DeceasedDomicile: {
        inEnglandOrWales: 'IhtCompleted',
        otherwise: 'StopPage'
    },
    IhtCompleted: {
        completed: 'WillLeft',
        otherwise: 'StopPage'
    },
    WillLeft: {
        withWill: 'WillOriginal',
        otherwise: 'DiedAfterOctober2014'
    },
    DiedAfterOctober2014: {
        diedAfter: 'RelatedToDeceased',
        otherwise: 'StopPage'
    },
    RelatedToDeceased: {
        related: 'OtherApplicants',
        otherwise: 'StopPage'
    },
    OtherApplicants: {
        noOthers: 'StartApply',
        otherwise: 'StopPage'
    },
    StartApply: 'Dashboard',
    DeceasedDetails: {
        diedAfter: 'DeceasedAddress',
        otherwise: 'StopPage'
    },
    DeceasedAddress: 'DocumentUpload',
    DocumentUpload: {
        isUploadingDocument: 'DocumentUpload',
        otherwise: 'IhtMethod'
    },
    IhtMethod: {
        online: 'IhtIdentifier',
        otherwise: 'IhtPaper'
    },
    IhtIdentifier: 'IhtValue',
    IhtValue: {
        lessThanOrEqualTo250k: 'AssetsOutside',
        otherwise: 'DeceasedAlias'
    },
    IhtPaper: {
        lessThanOrEqualTo250k: 'AssetsOutside',
        otherwise: 'DeceasedAlias'
    },
    AssetsOutside: {
        hasAssetsOutside: 'ValueAssetsOutside',
        otherwise: 'DeceasedAlias'
    },
    ValueAssetsOutside: 'DeceasedAlias',
    DeceasedAlias: {
        assetsInOtherNames: 'DeceasedOtherNames',
        otherwise: 'DeceasedMaritalStatus'
    },
    DeceasedOtherNames: 'DeceasedMaritalStatus',
    AddAlias: 'DeceasedOtherNames',
    RemoveAlias: 'DeceasedOtherNames',
    DeceasedMaritalStatus: {
        divorcedOrSeparated: 'DivorcePlace',
        otherwise: 'TaskList'
    },
    DivorcePlace: {
        inEnglandOrWales: 'TaskList',
        otherwise: 'StopPage'
    },
    RelationshipToDeceased: {
        childDeceasedMarried: 'SpouseNotApplyingReason',
        childDeceasedNotMarried: 'AnyOtherChildren',
        adoptedChild: 'AdoptionPlace',
        spousePartnerLessThan250k: 'ApplicantName',
        spousePartnerMoreThan250k: 'AnyChildren',
        otherwise: 'StopPage'
    },
    SpouseNotApplyingReason: {
        renouncing: 'AnyOtherChildren',
        otherwise: 'StopPage'
    },
    AdoptionPlace: {
        inEnglandOrWalesDeceasedMarried: 'SpouseNotApplyingReason',
        inEnglandOrWalesDeceasedNotMarried: 'AnyOtherChildren',
        otherwise: 'StopPage'
    },
    AnyChildren: {
        hadChildren: 'AllChildrenOver18',
        otherwise: 'ApplicantName'
    },
    AnyOtherChildren: {
        hadOtherChildren: 'AllChildrenOver18',
        otherwise: 'ApplicantName'
    },
    AllChildrenOver18: {
        allChildrenOver18: 'AnyDeceasedChildren',
        otherwise: 'StopPage'
    },
    AnyDeceasedChildren: {
        hadDeceasedChildren: 'AnyGrandchildrenUnder18',
        otherwise: 'ApplicantName'
    },
    AnyGrandchildrenUnder18: {
        allGrandchildrenOver18: 'ApplicantName',
        otherwise: 'StopPage'
    },
    ApplicantName: 'ApplicantPhone',
    ApplicantPhone: 'ApplicantAddress',
    ApplicantAddress: 'Summary',
    Summary: 'TaskList',
    Declaration: 'TaskList',
    CopiesStart: 'CopiesUk',
    CopiesUk: 'AssetsOverseas',
    AssetsOverseas: {
        assetsoverseas: 'CopiesOverseas',
        otherwise: 'CopiesSummary'
    },
    CopiesOverseas: 'CopiesSummary',
    CopiesSummary: 'TaskList',
    PaymentBreakdown: 'PaymentStatus',
    PaymentStatus: 'TaskList',
    Documents: 'ThankYou',
    ThankYou: 'TaskList',
    TaskList: 'TaskList',
    Dashboard: 'TaskList',
    StopPage: 'StopPage'
};

module.exports.stepList = stepList;
module.exports.taskList = taskList;
