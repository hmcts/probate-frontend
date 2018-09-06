const taskList = {
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
        lastStep: 'ThankYou',
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

    // Executors Task ----------------------------------------------------------
    ApplicantName: 'ApplicantNameAsOnWill',
    ApplicantNameAsOnWill: 'ApplicantPhone',
    ApplicantPhone: 'ApplicantAddress',
    ApplicantAddress: 'ExecutorsNumber',
    ExecutorsNumber: {
        deceasedName: 'TaskList',
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
        allDead: 'TaskList',
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
        allExecsApplying: 'TaskList',
        otherwise: 'ExecutorRoles'
    },
    ExecutorRoles: {
        continue: 'ExecutorRoles',
        powerReserved: 'ExecutorNotified',
        otherwise: 'TaskList',
    },
    ExecutorNameAsOnWill: 'OtherExecutors',
    ExecutorNotified: {
        roles: 'ExecutorRoles',
        otherwise: 'TaskList'
    },
    DeleteExecutor: 'OtherExecutors',

    // Declaration Task -------------------------------------------------------
    Declaration: {
        dataChangedAfterEmailSent: 'ExecutorsChangeMade',
        otherExecutorsApplying: 'ExecutorsInvite',
        otherwise: 'TaskList'
    },
    ExecutorsInvite: 'ExecutorsInvitesSent',
    ExecutorsInvitesSent: 'TaskList',
    ExecutorsChangeMade: 'TaskList',
    Submit: 'TaskList',

    // Copies Task ------------------------------------------------------------
    CopiesStart: 'CopiesUk',
    CopiesUk: 'AssetsOverseas',
    AssetsOverseas: {
        assetsoverseas: 'CopiesOverseas',
        otherwise: 'CopiesSummary'
    },
    CopiesOverseas: 'CopiesSummary',
    CopiesSummary: 'TaskList',

    // Payment Task -----------------------------------------------------------
    PaymentBreakdown: 'PaymentStatus',
    PaymentStatus: 'TaskList',

    // Documents Task ---------------------------------------------------------
    Documents: 'ThankYou',
    ThankYou: 'ThankYou',

    // ------------------------------------------------------------------------
    ContinueApply: 'TaskList',
    Summary: 'TaskList',
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
