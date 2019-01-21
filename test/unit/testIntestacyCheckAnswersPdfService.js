'use strict';

const {expect} = require('chai');
const sinon = require('sinon');
const IntestacyCheckAnswersPdf = require('app/services/IntestacyCheckAnswersPdf');
const IntestacyPdf = require('app/services/IntestacyPdf');
const config = require('app/config').pdf;

describe('IntestacyCheckAnswersPdfService', () => {
    describe('post()', () => {
        it('should call super.post()', (done) => {
            const endpoint = 'http://localhost';
            const formdata = {
                checkAnswersSummary: 'Some really interesting text'
            };
            const intestacyCheckAnswersPdf = new IntestacyCheckAnswersPdf(endpoint, 'abc123');
            const postStub = sinon.stub(IntestacyPdf.prototype, 'post');

            intestacyCheckAnswersPdf.post(formdata);

            expect(postStub.calledOnce).to.equal(true);
            expect(postStub.calledWith(
                config.template.checkAnswers,
                {
                    checkAnswersSummary: formdata.checkAnswersSummary
                },
                'Post intestacy check answers pdf'
            )).to.equal(true);

            postStub.restore();
            done();
        });
    });
});
