'use strict';

const initSteps = require('app/core/initSteps');
const co = require('co');
const expect = require('chai').expect;
const journey = require('app/journeys/intestacy');
const rewire = require('rewire');
const CoApplicantEmail = rewire('app/steps/ui/executors/coapplicantemail');

describe('coapplicant-email', () => {
    let ctx;
    let errors;
    const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
    let section;
    let templatePath;
    let i18next;
    let schema;
    let formdata;

    describe('handlePost()', () => {
        beforeEach(() => {
            section = 'applicant';
            templatePath = 'addressLookup';
            i18next = {};
            schema = {
                $schema: 'http://json-schema.org/draft-07/schema',
                properties: {}
            };
            formdata = {
                caseType: 'gop',
                applicant: {
                    phoneNumber: '07900123456'
                }
            };
            ctx = {
                list: [
                    {
                        firstName: 'Lead',
                        lastName: 'Applicant',
                        isApplying: true,
                        isApplicant: true
                    },
                    {
                        fullName: 'Bob Cratchett',
                        isApplying: true,
                        email: 'testemail@outlook.com',
                    },
                    {
                        fullName: 'Billy Jean',
                        isApplying: true,
                        email: 'testemail@gmail.com',
                        emailSent: true
                    }
                ],
                invitesSent: 'true',
                otherExecutorsApplying: 'optionYes',
                email: 'newtestemail@gmail.com',
                index: 1,
                otherExecName: 'Bob Cratchett',
                executorsEmailChanged: false,
                ccdCase: {
                    id: 1234567890123456,
                    state: 'Pending'
                }
            };
            errors = [];
        });

        it ('test emailChanged flag is correctly set and contact details updated (single applicant)', (done) => {
            co(function* () {
                ctx.list[1].emailChanged = true;
                const coApplicantEmail = new CoApplicantEmail(steps, section, templatePath, i18next, schema);
                [ctx, errors] = yield coApplicantEmail.handlePost(ctx, errors, formdata);
                expect(ctx).to.deep.equal({
                    list: [
                        {
                            firstName: 'Lead',
                            lastName: 'Applicant',
                            isApplying: true,
                            isApplicant: true
                        },
                        {
                            fullName: 'Bob Cratchett',
                            isApplying: true,
                            email: 'newtestemail@gmail.com',
                            emailChanged: true
                        },
                        {
                            fullName: 'Billy Jean',
                            isApplying: true,
                            email: 'testemail@gmail.com',
                            emailSent: true
                        }
                    ],
                    invitesSent: 'true',
                    otherExecutorsApplying: 'optionYes',
                    email: 'newtestemail@gmail.com',
                    index: 1,
                    otherExecName: 'Bob Cratchett',
                    executorsEmailChanged: true,
                    ccdCase: {
                        id: 1234567890123456,
                        state: 'Pending'
                    }
                });
                done();
            })
                .catch((err) => {
                    done(err);
                });
        });

        it('test emailChanged flag is correctly set and email details updated', (done) => {
            ctx.list[1].emailSent = false;
            ctx.list[2].emailSent = true;
            ctx.list[2].inviteId = 'dummy_id';
            co(function* () {
                const coApplicantEmail = new CoApplicantEmail(steps, section, templatePath, i18next, schema);
                [ctx, errors] = yield coApplicantEmail.handlePost(ctx, errors, formdata);
                expect(ctx).to.deep.equal({
                    list: [
                        {
                            firstName: 'Lead',
                            lastName: 'Applicant',
                            isApplying: true,
                            isApplicant: true
                        },
                        {
                            fullName: 'Bob Cratchett',
                            isApplying: true,
                            email: 'newtestemail@gmail.com',
                            emailSent: false
                        },
                        {
                            fullName: 'Billy Jean',
                            isApplying: true,
                            email: 'testemail@gmail.com',
                            emailSent: true,
                            inviteId: 'dummy_id'
                        }
                    ],
                    invitesSent: 'true',
                    otherExecutorsApplying: 'optionYes',
                    email: 'newtestemail@gmail.com',
                    index: 1,
                    otherExecName: 'Bob Cratchett',
                    executorsEmailChanged: false,
                    ccdCase: {
                        id: 1234567890123456,
                        state: 'Pending'
                    }
                });
                done();
            })
                .catch((err) => {
                    done(err);
                });
        });

        it('test emailChanged flag is correctly set, executorToBeNotifiedList is empty, contact details updated and the InviteData.patch() service is called', (done) => {
            const revert = CoApplicantEmail.__set__('InviteData', class {
                updateContactDetails() {
                    return Promise.resolve({response: 'Make it pass!'});
                }
            });

            ctx.list[1].inviteId = 'dummy_inviteId';
            ctx.list[1].emailSent = true;
            ctx.email = 'cratchet@email.com';
            co(function* () {
                const coApplicantEmail = new CoApplicantEmail(steps, section, templatePath, i18next, schema);
                [ctx, errors] = yield coApplicantEmail.handlePost(ctx, errors, formdata);
                expect(ctx).to.deep.equal({
                    list: [
                        {
                            firstName: 'Lead',
                            lastName: 'Applicant',
                            isApplying: true,
                            isApplicant: true
                        },
                        {
                            fullName: 'Bob Cratchett',
                            isApplying: true,
                            email: 'cratchet@email.com',
                            emailChanged: true,
                            inviteId: 'dummy_inviteId',
                            emailSent: true
                        },
                        {
                            fullName: 'Billy Jean',
                            isApplying: true,
                            email: 'testemail@gmail.com',
                            emailSent: true
                        }
                    ],
                    invitesSent: 'true',
                    otherExecutorsApplying: 'optionYes',
                    email: 'cratchet@email.com',
                    index: 1,
                    otherExecName: 'Bob Cratchett',
                    executorsEmailChanged: true,
                    ccdCase: {
                        id: 1234567890123456,
                        state: 'Pending'
                    }
                });
                revert();
                done();
            })
                .catch((err) => {
                    done(err);
                });
        });
    });

    describe('nextStepUrl()', () => {
        it('should return url for the next step', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                index: 1
            };
            const coApplicantEmail = new CoApplicantEmail(steps, section, templatePath, i18next, schema);
            const nextStepUrl = coApplicantEmail.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/executor-address/1');
            done();
        });
    });
});
