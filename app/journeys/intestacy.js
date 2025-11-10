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
    WaitingForHmrc: 'TaskList',
    IhtUnusedAllowanceClaimed: 'ProbateEstateValues',
    ProbateEstateValues: {
        lessThanOrEqualToAssetsThreshold: 'AssetsOutside',
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
        lessThanOrEqualToAssetsThreshold: 'AssetsOutside',
        otherwise: 'DeceasedAlias'
    },
    IhtPaper: {
        lessThanOrEqualToAssetsThreshold: 'AssetsOutside',
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
        childOrGrandchildDeceasedNotMarried: 'ChildAdoptedIn',
        adoptedChild: 'AdoptionPlace',
        spousePartnerLessThanAssetsThreshold: 'ApplicantName',
        spousePartnerMoreThanAssetsThreshold: 'AnyChildren',
        otherwise: 'StopPage'
    },
    SiblingAnyParentsAlive: {
        siblingHasParentsAlive: 'SiblingAdoptedIn',
        otherwise: 'StopPage'
    },
    SiblingAdoptedIn: {
        siblingAdoptedIn: 'SiblingAdoptionPlace',
        siblingNotAdoptedIn: 'SiblingAdoptedOut'
    },
    SiblingAdoptionPlace: {
        siblingAdoptedInEnglandOrWales: 'SameParents',
        otherwise: 'StopPage'
    },
    SiblingAdoptedOut: {
        siblingAdoptedOut: 'SameParents',
        otherwise: 'StopPage'
    },
    SameParents: {
        optionBothParentsSame: 'WholeBloodSiblingAdoptedIn',
        optionOneParentsSame: 'HalfBloodSiblingAdoptedIn',
        optionNoParentsSame: 'StopPage'
    },
    SpouseNotApplyingReason: {
        renouncing: 'ChildAdoptedIn',
        otherwise: 'StopPage'
    },
    ChildAdoptedIn: {
        childAdoptedIn: 'ChildAdoptionPlace',
        childNotAdoptedIn: 'ChildAdoptedOut'
    },
    ChildAdoptedOut: {
        childAdoptedOut: 'AnyOtherChildren',
        otherwise: 'StopPage'
    },
    ChildAdoptionPlace: {
        childAdoptedInEnglandOrWales: 'AnyOtherChildren',
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
    JoinApplication: 'CoApplicantRelationshipToDeceased',
    CoApplicantRelationshipToDeceased: {
        optionChild: 'CoApplicantName',
        optionGrandchild: 'ParentDieBefore',
        otherwise: 'StopPage'
    },
    RemoveCoApplicant: 'JointApplication',
    CoApplicantName: 'CoApplicantAdoptedIn',
    CoApplicantAdoptedIn: {
        adoptedIn: 'CoApplicantAdoptionPlace',
        notAdoptedIn: 'CoApplicantAdoptedOut'
    },
    ParentDieBefore: {
        parentDieBefore: 'CoApplicantName',
        otherwise: 'StopPage'
    },
    CoApplicantAdoptionPlace: {
        childAdoptedInEnglandOrWales: 'CoApplicantEmail',
        grandChildAdoptedInEnglandOrWales: 'ParentAdoptedIn',
        otherwise: 'StopPage'
    },
    CoApplicantAdoptedOut: {
        childNotAdoptedOut: 'CoApplicantEmail',
        grandchildNotAdoptedOut: 'ParentAdoptedIn',
        otherwise: 'StopPage'
    },
    ParentAdoptedIn: {
        parentAdoptedIn: 'ParentAdoptionPlace',
        notParentAdoptedIn: 'ParentAdoptedOut'
    },
    ParentAdoptedOut: {
        parentNotAdoptedOut: 'CoApplicantEmail',
        otherwise: 'StopPage'
    },
    ParentAdoptionPlace: {
        parentAdoptedOutEnglandOrWales: 'CoApplicantEmail',
        otherwise: 'StopPage'
    },
    CoApplicantEmail: 'ExecutorAddress',
    ExecutorContactDetails: 'ExecutorAddress',
    ExecutorAddress: 'JointApplication',
    ApplicantName: 'ApplicantPhone',
    ApplicantPhone: 'ApplicantAddress',
    ApplicantAddress: {
        hasCoApplicant: 'JointApplication',
        hasNoCoApplicant: 'Equality',
        otherwise: 'Equality'
    },
    Equality: 'Summary',
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
    VerifyDod: 'CoApplicantDeclaration',
    CoApplicantDeclaration: {
        agreed: 'IntestacyCoApplicantAgreePage',
        otherwise: 'IntestacyCoApplicantDisagreePage'
    },
    CoApplicantAgreePage: 'CoApplicantAgreePage',
    CoApplicantDisagreePage: 'CoApplicantDisagreePage',
    ProvideInformation: {
        responseOrDocument: 'ReviewResponse',
        isUploadingDocument: 'ProvideInformation',
        otherwise: 'CitizensHub'
    },
    ReviewResponse: 'CitizensHub'
};

module.exports.stepList = stepList;
module.exports.taskList = taskList;
