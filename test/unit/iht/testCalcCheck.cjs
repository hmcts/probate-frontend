'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const CalcCheck = steps.CalcCheck;

describe('CalcCheck', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = CalcCheck.constructor.getUrl();
            expect(url).to.equal('/calc-check');
            done();
        });
    });
    describe('nextStepOptions()', () => {
        it('should return the correct next step options', (done) => {
            const result = CalcCheck.nextStepOptions();
            expect(result).to.deep.equal({
                options: [
                    {key: 'calcCheckCompleted', value: 'optionYes', choice: 'calcCheckCompleted'},
                    {key: 'calcCheckCompleted', value: 'optionNo', choice: 'calcCheckIncomplete'}
                ]
            });
            done();
        });
    });
    describe('isComplete()', () => {
        it('should return the complete when have estateValueCompleted', (done) => {
            const ctx = {
                estateValueCompleted: 'optionYes'
            };
            const result = CalcCheck.isComplete(ctx);
            const expectedTrue = [true, 'inProgress'];
            expect(result).to.deep.equal(expectedTrue);
            done();
        });
        it('should return complete false when no estateValueCompleted', (done) => {
            const ctx = {
            };
            const result = CalcCheck.isComplete(ctx);
            const expectedFalse = [false, 'inProgress'];
            expect(result).to.deep.equal(expectedFalse);
            done();
        });
        it('should return complete false when optionNo', (done) => {
            const ctx = {
                calcCheckCompleted: 'optionNo'
            };
            const result = CalcCheck.isComplete(ctx);
            const expectedFalse = [false, 'inProgress'];
            expect(result).to.deep.equal(expectedFalse);
            done();
        });
    });
});
