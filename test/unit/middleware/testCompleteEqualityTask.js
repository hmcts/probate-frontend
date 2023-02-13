'use strict';

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

const modulePath = 'app/middleware/completeEqualityTask';
const proxyquire = require('proxyquire');
const FormData = require('app/services/FormData');
const completeEqualityTask = require('../../../app/middleware/completeEqualityTask');

let equalityStub;
const startStub = () => {
    equalityStub = require('test/service-stubs/equalityAndDiversityHealth');
};
const stopStub = () => {
    equalityStub.close();
    delete require.cache[require.resolve('test/service-stubs/equalityAndDiversityHealth')];
};
describe('completeEqualityTask', () => {
    describe('PCQ feature toggle is ON and health is UP', () => {
        before(() => startStub());

        it('should redirect to PCQ', (done) => {
            const formDataStub = sinon.stub(FormData.prototype, 'post');
            const fetchJsonStub = sinon.stub().returns(Promise.resolve({status: 'UP', 'pcq-backend': {status: 'UP'}}));
            const completeEqualityTaskStubbed = proxyquire(modulePath, {'app/components/api-utils': {fetchJson: fetchJsonStub}});

            const params = {
                isEnabled: true,
                req: {
                    session: {
                        caseType: 'gop',
                        form: {
                            applicantEmail: 'test@email.com',
                            ccdCase: {
                                id: 1234567890123456
                            }
                        }
                    }
                },
                res: {
                    locals: {launchDarkly: {}},
                    redirect: () => {
                        // Do nothing
                    }
                },
                next: sinon.spy()
            };

            completeEqualityTaskStubbed(params);

            setTimeout(() => {
                expect(params.req.session.form.equality.pcqId).to.not.equal('Service down');
                expect(params.next.calledOnce).to.equal(true);

                done();
                formDataStub.restore();
            }, 500);
        });

        after(() => stopStub());
    });

    describe('PCQ feature toggle is ON and health is DOWN', () => {
        it('[PROBATE] should redirect to Task List', (done) => {
            const formDataStub = sinon.stub(FormData.prototype, 'post');
            const fetchJsonStub = sinon.stub().returns(Promise.resolve({status: 'DOWN', 'pcq-backend': {status: 'DOWN'}}));
            const completeEqualityTaskStubbed = proxyquire(modulePath, {'app/components/api-utils': {fetchJson: fetchJsonStub}});

            const params = {
                isEnabled: true,
                req: {
                    session: {
                        caseType: 'gop',
                        form: {
                            applicantEmail: 'test@email.com',
                            ccdCase: {
                                id: 1234567890123456
                            }
                        }
                    }
                },
                res: {
                    redirect: sinon.stub()
                },
                next: sinon.spy()
            };

            completeEqualityTaskStubbed(params);

            setTimeout(() => {
                sinon.assert.calledOnce(params.res.redirect);
                expect(params.res.redirect.calledOnce).to.equal(true);
                expect(params.res.redirect).to.have.been.calledWith('/task-list');

                done();
                formDataStub.restore();
            }, 2500);
        });

        it('[INTESTACY] should redirect to Summary', (done) => {
            const formDataStub = sinon.stub(FormData.prototype, 'post');
            const fetchJsonStub = sinon.stub().returns(Promise.resolve({status: 'DOWN', 'pcq-backend': {status: 'DOWN'}}));
            const completeEqualityTaskStubbed = proxyquire(modulePath, {'app/components/api-utils': {fetchJson: fetchJsonStub}});
            const params = {
                isEnabled: true,
                req: {
                    session: {
                        caseType: 'intestacy',
                        form: {
                            applicantEmail: 'test@email.com',
                            ccdCase: {
                                id: 1234567890123456
                            }
                        }
                    }
                },
                res: {
                    redirect: sinon.stub()
                },
                next: sinon.spy()
            };

            completeEqualityTaskStubbed(params);

            setTimeout(() => {
                sinon.assert.calledOnce(params.res.redirect);
                expect(params.res.redirect.calledOnce).to.equal(true);
                expect(params.res.redirect).to.have.been.calledWith('/summary');

                done();
                formDataStub.restore();
            }, 2500);
        });
    });

    describe('PCQ feature toggle is OFF', () => {
        it('[PROBATE] should redirect to Task List', (done) => {
            const formDataStub = sinon.stub(FormData.prototype, 'post');
            const params = {
                isEnabled: false,
                req: {
                    session: {
                        caseType: 'gop',
                        form: {
                            applicantEmail: 'test@email.com',
                            ccdCase: {
                                id: 1234567890123456
                            }
                        }
                    }
                },
                res: {
                    redirect: sinon.stub()
                },
                next: sinon.spy()
            };

            completeEqualityTask(params);

            setTimeout(() => {
                sinon.assert.calledOnce(params.res.redirect);
                expect(params.res.redirect.calledOnce).to.equal(true);
                expect(params.res.redirect).to.have.been.calledWith('/task-list');

                done();
                formDataStub.restore();
            }, 500);
        });

        it('[INTESTACY] should redirect to Summary', (done) => {
            const formDataStub = sinon.stub(FormData.prototype, 'post');
            const params = {
                isEnabled: false,
                req: {
                    session: {
                        caseType: 'intestacy',
                        form: {
                            applicantEmail: 'test@email.com',
                            ccdCase: {
                                id: 1234567890123456
                            }
                        }
                    }
                },
                res: {
                    redirect: sinon.stub()
                },
                next: sinon.spy()
            };

            completeEqualityTask(params);

            setTimeout(() => {
                sinon.assert.calledOnce(params.res.redirect);
                expect(params.res.redirect.calledOnce).to.equal(true);
                expect(params.res.redirect).to.have.been.calledWith('/summary');

                done();
                formDataStub.restore();
            }, 500);
        });
    });
});
