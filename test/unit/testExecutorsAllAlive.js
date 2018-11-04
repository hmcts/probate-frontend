'use strict';

const initSteps = require('app/core/initSteps');
const {assert, expect} = require('chai');
const ExecutorsWrapper = require('app/wrappers/Executors');

describe('ExecutorsAllAlive', () => {
    const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
    const ExecutorsAllAlive = steps.ExecutorsAllAlive;

    describe('getUrl', () => {
        it('returns correct url', () => {
            assert.equal(ExecutorsAllAlive.constructor.getUrl(), '/executors-all-alive');
        });
    });

    describe('handlePost', () => {
        it('prunes "diedBefore", "notApplying" and "notApplyingReason" if "allalive" is changed to "Yes"', () => {
            const ctx = {
                executorsNumber: 2,
                allalive: 'Yes',
                list: [
                    {
                        firstName: 'Lead',
                        lastName: 'Applicant',
                        isApplying: true,
                        isApplicant: true
                    },
                    {
                        fullName: 'James Miller',
                        isDead: true,
                        diedBefore: 'Yes',
                        notApplyingReason: 'This executor died (before the person who has died)',
                        notApplyingKey: 'optionDiedBefore',
                    }]
            };
            const errors = {};
            const [result] = ExecutorsAllAlive.handlePost(ctx, errors);
            const executorsWrapper = new ExecutorsWrapper(result);
            expect(executorsWrapper.executors(true)).to.deep.equal([{fullName: 'James Miller', isDead: false}]);
        });

    });

    describe('nextStepOptions', () => {
        it('returns correct options', () => {
            const result = ExecutorsAllAlive.nextStepOptions();
            expect(result).to.deep.equal({options: [
                {key: 'allalive', value: 'Yes', choice: 'isAlive'},
                {key: 'allalive', value: 'No', choice: 'whoDied'},
            ]});
        });

    });
});
