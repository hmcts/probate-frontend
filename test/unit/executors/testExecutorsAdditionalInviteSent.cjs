'use strict';

const initSteps = require('app/core/initSteps');
const {assert, expect} = require('chai');
const coreContextMockData = require('../../data/core-context-mock-data.json');

describe('Executor-Additional-Invite-Sent', () => {
    let ctx;
    let req;
    const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
    const executorsAdditionalInviteSent = steps.ExecutorsAdditionalInviteSent;

    describe('getContextData()', () => {
        beforeEach(() => {
            req = {
                sessionID: 'dummy_sessionId',
                session: {
                    language: 'en',
                    form: {
                        executors: {},
                        caseType: 'gop',
                        ccdCase: {
                            id: 1234567890123456,
                            state: 'Pending'
                        }
                    },
                    serviceAuthorization: 'serviceAuthorization',
                    caseType: 'probate'
                },
                authToken: 'authToken',
                caseType: 'gop'
            };
        });

        it('test that inviteSuffix is correctly populated with empty string when only one executor is to be notified', () => {
            req.session.form.executors = {
                executorsToNotifyList: [
                    {fullName: 'other applicant', isApplying: true}
                ]
            };
            ctx = executorsAdditionalInviteSent.getContextData(req);
            expect(ctx).to.deep.equal({
                ...coreContextMockData,
                executorsToNotifyList: [
                    {
                        fullName: 'other applicant',
                        isApplying: true
                    }
                ],
                header: 'header',
                inviteSuffix: '',
                sessionID: 'dummy_sessionId',
                authToken: 'authToken',
                serviceAuthorization: 'serviceAuthorization'
            });
        });

        it('test that inviteSuffix is correctly populated with -multiples when more than one executor is to be notified', () => {
            req.session.form.executors = {
                executorsToNotifyList: [
                    {fullName: 'other applicant', isApplying: true},
                    {fullName: 'harvey', isApplying: true}
                ]
            };
            ctx = executorsAdditionalInviteSent.getContextData(req);
            expect(ctx).to.deep.equal({
                ...coreContextMockData,
                executorsToNotifyList: [
                    {
                        fullName: 'other applicant',
                        isApplying: true
                    },
                    {
                        fullName: 'harvey',
                        isApplying: true
                    }
                ],
                header: 'header-multiple',
                inviteSuffix: '-multiple',
                sessionID: 'dummy_sessionId',
                authToken: 'authToken',
                serviceAuthorization: 'serviceAuthorization'
            });
        });
    });

    describe('action()', () => {
        beforeEach(() => {
            ctx = {
                executorsToNotifyList: [
                    {fullName: 'other applicant', isApplying: true},
                    {fullName: 'harvey', isApplying: true}
                ],
                inviteSuffix: '-multiple',
                header: 'header-multiple'
            };
        });

        it('test that context variables are removed and empty object returned', () => {
            let formdata = {
                executors: {
                    executorsToNotifyList: [
                        {fullName: 'other applicant', isApplying: true},
                        {fullName: 'harvey', isApplying: true}
                    ]
                }
            };
            [ctx, formdata] = executorsAdditionalInviteSent.action(ctx, formdata);
            expect(ctx).to.deep.equal({});
            expect(formdata).to.deep.equal({'executors': {}});
        });

        it('test that context variables are removed and object contains only appropriate variables', () => {
            let formdata = {
                executors: {
                    executorsToNotifyList: [
                        {fullName: 'other applicant', isApplying: true},
                        {fullName: 'harvey', isApplying: true}
                    ]
                }
            };
            ctx.invitesSent = 'true';
            [ctx, formdata] = executorsAdditionalInviteSent.action(ctx, formdata);
            expect(ctx).to.deep.equal({invitesSent: 'true'});
            expect(formdata).to.deep.equal({'executors': {}});
        });
    });

    describe('getUrl()', () => {
        it('test correct url is returned from getUrl function', () => {
            assert.equal(executorsAdditionalInviteSent.constructor.getUrl(), '/executors-additional-invite-sent');
        });
    });
});
