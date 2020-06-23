'use strict';

const ExecutorsWrapper = require('app/wrappers/Executors');
const FormatName = require('app/utils/FormatName');
const {get} = require('lodash');
const expect = require('chai').expect;
const config = require('config');
const utils = require('app/components/step-utils');
const moment = require('moment');
const probateDeclarationFactory = require('app/utils/ProbateDeclarationFactory');
const formdata = require('test/data/complete-form').formdata;
const content = {
    en: require('app/resources/en/translation/declaration'),
    cy: require('app/resources/cy/translation/declaration')
};

describe('ProbateDeclarationFactory', () => {
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
        executorsApplyingText = {
            en: '',
            cy: ''
        };
        executorsNotApplyingText = {
            en: '',
            cy: ''
        };
    });

    describe('build()', () => {
        it('should return the Legal Statement and Declaration objects', (done) => {
            const templateData = probateDeclarationFactory.build(ctx, content, formdata, multipleApplicantSuffix, executorsApplying, executorsApplyingText, executorsNotApplyingText);

            expect(templateData).to.deep.equal({
                legalStatement: {
                    en: {
                        applicant: content.en[`legalStatementApplicant${multipleApplicantSuffix}`]
                            .replace('{detailsOfApplicants}', FormatName.formatMultipleNamesAndAddress(executorsApplying, content.en, formdata.applicantAddress))
                            .replace('{applicantName}', formdata.applicantName)
                            .replace('{applicantAddress}', formdata.applicantAddress.formattedAddress),
                        deceased: content.en.legalStatementDeceased
                            .replace('{deceasedName}', formdata.deceasedName)
                            .replace('{deceasedAddress}', formdata.deceasedAddress.formattedAddress)
                            .replace('{deceasedDob}', formdata.dobFormattedDate.en)
                            .replace('{deceasedDod}', formdata.dodFormattedDate.en),
                        deceasedEstateLand: content.en[`deceasedEstateLand${multipleApplicantSuffix}`]
                            .replace(/{deceasedName}/g, formdata.deceasedName),
                        deceasedEstateValue: content.en.deceasedEstateValue
                            .replace('{ihtGrossValue}', formdata.ihtGrossValue)
                            .replace('{ihtNetValue}', formdata.ihtNetValue),
                        deceasedOtherNames: '',
                        executorsApplying: '',
                        executorsNotApplying: '',
                        intro: content.en[`intro${multipleApplicantSuffix}`]
                            .replace('{applicantName}', formdata.applicantName)
                    },
                    cy: {
                        applicant: content.cy[`legalStatementApplicant${multipleApplicantSuffix}`]
                            .replace('{detailsOfApplicants}', FormatName.formatMultipleNamesAndAddress(executorsApplying, content.en, formdata.applicantAddress))
                            .replace('{applicantName}', formdata.applicantName)
                            .replace('{applicantAddress}', formdata.applicantAddress.formattedAddress),
                        deceased: content.cy.legalStatementDeceased
                            .replace('{deceasedName}', formdata.deceasedName)
                            .replace('{deceasedAddress}', formdata.deceasedAddress.formattedAddress)
                            .replace('{deceasedDob}', formdata.dobFormattedDate.cy)
                            .replace('{deceasedDod}', formdata.dodFormattedDate.cy),
                        deceasedEstateLand: content.cy[`deceasedEstateLand${multipleApplicantSuffix}`]
                            .replace(/{deceasedName}/g, formdata.deceasedName),
                        deceasedEstateValue: content.cy.deceasedEstateValue
                            .replace('{ihtGrossValue}', formdata.ihtGrossValue)
                            .replace('{ihtNetValue}', formdata.ihtNetValue),
                        deceasedOtherNames: '',
                        executorsApplying: '',
                        executorsNotApplying: '',
                        intro: content.cy[`intro${multipleApplicantSuffix}`]
                            .replace('{applicantName}', formdata.applicantName)
                    }
                },
                declaration: {
                    en: {
                        accept: content.en.declarationCheckbox,
                        confirm: content.en[`declarationConfirm${multipleApplicantSuffix}`]
                            .replace('{deceasedName}', formdata.deceasedName),
                        confirmItem1: content.en.declarationConfirmItem1,
                        confirmItem2: content.en.declarationConfirmItem2,
                        confirmItem3: content.en.declarationConfirmItem3,
                        requests: content.en[`declarationRequests${multipleApplicantSuffix}`],
                        requestsItem1: content.en.declarationRequestsItem1,
                        requestsItem2: content.en.declarationRequestsItem2,
                        submitWarning: content.en[`submitWarning${multipleApplicantSuffix}`],
                        understand: content.en[`declarationUnderstand${multipleApplicantSuffix}`],
                        understandItem1: content.en[`declarationUnderstandItem1${multipleApplicantSuffix}`],
                        understandItem2: content.en.declarationUnderstandItem2
                    },
                    cy: {
                        accept: content.cy.declarationCheckbox,
                        confirm: content.cy[`declarationConfirm${multipleApplicantSuffix}`]
                            .replace('{deceasedName}', formdata.deceasedName),
                        confirmItem1: content.cy.declarationConfirmItem1,
                        confirmItem2: content.cy.declarationConfirmItem2,
                        confirmItem3: content.cy.declarationConfirmItem3,
                        requests: content.cy[`declarationRequests${multipleApplicantSuffix}`],
                        requestsItem1: content.cy.declarationRequestsItem1,
                        requestsItem2: content.cy.declarationRequestsItem2,
                        submitWarning: content.cy[`submitWarning${multipleApplicantSuffix}`],
                        understand: content.cy[`declarationUnderstand${multipleApplicantSuffix}`],
                        understandItem1: content.cy[`declarationUnderstandItem1${multipleApplicantSuffix}`],
                        understandItem2: content.cy.declarationUnderstandItem2
                    }
                }
            });
            done();
        });
    });
});
