'use strict';

const TestWrapper = require('test/util/TestWrapper');

const CopiesSummary = require('app/steps/ui/copies/summary');

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

describe('copies-overseas', () => {
    let testWrapper;
    const expectedNextUrlForCopiesSummary = CopiesSummary.getUrl();

    afterEach(async () => {
        nock.cleanAll();
        await testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection - Feature toggles', () => {

        it('test right content loaded on the page with the ft_fees_api toggle ON', (done) => {

            testWrapper = new TestWrapper('CopiesOverseas', {ft_fees_api: true});
            invitesAllAgreedNock();

            const sessionData = require('test/data/copiesUk');
            sessionData.ccdCase = {
                state: 'Pending',
                id: 1234567890123456
            };

            try {
                testWrapper.agent.post('/prepare-session/form')
                    .send(sessionData)
                    .end(() => {
                        console.log('ft_fees_api toggle ON - 4) into /prepare-session/form post end');
                        delete require.cache[require.resolve('test/data/copiesUk')];
                        const contentToExclude = [
                            'questionOld',
                            'paragraph1Old'
                        ];

                        testWrapper.testContent(done, {}, contentToExclude);
                    });
            } catch (err) {
                console.error(err.message);
                done(err);
            }
        });

        it('test right content loaded on the page with the ft_fees_api toggle OFF', (done) => {
            testWrapper = new TestWrapper('CopiesOverseas', {ft_fees_api: false});

            invitesAllAgreedNock();

            const sessionData = require('test/data/copiesUk');
            sessionData.ccdCase = {
                state: 'Pending',
                id: 1234567890123456
            };

            try {
                testWrapper.agent.post('/prepare-session/form')
                    .send(sessionData)
                    .end(() => {
                        delete require.cache[require.resolve('test/data/copiesUk')];
                        const contentToExclude = [
                            'paragraph1',
                            'bullet1',
                            'bullet2',
                            'copies'
                        ];

                        testWrapper.testContent(done, {}, contentToExclude);
                    });
            } catch (err) {
                console.error(err.message);
                done(err);
            }
        });
    });

    describe('Verify Content, Errors and Redirection', () => {
        beforeEach(() => {
            testWrapper = new TestWrapper('CopiesOverseas');
        });

        testCommonContent.runTest('CopiesOverseas', null, null, [], false, {ccdCase: {state: 'CaseCreated'}, declaration: {declarationCheckbox: 'true'}});

        it('test errors message displayed for invalid data, text values', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {overseas: 'abcd'};
                    try {
                        testWrapper.testErrors(done, data, 'invalid');
                    } catch (err) {
                        console.error(err.message);
                        done(err);
                    }
                });
        });

        it('test errors message displayed for invalid data, special characters', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {overseas: '//1234//'};

                    try {
                        testWrapper.testErrors(done, data, 'invalid');
                    } catch (err) {
                        console.error(err.message);
                        done(err);
                    }
                });
        });

        it('test errors message displayed for missing data, nothing entered', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {overseas: ''};

                    try {
                        testWrapper.testErrors(done, data, 'required');
                    } catch (err) {
                        console.error(err.message);
                        done(err);
                    }
                });
        });

        it('test errors message displayed for invalid data, negative numbers', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {overseas: '-1'};

                    try {
                        testWrapper.testErrors(done, data, 'invalid');
                    } catch (err) {
                        console.error(err.message);
                        done(err);
                    }
                });
        });

        it(`test it redirects to next page: ${expectedNextUrlForCopiesSummary}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {overseas: '0'};

                    try {
                        testWrapper.testRedirect(done, data, expectedNextUrlForCopiesSummary);
                    } catch (err) {
                        console.error(err.message);
                        done(err);
                    }
                });
        });

        it(`test it redirects to next page: ${expectedNextUrlForCopiesSummary}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {overseas: '1'};

                    try {
                        testWrapper.testRedirect(done, data, expectedNextUrlForCopiesSummary);
                    } catch (err) {
                        console.error(err.message);
                        done(err);
                    }
                });
        });
    });
});
