'use strict';

const taskList = {
    DeceasedTask: {
        firstStep: 'BilingualGOP',
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
    StartEligibility: 'DeathCertificate',
    DeathCertificate: {
        hasCertificate: 'DeathCertificateInEnglish',
        otherwise: 'StopPage'
    },
    DeathCertificateInEnglish: {
        deathCertificateInEnglish: 'DeceasedDomicile',
        otherwise: 'DeathCertificateTranslation'
    },
    DeathCertificateTranslation: {
        hasDeathCertificateTranslation: 'DeceasedDomicile',
        otherwise: 'StopPage'
    },
    DeceasedDomicile: {
        inEnglandOrWales: 'ExceptedEstateDeceasedDod',
        otherwise: 'StopPage'
    },
    ExceptedEstateDeceasedDod: {
        dodAfterEeThreshold: 'ExceptedEstateValued',
        otherwise: 'IhtCompleted'
    },
    ExceptedEstateValued: {
        eeEstateValued: 'WillLeft',
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
    WillOriginal: {
        isOriginal: 'ApplicantExecutor',
        otherwise: 'StopPage'
    },
    ApplicantExecutor: {
        isExecutor: 'MentalCapacity',
        otherwise: 'StopPage'
    },
    MentalCapacity: {
        isCapable: 'StartApply',
        otherwise: 'StopPage'
    },
    StartApply: 'TaskList',
    BilingualGOP: 'DeceasedName',
    DeceasedName: 'DeceasedDob',
    DeceasedDob: 'DeceasedDod',
    DeceasedDod: 'DeceasedAddress',
    DeceasedAddress: 'DiedEnglandOrWales',
    DiedEnglandOrWales: {
        hasDiedEngOrWales: 'DeathCertificateInterim',
        otherwise: 'EnglishForeignDeathCert'
    },
    DeathCertificateInterim: 'IhtMethod',
    CalcCheck: {
        calcCheckCompleted: 'NewSubmittedToHmrc',
        calcCheckIncomplete: 'ReportEstateValues',
        otherwise: 'NewSubmittedToHmrc'
    },
    NewSubmittedToHmrc: {
        optionIHT400: 'HmrcLetter',
        optionIHT400421: 'ProbateEstateValues',
        optionNA: 'IhtEstateValues',
        otherwise: 'IhtEstateValues'
    },
    ReportEstateValues: 'CalcCheck',
    HmrcLetter: {
        hmrcLetter: 'UniqueProbateCode',
        otherwise: 'WaitingForHmrc'
    },
    IhtEstateForm: {
        optionIHT400: 'HmrcLetter',
        optionIHT400421: 'ProbateEstateValues',
        optionIHT205: 'ProbateEstateValues',
        otherwise: 'ProbateEstateValues'
    },
    IhtEstateValues: {
        netQualifyingValueWithinRange: 'DeceasedHadLateSpouseOrCivilPartner',
        otherwise: 'ProbateEstateValues'
    },
    DeceasedHadLateSpouseOrCivilPartner: {
        deceasedHadLateSpouseOrCivilPartner: 'IhtUnusedAllowanceClaimed',
        otherwise: 'ProbateEstateValues'
    },
    UniqueProbateCode: 'ProbateEstateValues',
    WaitingForHmrc: 'HmrcLetter',
    IhtUnusedAllowanceClaimed: 'ProbateEstateValues',
    ProbateEstateValues: 'DeceasedAlias',
    EnglishForeignDeathCert: {
        foreignDeathCertIsInEnglish: 'IhtMethod',
        ihtPaper: 'IhtPaper',
        otherwise: 'ForeignDeathCertTranslation'
    },
    ForeignDeathCertTranslation: 'IhtMethod',
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
    DeceasedMarried: 'WillHasVisibleDamage',
    WillHasVisibleDamage: {
        willDoesHaveVisibleDamage: 'WillDamageReasonKnown',
        otherwise: 'WillCodicils'
    },
    WillDamageReasonKnown: 'WillDamageCulpritKnown',
    WillDamageCulpritKnown: 'WillDamageDate',
    WillDamageDate: 'WillCodicils',
    WillCodicils: {
        noCodicils: 'DeceasedWrittenWishes',
        otherwise: 'CodicilsNumber'
    },
    CodicilsNumber: 'CodicilsHasVisibleDamage',
    CodicilsHasVisibleDamage: {
        codicilsDoesHaveVisibleDamage: 'CodicilsDamageReasonKnown',
        otherwise: 'DeceasedWrittenWishes'
    },
    CodicilsDamageReasonKnown: 'CodicilsDamageCulpritKnown',
    CodicilsDamageCulpritKnown: 'CodicilsDamageDate',
    CodicilsDamageDate: 'DeceasedWrittenWishes',
    DeceasedWrittenWishes: 'TaskList',
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
        oneExecutor: 'Equality',
        otherwise: 'ExecutorsNames'
    },
    ExecutorsNames: 'ExecutorsAllAlive',
    ExecutorsAllAlive: {
        isAlive: 'ExecutorsApplying',
        whoDied: 'ExecutorsWhoDied'
    },
    ExecutorsWhoDied: 'ExecutorsWhenDied',
    ExecutorsWhenDied: {
        continue: 'ExecutorsWhenDied',
        allDead: 'Equality',
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
        otherwise: 'ExecutorContactDetails'
    },
    ExecutorContactDetails: 'ExecutorAddress',
    ExecutorAddress: {
        continue: 'ExecutorContactDetails',
        allExecsApplying: 'Equality',
        otherwise: 'ExecutorRoles'
    },
    ExecutorRoles: {
        continue: 'ExecutorRoles',
        powerReserved: 'ExecutorNotified',
        otherwise: 'Equality'
    },
    ExecutorNameAsOnWill: 'OtherExecutors',
    ExecutorNotified: {
        roles: 'ExecutorRoles',
        otherwise: 'Equality'
    },
    Equality: 'TaskList',
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
    Dashboard: 'TaskList',
    StopPage: 'StopPage',
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
