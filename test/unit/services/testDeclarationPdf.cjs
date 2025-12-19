'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const ProbateDeclarationPdf = require('app/services/DeclarationPdf');
const ProbatePdf = require('app/services/Pdf');
const config = require('config').pdf;

describe('DeclarationPdfService', () => {
    describe('post()', () => {
        it('should call super.post()', (done) => {
            const endpoint = 'http://localhost';
            const req = {
                session: {
                    form: {
                        legalDeclaration: 'Some really interesting text'
                    }
                }
            };
            const probateDeclarationPdf = new ProbateDeclarationPdf(endpoint, 'abc123');
            const postStub = sinon.stub(ProbatePdf.prototype, 'post');

            probateDeclarationPdf.post(req);

            expect(postStub.calledOnce).to.equal(true);
            expect(postStub.calledWith(
                config.template.declaration, req.session.form.legalDeclaration,
                'Post probate declaration pdf'
            )).to.equal(true);

            postStub.restore();
            done();
        });
    });
});
