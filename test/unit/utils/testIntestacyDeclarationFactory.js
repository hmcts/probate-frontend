'use strict';

const applicant2NameFactory = require('app/utils/Applicant2NameFactory');
const FormatName = require('app/utils/FormatName');
const {get} = require('lodash');
const expect = require('chai').expect;
const config = require('config');
const utils = require('app/components/step-utils');
const moment = require('moment');
const intestacyDeclarationFactory = require('app/utils/IntestacyDeclarationFactory');
const formdata = require('test/data/complete-form').formdata;
const content = {
    en: require('app/resources/en/translation/declaration'),
    cy: require('app/resources/cy/translation/declaration')
};

describe('IntestacyDeclarationFactory', () => {
    let ctx;

    beforeEach(() => {
        ctx = {};

        const formdataApplicant = formdata.applicant || {};
        formdata.applicantName = FormatName.format(formdataApplicant);
        formdata.applicantAddress = get(formdataApplicant, 'address', {});

        const formdataDeceased = formdata.deceased || {};
        formdata.deceasedName = FormatName.format(formdataDeceased);
        formdata.deceasedAddress = get(formdataDeceased, 'address', {});
        formdata.deceasedOtherNames = FormatName.formatMultipleNamesAndAddress(get(formdataDeceased, 'otherNames'), content);
        formdata.dobFormattedDate = utils.formattedDate(moment(formdataDeceased['dob-day'] + '/' + formdataDeceased['dob-month'] + '/' + formdataDeceased['dob-year'], config.dateFormat).parseZone(), 'en');
        formdata.dodFormattedDate = utils.formattedDate(moment(formdataDeceased['dod-day'] + '/' + formdataDeceased['dod-month'] + '/' + formdataDeceased['dod-year'], config.dateFormat).parseZone(), 'en');
        formdata.maritalStatus = formdataDeceased.maritalStatus;
        formdata.relationshipToDeceased = formdataDeceased.relationshipToDeceased;
        formdata.hadChildren = formdataDeceased.hadChildren;
        formdata.anyOtherChildren = formdataDeceased.anyOtherChildren;

        const formdataIht = formdata.iht || {};
        formdata.ihtGrossValue = formdataIht.grossValue ? formdataIht.grossValue.toFixed(2) : 0;
        formdata.ihtNetValue = formdataIht.netValue ? formdataIht.netValue.toFixed(2) : 0;
    });

    describe('build()', () => {
        it('should return the Legal Statement and Declaration objects when the deceased has no other names', (done) => {
            const templateData = intestacyDeclarationFactory.build(ctx, content, formdata);

            expect(templateData).to.deep.equal({
                legalStatement: {
                    en: {
                        applicant: content.en.legalStatementApplicant
                            .replace('{applicantName}', formdata.applicantName)
                            .replace('{applicantAddress}', formdata.applicantAddress.formattedAddress),
                        applicant2: applicant2NameFactory.getApplicant2Name(formdata, content.en),
                        applying: content.en.intestacyLettersOfAdministration
                            .replace('{deceasedName}', formdata.deceasedName),
                        deceased: content.en.intestacyLegalStatementDeceased
                            .replace('{deceasedName}', formdata.deceasedName)
                            .replace('{deceasedAddress}', formdata.deceasedAddress.formattedAddress)
                            .replace('{deceasedDob}', formdata.dobFormattedDate.en)
                            .replace('{deceasedDod}', formdata.dodFormattedDate.en),
                        deceasedChildren: content.en.intestacyDeceasedChildren,
                        deceasedEstateLand: content.en.intestacyDeceasedEstateLand
                            .replace(/{deceasedName}/g, formdata.deceasedName),
                        deceasedEstateValue: content.en.deceasedEstateValue
                            .replace('{ihtGrossValue}', formdata.ihtGrossValue)
                            .replace('{ihtNetValue}', formdata.ihtNetValue),
                        deceasedEstateValueExceptedEstateConfirmation: 'I confirm that the estate is an excepted estate.',
                        deceasedEstateAssetsOverseas: content.en.intestacyDeceasedEstateOutside
                            .replace('{ihtNetValueAssetsOutside}', formdata.ihtNetValueAssetsOutside),
                        deceasedMaritalStatus: content.en.intestacyDeceasedMaritalStatus
                            .replace('{deceasedMaritalStatus}', content.en[get(formdata.deceased, 'maritalStatus', '')].toLowerCase()),
                        deceasedOtherNames: '',
                        intro: content.en.intro
                    },
                    cy: {
                        applicant: content.cy.legalStatementApplicant
                            .replace('{applicantName}', formdata.applicantName)
                            .replace('{applicantAddress}', formdata.applicantAddress.formattedAddress),
                        applicant2: applicant2NameFactory.getApplicant2Name(formdata, content.cy),
                        applying: content.cy.intestacyLettersOfAdministration
                            .replace('{deceasedName}', formdata.deceasedName),
                        deceased: content.cy.intestacyLegalStatementDeceased
                            .replace('{deceasedName}', formdata.deceasedName)
                            .replace('{deceasedAddress}', formdata.deceasedAddress.formattedAddress)
                            .replace('{deceasedDob}', formdata.dobFormattedDate.cy)
                            .replace('{deceasedDod}', formdata.dodFormattedDate.cy),
                        deceasedChildren: content.cy.intestacyDeceasedChildren,
                        deceasedEstateLand: content.cy.intestacyDeceasedEstateLand
                            .replace(/{deceasedName}/g, formdata.deceasedName),
                        deceasedEstateValue: content.cy.deceasedEstateValue
                            .replace('{ihtGrossValue}', formdata.ihtGrossValue)
                            .replace('{ihtNetValue}', formdata.ihtNetValue),
                        deceasedEstateValueExceptedEstateConfirmation: 'Rwy\'n cadarnhau bod yr ystad yn ystad eithriedig.',
                        deceasedEstateAssetsOverseas: content.cy.intestacyDeceasedEstateOutside
                            .replace('{ihtNetValueAssetsOutside}', formdata.ihtNetValueAssetsOutside),
                        deceasedMaritalStatus: content.cy.intestacyDeceasedMaritalStatus
                            .replace('{deceasedMaritalStatus}', content.cy[get(formdata.deceased, 'maritalStatus', '')].toLowerCase()),
                        deceasedOtherNames: '',
                        intro: content.cy.intro
                    }
                },
                declaration: {
                    en: {
                        accept: content.en.declarationCheckbox,
                        confirm: content.en.declarationConfirm
                            .replace('{deceasedName}', formdata.deceasedName),
                        confirmItem1: content.en.declarationConfirmItem1,
                        confirmItem2: content.en.declarationConfirmItem2,
                        confirmItem3: content.en['declarationConfirmItem3-intestacy'],
                        requests: content.en.declarationRequests,
                        requestsItem1: content.en['declarationRequestsItem1-intestacy'],
                        requestsItem2: content.en['declarationRequestsItem2-intestacy'],
                        submitWarning: content.en.submitWarning,
                        understand: content.en.declarationUnderstand,
                        understandItem1: content.en['declarationUnderstandItem1-intestacy'],
                        understandItem2: content.en.declarationUnderstandItem2,
                    },
                    cy: {
                        accept: content.cy.declarationCheckbox,
                        confirm: content.cy.declarationConfirm
                            .replace('{deceasedName}', formdata.deceasedName),
                        confirmItem1: content.cy.declarationConfirmItem1,
                        confirmItem2: content.cy.declarationConfirmItem2,
                        confirmItem3: content.cy['declarationConfirmItem3-intestacy'],
                        requests: content.cy.declarationRequests,
                        requestsItem1: content.cy['declarationRequestsItem1-intestacy'],
                        requestsItem2: content.cy['declarationRequestsItem2-intestacy'],
                        submitWarning: content.cy.submitWarning,
                        understand: content.cy.declarationUnderstand,
                        understandItem1: content.cy['declarationUnderstandItem1-intestacy'],
                        understandItem2: content.cy.declarationUnderstandItem2,
                    }
                }
            });
            done();
        });

        it('should return the Legal Statement and Declaration objects when the deceased has other names', (done) => {
            formdata.deceasedOtherNames = {
                en: 'Deceased Other Name',
                cy: 'Deceased Other Name'
            };

            const templateData = intestacyDeclarationFactory.build(ctx, content, formdata);

            expect(templateData).to.deep.equal({
                legalStatement: {
                    en: {
                        applicant: content.en.legalStatementApplicant
                            .replace('{applicantName}', formdata.applicantName)
                            .replace('{applicantAddress}', formdata.applicantAddress.formattedAddress),
                        applicant2: applicant2NameFactory.getApplicant2Name(formdata, content.en),
                        applying: content.en.intestacyLettersOfAdministration
                            .replace('{deceasedName}', formdata.deceasedName),
                        deceased: content.en.intestacyLegalStatementDeceased
                            .replace('{deceasedName}', formdata.deceasedName)
                            .replace('{deceasedAddress}', formdata.deceasedAddress.formattedAddress)
                            .replace('{deceasedDob}', formdata.dobFormattedDate.en)
                            .replace('{deceasedDod}', formdata.dodFormattedDate.en),
                        deceasedChildren: content.en.intestacyDeceasedChildren,
                        deceasedEstateLand: content.en.intestacyDeceasedEstateLand
                            .replace(/{deceasedName}/g, formdata.deceasedName),
                        deceasedEstateValue: content.en.deceasedEstateValue
                            .replace('{ihtGrossValue}', formdata.ihtGrossValue)
                            .replace('{ihtNetValue}', formdata.ihtNetValue),
                        deceasedEstateValueExceptedEstateConfirmation: 'I confirm that the estate is an excepted estate.',
                        deceasedEstateAssetsOverseas: content.en.intestacyDeceasedEstateOutside
                            .replace('{ihtNetValueAssetsOutside}', formdata.ihtNetValueAssetsOutside),
                        deceasedMaritalStatus: content.en.intestacyDeceasedMaritalStatus
                            .replace('{deceasedMaritalStatus}', content.en[get(formdata.deceased, 'maritalStatus', '')].toLowerCase()),
                        deceasedOtherNames: content.en.deceasedOtherNames.replace('{deceasedOtherNames}', formdata.deceasedOtherNames.en),
                        intro: content.en.intro
                    },
                    cy: {
                        applicant: content.cy.legalStatementApplicant
                            .replace('{applicantName}', formdata.applicantName)
                            .replace('{applicantAddress}', formdata.applicantAddress.formattedAddress),
                        applicant2: applicant2NameFactory.getApplicant2Name(formdata, content.cy),
                        applying: content.cy.intestacyLettersOfAdministration
                            .replace('{deceasedName}', formdata.deceasedName),
                        deceased: content.cy.intestacyLegalStatementDeceased
                            .replace('{deceasedName}', formdata.deceasedName)
                            .replace('{deceasedAddress}', formdata.deceasedAddress.formattedAddress)
                            .replace('{deceasedDob}', formdata.dobFormattedDate.cy)
                            .replace('{deceasedDod}', formdata.dodFormattedDate.cy),
                        deceasedChildren: content.cy.intestacyDeceasedChildren,
                        deceasedEstateLand: content.cy.intestacyDeceasedEstateLand
                            .replace(/{deceasedName}/g, formdata.deceasedName),
                        deceasedEstateValue: content.cy.deceasedEstateValue
                            .replace('{ihtGrossValue}', formdata.ihtGrossValue)
                            .replace('{ihtNetValue}', formdata.ihtNetValue),
                        deceasedEstateValueExceptedEstateConfirmation: 'Rwy\'n cadarnhau bod yr ystad yn ystad eithriedig.',
                        deceasedEstateAssetsOverseas: content.cy.intestacyDeceasedEstateOutside
                            .replace('{ihtNetValueAssetsOutside}', formdata.ihtNetValueAssetsOutside),
                        deceasedMaritalStatus: content.cy.intestacyDeceasedMaritalStatus
                            .replace('{deceasedMaritalStatus}', content.cy[get(formdata.deceased, 'maritalStatus', '')].toLowerCase()),
                        deceasedOtherNames: content.cy.deceasedOtherNames.replace('{deceasedOtherNames}', formdata.deceasedOtherNames.cy),
                        intro: content.cy.intro
                    }
                },
                declaration: {
                    en: {
                        accept: content.en.declarationCheckbox,
                        confirm: content.en.declarationConfirm
                            .replace('{deceasedName}', formdata.deceasedName),
                        confirmItem1: content.en.declarationConfirmItem1,
                        confirmItem2: content.en.declarationConfirmItem2,
                        confirmItem3: content.en['declarationConfirmItem3-intestacy'],
                        requests: content.en.declarationRequests,
                        requestsItem1: content.en['declarationRequestsItem1-intestacy'],
                        requestsItem2: content.en['declarationRequestsItem2-intestacy'],
                        submitWarning: content.en.submitWarning,
                        understand: content.en.declarationUnderstand,
                        understandItem1: content.en['declarationUnderstandItem1-intestacy'],
                        understandItem2: content.en.declarationUnderstandItem2,
                    },
                    cy: {
                        accept: content.cy.declarationCheckbox,
                        confirm: content.cy.declarationConfirm
                            .replace('{deceasedName}', formdata.deceasedName),
                        confirmItem1: content.cy.declarationConfirmItem1,
                        confirmItem2: content.cy.declarationConfirmItem2,
                        confirmItem3: content.cy['declarationConfirmItem3-intestacy'],
                        requests: content.cy.declarationRequests,
                        requestsItem1: content.cy['declarationRequestsItem1-intestacy'],
                        requestsItem2: content.cy['declarationRequestsItem2-intestacy'],
                        submitWarning: content.cy.submitWarning,
                        understand: content.cy.declarationUnderstand,
                        understandItem1: content.cy['declarationUnderstandItem1-intestacy'],
                        understandItem2: content.cy.declarationUnderstandItem2,
                    }
                }
            });
            done();
        });
    });

    describe('getMaritalStatus()', () => {
        it('should return the formatted deceased marital status', (done) => {
            const maritalStatus = intestacyDeclarationFactory.getMaritalStatus(formdata, content.en);

            expect(maritalStatus).to.equal('married or in a civil partnership');

            done();
        });
    });
});
