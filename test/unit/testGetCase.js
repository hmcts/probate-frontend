'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const rewire = require('rewire');
const getCase = rewire('app/middleware/getCase');
const content = require('app/resources/en/translation/dashboard');

describe.skip('GetCaseMiddleware', () => {
    it('should return a case in progress and redirect to task-list', (done) => {
        const req = {
            originalUrl: '/get-case/1234-5678-9012-3456',
            session: {
                form: {
                    applicantEmail: 'test@email.com'
                }
            }
        };
        const res = {
            redirect: sinon.spy()
        };

        getCase(req, res);

        expect(req.session).to.deep.equal({
            status: content.statusInProgress,
            form: {
                applicantEmail: 'test@email.com',
                executors: {}
            }
        });
        expect(res.redirect.calledOnce).to.equal(true);
        expect(res.redirect.calledWith('/task-list')).to.equal(true);

        done();
    });

    it('should return a submitted case in progress and redirect to thank-you', (done) => {
        const req = {
            originalUrl: '/get-case/9012-3456-7890-1234',
            session: {
                form: {
                    applicantEmail: 'test@email.com'
                }
            }
        };
        const res = {};

        getCase(req, res);

        expect(req.session).to.deep.equal({
            status: content.statusSubmitted,
            form: {
                applicantEmail: 'test@email.com',
                executors: {}
            }
        });
        expect(res.redirect.calledOnce).to.equal(true);
        expect(res.redirect.calledWith('/thank-you')).to.equal(true);

        done();
    });
});
