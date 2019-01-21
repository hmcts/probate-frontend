'use strict';

const {expect} = require('chai');
const sinon = require('sinon');
const ProbateCheckAnswersPdf = require('app/services/ProbateCheckAnswersPdf');
const ProbatePdf = require('app/services/ProbatePdf');
const config = require('app/config').pdf;

describe('ProbateCheckAnswersPdfService', () => {
    describe('post()', () => {
        it('should call super.post()', (done) => {
            const endpoint = 'http://localhost';
            const formdata = {
                checkAnswersSummary: 'Some really interesting text'
            };
            const probateCheckAnswersPdf = new ProbateCheckAnswersPdf(endpoint, 'abc123');
            const postStub = sinon.stub(ProbatePdf.prototype, 'post');

            probateCheckAnswersPdf.post(formdata);

            expect(postStub.calledOnce).to.equal(true);
            expect(postStub.calledWith(
                config.template.checkAnswers,
                {
                    checkAnswersSummary: formdata.checkAnswersSummary
                },
                'Post probate check answers pdf'
            )).to.equal(true);

            postStub.restore();
            done();
        });
    });
});
