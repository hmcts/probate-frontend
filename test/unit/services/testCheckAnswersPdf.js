'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const CheckAnswersPdf = require('app/services/CheckAnswersPdf');
const Pdf = require('app/services/Pdf');
const config = require('config').pdf;

describe('CheckAnswersPdfService', () => {
    describe('post()', () => {
        it('should call super.post()', (done) => {
            const endpoint = 'http://localhost';
            const req = {
                session: {
                    form: {
                        checkAnswersSummary: 'Some really interesting text'
                    }
                }
            };
            const checkAnswersPdf = new CheckAnswersPdf(endpoint, 'abc123');
            const postStub = sinon.stub(Pdf.prototype, 'post');

            checkAnswersPdf.post(req);

            expect(postStub.calledOnce).to.equal(true);
            expect(postStub.calledWith(
                config.template.checkAnswers, req.session.form.checkAnswersSummary,
                'Post probate check answers pdf'
            )).to.equal(true);

            postStub.restore();
            done();
        });
    });
});
