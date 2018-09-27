'use strict';

const taskList = {
    EligibilityTask: {
        firstStep: 'WillLeft',
        lastStep: 'TaskList',
        summary: 'Summary'
    },
    DeceasedTask: {
        firstStep: 'DeceasedName',
        lastStep: 'TaskList',
        summary: 'Summary'
    },
    ExecutorsTask: {
        firstStep: 'ApplicantName',
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
    // Eligibility Task -------------------------------------------------------
    StartEligibility: 'WillLeft',
    WillLeft: {
        withWill: 'WillOriginal',
        otherwise: 'StopPage'
    },
    WillOriginal: {
        isOriginal: 'DeathCertificate',
        otherwise: 'StopPage'
    },
    DeathCertificate: {
        hasCertificate: 'DeceasedDomicile',
        otherwise: 'StopPage'
    },
    DeceasedDomicile: {
        inEnglandOrWales: 'ApplicantExecutor',
        otherwise: 'StopPage'
    },
    ApplicantExecutor: {
        isExecutor: 'MentalCapacity',
        otherwise: 'StopPage'
    },
    MentalCapacity: {
        isCapable: 'IhtCompleted',
        otherwise: 'StopPage'
    },
    IhtCompleted: {
        completed: 'StartApply',
        otherwise: 'StopPage'
    },
    StartApply: 'TaskList',
    // Deceased Task ----------------------------------------------------------
    DeceasedName: 'DeceasedDob',
    DeceasedDob: 'DeceasedDod',
    DeceasedDod: 'DeceasedAddress',
    DeceasedAddress: 'IhtMethod',
    IhtMethod: {
        online: 'IhtIdentifier',
        otherwise: 'IhtPaper'
    },
    IhtIdentifier: 'IhtValue',
    IhtValue: 'DeceasedAlias',
    IhtPaper: 'DeceasedAlias',
    DeceasedAlias: {
        assetsInOtherNames: 'DeceasedOtherNames',
        otherwise: 'DeceasedMarried'
    },
    DeceasedOtherNames: 'DeceasedMarried',
    AddAlias: 'DeceasedOtherNames',
    RemoveAlias: 'DeceasedOtherNames',
    DeceasedMarried: 'WillCodicils',
    WillCodicils: {
        noCodicils: 'TaskList',
        otherwise: 'CodicilsNumber'
    },
    CodicilsNumber: 'TaskList',
    // Executors Task ---------------------------------------------------------
    ApplicantName: 'ApplicantNameAsOnWill',
    ApplicantNameAsOnWill: {
        hasAlias: 'ApplicantAlias',
        otherwise: 'ApplicantPhone'
    },
    ApplicantAlias: 'ApplicantAliasReason',
    ApplicantAliasReason: 'ApplicantPhone',
    ApplicantPhone: 'ApplicantAddress',
    ApplicantAddress: 'ExecutorsNumber',
    ExecutorsNumber: {
        oneExecutor: 'TaskList',
        otherwise: 'ExecutorsNames',
    },
    ExecutorsNames: 'ExecutorsAllAlive',
    ExecutorsAllAlive: {
        isAlive: 'ExecutorsApplying',
        whoDied: 'ExecutorsWhoDied'
    },
    ExecutorsWhoDied: 'ExecutorsWhenDied',
    ExecutorsWhenDied: {
        continue: 'ExecutorsWhenDied',
        allDead: 'DeceasedName',
        otherwise: 'ExecutorsApplying'
    },
    ExecutorsApplying: {
        otherExecutorsApplying: 'ExecutorsDealingWithEstate',
        otherwise: 'ExecutorRoles'
    },
    ExecutorsDealingWithEstate: 'ExecutorsAlias',
    ExecutorsAlias: {
        withAlias: 'ExecutorsWithOtherNames',
        otherwise: 'ExecutorContactDetails'
    },
    ExecutorsWithOtherNames: 'ExecutorCurrentName',
    ExecutorCurrentName: {
        continue: 'ExecutorCurrentName',
        otherwise: 'ExecutorContactDetails',
    },
    ExecutorContactDetails: 'ExecutorAddress',
    ExecutorAddress: {
        continue: 'ExecutorContactDetails',
        allExecsApplying: 'DeceasedName',
        otherwise: 'ExecutorRoles'
    },
    ExecutorRoles: {
        continue: 'ExecutorRoles',
        powerReserved: 'ExecutorNotified',
        otherwise: 'DeceasedName',
    },
    ExecutorNameAsOnWill: 'OtherExecutors',
    ExecutorNotified: {
        roles: 'ExecutorRoles',
        otherwise: 'DeceasedName'
    },
    DeleteExecutor: 'OtherExecutors',
    // ------------------------------------------------------------------------
    Summary: 'TaskList',
    Declaration: {
        sendAdditionalInvites: 'ExecutorsAdditionalInvite',
        executorEmailChanged: 'ExecutorsUpdateInvite',
        dataChangedAfterEmailSent: 'ExecutorsChangeMade',
        otherExecutorsApplying: 'ExecutorsInvite',
        otherwise: 'TaskList'
    },
    ExecutorsAdditionalInvite: 'ExecutorsAdditionalInviteSent',
    ExecutorsAdditionalInviteSent: 'TaskList',
    ExecutorsUpdateInvite: 'ExecutorsUpdateInviteSent',
    ExecutorsUpdateInviteSent: 'TaskList',
    ExecutorsInvite: 'ExecutorsInvitesSent',
    ExecutorsInvitesSent: 'TaskList',
    ExecutorsChangeMade: 'TaskList',
    Submit: 'TaskList',
    Documents: 'ThankYou',
    ThankYou: 'TaskList',
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
    AddressLookup: 'AddressLookup',
    TaskList: 'TaskList',
    StopPage: 'StopPage',
    TermsConditions: 'TermsConditions',
    PinPage: 'CoApplicantStartPage',
    PinResend: 'PinSent',
    PinSent: 'PinPage',
    CoApplicantStartPage: 'CoApplicantDeclaration',
    CoApplicantDeclaration: {
        agreed: 'CoApplicantAgreePage',
        otherwise: 'CoApplicantDisagreePage'
    },
    CoApplicantAgreePage: 'CoApplicantAgreePage',
    CoApplicantDisagreePage: 'CoApplicantDisagreePage'
};

module.exports.stepList = stepList;
module.exports.taskList = taskList;
