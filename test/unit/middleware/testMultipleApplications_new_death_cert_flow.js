// eslint-disable-line max-lines

'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const rewire = require('rewire');
const multipleApplicationsMiddleware = rewire('app/middleware/multipleApplications');

const Service = require('app/services/Service');

//DTSPB-529 Test file duplicated for new probate death cert flow.

const allApplicationsExpectedResponse = {
    applications: [
        {
            deceasedFullName: 'David Cameron',
            dateCreated: '13 July 2016',
            caseType: 'PA',
            ccdCase: {
                id: '1234567890123456',
                state: 'Pending'
            }
        },
        {
            deceasedFullName: 'Theresa May',
            dateCreated: '24 July 2019',
            caseType: 'PA',
            ccdCase: {
                id: '5678901234561234',
                state: 'CaseCreated'
            }
        },
        {
            deceasedFullName: 'Boris Johnson',
            dateCreated: '14 September 2019',
            caseType: 'PA',
            ccdCase: {
                id: '9012345612345678',
                state: 'Pending'
            }
        },
        {
            deceasedFullName: 'Margareth Thatcher',
            dateCreated: '2 October 2019',
            caseType: 'INTESTACY',
            ccdCase: {
                id: '3456123456789012',
                state: 'Pending'
            }
        },
        {
            dateCreated: '9 November 2019',
            caseType: 'PA',
            ccdCase: {
                id: '9999999999999999',
                state: 'Pending'
            }
        }
    ]
};

describe('multipleApplicationsMiddleware', () => {
    describe('InitDashboardMiddleware', () => {
        it('should redirect to Start Eligibility if no applications found', (done) => {
            const req = {
                session: {
                    form: {
                        applicantEmail: 'test@email.com'
                    }
                }
            };
            const res = {redirect: () => {
                // Do nothing
            }};
            const next = sinon.spy();

            const redirectSpy = sinon.spy(res, 'redirect');
            const serviceStub = sinon.stub(Service.prototype, 'fetchJson')
                .returns(Promise.resolve({
                    applications: []
                }));

            multipleApplicationsMiddleware.initDashboard(req, res, next);

            setTimeout(() => {
                expect(serviceStub.calledOnce).to.equal(true);
                expect(redirectSpy.calledOnce).to.equal(true);
                expect(redirectSpy.calledWith('/start-eligibility')).to.equal(true);

                serviceStub.restore();
                redirectSpy.restore();

                done();
            });
        });

        it('should not create a new application if will left screener is not found', (done) => {
            const revert = multipleApplicationsMiddleware.__set__('renderDashboard', () => {
                req.session.form.applications = allApplicationsExpectedResponse.applications;
                return Promise.resolve();
            });

            const req = {
                session: {
                    form: {
                        applicantEmail: 'test@email.com',
                        caseType: 'gop',
                        payloadVersion: 'dummy',
                        userLoggedIn: true,
                        screeners: {
                            deathCertificate: 'optionYes'
                        }
                    }
                }
            };
            const res = {redirect: () => {
                // Do nothing
            }};
            const next = sinon.spy();

            const serviceStub = sinon.stub(Service.prototype, 'fetchJson')
                .returns(Promise.resolve(allApplicationsExpectedResponse));

            multipleApplicationsMiddleware.initDashboard(req, res, next);

            setTimeout(() => {
                expect(serviceStub.calledOnce).to.equal(true);
                expect(req.session).to.deep.equal({
                    form: {
                        applicantEmail: 'test@email.com',
                        payloadVersion: 'dummy',
                        userLoggedIn: true,
                        applications: allApplicationsExpectedResponse.applications
                    }
                });

                serviceStub.restore();
                revert();
                done();
            });
        });

        it('should not create a new application if all screeners are found and a Draft application of the same caseType is already present', (done) => {
            const revert = multipleApplicationsMiddleware.__set__({
                renderDashboard: function () {
                    req.session.form.applications = allApplicationsExpectedResponse.applications;
                    return Promise.resolve();
                },
                featureToggle: class {
                    static isEnabled() {
                        return true;
                    }
                }
            });

            const req = {
                session: {
                    form: {
                        applicantEmail: 'test@email.com',
                        caseType: 'gop',
                        payloadVersion: 'dummy',
                        userLoggedIn: true,
                        screeners: {
                            deathCertificate: 'optionYes',
                            deathCertificateInEnglish: 'optionNo',
                            deathCertificateTranslation: 'optionYes',
                            domicile: 'optionYes',
                            completed: 'optionYes',
                            left: 'optionYes',
                            original: 'optionYes',
                            executor: 'optionYes',
                            mentalCapacity: 'optionYes'
                        },
                    }
                }
            };
            const res = {redirect: () => {
                // Do nothing
            }};
            const next = sinon.spy();

            const serviceStub = sinon.stub(Service.prototype, 'fetchJson')
                .returns(Promise.resolve(allApplicationsExpectedResponse));

            multipleApplicationsMiddleware.initDashboard(req, res, next);

            setTimeout(() => {
                expect(serviceStub.calledOnce).to.equal(true);
                expect(req.session).to.deep.equal({
                    form: {
                        applicantEmail: 'test@email.com',
                        payloadVersion: 'dummy',
                        userLoggedIn: true,
                        applications: allApplicationsExpectedResponse.applications
                    }
                });

                serviceStub.restore();
                revert();
                done();
            });
        });

        it('should not create a new application if not all screeners are found and a Draft application of the same caseType is already present', (done) => {
            const revert = multipleApplicationsMiddleware.__set__({
                renderDashboard: function () {
                    req.session.form.applications = allApplicationsExpectedResponse.applications;
                    return Promise.resolve();
                },
                featureToggle: class {
                    static isEnabled() {
                        return true;
                    }
                }
            });

            const req = {
                session: {
                    form: {
                        applicantEmail: 'test@email.com',
                        caseType: 'gop',
                        payloadVersion: 'dummy',
                        userLoggedIn: true,
                        screeners: {
                            deathCertificateInEnglish: 'optionNo',
                            deathCertificateTranslation: 'optionYes',
                            domicile: 'optionYes',
                            completed: 'optionYes',
                            left: 'optionYes'
                        }
                    }
                }
            };
            const res = {redirect: () => {
                // Do nothing
            }};
            const next = sinon.spy();

            const serviceStub = sinon.stub(Service.prototype, 'fetchJson')
                .returns(Promise.resolve(allApplicationsExpectedResponse));

            multipleApplicationsMiddleware.initDashboard(req, res, next);

            setTimeout(() => {
                expect(serviceStub.calledOnce).to.equal(true);
                expect(req.session).to.deep.equal({
                    form: {
                        applicantEmail: 'test@email.com',
                        payloadVersion: 'dummy',
                        userLoggedIn: true,
                        applications: allApplicationsExpectedResponse.applications
                    }
                });

                serviceStub.restore();
                revert();
                done();
            });
        });

        it('should create a new draft application if all screeners are present and no applications found', (done) => {
            const revert = multipleApplicationsMiddleware.__set__({
                renderDashboard: function () {
                    req.session.form.applications = [
                        {
                            dateCreated: '9 November 2019',
                            caseType: 'PA',
                            ccdCase: {
                                id: '9999999999999999',
                                state: 'Pending'
                            }
                        }
                    ];
                    return Promise.resolve();
                },
                featureToggle: class {
                    static isEnabled() {
                        return true;
                    }
                }
            });

            const req = {
                session: {
                    form: {
                        applicantEmail: 'test@email.com',
                        caseType: 'gop',
                        payloadVersion: 'dummy',
                        userLoggedIn: true,
                        screeners: {
                            deathCertificate: 'optionYes',
                            deathCertificateInEnglish: 'optionNo',
                            deathCertificateTranslation: 'optionYes',
                            domicile: 'optionYes',
                            completed: 'optionYes',
                            left: 'optionYes',
                            original: 'optionYes',
                            executor: 'optionYes',
                            mentalCapacity: 'optionYes'
                        }
                    }
                }
            };
            const res = {redirect: () => {
                // Do nothing
            }};
            const next = sinon.spy();

            const serviceStub = sinon.stub(Service.prototype, 'fetchJson')
                .returns(Promise.resolve({applications: []}));

            multipleApplicationsMiddleware.initDashboard(req, res, next);

            setTimeout(() => {
                expect(serviceStub.callCount).to.equal(2);
                expect(req.session).to.deep.equal({
                    form: {
                        applicantEmail: 'test@email.com',
                        payloadVersion: 'dummy',
                        userLoggedIn: true,
                        applications: [
                            {
                                dateCreated: '9 November 2019',
                                caseType: 'PA',
                                ccdCase: {
                                    id: '9999999999999999',
                                    state: 'Pending'
                                }
                            }
                        ]
                    }
                });

                serviceStub.restore();
                revert();
                done();
            });
        });

        it('should create a new draft application if all screeners are present and no Draft applications of same case type found', (done) => {
            delete allApplicationsExpectedResponse.applications[4];

            const revert = multipleApplicationsMiddleware.__set__({
                renderDashboard: function () {
                    req.session.form.applications = allApplicationsExpectedResponse.applications;
                    return Promise.resolve();
                },
                featureToggle: class {
                    static isEnabled() {
                        return true;
                    }
                }
            });

            const req = {
                session: {
                    form: {
                        applicantEmail: 'test@email.com',
                        caseType: 'gop',
                        payloadVersion: 'dummy',
                        userLoggedIn: true,
                        screeners: {
                            deathCertificate: 'optionYes',
                            deathCertificateInEnglish: 'optionNo',
                            deathCertificateTranslation: 'optionYes',
                            domicile: 'optionYes',
                            completed: 'optionYes',
                            left: 'optionYes',
                            original: 'optionYes',
                            executor: 'optionYes',
                            mentalCapacity: 'optionYes'
                        }
                    }
                }
            };
            const res = {redirect: () => {
                // Do nothing
            }};
            const next = sinon.spy();

            const serviceStub = sinon.stub(Service.prototype, 'fetchJson')
                .returns(Promise.resolve(allApplicationsExpectedResponse));

            multipleApplicationsMiddleware.initDashboard(req, res, next);

            setTimeout(() => {
                expect(serviceStub.callCount).to.equal(2);
                expect(req.session).to.deep.equal({
                    form: {
                        applicantEmail: 'test@email.com',
                        payloadVersion: 'dummy',
                        userLoggedIn: true,
                        applications: allApplicationsExpectedResponse.applications
                    }
                });

                serviceStub.restore();
                revert();
                done();
            });
        });

        it('should create a new draft application if all screeners are present and a Draft applications found but of different caseType', (done) => {
            const revert = multipleApplicationsMiddleware.__set__({
                renderDashboard: function () {
                    req.session.form.applications = allApplicationsExpectedResponse.applications;
                    return Promise.resolve();
                },
                featureToggle: class {
                    static isEnabled() {
                        return true;
                    }
                }
            });

            const req = {
                session: {
                    form: {
                        applicantEmail: 'test@email.com',
                        caseType: 'intestacy',
                        payloadVersion: 'dummy',
                        userLoggedIn: true,
                        screeners: {
                            deathCertificate: 'optionYes',
                            deathCertificateInEnglish: 'optionNo',
                            deathCertificateTranslation: 'optionYes',
                            domicile: 'optionYes',
                            completed: 'optionYes',
                            left: 'optionYes',
                            original: 'optionYes',
                            executor: 'optionYes',
                            mentalCapacity: 'optionYes'
                        }
                    }
                }
            };
            const res = {redirect: () => {
                // Do nothing
            }};
            const next = sinon.spy();

            const serviceStub = sinon.stub(Service.prototype, 'fetchJson')
                .returns(Promise.resolve(allApplicationsExpectedResponse));

            multipleApplicationsMiddleware.initDashboard(req, res, next);

            setTimeout(() => {
                expect(serviceStub.callCount).to.equal(2);
                expect(req.session).to.deep.equal({
                    form: {
                        applicantEmail: 'test@email.com',
                        payloadVersion: 'dummy',
                        userLoggedIn: true,
                        applications: allApplicationsExpectedResponse.applications
                    }
                });

                serviceStub.restore();
                revert();
                done();
            });
        });

        it('should return an array of applications', (done) => {
            const revert = multipleApplicationsMiddleware.__set__('renderDashboard', () => {
                req.session.form.applications = allApplicationsExpectedResponse.applications;
                return Promise.resolve();
            });
            const req = {
                session: {
                    form: {
                        applicantEmail: 'test@email.com',
                        payloadVersion: 'dummy',
                        userLoggedIn: true,
                    }
                }
            };
            const res = {redirect: () => {
                // Do nothing
            }};
            const next = sinon.spy();

            const serviceStub = sinon.stub(Service.prototype, 'fetchJson')
                .returns(Promise.resolve(allApplicationsExpectedResponse));

            multipleApplicationsMiddleware.initDashboard(req, res, next);

            setTimeout(() => {
                expect(serviceStub.calledOnce).to.equal(true);
                expect(req.session).to.deep.equal({
                    form: {
                        applicantEmail: 'test@email.com',
                        payloadVersion: 'dummy',
                        userLoggedIn: true,
                        applications: allApplicationsExpectedResponse.applications
                    }
                });

                serviceStub.restore();
                revert();
                done();
            });
        });
    });

    describe('GetCaseMiddleware', () => {
        it('should NOT return a case when ccdCaseId is not present', (done) => {
            const req = {
                originalUrl: '/get-case',
                session: {
                    id: 'fb2e77d.47a0479900504cb3ab4a1f626d174d2d',
                    form: {
                        caseType: 'gop',
                        applicantEmail: 'test@email.com'
                    }
                }
            };
            const res = {redirect: () => {
                // Do nothing
            }};

            const redirectSpy = sinon.spy(res, 'redirect');

            multipleApplicationsMiddleware.getCase(req, res);

            setTimeout(() => {
                expect(redirectSpy.calledOnce).to.equal(true);
                expect(redirectSpy.calledWith('/dashboard')).to.equal(true);

                redirectSpy.restore();

                done();
            });
        });

        it('should NOT return a case when probateType is not present', (done) => {
            const req = {
                originalUrl: '/get-case/1234567890123456',
                session: {
                    id: 'fb2e77d.47a0479900504cb3ab4a1f626d174d2d',
                    form: {
                        applicantEmail: 'test@email.com'
                    }
                }
            };
            const res = {redirect: () => {
                // Do nothing
            }};

            const redirectSpy = sinon.spy(res, 'redirect');

            multipleApplicationsMiddleware.getCase(req, res);

            setTimeout(() => {
                expect(redirectSpy.calledOnce).to.equal(true);
                expect(redirectSpy.calledWith('/dashboard')).to.equal(true);

                redirectSpy.restore();

                done();
            });
        });

        it('should return a case in progress and redirect to task-list using probateType from the URL', (done) => {
            const req = {
                originalUrl: '/get-case/1234567890123456?probateType=PA',
                session: {
                    id: 'fb2e77d.47a0479900504cb3ab4a1f626d174d2d',
                    form: {
                        applicantEmail: 'test@email.com'
                    }
                }
            };
            const res = {redirect: () => {
                // Do nothing
            }};

            const multipleAppGetCaseStubResponse = {
                applicantEmail: 'test@email.com',
                ccdCase: {
                    id: 1234567890123456,
                    state: 'Pending'
                }
            };

            const redirectSpy = sinon.spy(res, 'redirect');
            const serviceStub = sinon.stub(Service.prototype, 'fetchJson')
                .returns(Promise.resolve(multipleAppGetCaseStubResponse));

            multipleApplicationsMiddleware.getCase(req, res);

            setTimeout(() => {
                expect(serviceStub.calledOnce).to.equal(true);
                expect(redirectSpy.calledOnce).to.equal(true);
                expect(redirectSpy.calledWith('/task-list')).to.equal(true);

                serviceStub.restore();
                redirectSpy.restore();

                done();
            });
        });

        it('should return a case in progress and redirect to task-list using probateType from the session', (done) => {
            const req = {
                originalUrl: '/get-case/1234567890123456',
                session: {
                    id: 'fb2e77d.47a0479900504cb3ab4a1f626d174d2d',
                    form: {
                        caseType: 'gop',
                        applicantEmail: 'test@email.com'
                    }
                }
            };
            const res = {redirect: () => {
                // Do nothing
            }};

            const multipleAppGetCaseStubResponse = {
                applicantEmail: 'test@email.com',
                ccdCase: {
                    id: 1234567890123456,
                    state: 'Pending'
                }
            };

            const redirectSpy = sinon.spy(res, 'redirect');
            const serviceStub = sinon.stub(Service.prototype, 'fetchJson')
                .returns(Promise.resolve(multipleAppGetCaseStubResponse));

            multipleApplicationsMiddleware.getCase(req, res);

            setTimeout(() => {
                expect(serviceStub.calledOnce).to.equal(true);
                expect(redirectSpy.calledOnce).to.equal(true);
                expect(redirectSpy.calledWith('/task-list')).to.equal(true);

                serviceStub.restore();
                redirectSpy.restore();

                done();
            });
        });

        it('should return a submitted case and redirect to task-list (which in turn would then redirect to documents or thank-you)', (done) => {
            const req = {
                originalUrl: '/get-case/9012345678901234?probateType=PA',
                session: {
                    id: 'fb2e77d.47a0479900504cb3ab4a1f626d174d2d',
                    form: {
                        applicantEmail: 'test@email.com'
                    }
                }
            };
            const res = {redirect: () => {
                // Do nothing
            }};

            const multipleAppGetCaseStubResponse = {
                applicantEmail: 'test@email.com',
                ccdCase: {
                    id: 9012345678901234,
                    state: 'CaseCreated'
                }
            };

            const redirectSpy = sinon.spy(res, 'redirect');
            const serviceStub = sinon.stub(Service.prototype, 'fetchJson')
                .returns(Promise.resolve(multipleAppGetCaseStubResponse));

            multipleApplicationsMiddleware.getCase(req, res);

            setTimeout(() => {
                expect(serviceStub.calledOnce).to.equal(true);
                expect(redirectSpy.calledOnce).to.equal(true);
                expect(redirectSpy.calledWith('/task-list')).to.equal(true);

                serviceStub.restore();
                redirectSpy.restore();

                done();
            });
        });

        it('should return an error if the case is unable to be retrieved', (done) => {
            const req = {
                originalUrl: '/get-case/3456789012345678?probateType=PA',
                session: {
                    id: 'fb2e77d.47a0479900504cb3ab4a1f626d174d2d',
                    form: {
                        applicantEmail: 'test@email.com'
                    }
                }
            };
            const res = {redirect: () => {
                // Do nothing
            }};

            const redirectSpy = sinon.spy(res, 'redirect');
            const serviceStub = sinon.stub(Service.prototype, 'fetchJson')
                .returns(Promise.reject(new Error('Unable to retrieve case')));

            multipleApplicationsMiddleware.getCase(req, res);

            setTimeout(() => {
                expect(serviceStub.calledOnce).to.equal(true);
                expect(redirectSpy.calledOnce).to.equal(true);
                expect(redirectSpy.calledWith('/errors/404')).to.equal(true);

                serviceStub.restore();
                redirectSpy.restore();

                done();
            });
        });

        it('should set the executor declaration flags in the session.form', (done) => {
            const req = {
                originalUrl: '/task-list',
                session: {
                    form: {
                        caseType: 'gop',
                        ccdCase: {
                            id: 1234567890123456
                        },
                        declaration: {
                            declarationCheckbox: 'true',
                        },
                        executors: {
                            list: [
                                {
                                    fullName: 'Bob Jones',
                                    isApplicant: false,
                                    isApplying: true
                                },
                                {
                                    fullName: 'Tom Smith',
                                    isApplicant: false,
                                    isApplying: true
                                },
                                {
                                    fullName: 'James Taylor',
                                    isApplicant: false,
                                    isApplying: true
                                },
                                {
                                    fullName: 'Died Before',
                                    isApplying: false,
                                    isDead: true,
                                    diedBefore: 'optionYes',
                                    notApplyingKey: 'optionDiedBefore'
                                },
                                {
                                    fullName: 'Power Reserved',
                                    isApplying: false,
                                    isDead: false,
                                    notApplyingKey: 'optionPowerReserved',
                                    executorNotified: 'optionYes'
                                }
                            ]
                        }
                    }
                }
            };
            const res = {};

            const multipleAppGetCaseStubResponse = {
                caseType: 'gop',
                ccdCase: {
                    id: 1234567890123456
                },
                declaration: {
                    declarationCheckbox: 'true',
                },
                executors: {
                    list: [
                        {
                            fullName: 'Bob Jones',
                            isApplicant: false,
                            isApplying: true,
                            executorAgreed: 'optionYes'
                        },
                        {
                            fullName: 'Tom Smith',
                            isApplicant: false,
                            isApplying: true,
                            executorAgreed: 'optionNo'
                        },
                        {
                            fullName: 'James Taylor',
                            isApplicant: false,
                            isApplying: true
                        },
                        {
                            fullName: 'Died Before',
                            isApplying: false,
                            isDead: true,
                            diedBefore: 'optionYes',
                            notApplyingKey: 'optionDiedBefore'
                        },
                        {
                            fullName: 'Power Reserved',
                            isApplying: false,
                            isDead: false,
                            notApplyingKey: 'optionPowerReserved',
                            executorNotified: 'optionYes'
                        }
                    ]
                }
            };

            const next = sinon.spy();
            const serviceStub = sinon.stub(Service.prototype, 'fetchJson')
                .returns(Promise.resolve(multipleAppGetCaseStubResponse));

            multipleApplicationsMiddleware.getCase(req, res, next, true);

            setTimeout(() => {
                expect(serviceStub.calledOnce).to.equal(true);
                expect(next.calledOnce).to.equal(true);
                expect(req.session.form).to.deep.equal({
                    caseType: 'gop',
                    ccdCase: {
                        id: 1234567890123456
                    },
                    declaration: {
                        declarationCheckbox: 'true',
                    },
                    executors: {
                        list: [
                            {
                                fullName: 'Bob Jones',
                                isApplicant: false,
                                isApplying: true,
                                executorAgreed: 'optionYes'
                            },
                            {
                                fullName: 'Tom Smith',
                                isApplicant: false,
                                isApplying: true,
                                executorAgreed: 'optionNo'
                            },
                            {
                                fullName: 'James Taylor',
                                isApplicant: false,
                                isApplying: true
                            },
                            {
                                fullName: 'Died Before',
                                isApplying: false,
                                isDead: true,
                                diedBefore: 'optionYes',
                                notApplyingKey: 'optionDiedBefore'
                            },
                            {
                                fullName: 'Power Reserved',
                                isApplying: false,
                                isDead: false,
                                notApplyingKey: 'optionPowerReserved',
                                executorNotified: 'optionYes'
                            }
                        ]
                    },
                    executorsDeclarations: [
                        {
                            executorName: 'Bob Jones',
                            agreed: 'agreed'
                        },
                        {
                            executorName: 'Tom Smith',
                            agreed: 'disagreed'
                        },
                        {
                            executorName: 'James Taylor',
                            agreed: 'notDeclared'
                        }
                    ]
                });
                serviceStub.restore();
                done();
            });
        });
    });
});
