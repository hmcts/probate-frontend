'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const journey = require('app/journeys/probate');
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const ExecutorsAllAlive = steps.ExecutorsAllAlive;

describe('ExecutorsAllAlive', () => {
    describe('nextStepUrl()', () => {
        it('should return url for the next step if all the excutors are alive', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                allalive: 'optionYes'
            };
            const nextStepUrl = ExecutorsAllAlive.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/other-executors-applying*');
            done();
        });

        it('should return url for the next step if all the executors are not alive', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                allalive: 'optionNo'
            };
            const nextStepUrl = ExecutorsAllAlive.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/executors-who-died*');
            done();
        });
    });

    describe('action()', () => {
        it('removes the correct values from the context when some executors have died', (done) => {
            let formdata = {};
            let ctx = {
                allalive: 'optionNo',
                executorsNumber: 4,
                list: [
                    {firstName: 'Applicant FN', lastName: 'Applicant LN', isApplicant: true},
                    {firstName: 'FN1', lastName: 'LN1', isDead: true, diedBefore: 'optionYes', notApplyingKey: 'optionPowerReserved', notApplyingReason: 'optionPowerReserved'},
                    {firstName: 'FN2', lastName: 'LN2', isDead: false},
                    {firstName: 'FN3', lastName: 'LN3', isDead: false, notApplyingKey: 'optionPowerReserved', notApplyingReason: 'optionPowerReserved'}
                ]
            };
            [ctx, formdata] = ExecutorsAllAlive.action(ctx, formdata);
            expect(ctx).to.deep.equal({
                allalive: 'optionNo',
                executorsNumber: 4,
                list: [
                    {firstName: 'Applicant FN', lastName: 'Applicant LN', isApplicant: true},
                    {firstName: 'FN1', lastName: 'LN1', isDead: true, diedBefore: 'optionYes', notApplyingKey: 'optionPowerReserved', notApplyingReason: 'optionPowerReserved'},
                    {firstName: 'FN2', lastName: 'LN2', isDead: false},
                    {firstName: 'FN3', lastName: 'LN3', isDead: false, notApplyingKey: 'optionPowerReserved', notApplyingReason: 'optionPowerReserved'}
                ]
            });
            done();
        });

        it('removes the correct values from the context when all the executors are alive', (done) => {
            let formdata = {};
            let ctx = {
                allalive: 'optionYes',
                executorsNumber: 4,
                list: [
                    {firstName: 'Applicant FN', lastName: 'Applicant LN', isApplicant: true},
                    {firstName: 'FN1', lastName: 'LN1', isDead: true, diedBefore: 'optionYes', notApplyingKey: 'optionPowerReserved', notApplyingReason: 'optionPowerReserved'},
                    {firstName: 'FN2', lastName: 'LN2', isDead: false},
                    {firstName: 'FN3', lastName: 'LN3', isDead: false, notApplyingKey: 'optionPowerReserved', notApplyingReason: 'optionPowerReserved'}
                ]
            };
            [ctx, formdata] = ExecutorsAllAlive.action(ctx, formdata);
            expect(ctx).to.deep.equal({
                allalive: 'optionYes',
                executorsNumber: 4,
                list: [
                    {firstName: 'Applicant FN', lastName: 'Applicant LN', isApplicant: true},
                    {firstName: 'FN1', lastName: 'LN1', isDead: false},
                    {firstName: 'FN2', lastName: 'LN2', isDead: false},
                    {firstName: 'FN3', lastName: 'LN3', isDead: false, notApplyingKey: 'optionPowerReserved', notApplyingReason: 'optionPowerReserved'}
                ]
            });
            done();
        });
    });
});
