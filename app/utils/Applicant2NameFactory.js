'use strict';

const contentMaritalStatus = require('app/resources/en/translation/deceased/maritalstatus');
const contentRelationshipToDeceased = require('app/resources/en/translation/applicant/relationshiptodeceased');
const contentAnyChildren = require('app/resources/en/translation/deceased/anychildren');
const contentAnyOtherChildren = require('app/resources/en/translation/deceased/anyotherchildren');

const config = require('app/config');

class Applicant2NameFactory {

    static getApplicant2Name(formdata, content) {
        let applicant2 = '';
        if (formdata.maritalStatus === contentMaritalStatus.optionMarried) {
            applicant2 = getMarried(formdata, content);
        } else {
            applicant2 = getNotMarried(formdata, content);
        }
        return applicant2.replace(/{deceasedName}/g, formdata.deceasedName);
    }
}

function getMarried(formdata, content) {
    if (formdata.relationshipToDeceased === contentRelationshipToDeceased.optionSpousePartner) {
        return getSpousePartner(formdata, content);
    }
    return getNonSpousePartner(formdata, content);
}

function getSpousePartner(formdata, content) {
    if (formdata.anyChildren === contentAnyChildren.optionNo || formdata.ihtTotalNetValue <= config.assetsValueThreshold) {
        return content.intestacyDeceasedMarriedSpouseApplyingHadNoChildrenOrEstateLessThan250k;
    }
    return content.intestacyDeceasedMarriedSpouseApplyingHadChildren;
}

function getNonSpousePartner(formdata, content) {
    if (formdata.ihtTotalNetValue <= config.assetsValueThreshold) {
        return getAnyOtherChildrenBelowThreshold(formdata, content);
    }
    return getAnyOtherChildrenAboveThreshold(formdata, content);
}

function getAnyOtherChildrenBelowThreshold(formdata, content) {
    if (formdata.anyOtherChildren === contentAnyOtherChildren.optionYes) {
        if (formdata.relationshipToDeceased === contentRelationshipToDeceased.optionAdoptedChild) {
            return content.intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasSiblingsIsAdopted;
        }
        return content.intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasSiblingsIsNotAdopted;

    }
    if (formdata.relationshipToDeceased === contentRelationshipToDeceased.optionAdoptedChild) {
        return content.intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasNoSiblingsIsAdopted;
    }
    return content.intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasNoSiblingsIsNotAdopted;
}

function getAnyOtherChildrenAboveThreshold(formdata, content) {
    if (formdata.anyOtherChildren === contentAnyOtherChildren.optionYes) {
        if (formdata.relationshipToDeceased === contentRelationshipToDeceased.optionAdoptedChild) {
            return content.intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasSiblingsIsAdopted;
        }
        return content.intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasSiblingsIsNotAdopted;

    }
    if (formdata.relationshipToDeceased === contentRelationshipToDeceased.optionAdoptedChild) {
        return content.intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasNoSiblingsIsAdopted;
    }
    return content.intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasNoSiblingsIsNotAdopted;
}

function getNotMarried(formdata, content) {
    if (formdata.anyOtherChildren === contentAnyOtherChildren.optionYes) {
        return getNotMarriedAndOtherChildren(formdata, content);
    }
    return getNotMarriedAndNoOtherChildren(formdata, content);

}

function getNotMarriedAndOtherChildren(formdata, content) {
    if (formdata.relationshipToDeceased === contentRelationshipToDeceased.optionAdoptedChild) {
        return content.intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsAdopted;
    }
    return content.intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsNotAdopted;
}

function getNotMarriedAndNoOtherChildren(formdata, content) {
    if (formdata.relationshipToDeceased === contentRelationshipToDeceased.optionAdoptedChild) {
        return content.intestacyDeceasedNotMarriedChildApplyingHasNoSiblingsIsAdopted;
    }
    return content.intestacyDeceasedNotMarriedChildApplyingHasNoSiblingsIsNotAdopted;
}

module.exports = Applicant2NameFactory;
