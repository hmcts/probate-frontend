'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const rewire = require('rewire');
const getCase = rewire('app/middleware/getCase');
const content = require('app/resources/en/translation/dashboard');
const MultipleApplications = require('app/services/MultipleApplications');

describe('GetCaseMiddleware', () => {
    it('should return a case in progress and redirect to task-list', (done) => {
        const req = {
            originalUrl: '/get-case/1234-5678-9012-3456',
            session: {
                id: 'fb2e77d.47a0479900504cb3ab4a1f626d174d2d',
                form: {
                    applicantEmail: 'test@email.com'
                }
            }
        };

        const multipleAppGetCaseStubResponse = {
            form: {'applicantEmail': 'test@email.com'},
            status: content.statusInProgress
        };

        const res = {redirect: () => {
            // Do nothing
        }};
        const redirectSpy = sinon.spy(res, 'redirect');

        const multipleAppGetCaseStub = sinon.stub(MultipleApplications.prototype, 'getCase')
            .returns(Promise.resolve(multipleAppGetCaseStubResponse));

        getCase(req, res);

        setTimeout(() => {
            expect(multipleAppGetCaseStub.calledOnce).to.equal(true);
            expect(redirectSpy.calledOnce).to.equal(true);
            expect(redirectSpy.calledWith('/task-list')).to.equal(true);

            multipleAppGetCaseStub.restore();
            redirectSpy.restore();

            done();
        });
    });

    it('should return a submitted case in progress and redirect to thank-you', (done) => {
        const req = {
            originalUrl: '/get-case/9012-3456-7890-1234',
            session: {
                id: 'fb2e77d.47a0479900504cb3ab4a1f626d174d2d',
                form: {
                    applicantEmail: 'test@email.com'
                }
            }
        };

        const multipleAppGetCaseStubResponse = {
            form: {'applicantEmail': 'test@email.com'},
            status: content.statusSubmitted
        };

        const res = {redirect: () => {
            // Do nothing
        }};
        const redirectSpy = sinon.spy(res, 'redirect');

        const multipleAppGetCaseStub = sinon.stub(MultipleApplications.prototype, 'getCase')
            .returns(Promise.resolve(multipleAppGetCaseStubResponse));

        getCase(req, res);

        setTimeout(() => {
            expect(multipleAppGetCaseStub.calledOnce).to.equal(true);
            expect(redirectSpy.calledOnce).to.equal(true);
            expect(redirectSpy.calledWith('/thank-you')).to.equal(true);

            multipleAppGetCaseStub.restore();
            redirectSpy.restore();

            done();
        });
    });
});
