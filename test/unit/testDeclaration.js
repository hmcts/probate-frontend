'use strict';

const {assert} = require('chai');
const initSteps = require('app/core/initSteps');
const services = require('app/components/services');
const sinon = require('sinon');
const {expect} = require('chai');
const ExecutorsWrapper = require('app/wrappers/Executors');

describe('Declaration tests', function () {
    let ctx;
    let formdata;
    let updateInviteDataStub;
    const Declaration = initSteps([__dirname + '/../../app/steps/action/', __dirname + '/../../app/steps/ui']).Declaration;

    describe('resetAgreedFlags()', () => {
        const executorsInvited = [
            {inviteId: '1'},
            {inviteId: '2'},
            {inviteId: '3'}
        ];

        beforeEach(() => {
            updateInviteDataStub = sinon.stub(services, 'updateInviteData');
        });

        afterEach(() => {
            updateInviteDataStub.restore();
        });

        it('Success - there are no Errors in the results', (done) => {
            updateInviteDataStub.returns(Promise.resolve({agreed: null}));
            Declaration.resetAgreedFlags(executorsInvited).then((results) => {
                assert.isFalse(results.some(result => result.name === 'Error'));
                done();
            })
            .catch(err => done(err));
        });

        it('Failure - there is an Error in the results', (done) => {
            updateInviteDataStub.returns(Promise.resolve(new Error('Blimey')));
            Declaration.resetAgreedFlags(executorsInvited).then((results) => {
                assert.isTrue(results.some(result => result.name === 'Error'));
                done();
            })
            .catch(err => done(err));
        });
    });

    describe('action()', () => {
        beforeEach(() => {
            updateInviteDataStub = sinon.stub(services, 'updateInviteData');
            ctx = {
                hasMultipleApplicants: true,
                hasDataChanged: false,
                executorsEmailChanged: false,
                hasDataChangedAfterEmailSent: true,
                invitesSent: 'true',
            };
            formdata = {};
        });

        afterEach(() => {
            updateInviteDataStub.restore();
        });

        it('test that context variables are removed and empty object returned', () => {
            [ctx, formdata] = Declaration.action(ctx, formdata);
            expect(ctx).to.deep.equal({});
        });

        it('test that context variables are removed and object contains only appropriate variables', () => {
            ctx.softStop = false;
            [ctx, formdata] = Declaration.action(ctx, formdata);
            expect(ctx).to.deep.equal({softStop: false});
        });

        it('test that context variables are removed and resetAgreedFlags is called', () => {
            updateInviteDataStub.returns(Promise.resolve({agreed: null}));
            ctx.hasDataChanged = true;
            ctx.executors = {
                'executorsNumber': 3,
                    'invitesSent': 'true',
                    'list': [
                    {'fullName': 'john', 'isApplying': true, 'isApplicant': true},
                    {'fullName': 'other applicant', 'isApplying': true, 'emailChanged': true},
                    {'fullName': 'harvey', 'isApplying': true, 'emailChanged': true}
                ]
            };
            ctx.executorsWrapper = new ExecutorsWrapper(ctx.executors);
            [ctx, formdata] = Declaration.action(ctx, formdata);
            expect(ctx).to.deep.equal({
                executors: {
                    'executorsNumber': 3,
                    'invitesSent': 'true',
                    'list': [
                        {'fullName': 'john', 'isApplying': true, 'isApplicant': true},
                        {'fullName': 'other applicant', 'isApplying': true, 'emailChanged': true},
                        {'fullName': 'harvey', 'isApplying': true, 'emailChanged': true}
                    ]
                }
            });
        });
    });
});
