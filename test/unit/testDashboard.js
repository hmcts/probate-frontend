'use strict';

const rewire = require('rewire');
const sinon = require('sinon');
const initSteps = require('app/core/initSteps');
const {assert, expect} = require('chai');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const Dashboard = steps.Dashboard;
const dashboard = rewire('app/steps/ui/dashboard');

describe('Dashboard', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = Dashboard.constructor.getUrl();
            expect(url).to.equal('/dashboard');
            done();
        });
    });

    describe('getContextData()', () => {
        it('should return the correct context on GET', (done) => {
            const req = {
                method: 'GET',
                sessionID: 'dummy_sessionId',
                session: {
                    language: 'en',
                    form: {
                        applications: [
                            {ccdCase: {id: 1234567890123456}},
                            {ccdCase: {id: 5678901234567890}},
                            {ccdCase: {id: 9012345678901234}}
                        ]
                    },
                    caseType: 'gop'
                }
            };
            const revert = dashboard.__set__('eligibilityCookie', {setCookie: sinon.spy()});
            const res = {cookie: () => true};

            const ctx = Dashboard.getContextData(req, res);
            expect(ctx).to.deep.equal({
                sessionID: 'dummy_sessionId',
                applications: [
                    {ccdCase: {id: 1234567890123456, idFormatted: '1234-5678-9012-3456', idFormattedAccessible: '1 2 3 4, -, 5 6 7 8, -, 9 0 1 2, -, 3 4 5 6'}},
                    {ccdCase: {id: 5678901234567890, idFormatted: '5678-9012-3456-7890', idFormattedAccessible: '5 6 7 8, -, 9 0 1 2, -, 3 4 5 6, -, 7 8 9 0'}},
                    {ccdCase: {id: 9012345678901234, idFormatted: '9012-3456-7890-1234', idFormattedAccessible: '9 0 1 2, -, 3 4 5 6, -, 7 8 9 0, -, 1 2 3 4'}}
                ],
                userLoggedIn: false,
                language: 'en',
                featureToggles: {
                    ft_avaya_webchat: 'false'
                },
                isAvayaWebChatEnabled: false
            });
            revert();
            done();
        });
    });

    describe('handleGet()', () => {
        it('should return true when the isDashboard flag', (done) => {
            const ctxToTest = {};
            const [ctx] = Dashboard.handleGet(ctxToTest);
            expect(ctx.isDashboard).to.equal(true);
            done();
        });
    });

    describe('action()', () => {
        it('test it cleans up context', () => {
            const ctx = {
                applications: [
                    'dummyApplication1',
                    'dummyApplication2',
                    'dummyApplication3'
                ]
            };
            Dashboard.action(ctx);
            assert.isUndefined(ctx.applications);
        });
    });
});
