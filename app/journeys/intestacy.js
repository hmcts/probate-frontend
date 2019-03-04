'use strict';

const taskList = {
    DeceasedTask: {
        firstStep: 'DeceasedDetails',
        lastStep: 'TaskList',
        summary: 'Summary'
    },
    ExecutorsTask: {
        firstStep: 'RelationshipToDeceased',
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
        withoutWillToggleOn: 'DiedAfterOctober2014',
        otherwise: 'StopPage'
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
    StartApply: 'TaskList',

    DeceasedDetails: 'DeceasedAddress',
    DeceasedAddress: {
        documentUploadToggleOn: 'DocumentUpload',
        otherwise: 'IhtMethod'
    },
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
        renouncing: 'AnyChildren',
        otherwise: 'StopPage'
    },
    AdoptionPlace: {
        inEnglandOrWales: 'SpouseNotApplyingReason',
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

    Summary: 'TaskList',
    TaskList: 'TaskList',
    StopPage: 'StopPage'
};

module.exports.stepList = stepList;
module.exports.taskList = taskList;
