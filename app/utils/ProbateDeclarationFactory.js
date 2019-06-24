'use strict';

const FormatName = require('app/utils/FormatName');

class ProbateDeclarationFactory {

    static build(ctx, content, formdata, multipleApplicantSuffix, executorsApplying, executorsApplyingText, executorsNotApplyingText) {
        const legalStatement = {
            intro: content[`intro${multipleApplicantSuffix}`]
                .replace('{applicantName}', formdata.applicantName),
            applicant: content[`legalStatementApplicant${multipleApplicantSuffix}`]
                .replace('{detailsOfApplicants}', FormatName.formatMultipleNamesAndAddress(executorsApplying, content, formdata.applicantAddress))
                .replace('{applicantName}', formdata.applicantName)
                .replace('{applicantAddress}', formdata.applicantAddress.formattedAddress),
            deceased: content.legalStatementDeceased
                .replace('{deceasedName}', formdata.deceasedName)
                .replace('{deceasedAddress}', formdata.deceasedAddress.formattedAddress)
                .replace('{deceasedDob}', formdata.dob_formattedDate)
                .replace('{deceasedDod}', formdata.dod_formattedDate),
            deceasedOtherNames: formdata.deceasedOtherNames ? content.deceasedOtherNames.replace('{deceasedOtherNames}', formdata.deceasedOtherNames) : '',
            executorsApplying: executorsApplyingText,
            deceasedEstateValue: content.deceasedEstateValue
                .replace('{ihtGrossValue}', formdata.ihtGrossValue)
                .replace('{ihtNetValue}', formdata.ihtNetValue),
            deceasedEstateLand: content[`deceasedEstateLand${multipleApplicantSuffix}`]
                .replace(/{deceasedName}/g, formdata.deceasedName),
            executorsNotApplying: executorsNotApplyingText
        };

        const declaration = {
            confirm: content[`declarationConfirm${multipleApplicantSuffix}`]
                .replace('{deceasedName}', formdata.deceasedName),
            confirmItem1: content.declarationConfirmItem1,
            confirmItem2: content.declarationConfirmItem2,
            confirmItem3: content.declarationConfirmItem3,
            requests: content[`declarationRequests${multipleApplicantSuffix}`],
            requestsItem1: content.declarationRequestsItem1,
            requestsItem2: content.declarationRequestsItem2,
            understand: content[`declarationUnderstand${multipleApplicantSuffix}`],
            understandItem1: content[`declarationUnderstandItem1${multipleApplicantSuffix}`],
            understandItem2: content[`declarationUnderstandItem2${multipleApplicantSuffix}`],
            accept: content.declarationCheckbox,
            submitWarning: content[`submitWarning${multipleApplicantSuffix}`]
        };

        return {legalStatement, declaration};
    }
}

module.exports = ProbateDeclarationFactory;
