'use strict';

const {assert, expect, use} = require('chai');
const sinon = require('sinon');
const chaiAsPromised = require('chai-as-promised');
const InviteLinkModule = require('app/services/InviteLink');
const initSteps = require('app/core/initSteps');
const journey = require('app/journeys/probate');

use(chaiAsPromised);

const steps = initSteps([
    `${__dirname}/../../../app/steps/action/`,
    `${__dirname}/../../../app/steps/ui`
]);
const ExecsInvite = steps.ExecutorsInvite;

describe('Executors-Invite', () => {
    let ctx;

    describe('getContextData()', () => {
        const req = {
            session: {
                form: {
                    executors: {
                        executorsNumber: 0
                    }
                }
            }
        };

        it('test inviteSuffix is correct when the number of executors is 2', () => {
            req.session.form.executors.executorsNumber = 2;
            ctx = ExecsInvite.getContextData(req);
            assert.equal(ctx.inviteSuffix, '');
        });

        it('test inviteSuffix is correct when the number of executors exceeds 2', () => {
            req.session.form.executors.executorsNumber = 3;
            ctx = ExecsInvite.getContextData(req);
            assert.equal(ctx.inviteSuffix, '-multiple');
        });
    });

    describe('nextStepUrl()', () => {
        it('should return url for the next step', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {};
            const nextStepUrl = ExecsInvite.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/executors-invites-sent');
            done();
        });
    });

    describe('action()', () => {
        it('test inviteSuffix is removed from the context', () => {
            ctx = {
                inviteSuffix: '-multiple'
            };
            ExecsInvite.action(ctx);
            assert.isUndefined(ctx.inviteSuffix);
        });
    });

    describe('handlePost()', () => {
        let ctx, formdata, InviteLinkMock, logger, merge;

        beforeEach(() => {
            logger = require('app/components/logger')('Init');
            ctx = {
                list: [{
                    email: 'a@b.com',
                    fullName: 'John Doe',
                    isApplying: true,
                    isApplicant: false
                }]
            };
            formdata = {
                deceased: {firstName: 'Jane', lastName: 'Doe'},
                ccdCase: {id: 12345},
                applicant: {},
                language: {bilingual: 'optionNo'}
            };
            sinon.stub(require('lodash'), 'merge');
            merge = require('lodash').merge;
        });

        afterEach(() => {
            sinon.restore();
        });

        it('should log error and throw ReferenceError if result.name is Error', async () => {
            sinon.stub(logger, 'error');
            InviteLinkMock = sinon.stub().returns({
                post: () => Promise.resolve({name: 'Error'})
            });

            const instance = Object.create(ExecsInvite);
            instance.InviteLink = InviteLinkMock;
            const gen = instance.handlePost(ctx, [], formdata);
            const promise = gen.next().value;

            await expect(promise).to.be.rejectedWith(ReferenceError);
            expect(logger.error.calledOnce);
        });

        it('should merge invitations if result.name is ok', async () => {
            const execResult = {inviteId: 'john-doe-123', email: 'a@b.com', executorName: 'John Doe'};

            sinon.stub(require('app/utils/Sanitize'), 'sanitizeInput').callsFake(x => x);
            sinon.stub(InviteLinkModule.prototype, 'post').resolves({invitations: [execResult]});
            const instance = Object.create(ExecsInvite);
            const gen = instance.handlePost(ctx, [], formdata);
            await gen.next().value;

            expect(merge.calledWith(ctx.list[0], {inviteId: 'john-doe-123', emailSent: true}));
        });
    });
});
