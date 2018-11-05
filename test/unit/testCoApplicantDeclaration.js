'use strict';

const initSteps = require('app/core/initSteps');
const chai = require('chai');
const expect = chai.expect;
const assert = require('chai').assert;
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const sessionData = require('test/data/complete-form').formdata;
const json = require('app/resources/en/translation/coapplicant/declaration.json');
const co = require('co');
const services = require('app/components/services');
const sinon = require('sinon');

describe('CoApplicantDeclaration.js', () => {
    let updateInviteDataStub;

    beforeEach(function () {
        updateInviteDataStub = sinon.stub(services, 'updateInviteData');
    });

    afterEach(function () {
        updateInviteDataStub.restore();
    });

    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const coApplicantDeclaration = steps.CoApplicantDeclaration;
            const url = coApplicantDeclaration.constructor.getUrl();
            expect(url).to.equal('/co-applicant-declaration');
            done();
        });
    });

    describe('getContextData()', () => {
        it('sets the context correctly', (done) => {
            const req = {
                session: {
                    inviteId: 'A',
                    formdataId: 'B',
                    form: {
                        sessionData
                    }
                }
            };

            const formdata = req.session.form;
            const coApplicantDeclaration = steps.CoApplicantDeclaration;
            const ctx = coApplicantDeclaration.getContextData(req);

            expect(ctx.inviteId).to.equal('A');
            expect(ctx.formdataId).to.equal('B');
            expect(ctx.declaration).to.equal(formdata.declaration);
            expect(ctx.applicant).to.equal(formdata.applicant);
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const coApplicantDeclaration = steps.CoApplicantDeclaration;
            const nextStepOptions = coApplicantDeclaration.nextStepOptions();
            expect(nextStepOptions).to.deep.equal({
                options: [{
                    key: 'agreement',
                    value: json.optionYes,
                    choice: 'agreed'
                }]
            });
            done();
        });
    });

    describe('handlePost()', () => {
        it('does not throw error if name is Success', (done) => {
            updateInviteDataStub.returns(Promise.resolve({name: 'Success'}));
            const coApplicantDeclaration = steps.CoApplicantDeclaration;

            let ctx = {
                inviteId: 'A',
                agreement: json.optionYes
            };
            let errors = [];

            co(function* () {
                [ctx, errors] = yield coApplicantDeclaration.handlePost(ctx, errors);
                done();
            })
                .catch((err) => {
                    done(err);
                });
        });

        it('throws error if name is Error', (done) => {
            updateInviteDataStub.returns(Promise.resolve({name: 'Error'}));
            const coApplicantDeclaration = steps.CoApplicantDeclaration;

            let ctx = {
                inviteId: 'A',
                agreement: json.optionYes
            };
            let errors = [];

            co(function* () {
                [ctx, errors] = yield coApplicantDeclaration.handlePost(ctx, errors);
                done();
            })
                .catch((err) => {
                    expect(err).to.equal(new ReferenceError('Error updating co-applicant\'s data'));
                    done(err);
                });
            done();
        });
    });

    describe('action()', () => {
        it('removes the correct values from the context', (done) => {
            const ctx = {
                sessionID: 'A',
                _csrf: 'B',
                inviteId: 'C',
                formdataId: 'D',
                applicant: sessionData.applicant,
                declaration: sessionData.declaration
            };
            const formdata = {};
            const coApplicantDeclaration = steps.CoApplicantDeclaration;
            const action = coApplicantDeclaration.action(ctx, formdata);

            expect(action).to.deep.equal([{}, formdata]);
            done();
        });
    });
});
