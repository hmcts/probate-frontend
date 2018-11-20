'use strict';

const initSteps = require('app/core/initSteps');
const assert = require('chai').assert;
const expect = require('chai').expect;
const stopPagesContent = require('../../app/resources/en/translation/stoppage.json');

describe('Soft Stops', function () {
    const steps = initSteps([__dirname + '/../../app/steps/action/', __dirname + '/../../app/steps/ui/']);
    const stopPage = steps.StopPage;

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
                iht: {form: 'IHT400421'}
            };

            const result = step.isSoftStop(formdata, ctx);

            assertSoftStop(result, step);
        });

        it('Check soft stop for iht paper 207', function () {
            const step = steps.IhtPaper;
            const formdata = {
                iht: {form: 'IHT207'}
            };

            const result = step.isSoftStop(formdata, ctx);

            assertSoftStop(result, step);
        });
    });

    describe('Link placeholder replacements', function () {
        it('Filters out link URL placeholders from content', function () {
            const stopPages = {
                noWill: {placeHolders: ['applicationFormPA1A']},
                notOriginal: {placeHolders: ['applicationFormPA1P', 'guidance', 'registryInformation']},
                notExecutor: {placeHolders: ['applicationFormPA1P', 'guidance', 'registryInformation']},
                ihtNotCompleted: {placeHolders: ['ihtNotCompleted']},
                mentalCapacity: {placeHolders: ['applicationFormPA1P', 'guidance', 'registryInformation']},
                deathCertificate: {placeHolders: ['deathReportedToCoroner']}
            };

            Object.keys(stopPages).forEach(function(key) {
                stopPages[key].content = stopPagesContent[key];

                assert.deepEqual(stopPage.replaceLinkPlaceholders(stopPagesContent[key]), stopPages[key].placeHolders);
            });
        });

    });

    describe('action()', () => {
        it('removes the correct values from the context', (done) => {
            const ctx = {
                linkPlaceholders: ['applicationFormPA1A', 'guidance', 'registryInformation']
            };
            const testFormdata = {
                linkPlaceholders: ['applicationFormPA1A', 'guidance', 'registryInformation']
            };
            const action = stopPage.action(ctx, testFormdata);

            expect(action).to.deep.equal([{}, testFormdata]);
            done();
        });
    });

    function assertSoftStop(result, step) {
        assert.equal(result.isSoftStop, true);
        assert.equal(result.stepName, step.constructor.name);
    }
});
