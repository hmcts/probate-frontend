'use strict';

const chai = require('chai');
const sinonChai = require('sinon-chai');
const expect = chai.expect;
const sinon = require('sinon');
const rewire = require('rewire');
const InviteLink = rewire('app/invite');

chai.use(sinonChai);

describe('Executors invite endpoints', () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {
            session: {
                language: 'en',
                ccdCase: {
                    id: 1234567890123456,
                    state: 'Pending'
                },
                form: {
                    caseType: 'gop'
                }
            },
            params: {
                inviteId: 123
            }
        };
        res = {
            redirect: sinon.spy(),
            status: sinon.spy(),
            render: sinon.spy()
        };
        next = sinon.spy();
    });

    it('when there is a valid link and has not been recently used', (done) => {
        const restore = InviteLink.__set__({
            FormatUrl: {
                createHostname() {
                    return 'hostname';
                }
            },
            Authorise: class {
                post() {
                    return Promise.resolve('serviceAuthorisation');
                }
            },
            Security: class {
                getUserToken() {
                    return Promise.resolve('authToken');
                }
            },
            InviteLinkService: class {
                get() {
                    return Promise.resolve({valid: true});
                }
            },
            PinNumber: class {
                get() {
                    return Promise.resolve('1234');
                }
            }
        });

        const redisStub = {
            get: sinon.stub().resolves(null),
            set: sinon.stub(),
            expire: sinon.stub(),
        };

        const inviteLink = new InviteLink(redisStub, 30);

        inviteLink.verify()(req, res, next);

        checkAsync(() => {
            sinon.assert.calledOnce(res.redirect);
            expect(res.redirect).to.have.been.calledWith('/sign-in');
            restore();
            done();
        });
    });

    it('when there is a valid link and has been recently used', (done) => {
        const restore = InviteLink.__set__({
            FormatUrl: {
                createHostname() {
                    return 'hostname';
                }
            },
            Authorise: class {
                post() {
                    return Promise.resolve('serviceAuthorisation');
                }
            },
            Security: class {
                getUserToken() {
                    return Promise.resolve('authToken');
                }
            },
            InviteLinkService: class {
                get() {
                    return Promise.resolve({valid: true});
                }
            },
            PinNumber: class {
                get() {
                    return Promise.resolve('1234');
                }
            }
        });

        const redisStub = {
            get: sinon.stub().resolves(1234),
            ttl: sinon.stub().resolves(12),
        };

        const inviteLink = new InviteLink(redisStub, 30);

        inviteLink.verify()(req, res, next);

        checkAsync(() => {
            sinon.assert.calledOnce(res.redirect);
            expect(res.redirect).to.have.been.calledWith('/sign-in');
            restore();
            done();
        });
    });

    it('when there is a valid link but no redis client', (done) => {
        const restore = InviteLink.__set__({
            FormatUrl: {
                createHostname() {
                    return 'hostname';
                }
            },
            Authorise: class {
                post() {
                    return Promise.resolve('serviceAuthorisation');
                }
            },
            Security: class {
                getUserToken() {
                    return Promise.resolve('authToken');
                }
            },
            InviteLinkService: class {
                get() {
                    return Promise.resolve({valid: true});
                }
            },
            PinNumber: class {
                get() {
                    return Promise.resolve('1234');
                }
            }
        });

        const inviteLink = new InviteLink(null, 30);

        inviteLink.verify()(req, res, next);

        checkAsync(() => {
            sinon.assert.calledOnce(res.redirect);
            expect(res.redirect).to.have.been.calledWith('/sign-in');
            restore();
            done();
        });
    });

    it('when there is an invalid link', (done) => {
        const restore = InviteLink.__set__({
            Authorise: class {
                post() {
                    return Promise.resolve('serviceAuthorisation');
                }
            },
            Security: class {
                getUserToken() {
                    return Promise.resolve('authToken');
                }
            },
            InviteLinkService: class {
                get() {
                    return Promise.reject(new Error('Invalid link'));
                }
            }
        });
        const inviteLink = new InviteLink();

        inviteLink.verify()(req, res, next);

        checkAsync(() => {
            sinon.assert.calledOnce(res.redirect);
            expect(res.redirect).to.have.been.calledWith('/errors/404');
            restore();
            done();
        });
    });

    it('when the co-applicant accesses the link directly it should be redirected to not found page', (done) => {
        const inviteLink = new InviteLink();

        inviteLink.checkCoApplicant('true')(req, res, next);

        checkAsync(() => {
            expect(res.render).to.have.been.calledWith('errors/error');
            done();
        });
    });

    it('when the co-applicant accesses the link through the invite link it should be redirected the sign in page', (done) => {
        req.session.inviteId = 'validId';

        const restore = InviteLink.__set__({
            Authorise: class {
                post() {
                    return Promise.resolve('serviceAuthorisation');
                }
            },
            Security: class {
                getUserToken() {
                    return Promise.resolve('authToken');
                }
            },
            AllExecutorsAgreed: class {
                get() {
                    return Promise.resolve('false');
                }
            }
        });
        const inviteLink = new InviteLink();

        inviteLink.checkCoApplicant('true')(req, res, next);

        checkAsync(() => {
            sinon.assert.calledOnce(next);
            restore();
            done();
        });
    });

    const checkAsync = (callback) => {
        setTimeout(() => {
            callback();
        }, 3000);
    };
});
