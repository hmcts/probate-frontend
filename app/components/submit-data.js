'use strict';

const {mapValues, get} = require('lodash');
const steps = require('app/core/initSteps').steps;
const ExecutorsWrapper = require('app/wrappers/Executors');
const MaritalStatusEnum = require('app/utils/MaritalStatusEnum');
const RelationshipToDeceasedEnum = require('app/utils/RelationshipToTheDeceasedEnum');
const SpouseNotApplyingEnum = require('app/utils/SpouseNotApplyingEnum');
const dataMap = {
    applicantFirstName: 'applicant.firstName',
    applicantLastName: 'applicant.lastName',
    applicantSameWillName: 'applicant.nameAsOnTheWill',
    applicantAlias: 'applicant.alias',
    applicantAliasReason: 'applicant.aliasReason',
    applicantAddress: 'applicant.address',
    applicantPostcode: 'applicant.postcode',
    applicantPhone: 'applicant.phoneNumber',
    applicantEmail: 'applicantEmail',
    deceasedFirstname: 'deceased.firstName',
    deceasedSurname: 'deceased.lastName',
    deceasedAliasAssets: 'deceased.alias',
    deceasedOtherNames: 'deceased.otherNames',
    deceasedMarriedAfterDateOnWill: 'deceased.married',
    deceasedAddress: 'deceased.address',
    deceasedPostcode: 'deceased.postcode',
    deceasedDod: 'deceased.dod_formattedDate',
    deceasedDob: 'deceased.dob_formattedDate',
    noOfExecutors: 'executors.executorsNumber',
    dealingWithEstate: 'executors.otherExecutorsApplying',
    willWithCodicils: 'will.codicils',
    willCodicilsNumber: 'will.codicilsNumber',
    ihtForm: 'iht.form',
    ihtFormId: 'iht.ihtFormId',
    ihtIdentifier: 'iht.identifier',
    ihtGrossValue: 'iht.grossValue',
    ihtNetValue: 'iht.netValue',
    copiesUK: 'copies.uk',
    copiesOverseas: 'copies.overseas',
    totalFee: 'payment.total',
    reference: 'payment.reference',
    legalStatement: 'declaration.legalStatement',
    declaration: 'declaration.declaration',
    payloadVersion: 'payloadVersion',
    payment: 'payment',
    caseId: 'ccdCase.id',
    caseState: 'ccdCase.state',
    registry: 'registry',
    caseType: 'caseType',
    deceasedHasAssetsOutsideUK: 'iht.assetsOutside',
    foreignAssetEstateValue: 'iht.netValueAssetsOutside',
    deceasedDivorcedInEnglandOrWales: 'deceased.legalProcess',
    primaryApplicantAdoptionInEnglandOrWales: 'applicant.adoptionPlace',
    deceasedOtherChildren: 'deceased.anyOtherChildren',
    allDeceasedChildrenOverEighteen: 'deceased.allChildrenOver18',
    anyDeceasedChildrenDieBeforeDeceased: 'deceased.anyDeceasedChildren',
    anyDeceasedGrandChildrenUnderEighteen: 'deceased.anyGrandchildrenUnder18',
    deceasedAnyChildren: 'deceased.anyChildren'
};

const submitData = (ctx, data) => {
    const mappedData = mapValues(dataMap, path => get(data, path));

    mappedData.copiesUK = get(data, 'copies.uk', 0);

    if (get(data, 'assets.assetsoverseas') === steps.AssetsOverseas.generateContent(ctx).optionNo) {
        mappedData.copiesOverseas = 0;
    }

    const ihtMethod = get(data, 'iht.method');

    if (ihtMethod === steps.IhtMethod.generateContent(ctx).optionPaper) {
        mappedData.ihtIdentifier = steps.CopiesOverseas.commonContent().notApplicable;
    } else {
        mappedData.ihtIdentifier = get(data, 'iht.identifier');
        mappedData.ihtForm = 'online';
    }

    if (get(data, 'applicant.aliasReason') === 'other') {
        mappedData.applicantOtherReason = get(data, 'applicant.otherReason');
    }

    if (get(data, 'documents.uploads')) {
        mappedData.documentUploads = get(data, 'documents.uploads');
    }

    const executorsWrapper = new ExecutorsWrapper(data.executors);

    mappedData.noOfApplicants = executorsWrapper.executorsApplying().length;
    mappedData.executorsApplying = executorsWrapper.executorsApplying(true);
    mappedData.executorsNotApplying = executorsWrapper.executorsNotApplying(true);

    if (get(data, 'deceased.maritalStatus')) {
        mappedData.deceasedMaritalStatus = MaritalStatusEnum.getCCDCode(get(data, 'deceased.maritalStatus'));
    }
    if (get(data, 'applicant.relationshipToDeceased')) {
        mappedData.primaryApplicantRelationshipToDeceased = RelationshipToDeceasedEnum.getCCDCode(get(data, 'applicant.relationshipToDeceased'));
    }
    if (get(data, 'applicant.spouseNotApplyingReason')) {
        mappedData.deceasedSpouseNotApplyingReason = SpouseNotApplyingEnum.getCCDCode(get(data, 'applicant.spouseNotApplyingReason'));
    }
    return mappedData;
};

module.exports = submitData;
