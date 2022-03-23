'use strict';
const initSteps = require('app/core/initSteps');
const {expect, assert} = require('chai');
const rewire = require('rewire');
const UpdateInvite = rewire('app/steps/ui/executors/updateinvite');
const co = require('co');

describe('Update-Invite', () => {
    let steps;
    let section;
    let templatePath;
    let i18next;
    let schema;
    let req;
    let ctx;
    let errors;

    beforeEach(() => {
        steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
        section = 'executors';
        templatePath = 'executors/updateinvite';
        i18next = {};
        schema = {
            $schema: 'http://json-schema.org/draft-07/schema',
            properties: {}
        };
        req = {
            session: {
                form: {
                    deceased: {
                        firstName: 'Dee',
                        lastName: 'Ceased'
                    },
                    executors: {
                        executorsNumber: 3,
                        invitesSent: true
                    },
                    ccdCase: {
                        id: '1234-1234-1234-1234'
                    }
                }
            }
        };
    });

    describe('getUrl()', () => {
        it('test correct url is returned from getUrl function', () => {
            const updateInvite = new UpdateInvite(steps, section, templatePath, i18next, schema);
            assert.equal(updateInvite.constructor.getUrl(), '/executors-update-invite');
        });
    });

    describe('getContextData()', () => {
        it('test ctx variables are correctly assigned when there are more than one executor with new email', (done) => {

            const updateInvite = new UpdateInvite(steps, section, templatePath, i18next, schema);
            req.session.form.executors.list = [
                {fullName: 'john', isApplying: true, isApplicant: true},
                {fullName: 'other applicant', isApplying: true, emailChanged: true},
                {fullName: 'harvey', isApplying: true, emailChanged: true}];

            ctx = updateInvite.getContextData(req);
            expect(ctx.executorsEmailChangedList).to.deep.equal([
                {
                    emailChanged: true,
                    fullName: 'other applicant',
                    isApplying: true
                },
                {
                    emailChanged: true,
                    fullName: 'harvey',
                    isApplying: true
                }
            ]);
            expect(ctx.inviteSuffix).to.deep.equal('-multiple');
            done();
        });

        it('test ctx variables are correctly assigned when there is only one executor with new email', (done) => {

            const updateInvite = new UpdateInvite(steps, section, templatePath, i18next, schema);
            req.session.form.executors.list = [
                {fullName: 'john', isApplying: true, isApplicant: true},
                {fullName: 'other applicant', isApplying: true, emailChanged: true},
                {fullName: 'harvey', isApplying: true}];
            ctx = updateInvite.getContextData(req);
            expect(ctx.executorsEmailChangedList).to.deep.equal([
                {
                    emailChanged: true,
                    fullName: 'other applicant',
                    isApplying: true
                }
            ]);
            expect(ctx.inviteSuffix).to.deep.equal('');
            done();
        });
    });

    describe('handlePost()', () => {
        it('test that the emailChanged flag has been deleted', (done) => {
            const restoreInviteLink = UpdateInvite.__set__('InviteLink', class {
                post() {
                    return Promise.resolve({
                        invitations: [{
                            inviteId: '5678',
                            email: 'test@test.com',
                            executorName: 'other applicant'
                        }]
                    });
                }
            });

            const updateInvite = new UpdateInvite(steps, section, templatePath, i18next, schema);
            ctx = {};
            errors = {};
            req.session.form.executors.list = [
                {fullName: 'john', isApplying: true, isApplicant: true},
                {fullName: 'other applicant', isApplying: true, emailChanged: true, inviteId: '5678', email: 'test@test.com'}
            ];
            const expectedExecutorList = [
                {fullName: 'john', isApplying: true, isApplicant: true, id: 0},
                {fullName: 'other applicant', isApplying: true, inviteId: '5678', email: 'test@test.com', id: 1}];

            co(function* () {
                [ctx, errors] = yield updateInvite.handlePost(ctx, errors, req.session.form);
                restoreInviteLink();
                console.log(req.session.form.executors.list);
                expect(req.session.form.executors.list).to.deep.equal(expectedExecutorList);
                done();
            }).catch(err => {
                done(err);
            });
        });
    });

    describe('action()', () => {
        it('test that context variables are removed and empty object returned', () => {
            const updateInvite = new UpdateInvite(steps, section, templatePath, i18next, schema);
            let formdata = {};
            let ctx = {
                executorsEmailChanged: true,
                executorsEmailChangedList: true,
                inviteSuffix: '-multiple'
            };
            [ctx, formdata] = updateInvite.action(ctx, formdata);
            expect(ctx).to.deep.equal({});
        });

        it('test that context variables are removed and object contains only appropriate variables', () => {
            const updateInvite = new UpdateInvite(steps, section, templatePath, i18next, schema);
            let formdata = {};
            let ctx = {
                executorsEmailChanged: true,
                executorsEmailChangedList: true,
                inviteSuffix: '-multiple',
                invitesSent: 'true'
            };
            [ctx, formdata] = updateInvite.action(ctx, formdata);
            expect(ctx).to.deep.equal({invitesSent: 'true'});
        });
    });
});
