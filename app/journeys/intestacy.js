'use strict';

const taskList = {
    DeceasedTask: {
        firstStep: 'BilingualGOP',
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
    PaymentTask: {
        firstStep: 'CopiesStart',
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
        otherwise: 'DiedAfterOctober2014',
        skipDod2014: 'RelatedToDeceased'
    },
    DiedAfterOctober2014: {
        diedAfter: 'RelatedToDeceased',
        otherwise: 'StopPage'
    },
    RelatedToDeceased: {
        related: 'StartApply',
        otherwise: 'StopPage'
    },
    StartApply: 'TaskList',
    BilingualGOP: 'DeceasedName',
    DeceasedName: 'DeceasedDob',
    DeceasedDob: 'DeceasedDod',
    DeceasedDod: {
        diedAfter: 'DeceasedAddress',
        otherwise: 'StopPage'
    },
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
        otherwise: 'IhtEstateValues'
    },
    ReportEstateValues: 'CalcCheck',
    HmrcLetter: {
        hmrcLetter: 'UniqueProbateCode',
        otherwise: 'WaitingForHmrc'
    },
    IhtEstateForm: {
        optionIHT400: 'HmrcLetter',
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
    ProbateEstateValues: {
        lessThanOrEqualToIhtThreshold: 'AssetsOutside',
        otherwise: 'DeceasedAlias'
    },
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
    IhtValue: {
        lessThanOrEqualToIhtThreshold: 'AssetsOutside',
        otherwise: 'DeceasedAlias'
    },
    IhtPaper: {
        lessThanOrEqualToIhtThreshold: 'AssetsOutside',
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
        inEnglandOrWales: 'DivorceDate',
        otherwise: 'StopPage'
    },
    DivorceDate: 'TaskList',
    RelationshipToDeceased: {
        childOrGrandchildDeceasedMarried: 'SpouseNotApplyingReason',
        childAndDeceasedNotMarried: 'AdoptedIn',
        grandchildAndDeceasedNotMarried: 'DeceasedChildAlive',
        adoptedChild: 'AdoptionPlace',
        spousePartnerLessThanIhtThreshold: 'ApplicantName',
        spousePartnerMoreThanIhtThreshold: 'AnyChildren',
        otherwise: 'StopPage'
    },
    SpouseNotApplyingReason: {
        childAndSpouseNotApplying: 'AdoptedIn',
        grandchildAndSpouseNotApplying: 'DeceasedChildAlive',
        otherwise: 'StopPage'
    },
    DeceasedChildAlive: {
        childNotAlive: 'AdoptedIn',
        otherwise: 'StopPage'
    },
    AdoptedIn: {
        adoptedIn: 'PlaceOfAdoption',
        notAdoptedIn: 'AdoptedOut'
    },
    AdoptedOut: {
        childNotAdoptedOut: 'AnyOtherChildren',
        grandchildNotAdoptedOut: 'GrandchildAdoptedIn',
        otherwise: 'StopPage'
    },
    GrandchildAdoptedIn: {
        grandchildAdoptedIn: 'GrandchildAdoptionPlace',
        grandchildNotAdoptedIn: 'GrandchildAdoptedOut',
    },
    GrandchildAdoptedOut: {
        grandchildNotAdoptedOut: 'AnyOtherChildren',
        otherwise: 'StopPage'
    },
    GrandchildAdoptionPlace: {
        grandchildAdoptedInEnglandOrWales: 'AnyOtherChildren',
        otherwise: 'StopPage'
    },
    PlaceOfAdoption: {
        childAndAdoptedInEnglandOrWales: 'AnyOtherChildren',
        grandchildAndAdoptedInEnglandOrWales: 'GrandchildAdoptedIn',
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
        hadOtherChildren: 'AnyPredeceasedChildren',
        childAndHadNoChildren: 'ApplicantName',
        grandchildAndHadNoChildren: 'GrandchildParentHasOtherChildren'
    },
    AllChildrenOver18: {
        childAndAllChildrenOver18: 'ApplicantName',
        grandchildAndAllChildrenOver18: 'GrandchildParentHasOtherChildren',
        otherwise: 'StopPage'
    },
    GrandchildParentHasOtherChildren: {
        grandchildParentHasOtherChildren: 'GrandchildParentHasAllChildrenOver18',
        otherwise: 'ApplicantName'
    },
    GrandchildParentHasAllChildrenOver18: {
        allChildrenOver18: 'ApplicantName',
        otherwise: 'StopPage'
    },
    AnyPredeceasedChildren: {
        hadSomeOrAllPredeceasedChildren: 'AnySurvivingGrandchildren',
        optionNo: 'AllChildrenOver18'
    },
    AnySurvivingGrandchildren: {
        hadSurvivingGrandchildren: 'AnyGrandchildrenUnder18',
        hadOtherChildrenAndHadNoSurvivingGrandchildren: 'AllChildrenOver18',
        childAndNoOtherChildrenAndHadNoSurvivingGrandchildren: 'ApplicantName',
        grandchildAndNoSurvivingGrandchildrenOfOtherChildren: 'GrandchildParentHasOtherChildren'
    },
    AnyGrandchildrenUnder18: {
        allGrandchildrenOver18AndSomePredeceasedChildren: 'AllChildrenOver18',
        childAndGrandchildrenOver18AndAllPredeceasedChildren: 'ApplicantName',
        grandchildAndGrandchildrenOver18AndAllPredeceasedChildren: 'GrandchildParentHasOtherChildren',
        otherwise: 'StopPage'
    },
    ApplicantName: 'ApplicantPhone',
    ApplicantPhone: 'ApplicantAddress',
    ApplicantAddress: 'Equality',
    Equality: 'Summary',
    Summary: 'TaskList',
    Declaration: 'TaskList',
    CopiesStart: 'CopiesUk',
    CopiesUk: 'AssetsOverseas',
    AssetsOverseas: {
        assetsoverseas: 'CopiesOverseas',
        otherwise: 'CopiesSummary'
    },
    CopiesOverseas: 'CopiesSummary',
    CopiesSummary: 'PaymentBreakdown',
    PaymentBreakdown: 'PaymentStatus',
    PaymentStatus: 'TaskList',
    Documents: 'ThankYou',
    ThankYou: 'TaskList',
    TaskList: 'TaskList',
    Dashboard: 'TaskList',
    StopPage: 'StopPage',
    ProvideInformation: {
        responseOrDocument: 'ReviewResponse',
        isUploadingDocument: 'ProvideInformation',
        otherwise: 'CitizensHub'
    },
    ReviewResponse: 'CitizensHub'
};

module.exports.stepList = stepList;
module.exports.taskList = taskList;
