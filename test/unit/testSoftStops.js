'use strict';

const initSteps = require('app/core/initSteps');
const {assert, expect} = require('chai');
const stopPagesContent = require('../../app/resources/en/translation/stoppage.json');

describe('Soft Stops', () => {
    const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
    const stopPage = steps.StopPage;

    let ctx;

    beforeEach(() => {
        ctx = {};
    });

    describe('Soft stops for pages', () => {
        it('Check soft stop for applicant name as on the will', () => {
            const step = steps.ApplicantNameAsOnWill;
            const formdata = {
                applicant: {nameAsOnTheWill: 'optionNo'}
            };

            const result = step.isSoftStop(formdata, ctx);

            assertSoftStop(result, step);
        });

        it('Check soft stop for deceased alias', () => {
            const step = steps.DeceasedAlias;
            const formdata = {
                deceased: {alias: 'optionYes'}
            };

            const result = step.isSoftStop(formdata, ctx);

            assertSoftStop(result, step);
        });

        it('Check soft stop for deceased married', () => {
            const step = steps.DeceasedMarried;
            const formdata = {
                deceased: {married: 'optionYes'}
            };

            const result = step.isSoftStop(formdata, ctx);

            assertSoftStop(result, step);
        });

        it('Check soft stop for iht paper 400', () => {
            const step = steps.IhtPaper;
            const formdata = {
                iht: {form: 'optionIHT400421'}
            };

            const result = step.isSoftStop(formdata, ctx);

            assertSoftStop(result, step);
        });

        it('Check soft stop for iht paper 207', () => {
            const step = steps.IhtPaper;
            const formdata = {
                iht: {form: 'optionIHT207'}
            };

            const result = step.isSoftStop(formdata, ctx);

            assertSoftStop(result, step);
        });
    });

    describe('Link placeholder replacements', () => {
        it('Filters out link URL placeholders from content', () => {
            const stopPages = {
                deathCertificate: {placeHolders: ['deathReportedToCoroner']},
                deathCertificateTranslation: {placeHolders: ['applicationFormPA19']},
                notInEnglandOrWales: {placeHolders: ['applicationFormPA1P', 'applicationFormPA1A']},
                ihtNotCompleted: {placeHolders: ['ihtNotCompleted']},
                eeEstateNotValued: {placeHolders: ['ihtChecker', 'ihtChecker', 'ihtChecker']},
                notDiedAfterOctober2014: {placeHolders: ['applicationFormPA1A']},
                notRelated: {placeHolders: ['applicationFormPA1A']},
                otherApplicants: {placeHolders: ['applicationFormPA1A']},
                notOriginal: {placeHolders: ['solicitorsRegulationAuthority', 'findOriginalWill', 'applicationFormPA1P', 'applicationFormPA1A']},
                notExecutor: {placeHolders: ['applicationFormPA1P']},
                mentalCapacity: {placeHolders: ['applicationFormPA1P', 'applicationFormPA14']}
            };

            Object.keys(stopPages).forEach((key) => {
                stopPages[key].content = stopPagesContent[key];

                assert.deepEqual(stopPage.replaceLinkPlaceholders(stopPagesContent[key]), stopPages[key].placeHolders);
            });
        });

    });

    describe('action()', () => {
        it('removes the correct values from the context', (done) => {
            const ctx = {
                stopReason: 'someReason',
                linkPlaceholders: ['applicationFormPA1A']
            };
            const testFormdata = {
                stopReason: 'someReason',
                linkPlaceholders: ['applicationFormPA1A']
            };
            const action = stopPage.action(ctx, testFormdata);

            expect(action).to.deep.equal([{}, testFormdata]);
            done();
        });
    });

    const assertSoftStop = (result, step) => {
        assert.equal(result.isSoftStop, true);
        assert.equal(result.stepName, step.constructor.name);
    };
});
