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
        parentSiblingNotMarried: 'AnyLivingDescendants',
        otherwise: 'StopPage'
    },
    AnyLivingDescendants: {
        anyLivingParents: 'AnyLivingParents',
        adoptedIn: 'DeceasedAdoptedIn',
        otherwise: 'StopPage'
    },
    AnyLivingParents: {
        hasNoLivingParents: 'DeceasedAdoptedIn',
        otherwise: 'StopPage'
    },
    SameParents: {
        wholeOrHalfBloodSibling: 'AdoptedIn',
        otherwise: 'StopPage'
    },
    SpouseNotApplyingReason: {
        childAndSpouseNotApplying: 'AdoptedIn',
        grandchildAndSpouseNotApplying: 'DeceasedChildAlive',
        otherwise: 'StopPage'
    },
    DeceasedChildAlive: {
        childNotAlive: 'ParentAdoptedIn',
        otherwise: 'StopPage'
    },
    AdoptedIn: {
        adoptedIn: 'AdoptionPlace',
        notAdoptedIn: 'AdoptedOut'
    },
    AdoptedOut: {
        childOrGrandchildNotAdoptedOut: 'AnyOtherChildren',
        siblingNotAdoptedOut: 'AnyOtherWholeSiblings',
        otherwise: 'StopPage'
    },
    AdoptionPlace: {
        childOrGrandChildAdoptedInEnglandOrWales: 'AnyOtherChildren',
        siblingAdoptedInEnglandOrWales: 'AnyOtherWholeSiblings',
        otherwise: 'StopPage'
    },
    ParentAdoptedIn: {
        parentAdoptedIn: 'ParentAdoptionPlace',
        parentNotAdoptedIn: 'ParentAdoptedOut',
    },
    ParentAdoptedOut: {
        parentNotAdoptedOut: 'AdoptedIn',
        otherwise: 'StopPage'
    },
    ParentAdoptionPlace: {
        parentAdoptedInEnglandOrWales: 'AdoptedIn',
        otherwise: 'StopPage'
    },
    DeceasedAdoptedIn: {
        deceasedAdoptedIn: 'DeceasedAdoptionPlace',
        deceasedNotAdoptedIn: 'DeceasedAdoptedOut'
    },
    DeceasedAdoptedOut: {
        parentApplyingAndDeceasedNotAdoptedOut: 'AnyOtherParentAlive',
        siblingApplyingAndDeceasedNotAdoptedOut: 'SameParents',
        otherwise: 'StopPage'
    },
    DeceasedAdoptionPlace: {
        parentApplyingAndDeceasedAdoptedInEnglandOrWales: 'AnyOtherParentAlive',
        siblingApplyingAndDeceasedAdoptedInEnglandOrWales: 'SameParents',
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
    AnyOtherWholeSiblings: {
        hadOtherWholeSiblings: 'AnyPredeceasedWholeSiblings',
        hadOneParentSameAndHadNoWholeSiblings: 'AnyOtherHalfSiblings',
        otherwise: 'ApplicantName'
    },
    AnyPredeceasedWholeSiblings: {
        hadSomeOrAllPredeceasedWholeSibling: 'AnySurvivingWholeNiecesAndWholeNephews',
        hadNoPredeceasedWholeSiblings: 'AllWholeSiblingsOver18',
        otherwise: 'StopPage'
    },
    AnySurvivingWholeNiecesAndWholeNephews: {
        hasBothParentsSameAndHasSurvivors: 'AllWholeNiecesAndWholeNephewsOver18',
        hasBothParentsSameAndHadOtherWholeSiblingAndHadNoSurvivors: 'AllWholeSiblingsOver18',
        hasBothParentsSameAndHadNoOtherWholeSiblingAndHadNoSurvivors: 'ApplicantName',
        hasOneParentsSameAndHadAllPredeceasedWholeSiblingAndNoSurvivors: 'AnyOtherHalfSiblings',
        otherwise: 'StopPage'
    },
    AllWholeNiecesAndWholeNephewsOver18: {
        allWholeNiecesAndWholeNephewsOver18AndSomePredeceasedWholeSiblings: 'AllWholeSiblingsOver18',
        allWholeNiecesAndWholeNephewsOver18AndAllPredeceasedWholeSiblings: 'ApplicantName',
        otherwise: 'StopPage'
    },
    AllWholeSiblingsOver18: {
        allWholeSiblingsOver18: 'ApplicantName',
        otherwise: 'StopPage'
    },
    AnyOtherHalfSiblings: {
        hadOtherOtherHalfSiblings: 'AnyPredeceasedHalfSiblings',
        otherwise: 'ApplicantName'
    },
    AnyPredeceasedHalfSiblings: {
        hadSomeOrAllPredeceasedHalfSibling: 'AnySurvivingHalfNiecesAndHalfNephews',
        optionNo: 'AllHalfSiblingsOver18'
    },
    AnySurvivingHalfNiecesAndHalfNephews: {
        hadSurvivingHalfNiecesAndHalfNephews: 'AllHalfNiecesAndHalfNephewsOver18',
        hadOtherHalfSiblingAndHadNoSurvivingHalfNiecesOrNephews: 'AllHalfSiblingsOver18',
        hadNoOtherHalfSiblingAndHadNoSurvivingHalfNiecesOrNephews: 'ApplicantName'
    },
    AllHalfNiecesAndHalfNephewsOver18: {
        allHalfNiecesAndHalfNephewsOver18AndSomePredeceasedHalfSiblings: 'AllHalfSiblingsOver18',
        allHalfNiecesAndHalfNephewsOver18AndAllPredeceasedHalfSiblings: 'ApplicantName',
        otherwise: 'StopPage'
    },
    AllHalfSiblingsOver18: {
        allHalfSiblingsOver18: 'ApplicantName',
        otherwise: 'StopPage'
    },
    AnyOtherParentAlive: 'ApplicantName',
    JointApplication: {
        isJointApplication: 'CoApplicantRelationshipToDeceased',
        isParentJointApplication: 'CoApplicantName',
        notJointApplication: 'Equality',
        otherwise: 'TaskList'
    },
    CoApplicantRelationshipToDeceased: {
        childOrSibling: 'CoApplicantName',
        grandchildOrNieceNephew: 'ParentDieBefore',
        otherwise: 'StopPage'
    },
    RemoveCoApplicant: 'JointApplication',
    CoApplicantName: {
        isChildJointApplication: 'CoApplicantAdoptedIn',
        isParentJointApplication: 'CoApplicantEmail'
    },
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
        grandChildAdoptedInEnglandOrWales: 'CoApplicantParentAdoptedIn',
        otherwise: 'StopPage'
    },
    CoApplicantAdoptedOut: {
        childOrSiblingOrNieceOrNephewNotAdoptedOut: 'CoApplicantEmail',
        grandChildCoApplicantNotAdoptedOut: 'CoApplicantParentAdoptedIn',
        otherwise: 'StopPage'
    },
    CoApplicantParentAdoptedIn: {
        parentAdoptedIn: 'CoApplicantParentAdoptionPlace',
        notParentAdoptedIn: 'CoApplicantParentAdoptedOut'
    },
    CoApplicantParentAdoptedOut: {
        parentNotAdoptedOut: 'CoApplicantEmail',
        otherwise: 'StopPage'
    },
    CoApplicantParentAdoptionPlace: {
        parentAdoptedOutEnglandOrWales: 'CoApplicantEmail',
        otherwise: 'StopPage'
    },
    CoApplicantEmail: 'ExecutorAddress',
    ExecutorContactDetails: 'ExecutorAddress',
    ExecutorAddress: {
        isChildJointApplication: 'JointApplication',
        isParentJointApplication: 'Equality'
    },
    ApplicantName: 'ApplicantPhone',
    ApplicantPhone: 'ApplicantAddress',
    ApplicantAddress: {
        hasCoApplicant: 'JointApplication',
        hasNoCoApplicant: 'Equality',
        isIntestacyWithOtherParent: 'JointApplication',
        isIntestacyNoOtherParent: 'Equality',
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
