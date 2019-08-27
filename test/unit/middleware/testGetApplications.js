'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const rewire = require('rewire');
const getApplications = rewire('app/middleware/getApplications');
const content = require('app/resources/en/translation/dashboard');

const expectedResponse = [{
    ccdCaseId: '1234-5678-9012-3456',
    deceasedFullName: 'Bob Jones',
    dateCreated: '7 October 2018',
    status: content.statusInProgress
}, {
    ccdCaseId: '9012-3456-1234-5678',
    deceasedFullName: 'Tom Smith',
    dateCreated: '24 February 2019',
    status: content.statusSubmitted
}];

describe('GetApplicationsMiddleware', () => {
    it('should return an array of applications', (done) => {
        const revert = getApplications.__set__('MultipleApplications', class {
            getApplications() {
                return Promise.resolve({applications: expectedResponse});
            }
        });

        const req = {
            session: {
                form: {
                    applicantEmail: 'test@email.com'
                }
            }
        };

        const res = {};

        const next = sinon.spy();

        getApplications(req, res, next);

        setTimeout(() => {
            expect(next.calledOnce).to.equal(true);
            expect(req.session).to.deep.equal({
                form: {
                    applicantEmail: 'test@email.com',
                    applications: expectedResponse
                }
            });

            revert();
            done();
        });
    });
});
