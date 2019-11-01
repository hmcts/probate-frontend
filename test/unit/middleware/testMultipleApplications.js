// eslint-disable-line max-lines

'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const rewire = require('rewire');
const multipleApplicationsMiddleware = rewire('app/middleware/multipleApplications');
const Service = require('app/services/Service');

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
    describe('initDashboardMiddleware', () => {
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

        it('should not create a new application if screeners are found but not WillLeft - should just render the existing applications instead', (done) => {
            const revert = multipleApplicationsMiddleware.__set__('renderDashboard', () => {
                req.session.form.applications = allApplicationsExpectedResponse.applications;
                return Promise.resolve();
            });
            const req = {
                session: {
                    form: {
                        applicantEmail: 'test@email.com',
                        screeners: {
                            deathCertificate: 'Yes'
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
                        applications: allApplicationsExpectedResponse.applications
                    }
                });

                serviceStub.restore();
                revert();
                done();
            });
        });

        it('should not create a new application if screeners are found including WillLeft and a Draft application of the same caseType is already present - should just render the existing applications instead', (done) => {
            const revert = multipleApplicationsMiddleware.__set__('renderDashboard', () => {
                req.session.form.applications = allApplicationsExpectedResponse.applications;
                return Promise.resolve();
            });
            const req = {
                session: {
                    form: {
                        applicantEmail: 'test@email.com',
                        caseType: 'gop',
                        screeners: {
                            deathCertificate: 'Yes',
                            domicile: 'Yes',
                            completed: 'Yes',
                            left: 'Yes',
                            original: 'Yes',
                            executor: 'Yes',
                            mentalCapacity: 'Yes'
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
                        applications: allApplicationsExpectedResponse.applications
                    }
                });

                serviceStub.restore();
                revert();
                done();
            });
        });

        it('should not create a new application if screeners are found including WillLeft and a Draft application of the same caseType is already present but not all screeners are present - should just render the existing applications instead', (done) => {
            const revert = multipleApplicationsMiddleware.__set__('renderDashboard', () => {
                req.session.form.applications = allApplicationsExpectedResponse.applications;
                return Promise.resolve();
            });
            const req = {
                session: {
                    form: {
                        applicantEmail: 'test@email.com',
                        caseType: 'gop',
                        screeners: {
                            deathCertificate: 'Yes',
                            domicile: 'Yes',
                            completed: 'Yes',
                            left: 'Yes'
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
                        applications: allApplicationsExpectedResponse.applications
                    }
                });

                serviceStub.restore();
                revert();
                done();
            });
        });

        it('should create a new draft application if all screeners are present and no Draft applications of same case type found', (done) => {
            delete allApplicationsExpectedResponse.applications[4];
            const revert = multipleApplicationsMiddleware.__set__('renderDashboard', () => {
                req.session.form.applications = allApplicationsExpectedResponse.applications;
                return Promise.resolve();
            });
            const req = {
                session: {
                    form: {
                        applicantEmail: 'test@email.com',
                        caseType: 'gop',
                        screeners: {
                            deathCertificate: 'Yes',
                            domicile: 'Yes',
                            completed: 'Yes',
                            left: 'Yes',
                            original: 'Yes',
                            executor: 'Yes',
                            mentalCapacity: 'Yes'
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
                        applications: allApplicationsExpectedResponse.applications
                    }
                });

                serviceStub.restore();
                revert();
                done();
            });
        });

        it('should create a new draft application if all screeners are present and a Draft applications found but of different caseType', (done) => {
            const revert = multipleApplicationsMiddleware.__set__('renderDashboard', () => {
                req.session.form.applications = allApplicationsExpectedResponse.applications;
                return Promise.resolve();
            });
            const req = {
                session: {
                    form: {
                        applicantEmail: 'test@email.com',
                        caseType: 'intestacy',
                        screeners: {
                            deathCertificate: 'Yes',
                            domicile: 'Yes',
                            completed: 'Yes',
                            left: 'No',
                            diedAfter: 'Yes',
                            related: 'Yes',
                            otherApplicants: 'No'
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
                        applicantEmail: 'test@email.com'
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

        it('should return a submitted case and redirect to thank-you', (done) => {
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
                expect(redirectSpy.calledWith('/thank-you')).to.equal(true);

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
    });
});
