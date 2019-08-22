'use strict';

const initSteps = require('../../app/core/initSteps');
const {expect, assert} = require('chai');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const Dashboard = steps.Dashboard;
const content = require('app/resources/en/translation/dashboard');

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
                    form: {
                        applications: [{
                            ccdCaseId: '1234-5678-9012-3456',
                            deceasedFullName: 'Bob Jones',
                            dateCreated: '7 October 2018',
                            status: content.statusInProgress
                        }, {
                            ccdCaseId: '9012-3456-1234-5678',
                            deceasedFullName: 'Tom Smith',
                            dateCreated: '24 February 2019',
                            status: content.statusSubmitted
                        }]
                    }
                }
            };
            const res = {};

            const ctx = Dashboard.getContextData(req, res);
            expect(ctx).to.deep.equal({
                sessionID: 'dummy_sessionId',
                applications: [{
                    ccdCaseId: '1234-5678-9012-3456',
                    deceasedFullName: 'Bob Jones',
                    dateCreated: '7 October 2018',
                    status: content.statusInProgress
                }, {
                    ccdCaseId: '9012-3456-1234-5678',
                    deceasedFullName: 'Tom Smith',
                    dateCreated: '24 February 2019',
                    status: content.statusSubmitted
                }],
                caseType: 'gop',
                userLoggedIn: false
            });
            done();
        });
    });

    describe('action()', () => {
        it('test it cleans up context', () => {
            const ctx = {
                applications: [{
                    ccdCaseId: '1234-5678-9012-3456',
                    deceasedFullName: 'Bob Jones',
                    dateCreated: '7 October 2018',
                    status: content.statusInProgress
                }, {
                    ccdCaseId: '9012-3456-1234-5678',
                    deceasedFullName: 'Tom Smith',
                    dateCreated: '24 February 2019',
                    status: content.statusSubmitted
                }]
            };
            Dashboard.action(ctx);
            assert.isUndefined(ctx.applications);
        });
    });
});
