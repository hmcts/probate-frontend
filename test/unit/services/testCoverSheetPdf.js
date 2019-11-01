'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const CoverSheetPdf = require('app/services/CoverSheetPdf');
const Pdf = require('app/services/Pdf');
const config = require('app/config');

describe('CoverSheetPdfService', () => {
    describe('post()', () => {
        it('should call super.post()', (done) => {
            const endpoint = 'http://localhost';
            const formdata = {
                applicant: {
                    firstName: 'Joe',
                    lastName: 'Bloggs',
                    address: {
                        formattedAddress: '1 Red Road, London, L1 1LL'
                    }
                },
                ccdCase: {
                    id: 'ccd123'
                },
                registry: {
                    address: 'Digital Application, Oxford District Probate Registry, Combined Court Building, St Aldates, Oxford, OX1 1LY'
                }
            };
            const coverSheetPdf = new CoverSheetPdf(endpoint, 'abc123');
            const postStub = sinon.stub(Pdf.prototype, 'post');

            const req = {
                session: {
                    form: formdata
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
                    submitAddress: 'Digital Application, Oxford District Probate Registry, Combined Court Building, St Aldates, Oxford, OX1 1LY'
                },
                'Post cover sheet pdf'
            )).to.equal(true);

            postStub.restore();
            done();
        });
    });
});
