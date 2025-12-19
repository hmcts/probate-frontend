'use strict';

const initSteps = require('app/core/initSteps.cjs');
const expect = require('chai').expect;
const journey = require('app/journeys/probate.cjs');
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const AnyExecutorsDied = steps.AnyExecutorsDied;

describe('anyExecutorsDied', () => {
    describe('nextStepUrl()', () => {
        it('should return url for the next step if all the executors are not alive', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                anyExecutorsDied: 'optionYes',
                list: [{fullName: 'ExecutorOne'}, {fullName: 'ExecutorTwo'}, {fullName: 'ExecutorThree'}]
            };
            const nextStepUrl = AnyExecutorsDied.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/executors-who-died');
            done();
        });

        it('should return url for the next step if single executor is not alive', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                anyExecutorsDied: 'optionYes',
                list: [{fullName: 'ExecutorOne'}, {fullName: 'ExecutorTwo'}],
            };
            const nextStepUrl = AnyExecutorsDied.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/executor-when-died/1');
            done();
        });

        it('should return url for the next step if all the executors are alive', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                anyExecutorsDied: 'optionNo'
            };
            const nextStepUrl = AnyExecutorsDied.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/other-executors-applying');
            done();
        });
    });

    describe('action()', () => {
        it('removes the correct values from the context when some executors have died', (done) => {
            let formdata = {};
            let ctx = {
                anyExecutorsDied: 'optionYes',
                executorsNumber: 4,
                list: [
                    {firstName: 'Applicant FN', lastName: 'Applicant LN', isApplicant: true},
                    {firstName: 'FN1', lastName: 'LN1', isDead: true, diedBefore: 'optionYes', notApplyingKey: 'optionPowerReserved', notApplyingReason: 'optionPowerReserved'},
                    {firstName: 'FN2', lastName: 'LN2', isDead: false},
                    {firstName: 'FN3', lastName: 'LN3', isDead: false, notApplyingKey: 'optionPowerReserved', notApplyingReason: 'optionPowerReserved'}
                ]
            };
            [ctx, formdata] = AnyExecutorsDied.action(ctx, formdata);
            expect(ctx).to.deep.equal({
                anyExecutorsDied: 'optionYes',
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
                anyExecutorsDied: 'optionNo',
                executorsNumber: 4,
                list: [
                    {firstName: 'Applicant FN', lastName: 'Applicant LN', isApplicant: true},
                    {firstName: 'FN1', lastName: 'LN1', isDead: true, diedBefore: 'optionYes', notApplyingKey: 'optionPowerReserved', notApplyingReason: 'optionPowerReserved'},
                    {firstName: 'FN2', lastName: 'LN2', isDead: false},
                    {firstName: 'FN3', lastName: 'LN3', isDead: false, notApplyingKey: 'optionPowerReserved', notApplyingReason: 'optionPowerReserved'}
                ]
            };
            [ctx, formdata] = AnyExecutorsDied.action(ctx, formdata);
            expect(ctx).to.deep.equal({
                anyExecutorsDied: 'optionNo',
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

    describe('handlePost()', () => {
        it('should set isDead to true and prune form data when there are 2 executors and anyExecutorsDied is optionYes', () => {
            let formdata = {};
            let ctx = {
                anyExecutorsDied: 'optionYes',
                list: [
                    {firstName: 'Applicant FN', lastName: 'Applicant LN', isApplicant: true},
                    {fullName: 'FN1'}
                ]
            };
            [ctx, formdata] = AnyExecutorsDied.handlePost(ctx, formdata);
            expect(ctx).to.deep.equal({
                anyExecutorsDied: 'optionYes',
                list: [
                    {firstName: 'Applicant FN', lastName: 'Applicant LN', isApplicant: true},
                    {fullName: 'FN1', isDead: true}
                ]
            });
        });
    });

    describe('pruneFormData()', () => {
        let data;

        it('test isApplying flag is correctly removed', (done) => {
            data = {fullname: 'bob smith', isApplying: true, isDead: true};
            expect(AnyExecutorsDied.pruneFormData(data)).to.deep.equal({
                fullname: 'bob smith', isDead: true
            });
            done();
        });

        it('test isApplying flag is not removed', (done) => {
            data = {fullname: 'bob smith', isApplying: true, isDead: false};
            expect(AnyExecutorsDied.pruneFormData(data)).to.deep.equal({
                fullname: 'bob smith', isApplying: true, isDead: false
            });
            done();
        });
    });
});
