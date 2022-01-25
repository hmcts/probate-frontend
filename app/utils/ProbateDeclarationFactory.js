'use strict';

const FormatName = require('app/utils/FormatName');

class ProbateDeclarationFactory {

    static build(ctx, content, formdata, multipleApplicantSuffix, executorsApplying, executorsApplyingText, executorsNotApplyingText) {
        const legalStatement = {};
        const declaration = {};

        legalStatement.en = {
            intro: content.en[`intro${multipleApplicantSuffix}`]
                .replace('{applicantName}', formdata.applicantName),
            applicant: content.en[`legalStatementApplicant${multipleApplicantSuffix}`]
                .replace('{detailsOfApplicants}', FormatName.formatMultipleNamesAndAddress(executorsApplying, content.en, formdata.applicantAddress))
                .replace('{applicantName}', formdata.applicantName)
                .replace('{applicantAddress}', formdata.applicantAddress.formattedAddress),
            deceased: content.en.legalStatementDeceased
                .replace('{deceasedName}', formdata.deceasedName)
                .replace('{deceasedAddress}', formdata.deceasedAddress.formattedAddress)
                .replace('{deceasedDob}', formdata.dobFormattedDate.en)
                .replace('{deceasedDod}', formdata.dodFormattedDate.en),
            deceasedOtherNames: formdata.deceasedOtherNames.en ? content.en.deceasedOtherNames.replace('{deceasedOtherNames}', formdata.deceasedOtherNames.en) : '',
            executorsApplying: executorsApplyingText.en,
            deceasedEstateValue: content.en.deceasedEstateValue
                .replace('{ihtGrossValue}', formdata.ihtGrossValue)
                .replace('{ihtNetValue}', formdata.ihtNetValue),
            deceasedEstateValueExceptedEstateConfirmation: content.en.deceasedEstateValueExceptedEstateConfirmation,
            deceasedEstateLand: content.en[`deceasedEstateLand${multipleApplicantSuffix}`]
                .replace(/{deceasedName}/g, formdata.deceasedName),
            executorsNotApplying: executorsNotApplyingText.en
        };
        declaration.en = {
            confirm: content.en[`declarationConfirm${multipleApplicantSuffix}`]
                .replace('{deceasedName}', formdata.deceasedName),
            confirmItem1: content.en.declarationConfirmItem1,
            confirmItem2: content.en.declarationConfirmItem2,
            confirmItem3: content.en.declarationConfirmItem3,
            requests: content.en[`declarationRequests${multipleApplicantSuffix}`],
            requestsItem1: content.en.declarationRequestsItem1,
            requestsItem2: content.en.declarationRequestsItem2,
            understand: content.en[`declarationUnderstand${multipleApplicantSuffix}`],
            understandItem1: content.en[`declarationUnderstandItem1${multipleApplicantSuffix}`],
            understandItem2: content.en.declarationUnderstandItem2,
            accept: content.en.declarationCheckbox,
            submitWarning: content.en[`submitWarning${multipleApplicantSuffix}`]
        };

        legalStatement.cy = {
            intro: content.cy[`intro${multipleApplicantSuffix}`]
                .replace('{applicantName}', formdata.applicantName),
            applicant: content.cy[`legalStatementApplicant${multipleApplicantSuffix}`]
                .replace('{detailsOfApplicants}', FormatName.formatMultipleNamesAndAddress(executorsApplying, content.cy, formdata.applicantAddress))
                .replace('{applicantName}', formdata.applicantName)
                .replace('{applicantAddress}', formdata.applicantAddress.formattedAddress),
            deceased: content.cy.legalStatementDeceased
                .replace('{deceasedName}', formdata.deceasedName)
                .replace('{deceasedAddress}', formdata.deceasedAddress.formattedAddress)
                .replace('{deceasedDob}', formdata.dobFormattedDate.cy)
                .replace('{deceasedDod}', formdata.dodFormattedDate.cy),
            deceasedOtherNames: formdata.deceasedOtherNames.cy ? content.cy.deceasedOtherNames.replace('{deceasedOtherNames}', formdata.deceasedOtherNames.cy) : '',
            executorsApplying: executorsApplyingText.cy,
            deceasedEstateValue: content.cy.deceasedEstateValue
                .replace('{ihtGrossValue}', formdata.ihtGrossValue)
                .replace('{ihtNetValue}', formdata.ihtNetValue),
            deceasedEstateValueExceptedEstateConfirmation: content.cy.deceasedEstateValueExceptedEstateConfirmation,
            deceasedEstateLand: content.cy[`deceasedEstateLand${multipleApplicantSuffix}`]
                .replace(/{deceasedName}/g, formdata.deceasedName),
            executorsNotApplying: executorsNotApplyingText.cy
        };
        declaration.cy = {
            confirm: content.cy[`declarationConfirm${multipleApplicantSuffix}`]
                .replace('{deceasedName}', formdata.deceasedName),
            confirmItem1: content.cy.declarationConfirmItem1,
            confirmItem2: content.cy.declarationConfirmItem2,
            confirmItem3: content.cy.declarationConfirmItem3,
            requests: content.cy[`declarationRequests${multipleApplicantSuffix}`],
            requestsItem1: content.cy.declarationRequestsItem1,
            requestsItem2: content.cy.declarationRequestsItem2,
            understand: content.cy[`declarationUnderstand${multipleApplicantSuffix}`],
            understandItem1: content.cy[`declarationUnderstandItem1${multipleApplicantSuffix}`],
            understandItem2: content.cy.declarationUnderstandItem2,
            accept: content.cy.declarationCheckbox,
            submitWarning: content.cy[`submitWarning${multipleApplicantSuffix}`]
        };

        return {legalStatement, declaration};
    }
}

module.exports = ProbateDeclarationFactory;
