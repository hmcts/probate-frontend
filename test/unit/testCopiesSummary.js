'use strict';

const initSteps = require('app/core/initSteps');
const chai = require('chai');
const expect = chai.expect;
const testSteps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const jsonAssetsOverseas = require('app/resources/en/translation/assets/overseas');
const jsonCopiesOverseas = require('app/resources/en/translation/copies/overseas');
const jsonCopiesSummary = require('app/resources/en/translation/copies/summary');
const jsonCopiesUk = require('app/resources/en/translation/copies/uk');

describe('CopiesSummary.js', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const copiesSummary = testSteps.CopiesSummary;
            const url = copiesSummary.constructor.getUrl();
            expect(url).to.equal('/copies-summary');
            done();
        });
    });

    describe('generateContent()', () => {
        it('should return the correct content', (done) => {
            const ctx = {
                sessionID: 'A'
            };
            const formdata = {};

            delete jsonAssetsOverseas.errors;
            delete jsonCopiesOverseas.errors;
            delete jsonCopiesUk.errors;
            jsonAssetsOverseas.url = '/assets-overseas';
            jsonCopiesOverseas.url = '/copies-overseas';
            jsonCopiesUk.url = '/copies-uk';
            jsonCopiesSummary.url = '/copies-summary';

            const copiesSummary = testSteps.CopiesSummary;
            const generateContent = copiesSummary.generateContent(ctx, formdata);
            expect(generateContent.AssetsOverseas).to.deep.equal(jsonAssetsOverseas);
            expect(generateContent.CopiesOverseas).to.deep.equal(jsonCopiesOverseas);
            expect(generateContent.CopiesSummary).to.deep.equal(jsonCopiesSummary);
            expect(generateContent.CopiesUk).to.deep.equal(jsonCopiesUk);
            expect(generateContent.AssetsJEGG).to.deep.equal(undefined);
            expect(generateContent.CopiesJEGG).to.deep.equal(undefined);
            done();
        });
    });

    describe('generateFields()', () => {
        const errors = [];
        it('should return the correct fields if Yes is given', (done) => {
            const ctx = {
                sessionID: 'A'
            };
            const formdata = {
                assets: {
                    assetsoverseas: 'Yes'
                }
            };

            const copiesSummary = testSteps.CopiesSummary;
            const generateFields = copiesSummary.generateFields(ctx, errors, formdata);
            expect(generateFields.assets.assetsoverseas.value).to.deep.equal('Yes');
            done();
        });

        it('should return the correct fields if No is given', (done) => {
            const ctx = {
                sessionID: 'A'
            };
            const formdata = {
                assets: {
                    assetsoverseas: 'No'
                }
            };

            const copiesSummary = testSteps.CopiesSummary;
            const generateFields = copiesSummary.generateFields(ctx, errors, formdata);
            expect(generateFields.assets.assetsoverseas.value).to.deep.equal('No');
            done();
        });
    });
});
