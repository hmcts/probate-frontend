'use strict';

const {expect} = require('chai');
const rewire = require('rewire');
const JourneyMap = rewire('app/core/JourneyMap');

describe('JourneyMap.js', () => {
    let currentStep;

    beforeEach(() => {
        currentStep = {
            nextStepOptions: () => {
                return {
                    options: [
                        {key: 'allExecsApplying', value: true, choice: 'allExecsApplying'}
                    ],
                };
            }
        };
    });

    describe('nextOptionStep()', () => {
        it('should return the next option step', (done) => {
            const ctx = {
                allExecsApplying: true
            };
            const journeyMap = new JourneyMap();
            const nextOptionStep = journeyMap.nextOptionStep(currentStep, ctx);
            expect(nextOptionStep).to.equal('allExecsApplying');
            done();
        });

        it('should return otherwise', (done) => {
            const ctx = {};
            const journeyMap = new JourneyMap();
            const nextOptionStep = journeyMap.nextOptionStep(currentStep, ctx);
            expect(nextOptionStep).to.equal('otherwise');
            done();
        });
    });

    describe('nextStep()', () => {
        let revert;
        let journey;

        beforeEach(() => {
            revert = JourneyMap.__set__('steps', {
                DeceasedName: {
                    name: 'DeceasedName'
                },
                ExecutorAddress: {
                    name: 'ExecutorAddress'
                }
            });
            journey = {
                stepList: {
                    ExecutorContactDetails: 'ExecutorAddress',
                    ExecutorAddress: {
                        allExecsApplying: 'DeceasedName',
                        otherwise: 'ExecutorRoles'
                    }
                }
            };
        });

        afterEach(() => {
            revert();
        });

        it('should return the next option step if the next step is a string', (done) => {
            currentStep.name = 'ExecutorContactDetails';
            const ctx = {};
            const journeyMap = new JourneyMap(journey);
            const nextStep = journeyMap.nextStep(currentStep, ctx);
            expect(nextStep).to.deep.equal({name: 'ExecutorAddress'});
            done();
        });

        it('should return the next option step if the next step is an object', (done) => {
            currentStep.name = 'ExecutorAddress';
            const ctx = {
                allExecsApplying: true
            };
            const journeyMap = new JourneyMap(journey);
            const nextStep = journeyMap.nextStep(currentStep, ctx);
            expect(nextStep).to.deep.equal({name: 'DeceasedName'});
            done();
        });
    });

    describe('stepList()', () => {
        it('should return the journey step list', (done) => {
            const journey = {
                stepList: {
                    ExecutorContactDetails: 'ExecutorAddress'
                }
            };
            const journeyMap = new JourneyMap(journey);
            const stepList = journeyMap.stepList();
            expect(stepList).to.deep.equal({ExecutorContactDetails: 'ExecutorAddress'});
            done();
        });
    });

    describe('taskList()', () => {
        it('should return the journey task list', (done) => {
            const journey = {
                taskList: {
                    EligibilityTask: {
                        firstStep: 'WillLeft',
                        lastStep: 'TaskList',
                        summary: 'Summary'
                    }
                }
            };
            const journeyMap = new JourneyMap(journey);
            const taskList = journeyMap.taskList();
            expect(taskList).to.deep.equal({
                EligibilityTask: {
                    firstStep: 'WillLeft',
                    lastStep: 'TaskList',
                    summary: 'Summary'
                }
            });
            done();
        });
    });
});
