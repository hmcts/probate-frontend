'use strict';

const {expect} = require('chai');
const sinon = require('sinon');
const ProbateCoverSheetPdf = require('app/services/ProbateCoverSheetPdf');
const ProbatePdf = require('app/services/ProbatePdf');
const config = require('app/config').pdf;

describe('ProbateCoverSheetPdfService', () => {
    describe('post()', () => {
        it('should call super.post()', (done) => {
            const endpoint = 'http://localhost';
            const formdata = {
                applicant: {
                    address: '1 Red Road, London, L1 1LL'
                },
                ccdCase: {
                    id: 'ccd123'
                },
                registry: {
                    address: 'Digital Application, Oxford District Probate Registry, Combined Court Building, St Aldates, Oxford, OX1 1LY'
                }
            };
            const probateCoverSheetPdf = new ProbateCoverSheetPdf(endpoint, 'abc123');
            const postStub = sinon.stub(ProbatePdf.prototype, 'post');

            probateCoverSheetPdf.post(formdata);

            expect(postStub.calledOnce).to.equal(true);
            expect(postStub.calledWith(
                config.template.coverSheet,
                {
                    bulkScanCoverSheet: {
                        applicantAddress: '1 Red Road, London, L1 1LL',
                        caseReference: 'ccd123',
                        submitAddress: 'Digital Application, Oxford District Probate Registry, Combined Court Building, St Aldates, Oxford, OX1 1LY'
                    }
                },
                'Post probate cover sheet pdf'
            )).to.equal(true);

            postStub.restore();
            done();
        });
    });
});
