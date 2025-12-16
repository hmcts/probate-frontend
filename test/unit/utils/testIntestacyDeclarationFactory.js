'use strict';

const FormatName = require('app/utils/FormatName');
const {get} = require('lodash');
const expect = require('chai').expect;
const config = require('config');
const utils = require('app/components/step-utils');
const moment = require('moment');
const intestacyDeclarationFactory = require('app/utils/IntestacyDeclarationFactory');
const ExecutorsWrapper = require('../../../app/wrappers/Executors');
const formdata = require('test/data/complete-form').formdata;
const content = {
    en: require('app/resources/en/translation/declaration'),
    cy: require('app/resources/cy/translation/declaration')
};

describe('IntestacyDeclarationFactory', () => {
    let ctx;
    let multipleApplicantSuffix;
    let executorsApplying;
    let executorsApplyingText;
    let executorsNotApplyingText;

    beforeEach(() => {
        ctx = {};
        ctx.executorsWrapper = new ExecutorsWrapper(formdata.executors);

        const formdataApplicant = formdata.applicant || {};
        formdata.applicantName = FormatName.format(formdataApplicant);
        formdata.applicantAddress = get(formdataApplicant, 'address', {});

        const formdataDeceased = formdata.deceased || {};
        formdata.deceasedName = FormatName.format(formdataDeceased);
        formdata.deceasedAddress = get(formdataDeceased, 'address', {});
        formdata.deceasedOtherNames = {
            en: FormatName.formatMultipleNamesAndAddress(get(formdataDeceased, 'otherNames'), content.en),
            cy: FormatName.formatMultipleNamesAndAddress(get(formdataDeceased, 'otherNames'), content.cy)
        };
        formdata.dobFormattedDate = utils.formattedDate(moment(formdataDeceased['dob-day'] + '/' + formdataDeceased['dob-month'] + '/' + formdataDeceased['dob-year'], config.dateFormat).parseZone(), 'en');
        formdata.dodFormattedDate = utils.formattedDate(moment(formdataDeceased['dod-day'] + '/' + formdataDeceased['dod-month'] + '/' + formdataDeceased['dod-year'], config.dateFormat).parseZone(), 'en');
        formdata.maritalStatus = formdataDeceased.maritalStatus;
        formdata.relationshipToDeceased = formdataDeceased.relationshipToDeceased;
        formdata.hadChildren = formdataDeceased.hadChildren;
        formdata.anyOtherChildren = formdataDeceased.anyOtherChildren;

        const formdataIht = formdata.iht || {};
        formdata.ihtGrossValue = formdataIht.grossValue ? formdataIht.grossValue.toFixed(2) : 0;
        formdata.ihtNetValue = formdataIht.netValue ? formdataIht.netValue.toFixed(2) : 0;

        multipleApplicantSuffix = '';
        executorsApplying = ctx.executorsWrapper.executorsApplying();
    });

    describe('build()', () => {
        it('should return the Legal Statement and Declaration objects when the deceased has no other names', (done) => {
            const templateData = intestacyDeclarationFactory.build(ctx, content, formdata, multipleApplicantSuffix, executorsApplying, executorsApplyingText);

            expect(templateData).to.deep.equal({
                legalStatement: {
                    en: {
                        intro: content.en[`intro${multipleApplicantSuffix}`]
                            .replace('{applicantName}', formdata.applicantName),
                        applicant: content.en[`legalStatementApplicant${multipleApplicantSuffix}`]
                            .replace('{detailsOfApplicants}', FormatName.formatMultipleNamesAndAddress(executorsApplying, content.en, formdata.applicantAddress)),
                        deceased: content.en.intestacyLegalStatementDeceased
                            .replace('{deceasedName}', formdata.deceasedName)
                            .replace('{deceasedAddress}', formdata.deceasedAddress.formattedAddress)
                            .replace('{deceasedDob}', formdata.dobFormattedDate.en)
                            .replace('{deceasedDod}', formdata.dodFormattedDate.en),
                        deceasedOtherNames: '',
                        deceasedMaritalStatus: content.en.intestacyDeceasedMaritalStatus
                            .replace('{deceasedMaritalStatus}', content.en[get(formdata.deceased, 'maritalStatus', '')].toLowerCase()),
                        deceasedChildren: content.en.intestacyDeceasedChildren,
                        executorsApplying: executorsApplyingText.en,
                        deceasedEstateValue: content.en.deceasedEstateValue
                            .replace('{ihtGrossValue}', formdata.ihtGrossValue)
                            .replace('{ihtNetValue}', formdata.ihtNetValue),
                        deceasedEstateValueExceptedEstateConfirmation: content.en.deceasedEstateValueExceptedEstateConfirmation,
                        deceasedEstateAssetsOverseas: content.en.intestacyDeceasedEstateOutside
                            .replace('{ihtNetValueAssetsOutside}', formdata.ihtNetValueAssetsOutside),
                        deceasedEstateLand: content.en[`intestacyDeceasedEstateLand${multipleApplicantSuffix}`]
                            .replace(/{deceasedName}/g, formdata.deceasedName),
                        executorsNotApplying: executorsNotApplyingText.en
                    },
                    cy: {
                        intro: content.cy[`intro${multipleApplicantSuffix}`]
                            .replace('{applicantName}', formdata.applicantName),
                        applicant: content.cy[`legalStatementApplicant${multipleApplicantSuffix}`]
                            .replace('{detailsOfApplicants}', FormatName.formatMultipleNamesAndAddress(executorsApplying, content.en, formdata.applicantAddress)),
                        deceased: content.cy.intestacyLegalStatementDeceased
                            .replace('{deceasedName}', formdata.deceasedName)
                            .replace('{deceasedAddress}', formdata.deceasedAddress.formattedAddress)
                            .replace('{deceasedDob}', formdata.dobFormattedDate.cy)
                            .replace('{deceasedDod}', formdata.dodFormattedDate.cy),
                        deceasedOtherNames: '',
                        deceasedMaritalStatus: content.cy.intestacyDeceasedMaritalStatus
                            .replace('{deceasedMaritalStatus}', content.cy[get(formdata.deceased, 'maritalStatus', '')].toLowerCase()),
                        deceasedChildren: content.cy.intestacyDeceasedChildren,
                        executorsApplying: executorsApplyingText.cy,
                        deceasedEstateValue: content.cy.deceasedEstateValue
                            .replace('{ihtGrossValue}', formdata.ihtGrossValue)
                            .replace('{ihtNetValue}', formdata.ihtNetValue),
                        deceasedEstateValueExceptedEstateConfirmation: content.cy.deceasedEstateValueExceptedEstateConfirmation,
                        deceasedEstateAssetsOverseas: content.cy.intestacyDeceasedEstateOutside
                            .replace('{ihtNetValueAssetsOutside}', formdata.ihtNetValueAssetsOutside),
                        deceasedEstateLand: content.cy[`intestacyDeceasedEstateLand${multipleApplicantSuffix}`]
                            .replace(/{deceasedName}/g, formdata.deceasedName),
                        applying: content.cy.intestacyLettersOfAdministration
                            .replace('{deceasedName}', formdata.deceasedName),
                        executorsNotApplying: executorsNotApplyingText.cy
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

            const templateData = intestacyDeclarationFactory.build(ctx, content, formdata, multipleApplicantSuffix, executorsApplying, executorsApplyingText);

            expect(templateData).to.deep.equal({
                legalStatement: {
                    en: {
                        intro: content.en[`intro${multipleApplicantSuffix}`]
                            .replace('{applicantName}', formdata.applicantName),
                        applicant: content.en[`legalStatementApplicant${multipleApplicantSuffix}`]
                            .replace('{detailsOfApplicants}', FormatName.formatMultipleNamesAndAddress(executorsApplying, content.en, formdata.applicantAddress)),
                        deceased: content.en.intestacyLegalStatementDeceased
                            .replace('{deceasedName}', formdata.deceasedName)
                            .replace('{deceasedAddress}', formdata.deceasedAddress.formattedAddress)
                            .replace('{deceasedDob}', formdata.dobFormattedDate.en)
                            .replace('{deceasedDod}', formdata.dodFormattedDate.en),
                        deceasedOtherNames: (formdata.deceasedOtherNames && formdata.deceasedOtherNames.en) ? content.en.deceasedOtherNames.replace('{deceasedOtherNames}', formdata.deceasedOtherNames.en) : '',
                        deceasedMaritalStatus: content.en.intestacyDeceasedMaritalStatus
                            .replace('{deceasedMaritalStatus}', content.en[get(formdata.deceased, 'maritalStatus', '')].toLowerCase()),
                        deceasedChildren: content.en.intestacyDeceasedChildren,
                        executorsApplying: executorsApplyingText.en,
                        deceasedEstateValue: content.en.deceasedEstateValue
                            .replace('{ihtGrossValue}', formdata.ihtGrossValue)
                            .replace('{ihtNetValue}', formdata.ihtNetValue),
                        deceasedEstateValueExceptedEstateConfirmation: content.en.deceasedEstateValueExceptedEstateConfirmation,
                        deceasedEstateAssetsOverseas: content.en.intestacyDeceasedEstateOutside
                            .replace('{ihtNetValueAssetsOutside}', formdata.ihtNetValueAssetsOutside),
                        deceasedEstateLand: content.en[`intestacyDeceasedEstateLand${multipleApplicantSuffix}`]
                            .replace(/{deceasedName}/g, formdata.deceasedName),
                        executorsNotApplying: executorsNotApplyingText.en
                    },
                    cy: {
                        intro: content.cy[`intro${multipleApplicantSuffix}`]
                            .replace('{applicantName}', formdata.applicantName),
                        applicant: content.cy[`legalStatementApplicant${multipleApplicantSuffix}`]
                            .replace('{detailsOfApplicants}', FormatName.formatMultipleNamesAndAddress(executorsApplying, content.en, formdata.applicantAddress)),
                        deceased: content.cy.intestacyLegalStatementDeceased
                            .replace('{deceasedName}', formdata.deceasedName)
                            .replace('{deceasedAddress}', formdata.deceasedAddress.formattedAddress)
                            .replace('{deceasedDob}', formdata.dobFormattedDate.cy)
                            .replace('{deceasedDod}', formdata.dodFormattedDate.cy),
                        deceasedOtherNames: (formdata.deceasedOtherNames && formdata.deceasedOtherNames.cy) ? content.cy.deceasedOtherNames.replace('{deceasedOtherNames}', formdata.deceasedOtherNames.cy) : '',
                        deceasedMaritalStatus: content.cy.intestacyDeceasedMaritalStatus
                            .replace('{deceasedMaritalStatus}', content.cy[get(formdata.deceased, 'maritalStatus', '')].toLowerCase()),
                        deceasedChildren: content.cy.intestacyDeceasedChildren,
                        executorsApplying: executorsApplyingText.cy,
                        deceasedEstateValue: content.cy.deceasedEstateValue
                            .replace('{ihtGrossValue}', formdata.ihtGrossValue)
                            .replace('{ihtNetValue}', formdata.ihtNetValue),
                        deceasedEstateValueExceptedEstateConfirmation: content.cy.deceasedEstateValueExceptedEstateConfirmation,
                        deceasedEstateAssetsOverseas: content.cy.intestacyDeceasedEstateOutside
                            .replace('{ihtNetValueAssetsOutside}', formdata.ihtNetValueAssetsOutside),
                        deceasedEstateLand: content.cy[`intestacyDeceasedEstateLand${multipleApplicantSuffix}`]
                            .replace(/{deceasedName}/g, formdata.deceasedName),
                        applying: content.cy.intestacyLettersOfAdministration
                            .replace('{deceasedName}', formdata.deceasedName),
                        executorsNotApplying: executorsNotApplyingText.cy
                    }
                },
                declaration: {
                    en: {
                        confirm: content.en.declarationConfirm
                            .replace('{deceasedName}', formdata.deceasedName),
                        confirmItem1: content.en.declarationConfirmItem1,
                        confirmItem2: content.en.declarationConfirmItem2,
                        confirmItem3: content.en['declarationConfirmItem3-intestacy'],
                        requests: content.en.declarationRequests,
                        requestsItem1: content.en['declarationRequestsItem1-intestacy'],
                        requestsItem2: content.en['declarationRequestsItem2-intestacy'],
                        understand: content.en.declarationUnderstand,
                        understandItem1: content.en['declarationUnderstandItem1-intestacy'],
                        understandItem2: content.en.declarationUnderstandItem2,
                        accept: content.en.declarationCheckbox,
                        submitWarning: content.en.submitWarning
                    },
                    cy: {
                        confirm: content.cy.declarationConfirm
                            .replace('{deceasedName}', formdata.deceasedName),
                        confirmItem1: content.cy.declarationConfirmItem1,
                        confirmItem2: content.cy.declarationConfirmItem2,
                        confirmItem3: content.cy['declarationConfirmItem3-intestacy'],
                        requests: content.cy.declarationRequests,
                        requestsItem1: content.cy['declarationRequestsItem1-intestacy'],
                        requestsItem2: content.cy['declarationRequestsItem2-intestacy'],
                        understand: content.cy.declarationUnderstand,
                        understandItem1: content.cy['declarationUnderstandItem1-intestacy'],
                        understandItem2: content.cy.declarationUnderstandItem2,
                        accept: content.cy.declarationCheckbox,
                        submitWarning: content.cy.submitWarning
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
