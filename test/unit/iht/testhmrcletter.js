'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const HmrcLetter = steps.HmrcLetter;

describe('HmrcLetter', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = HmrcLetter.constructor.getUrl();
            expect(url).to.equal('/hmrc-letter');
            done();
        });
    });
    describe('nextStepOptions()', () => {
        it('should return the correct next step options', (done) => {
            const result = HmrcLetter.nextStepOptions();
            expect(result).to.deep.equal({
                options: [
                    {key: 'hmrcLetterId', value: 'optionYes', choice: 'hmrcLetter'}
                ]
            });
            done();
        });
    });

    describe('handlePost()', () => {
        it('should clear unique probate code when HMRC letter is not received', (done) => {
            const ctx = {
                hmrcLetterId: 'optionNo',
                uniqueProbateCodeId: 'CTS04052311043tpps8e9'
            };
            const errors = [];
            const [updatedCtx] = HmrcLetter.handlePost(ctx, errors);
            expect(updatedCtx).to.deep.equal({
                hmrcLetterId: 'optionNo'
            });
            done();
        });
    });
});
