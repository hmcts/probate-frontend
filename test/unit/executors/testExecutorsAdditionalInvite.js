'use strict';

const initSteps = require('app/core/initSteps');
const {assert, expect} = require('chai');

describe('Executor-Additional-Invite', () => {
    let ctx;
    let req;
    const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
    const executorsAdditionalInvite = steps.ExecutorsAdditionalInvite;

    describe('getContextData()', () => {
        beforeEach(() => {
            req = {
                sessionID: 'dummy_sessionId',
                session: {
                    form: {
                        executors: [],
                        caseType: 'gop'
                    },
                    caseType: 'gop'
                }
            };
        });

        it('test that context variables are correctly populated for single executor to be notified', () => {
            req.session.form.executors = {
                list: [
                    {fullName: 'Applicant', isApplying: true, isApplicant: true},
                    {fullName: 'harvey', isApplying: true, emailSent: false}]
            };
            ctx = executorsAdditionalInvite.getContextData(req);
            expect(ctx.executorsToNotifyNames).to.equal('harvey');
            expect(ctx.inviteSuffix).to.equal('');
            expect(ctx.executorsToNotifyList).to.deep.equal([
                {emailSent: false, fullName: 'harvey', isApplying: true}
            ]);
        });

        it('test that context variables are correctly populated for multiple executors to be notified', () => {
            req.session.form.executors = {
                list: [
                    {fullName: 'Applicant', isApplying: true, isApplicant: true},
                    {fullName: 'other applicant', isApplying: true, emailSent: false},
                    {fullName: 'harvey', isApplying: true, emailSent: false}
                ]
            };
            ctx = executorsAdditionalInvite.getContextData(req);
            expect(ctx.executorsToNotifyNames).to.equal('other applicant and harvey');
            expect(ctx.inviteSuffix).to.equal('-multiple');
            expect(ctx.executorsToNotifyList).to.deep.equal([
                {emailSent: false, fullName: 'other applicant', isApplying: true},
                {emailSent: false, fullName: 'harvey', isApplying: true}
            ]);
        });
    });

    describe('action()', () => {
        beforeEach(() => {
            ctx = {
                inviteSuffix: ''
            };
        });

        it('test that inviteSuffix removed when is an empty string and empty object returned', () => {
            let formdata = {};
            [ctx, formdata] = executorsAdditionalInvite.action(ctx, formdata);
            expect(ctx).to.deep.equal({});
        });

        it('test that inviteSuffix removed when is -multiple and empty object returned', () => {
            let formdata = {};
            ctx.inviteSuffix = '-multiple';
            [ctx, formdata] = executorsAdditionalInvite.action(ctx, formdata);
            expect(ctx).to.deep.equal({});
        });

        it('test that context variables are removed and object contains only appropriate variables', () => {
            let formdata = {};
            ctx.invitesSent = 'true';
            [ctx, formdata] = executorsAdditionalInvite.action(ctx, formdata);
            expect(ctx).to.deep.equal({invitesSent: 'true'});
        });
    });

    describe('getUrl()', () => {
        it('test correct url is returned from getUrl function', () => {
            assert.equal(executorsAdditionalInvite.constructor.getUrl(), '/executors-additional-invite*');
        });
    });
});
