'use strict';

const initSteps = require('app/core/initSteps');
const {assert, expect} = require('chai');
const journey = require('app/journeys/probate');

describe('ExecutorCurrentName', () => {
    const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);

    describe('getContextData()', () => {
        it('sets the index when there is a numeric url param', (done) => {
            const req = {
                session: {
                    form: {
                        executors: {
                            list: []
                        }
                    }
                },
                params: [1]
            };
            const ExecutorCurrentName = steps.ExecutorCurrentName;
            const ctx = ExecutorCurrentName.getContextData(req);

            expect(ctx.index).to.equal(req.params[0]);
            done();
        });

        it('recalculates index when there is a * url param', (done) => {
            const req = {
                session: {
                    form: {
                        executors: {
                            list: [
                                {fullName: 'Prince', hasOtherName: false},
                                {fullName: 'Cher', hasOtherName: true}
                            ]
                        }
                    },
                },
                params: ['*']
            };
            const ExecutorCurrentName = steps.ExecutorCurrentName;
            const ctx = ExecutorCurrentName.getContextData(req);

            expect(ctx.index).to.equal(1);
            done();
        });

        it('returns -1 when there is a * url param and no execs with other name', (done) => {
            const req = {
                session: {
                    form: {
                        executors: {
                            list: []
                        }
                    },
                },
                params: ['*']
            };
            const ExecutorCurrentName = steps.ExecutorCurrentName;
            const ctx = ExecutorCurrentName.getContextData(req);

            expect(ctx.index).to.equal(-1);
            done();
        });
    });

    describe('nextStepUrl()', () => {
        it('should return url for the next step if the index is -1', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                index: -1
            };
            const ExecutorCurrentName = steps.ExecutorCurrentName;
            const nextStepUrl = ExecutorCurrentName.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/executor-contact-details*');
            done();
        });

        it('should return url for the next step if the index is not -1', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                index: 1
            };
            const ExecutorCurrentName = steps.ExecutorCurrentName;
            const nextStepUrl = ExecutorCurrentName.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/executor-current-name-reason/1');
            done();
        });
    });

    describe('nextStepOptions()', () => {

        it('ctx.continue returns true when next executor exists in list ', (done) => {

            const testCtx = {
                index: 1,
                list: [
                    {lastName: 'Huggins', firstName: 'Jake', isApplying: true, isApplicant: true},
                    {fullName: 'Madonna', hasOtherName: true},
                    {fullName: 'Prince', hasOtherName: false},
                    {fullName: 'Cher', hasOtherName: true}
                ]
            };

            const ExecutorCurrentName = steps.ExecutorCurrentName;
            const nextStepOptions = ExecutorCurrentName.nextStepOptions(testCtx);

            assert.equal(testCtx.continue, true);

            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'continue', value: true, choice: 'continue'},
                ],
            });
            done();
        });

        it('ctx.continue returns false when at the end of exec list ', (done) => {

            const testCtx = {
                index: -1,
                list: [
                    {lastName: 'Huggins', firstName: 'Jake', isApplying: true, isApplicant: true},
                    {fullName: 'Madonna', hasOtherName: true},
                    {fullName: 'Prince', hasOtherName: false},
                    {fullName: 'Cher', hasOtherName: true}
                ]
            };

            const ExecutorCurrentName = steps.ExecutorCurrentName;
            const nextStepOptions = ExecutorCurrentName.nextStepOptions(testCtx);

            assert.equal(testCtx.continue, false);
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'continue', value: true, choice: 'continue'},
                ],
            });
            done();
        });

    });

    describe('action()', () => {
        it('removes the correct values from the context', (done) => {
            const testCtx = {
                currentName: 'leatherface',
                continue: true,
                index: 1
            };
            const testFormdata = {};
            const ExecutorCurrentName = steps.ExecutorCurrentName;
            const action = ExecutorCurrentName.action(testCtx, testFormdata);

            expect(action).to.deep.equal([{}, testFormdata]);
            done();
        });
    });
});
