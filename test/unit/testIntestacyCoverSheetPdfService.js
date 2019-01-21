'use strict';

const {expect} = require('chai');
const sinon = require('sinon');
const IntestacyCoverSheetPdf = require('app/services/IntestacyCoverSheetPdf');
const IntestacyPdf = require('app/services/IntestacyPdf');
const config = require('app/config').pdf;

describe('IntestacyCoverSheetPdfService', () => {
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
            const intestacyCoverSheetPdf = new IntestacyCoverSheetPdf(endpoint, 'abc123');
            const postStub = sinon.stub(IntestacyPdf.prototype, 'post');

            intestacyCoverSheetPdf.post(formdata);

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
                'Post intestacy cover sheet pdf'
            )).to.equal(true);

            postStub.restore();
            done();
        });
    });
});
