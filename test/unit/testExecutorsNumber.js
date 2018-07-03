'use strict';
const initSteps = require('app/core/initSteps');
const assert = require('chai').assert;

describe('Executors-Applying', function () {
    const ExecsNumber = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]).ExecutorsNumber;

    describe('createExecutorList', () => {

        it('test only the main applicant is in the executors list when executors number is reduced', () => {
            const ctx = {
                executorsNumber: 2
            };
            const formdata = {
                'applicant': {
                    'firstName': 'Dave',
                    'lastName': 'Bassett'
                },
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
                ],
            };
            ExecsNumber.createExecutorList(ctx, formdata);
            assert.lengthOf(ctx.list, 1);
            assert.equal(ctx.list[0].firstName, 'Dave');
            assert.equal(ctx.list[0].lastName, 'Bassett');
            assert.isTrue(ctx.list[0].isApplicant);
        });
    });
});
