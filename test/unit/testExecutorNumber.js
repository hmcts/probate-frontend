'use strict';
const initSteps = require('app/core/initSteps');
const {expect, assert} = require('chai');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const ExecutorsNumber = steps.ExecutorsNumber;

describe('ExecutorsNumber', () => {
    let ctx;
    let formdata;

    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = ExecutorsNumber.constructor.getUrl();
            expect(url).to.equal('/executors-number');
            done();
        });
    });

    describe('handlePost()', () => {
        let ctx;
        let errors;
        let formdata;
        let session;
        let hostname;
        let featureToggles;

        it('should return the ctx with the deceased married status and the screening_question feature toggle', (done) => {
            ctx = {
                executorsNumber: '3'
            };
            errors = {};
            [ctx, errors] = ExecutorsNumber.handlePost(ctx, errors, formdata, session, hostname, featureToggles);
            expect(ctx).to.deep.equal({
                executorsNumber: '3',
                isToggleEnabled: false
            });
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options when the FT is off', (done) => {
            const ctx = {
                isToggleEnabled: false
            };
            const nextStepOptions = ExecutorsNumber.nextStepOptions(ctx);
            expect(nextStepOptions).to.deep.equal({
                options: [{
                    key: 'executorsNumber',
                    value: 1,
                    choice: 'oneExecutor'
                }]
            });
            done();
        });

        it('should return the correct options when the FT is on', (done) => {
            const ctx = {
                isToggleEnabled: true
            };
            const nextStepOptions = ExecutorsNumber.nextStepOptions(ctx);
            expect(nextStepOptions).to.deep.equal({
                options: [{
                    key: 'executorsNumber',
                    value: 1,
                    choice: 'oneExecutorToggleOn'
                }]
            });
            done();
        });
    });

    describe('action', () => {
        it('test isToggleEnabled is removed from the context', () => {
            const ctx = {
                isToggleEnabled: false
            };
            ExecutorsNumber.action(ctx);
            assert.isUndefined(ctx.isToggleEnabled);
        });
    });

    describe('createExecutorList', () => {
        beforeEach(() => {
            ctx = {};
            formdata = {
                applicant: {
                    'firstName': 'Dave',
                    'lastName': 'Bassett',
                    'alias': 'David James',
                    'aliasReason': 'Divorce',
                    'otherReason': ''
                },
                executors: {
                    list: [
                        {
                            'firstName': 'Dave',
                            'lastName': 'Bassett',
                            'isApplying': 'Yes',
                            'isApplicant': true
                        }, {
                            fullName: 'Ed Brown'
                        }, {
                            fullName: 'Dave Miller'
                        }
                    ]
                }
            };
        });

        it('test only the main applicant is in the executors list when executors number is reduced', () => {
            ctx.executorsNumber = 2;
            ctx = ExecutorsNumber.createExecutorList(ctx, formdata);
            assert.lengthOf(ctx.list, 1);
            expect(ctx.list).to.deep.equal([{
                'firstName': 'Dave',
                'lastName': 'Bassett',
                'alias': 'David James',
                'aliasReason': 'Divorce',
                'otherReason': '',
                'isApplying': true,
                'isApplicant': true
            }]);
        });

        it('test only the executors list remains the same when executors number is not reduced', () => {
            ctx.executorsNumber = 3;
            ctx = ExecutorsNumber.createExecutorList(ctx, formdata);
            assert.lengthOf(ctx.list, 3);
            expect(ctx.list).to.deep.equal([
                {
                    'firstName': 'Dave',
                    'lastName': 'Bassett',
                    'alias': 'David James',
                    'aliasReason': 'Divorce',
                    'otherReason': '',
                    'isApplying': true,
                    'isApplicant': true
                }, {
                    fullName: 'Ed Brown'
                }, {
                    fullName: 'Dave Miller'
                }
            ]);
        });

        it('test only the executors list remains the same when executors number is increased', () => {
            ctx.executorsNumber = 5;
            ctx = ExecutorsNumber.createExecutorList(ctx, formdata);
            assert.lengthOf(ctx.list, 3);
            expect(ctx.list).to.deep.equal([
                {
                    'firstName': 'Dave',
                    'lastName': 'Bassett',
                    'alias': 'David James',
                    'aliasReason': 'Divorce',
                    'otherReason': '',
                    'isApplying': true,
                    'isApplicant': true
                }, {
                    fullName: 'Ed Brown'
                }, {
                    fullName: 'Dave Miller'
                }
            ]);
        });
    });
});
