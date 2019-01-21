'use strict';

const {expect} = require('chai');
const sinon = require('sinon');
const rewire = require('rewire');
const ProbatePdf = rewire('app/services/ProbatePdf');
const Pdf = require('app/services/Pdf');
const config = require('app/config').pdf;

describe('ProbatePdfService', () => {
    describe('post()', () => {
        it('should call super.post()', (done) => {
            const endpoint = 'http://localhost';
            const pdfTemplate = config.template.coverSheet;
            const body = {};
            const logMessage = 'Post probate pdf';
            const probatePdf = new ProbatePdf(endpoint, 'abc123');
            const postStub = sinon.stub(Pdf.prototype, 'post');

            probatePdf.post(pdfTemplate, body, logMessage);

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
