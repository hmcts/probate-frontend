'use strict';

const {expect} = require('chai');
const sinon = require('sinon');
const rewire = require('rewire');
const IntestacyPdf = rewire('app/services/IntestacyPdf');
const Pdf = require('app/services/Pdf');
const config = require('app/config').pdf;

describe('IntestacyPdfService', () => {
    describe('post()', () => {
        it('should call super.post()', (done) => {
            const endpoint = 'http://localhost';
            const pdfTemplate = config.template.coverSheet;
            const body = {};
            const logMessage = 'Post intestacy pdf';
            const intestacyPdf = new IntestacyPdf(endpoint, 'abc123');
            const postStub = sinon.stub(Pdf.prototype, 'post');

            intestacyPdf.post(pdfTemplate, body, logMessage);

            expect(postStub.calledOnce).to.equal(true);
            expect(postStub.calledWith(
                body,
                logMessage,
                {
                    'Content-Type': 'application/json'
                },
                `${endpoint}${config.path}/${pdfTemplate}`
            )).to.equal(true);

            postStub.restore();
            done();
        });
    });
});
