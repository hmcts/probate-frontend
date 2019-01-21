'use strict';

const {expect} = require('chai');
const sinon = require('sinon');
const ProbateDeclarationPdf = require('app/services/ProbateDeclarationPdf');
const ProbatePdf = require('app/services/ProbatePdf');
const config = require('app/config').pdf;

describe('ProbateDeclarationPdfService', () => {
    describe('post()', () => {
        it('should call super.post()', (done) => {
            const endpoint = 'http://localhost';
            const formdata = {
                legalDeclaration: 'Some really interesting text'
            };
            const probateDeclarationPdf = new ProbateDeclarationPdf(endpoint, 'abc123');
            const postStub = sinon.stub(ProbatePdf.prototype, 'post');

            probateDeclarationPdf.post(formdata);

            expect(postStub.calledOnce).to.equal(true);
            expect(postStub.calledWith(
                config.template.declaration,
                {
                    legalDeclaration: formdata.legalDeclaration
                },
                'Post probate declaration pdf'
            )).to.equal(true);

            postStub.restore();
            done();
        });
    });
});
