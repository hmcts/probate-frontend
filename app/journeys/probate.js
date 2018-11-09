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
    NewStartEligibility: 'NewWillLeft',
    NewWillLeft: {
        withWill: 'NewWillOriginal',
        otherwise: 'StopPage'
    },
    NewWillOriginal: {
        isOriginal: 'NewDeathCertificate',
        otherwise: 'StopPage'
    },
    NewDeathCertificate: {
        hasCertificate: 'NewDeceasedDomicile',
        otherwise: 'StopPage'
    },
    NewDeceasedDomicile: {
        inEnglandOrWales: 'NewApplicantExecutor',
        otherwise: 'StopPage'
    },
    NewApplicantExecutor: {
        isExecutor: 'NewMentalCapacity',
        otherwise: 'StopPage'
    },
    NewMentalCapacity: {
        isCapable: 'NewIhtCompleted',
        otherwise: 'StopPage'
    },
    NewIhtCompleted: {
        completed: 'NewStartApply',
        otherwise: 'StopPage'
    },
    NewStartApply: 'TaskList',
    StartEligibility: 'StartApply',
    StartApply: 'TaskList',
    WillLeft: {
        withWill: 'WillOriginal',
        otherwise: 'StopPage'
    },
    WillOriginal: {
        isOriginal: 'WillCodicils',
        otherwise: 'StopPage'
    },
    DeathCertificate: {
        hasCertificate: 'IhtCompleted',
        otherwise: 'StopPage'
    },
    IhtCompleted: {
        completed: 'IhtMethod',
        otherwise: 'StopPage'
    },
    ApplicantExecutor: {
        isExecutor: 'MentalCapacity',
        otherwise: 'StopPage'
    },
    MentalCapacity: {
        isCapable: 'TaskList',
        otherwise: 'StopPage'
    },
    DeceasedName: {
        toggleOn: 'DeceasedDob',
        otherwise: 'DeceasedAlias'
    },
    DeceasedDob: {
        toggleOn: 'DeceasedDod',
        otherwise: 'DeceasedDomicile'
    },
    DeceasedDod: {
        toggleOn: 'DeceasedAddress',
        otherwise: 'DeceasedDob'
    },
    DeceasedDomicile: 'DeceasedAddress',
    DeceasedAddress: {
        toggleOn: 'IhtMethod',
        otherwise: 'Summary'
    },
    IhtMethod: {
        online: 'IhtIdentifier',
        otherwise: 'IhtPaper'
    },
    IhtIdentifier: 'IhtValue',
    IhtValue: {
        toggleOn: 'DeceasedAlias',
        otherwise: 'ApplicantExecutor'
    },
    IhtPaper: {
        toggleOn: 'DeceasedAlias',
        otherwise: 'ApplicantExecutor'
    },
    DeceasedAlias: {
        assetsInOtherNames: 'DeceasedOtherNames',
        otherwise: 'DeceasedMarried'
    },
    DeceasedOtherNames: 'DeceasedMarried',
    AddAlias: 'DeceasedOtherNames',
    RemoveAlias: 'DeceasedOtherNames',
    DeceasedMarried: {
        toggleOn: 'WillCodicils',
        otherwise: 'DeceasedDod'
    },
    WillCodicils: {
        noCodicilsToggleOn: 'TaskList',
        noCodicils: 'DeathCertificate',
        otherwise: 'CodicilsNumber'
    },
    CodicilsNumber: {
        toggleOn: 'TaskList',
        otherwise: 'DeathCertificate'
    },
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
        oneExecutorToggleOn: 'TaskList',
        oneExecutor: 'DeceasedName',
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
        allDeadToggleOn: 'TaskList',
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
        continue: 'ExecutorCurrentNameReason',
        otherwise: 'ExecutorContactDetails',
    },
    ExecutorCurrentNameReason: {
        continue: 'ExecutorCurrentName',
        otherwise: 'ExecutorContactDetails',
    },
    ExecutorContactDetails: 'ExecutorAddress',
    ExecutorAddress: {
        continue: 'ExecutorContactDetails',
        allExecsApplyingToggleOn: 'TaskList',
        allExecsApplying: 'DeceasedName',
        otherwise: 'ExecutorRoles'
    },
    ExecutorRoles: {
        continue: 'ExecutorRoles',
        powerReserved: 'ExecutorNotified',
        otherwiseToggleOn: 'TaskList',
        otherwise: 'DeceasedName',
    },
    ExecutorNameAsOnWill: 'OtherExecutors',
    ExecutorNotified: {
        roles: 'ExecutorRoles',
        otherwiseToggleOn: 'TaskList',
        otherwise: 'DeceasedName'
    },
    DeleteExecutor: 'OtherExecutors',
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
    CoApplicantDisagreePage: 'CoApplicantDisagreePage',
    DocumentUpload: 'DocumentUpload'
};

module.exports.stepList = stepList;
module.exports.taskList = taskList;
