'use strict';

const {expect} = require('chai');
const sinon = require('sinon');
const IntestacyDeclarationPdf = require('app/services/IntestacyDeclarationPdf');
const IntestacyPdf = require('app/services/IntestacyPdf');
const config = require('app/config').pdf;

describe('IntestacyDeclarationPdfService', () => {
    describe('post()', () => {
        it('should call super.post()', (done) => {
            const endpoint = 'http://localhost';
            const formdata = {
                legalDeclaration: 'Some really interesting text'
            };
            const intestacyDeclarationPdf = new IntestacyDeclarationPdf(endpoint, 'abc123');
            const postStub = sinon.stub(IntestacyPdf.prototype, 'post');

            intestacyDeclarationPdf.post(formdata);

            expect(postStub.calledOnce).to.equal(true);
            expect(postStub.calledWith(
                config.template.declaration,
                {
                    legalDeclaration: formdata.legalDeclaration
                },
                'Post intestacy declaration pdf'
            )).to.equal(true);

            postStub.restore();
            done();
        });
    });
});
