'use strict';
const initSteps = require('app/core/initSteps');
const assert = require('chai').assert;

describe('Soft Stops', function () {
    const steps = initSteps([__dirname + '/../../app/steps/action/', __dirname + '/../../app/steps/ui/']);
    let ctx;
    beforeEach(() => {
        ctx = {};
    });

    describe('Soft stops for pages', function () {

        it('Check soft stop for applicant name as on the will', function () {
            const step = steps.ApplicantNameAsOnWill;
            const formdata = {
                applicant: {nameAsOnTheWill: 'No'}
            };

            const result = step.isSoftStop(formdata, ctx);

            assertSoftStop(result, step);
        });

        it('Check soft stop for deceased alias', function () {
            const step = steps.DeceasedAlias;
            const formdata = {
                deceased: {alias: 'Yes'}
            };

            const result = step.isSoftStop(formdata, ctx);

            assertSoftStop(result, step);
        });

        it('Check soft stop for deceased married', function () {
            const step = steps.DeceasedMarried;
            const formdata = {
                deceased: {married: 'Yes'}
            };

            const result = step.isSoftStop(formdata, ctx);

            assertSoftStop(result, step);
        });

        it('Check soft stop for iht paper 400', function () {
            const step = steps.IhtPaper;
            const formdata = {
                iht: {form: '400'}
            };

            const result = step.isSoftStop(formdata, ctx);

            assertSoftStop(result, step);
        });

        it('Check soft stop for iht paper 207', function () {
            const step = steps.IhtPaper;
            const formdata = {
                iht: {form: '207'}
            };

            const result = step.isSoftStop(formdata, ctx);

            assertSoftStop(result, step);
        });

        it('Check soft stop for codicil date', function () {
            const step = steps.CodicilsDate;
            const formdata = {will: {isCodicilsDate: 'No'}};

            const result = step.isSoftStop(formdata, ctx);

            assertSoftStop(result, step);
        });
    });

    function assertSoftStop(result, step) {
        assert.equal(result.isSoftStop, true);
        assert.equal(result.stepName, step.constructor.name);
    }
});
