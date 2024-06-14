'use strict';
const caseTypes = require('app/utils/CaseTypes');
const DeceasedWrapper = require('./Deceased');
const ApplicantWrapper = require('./Applicant');

class Documents {
    constructor(formdata) {
        this.formdata = formdata || {};
        this.deceasedData = this.formdata.deceased || {};
        this.ihtData = this.formdata.iht || {};
        this.applicantData = this.formdata.applicant || {};
        this.deceasedWrapper = new DeceasedWrapper(this.deceasedData);
        this.applicantWrapper = new ApplicantWrapper(this.formdata);
    }

    documentsSent() {
        return this.formdata.sentDocuments === 'true';
    }

    documentsRequired() {
        if (this.formdata.caseType === caseTypes.GOP) {
            return true;
        }

        return this.intestacyDocumentsRequired();
    }

    intestacyDocumentsRequired() {
        const deceasedMarried = this.deceasedWrapper.hasMarriedStatus();
        const applicantIsChild = this.applicantWrapper.isApplicantChild();
        const intestacyDocScreeningConditionsMet = this.intestacyDocScreeningConditionsMet(deceasedMarried, applicantIsChild);
        const intestacyNoDocumentsRequiredCriteriaMet = this.intestacyNoDocumentsRequiredCriteriaMet();
        const iht205Used = (this.ihtData.form === 'optionIHT205' || this.ihtData.ihtFormId === 'optionIHT205');
        const iht207Used = (this.ihtData.form === 'optionIHT207' || this.ihtData.ihtFormId === 'optionIHT207' || this.ihtData.ihtFormEstateId === 'optionIHT207');
        const interimDeathCert = this.deceasedWrapper.hasInterimDeathCertificate();
        const foreignDeathCert = this.deceasedWrapper.hasForeignDeathCertificate();
        if (intestacyDocScreeningConditionsMet && intestacyNoDocumentsRequiredCriteriaMet) {
            return false;
        }
        return (deceasedMarried && applicantIsChild) || iht205Used || iht207Used || interimDeathCert || foreignDeathCert;
    }

    intestacyDocScreeningConditionsMet(deceasedMarried, applicantIsChild) {
        const deceasedNotMarriedAndApplicantChild = !deceasedMarried && applicantIsChild;
        const anyOtherChildren = this.deceasedWrapper.hasAnyOtherChildren();
        const allChildrenOver18 = this.deceasedWrapper.hasAllChildrenOver18();
        const anyDeceasedChildren = this.deceasedWrapper.hasAnyDeceasedChildren();
        const anyGrandchildrenUnder18 = this.deceasedWrapper.hasAnyGrandChildrenUnder18();
        const adoptionTookPlaceInEngOrWales = this.applicantWrapper.adoptionTookPlaceInEngOrWales();

        if (deceasedMarried && this.applicantWrapper.isSpouse()) {
            return true;
        }

        if (deceasedNotMarriedAndApplicantChild && anyOtherChildren && allChildrenOver18 && anyDeceasedChildren && !anyGrandchildrenUnder18) {
            return true;
        }

        if (deceasedNotMarriedAndApplicantChild && anyOtherChildren && allChildrenOver18 && !anyDeceasedChildren) {
            return true;
        }

        if (deceasedNotMarriedAndApplicantChild && adoptionTookPlaceInEngOrWales && !anyOtherChildren) {
            return true;
        }

        if (deceasedNotMarriedAndApplicantChild && !anyOtherChildren) {
            return true;
        }

        return false;
    }

    intestacyNoDocumentsRequiredCriteriaMet() {
        const iht400Used = (this.ihtData.form === 'optionIHT400421' || this.ihtData.ihtFormEstateId === 'optionIHT400421') || (this.ihtData.form === 'optionIHT400' || this.ihtData.ihtFormEstateId === 'optionIHT400');
        const deathCert = this.deceasedWrapper.hasDeathCertificate();
        const exceptedEstate = this.ihtData.estateValueCompleted === 'optionNo';
        return (iht400Used && deathCert) || (exceptedEstate && deathCert);
    }
}

module.exports = Documents;
