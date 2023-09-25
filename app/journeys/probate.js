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
        inEnglandOrWales: 'IhtCompleted',
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
    StartApply: 'Dashboard',
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
    IhtEstateValued: {
        ihtEstateFormsCompleted: 'IhtEstateForm',
        otherwise: 'IhtEstateValues',
    },
    IhtEstateForm: 'ProbateEstateValues',
    IhtEstateValues: {
        netQualifyingValueWithinRange: 'DeceasedHadLateSpouseOrCivilPartner',
        otherwise: 'ProbateEstateValues'
    },
    DeceasedHadLateSpouseOrCivilPartner: {
        deceasedHadLateSpouseOrCivilPartner: 'IhtUnusedAllowanceClaimed',
        otherwise: 'ProbateEstateValues'
    },
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

const previousStepList = {
    Dashboard: 'StartApply',
    Summary: 'Dashboard',
    StartEligibility: 'Dashboard',
    DeathCertificate: 'StartEligibility',
    StopPage: {
        DeathCertificate: 'DeathCertificate',
        DeathCertificateTranslation: 'DeathCertificateTranslation',
        DeceasedDomicile: 'DeceasedDomicile',
        ExceptedEstateValued: 'ExceptedEstateValued',
        StartEligibility: 'StartEligibility'
    },
    DeathCertificateInEnglish: 'DeathCertificate',
    DeathCertificateTranslation: 'DeathCertificateInEnglish',
    DeceasedDomicile: 'DeathCertificateInEnglish',
    ExceptedEstateDeceasedDod: 'DeceasedDomicile',
    ExceptedEstateValued: 'ExceptedEstateDeceasedDod',
    IhtCompleted: 'ExceptedEstateDeceasedDod',
    WillLeft: 'ExceptedEstateValued',
    WillOriginal: 'WillLeft',
    ApplicantExecutor: 'WillOriginal',
    MentalCapacity: 'ApplicantExecutor',
    TaskList: 'Dashboard',
    BilingualGOP: 'Dashboard',
    DeceasedName: 'BilingualGOP',
    DeceasedDob: 'DeceasedName',
    DeceasedDod: 'DeceasedDob',
    DeceasedAddress: 'DeceasedDod',
    DiedEnglandOrWales: 'DeceasedAddress',
    DeathCertificateInterim: 'DiedEnglandOrWales',
    IhtEstateValued: 'DeathCertificateInterim',
    IhtEstateForm: 'IhtEstateValued',
    ProbateEstateValues: 'IhtEstateForm',
    DeceasedAlias: 'ProbateEstateValues',
    DeceasedOtherNames: 'DeceasedAlias',
    DeceasedMarried: 'DeceasedAlias',
    WillHasVisibleDamage: 'DeceasedMarried',
    WillDamageReasonKnown: 'WillHasVisibleDamage',
    WillDamageCulpritKnown: 'WillDamageReasonKnown',
    WillDamageDate: 'WillDamageCulpritKnown',
    WillCodicils: 'WillHasVisibleDamage',
    CodicilsNumber: 'WillCodicils',
    CodicilsHasVisibleDamage: 'CodicilsNumber',
    CodicilsDamageReasonKnown: 'CodicilsHasVisibleDamage',
    CodicilsDamageCulpritKnown: 'CodicilsDamageReasonKnown',
    CodicilsDamageDate: 'CodicilsDamageCulpritKnown',
    DeceasedWrittenWishes: 'WillCodicils',
    ApplicantName: 'TaskList',
    ApplicantNameAsOnWill: 'ApplicantName',
    ApplicantAlias: 'ApplicantNameAsOnWill',
    ApplicantPhone: 'ApplicantNameAsOnWill',
    ApplicantAliasReason: 'ApplicantAlias',
    ApplicantAddress: 'ApplicantAliasReason',
    ExecutorsNumber: 'ApplicantAddress',
    AdoptionPlace: 'ApplicantAddress',
    RelationshipToDeceased: 'Dashboard'

};

module.exports.previousStepList = previousStepList;
module.exports.stepList = stepList;
module.exports.taskList = taskList;
