'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const rewire = require('rewire');
const SessionData = rewire('app/utils/SessionData');
const services = require('app/components/services');

describe('SessionData.js', () => {
    describe('getFormdata()', () => {
        it('should call next when the session data exists', (done) => {
            const req = {
                session: {
                    form: {
                        payloadVersion: '4.1.0'
                    }
                }
            };
            const next = sinon.spy();
            const sessionData = new SessionData();
            sessionData.getFormdata(req, next);
            expect(next.calledOnce).to.equal(true);
            done();
        });

        it('should call the callback with the correct params when the session data does not exist', (done) => {
            const req = {
                session: {},
                log: {
                    info: sinon.spy()
                }
            };
            const next = sinon.spy();
            const loadFormDataStub = sinon
                .stub(services, 'loadFormData')
                .returns(Promise.resolve({payloadVersion: '4.1.0'}));
            const sessionData = new SessionData();
            sessionData.getFormdata(req, next, (cbReq, result) => {
                expect(cbReq.session).to.deep.equal({back: []});
                expect(result).to.deep.equal({payloadVersion: '4.1.0'});
            });
            expect(req.log.info.calledOnce).to.equal(true);
            expect(req.log.info.calledWith('Failed to load session data')).to.equal(true);
            loadFormDataStub.restore();
            done();
        });
    });

    describe('setFormdata()', () => {
        it('should create new session data when no user data is found', (done) => {
            const req = {
                session: {
                    regId: '123456'
                },
                log: {
                    info: sinon.spy()
                }
            };
            const result = {
                name: 'Error'
            };
            SessionData.__set__('config', {
                payloadVersion: '4.1.0'
            });
            const sessionData = new SessionData();
            sessionData.setFormdata(req, result);
            expect(req.log.info.calledThrice).to.equal(true);
            expect(req.log.info.calledWith('Checking for existing user data')).to.equal(true);
            expect(req.log.info.calledWith('User data not found - creating new session data')).to.equal(true);
            expect(req.log.info.calledWith({tags: 'Analytics'}, 'Application Started')).to.equal(true);
            expect(req.session.form).to.deep.equal({
                payloadVersion: '4.1.0',
                applicantEmail: '123456'
            });
            done();
        });

        it('should create session data from the user data when the user data is found', (done) => {
            const req = {
                session: {},
                log: {
                    info: sinon.spy()
                }
            };
            const result = {
                formdata: {
                    payloadVersion: '4.1.0'
                }
            };
            const sessionData = new SessionData();
            sessionData.setFormdata(req, result);
            expect(req.log.info.calledTwice).to.equal(true);
            expect(req.log.info.calledWith('Checking for existing user data')).to.equal(true);
            expect(req.log.info.calledWith('User data found - creating new session from user data')).to.equal(true);
            expect(req.session.form).to.deep.equal({payloadVersion: '4.1.0'});
            done();
        });
    });

    describe('setDefaultSessionData()', () => {
        it('should set the correct default session data', (done) => {
            const req = {
                session: {
                    regId: '123456'
                }
            };
            SessionData.__set__('config', {
                payloadVersion: '4.1.0'
            });
            SessionData.setDefaultSessionData(req);
            expect(req).to.deep.equal({
                session: {
                    regId: '123456',
                    form: {
                        payloadVersion: '4.1.0',
                        applicantEmail: '123456'
                    }
                }
            });
            done();
        });
    });
});
