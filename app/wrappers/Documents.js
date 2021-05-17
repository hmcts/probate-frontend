'use strict';
const caseTypes = require('app/utils/CaseTypes');

class Documents {
    constructor(formdata) {
        this.formdata = formdata || {};
        this.deceasedData = this.formdata.deceased || {};
        this.ihtData = this.formdata.iht || {};
        this.applicantData = this.formdata.applicant || {};
    }

    documentsSent() {
        return this.formdata.sentDocuments === 'true';
    }

    documentsRequired() {
        if (this.formdata.caseType === caseTypes.GOP) {
            return true;
        }
        const deceasedMarried = this.deceasedData.maritalStatus === 'optionMarried';
        const applicantIsChild = this.applicantData.relationshipToDeceased === 'optionChild' || this.applicantData.relationshipToDeceased === 'optionAdoptedChild';
        const iht205Used = this.ihtData.method === 'optionPaper' && this.ihtData.form === 'optionIHT205';
        const interimDeathCert = this.deceasedData.deathCertificate === 'optionInterimCertificate';
        const foreignDeathCert = this.deceasedData.diedEngOrWales === 'optionNo';
        return (deceasedMarried && applicantIsChild) || iht205Used || interimDeathCert || foreignDeathCert;
    }
}

module.exports = Documents;
