'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const CoverSheetPdf = require('app/services/CoverSheetPdf');
const Pdf = require('app/services/Pdf');
const config = require('config');

let postStub;

describe('CoverSheetPdfService', () => {
    describe('post()', () => {

        afterEach(() => {
            postStub.restore();
        });

        it('should call super.post() and call with no docs required and no docs required text if intestacy no docs required conditions met, iht400 and death certificate selected', (done) => {
            const endpoint = 'http://localhost';
            const formdata = {
                caseType: 'intestacy',
                applicant: {
                    firstName: 'Joe',
                    lastName: 'Bloggs',
                    address: {
                        formattedAddress: '1 Red Road, London, L1 1LL'
                    },
                    relationshipToDeceased: 'optionSpousePartner',
                },
                deceased: {
                    maritalStatus: 'optionMarried',
                    deathCertificate: 'optionDeathCertificate'
                },
                iht: {
                    form: 'optionIHT400421',
                    method: 'optionPaper'
                },
                ccdCase: {
                    id: 'ccd123'
                },
                registry: {
                    address: 'Digital Application, Oxford District Probate Registry, Combined Court Building, St Aldates, Oxford, OX1 1LY'
                }
            };
            const coverSheetPdf = new CoverSheetPdf(endpoint, 'abc123');
            postStub = sinon.stub(Pdf.prototype, 'post');

            const req = {
                session: {
                    form: formdata,
                    language: 'en'
                }
            };

            coverSheetPdf.post(req);

            expect(postStub.calledOnce).to.equal(true);
            expect(postStub.calledWith(
                config.pdf.template.coverSheet,
                {
                    applicantAddress: '1 Red Road, London, L1 1LL',
                    applicantName: 'Joe Bloggs',
                    caseReference: 'ccd123',
                    submitAddress: 'Digital Application, Oxford District Probate Registry, Combined Court Building, St Aldates, Oxford, OX1 1LY',
                    checkListItems: [],
                    noDocumentsRequired: true,
                    noDocumentsRequiredText: 'Based on the details in the application no documents are required. However if documents are requested  from you  in the future, please send them along with this cover sheet to the address below'
                },
                'Post cover sheet pdf'
            )).to.equal(true);

            postStub.restore();
            done();
        });

        it('should call super.post() and call with no docs required and no docs required text if intestacy no docs required conditions met, excepted estate and death certificate selected', (done) => {
            const endpoint = 'http://localhost';
            const formdata = {
                caseType: 'intestacy',
                applicant: {
                    firstName: 'Joe',
                    lastName: 'Bloggs',
                    address: {
                        formattedAddress: '1 Red Road, London, L1 1LL'
                    },
                    relationshipToDeceased: 'optionSpousePartner',
                },
                deceased: {
                    maritalStatus: 'optionMarried',
                    deathCertificate: 'optionDeathCertificate'
                },
                iht: {
                    estateValueCompleted: 'optionNo'
                },
                ccdCase: {
                    id: 'ccd123'
                },
                registry: {
                    address: 'Digital Application, Oxford District Probate Registry, Combined Court Building, St Aldates, Oxford, OX1 1LY'
                }
            };
            const coverSheetPdf = new CoverSheetPdf(endpoint, 'abc123');
            postStub = sinon.stub(Pdf.prototype, 'post');

            const req = {
                session: {
                    form: formdata,
                    language: 'en'
                }
            };

            coverSheetPdf.post(req);

            expect(postStub.calledOnce).to.equal(true);
            expect(postStub.calledWith(
                config.pdf.template.coverSheet,
                {
                    applicantAddress: '1 Red Road, London, L1 1LL',
                    applicantName: 'Joe Bloggs',
                    caseReference: 'ccd123',
                    submitAddress: 'Digital Application, Oxford District Probate Registry, Combined Court Building, St Aldates, Oxford, OX1 1LY',
                    checkListItems: [],
                    noDocumentsRequired: true,
                    noDocumentsRequiredText: 'Based on the details in the application no documents are required. However if documents are requested  from you  in the future, please send them along with this cover sheet to the address below'
                },
                'Post cover sheet pdf'
            )).to.equal(true);

            postStub.restore();
            done();
        });

    });
});
