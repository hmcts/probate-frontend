'use strict';

const TestWrapper = require('test/util/TestWrapper');
const AssetsOverseas = require('app/steps/ui/assets/overseas');
const testCommonContent = require('test/component/common/testCommonContent.js');
const config = require('config');
const orchestratorServiceUrl = config.services.orchestrator.url;
const nock = require('nock');
const invitesAllAgreedNock = () => {
    nock(orchestratorServiceUrl)
        .get('/invite/allAgreed/1234567890123456')
        .reply(200, 'true');
};
const sessionData = {
    declaration: {
        declarationCheckbox: 'true'
    }
};

describe('copies-uk', () => {
    let testWrapper;
    const expectedNextUrlForAssetsOverseas = AssetsOverseas.getUrl();

    afterEach(async () => {
        nock.cleanAll();
        await testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection - Feature toggles', () => {
        it('test right content loaded on the page with the ft_fees_api toggle ON', (done) => {
            testWrapper = new TestWrapper('CopiesUk', {ft_fees_api: true});

            invitesAllAgreedNock();

            const sessionData = require('test/data/copiesUk');
            sessionData.ccdCase = {
                state: 'Pending',
                id: 1234567890123456
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    delete require.cache[require.resolve('test/data/copiesUk')];
                    const contentToExclude = [
                        'questionOld',
                        'paragraph1Old',
                        'paragraph2Old',
                        'paragraph3Old',
                        'copiesOld'
                    ];
                    testWrapper.testContent(done, {}, contentToExclude);
                });
        });

        it('test right content loaded on the page with the ft_fees_api toggle OFF', (done) => {
            testWrapper = new TestWrapper('CopiesUk', {ft_fees_api: false});

            invitesAllAgreedNock();

            const sessionData = require('test/data/copiesUk');
            sessionData.ccdCase = {
                state: 'Pending',
                id: 1234567890123456
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    delete require.cache[require.resolve('test/data/copiesUk')];
                    const contentToExclude = [
                        'question',
                        'paragraph1',
                        'paragraph2',
                        'paragraph3',
                        'bullet1',
                        'bullet2',
                        'copies',
                    ];
                    testWrapper.testContent(done, {}, contentToExclude);
                });
        });
    });

    describe('Verify Content, Errors and Redirection', () => {
        beforeEach(() => {
            testWrapper = new TestWrapper('CopiesUk');
        });

        testCommonContent.runTest('CopiesUk', null, null, [], false, {ccdCase: {state: 'CaseCreated'}, declaration: {declarationCheckbox: 'true'}});

        it('test errors message displayed for invalid data, text values', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {uk: 'abcd'};
                    testWrapper.testErrors(done, data, 'invalid');
                });
        });

        it('test errors message displayed for invalid data, special characters', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {uk: '//1234//'};
                    testWrapper.testErrors(done, data, 'invalid');
                });
        });

        it('test errors message displayed for missing data, nothing entered', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {uk: ''};
                    testWrapper.testErrors(done, data, 'required');
                });
        });

        it('test errors message displayed for invalid data, negative numbers', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {uk: '-1'};
                    testWrapper.testErrors(done, data, 'invalid');
                });
        });

        it(`test it redirects to next page: ${expectedNextUrlForAssetsOverseas}`, (done) => {
            invitesAllAgreedNock();

            const data = {uk: '0'};
            const sessionData = require('test/data/copiesUk');
            sessionData.ccdCase = {
                state: 'Pending',
                id: 1234567890123456
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    delete require.cache[require.resolve('test/data/copiesUk')];

                    testWrapper.testRedirect(done, data, expectedNextUrlForAssetsOverseas);
                });
        });

        it(`test it redirects to next page: ${expectedNextUrlForAssetsOverseas}`, (done) => {
            invitesAllAgreedNock();

            const data = {uk: '1'};
            const sessionData = require('test/data/copiesUk');
            sessionData.ccdCase = {
                state: 'Pending',
                id: 1234567890123456
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    delete require.cache[require.resolve('test/data/copiesUk')];

                    testWrapper.testRedirect(done, data, expectedNextUrlForAssetsOverseas);
                });
        });
    });
});
