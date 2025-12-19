'use strict';

const expect = require('chai').expect;
const Fees = require('app/services/FeesData.cjs');
const co = require('co');
const caseTypes = require('app/utils/CaseTypes.cjs');
const config = require('config');
const nock = require('nock');

describe('FeesData', () => {
    describe('should call', () => {
        afterEach(() => {
            nock.cleanAll();
        });

        it('updateFees successfully', (done) => {
            const endpoint = 'http://localhost';
            const ccdCaseId = 1234567890123456;
            const result = {id: 'fees123'};
            const data = {ccdCaseId: ccdCaseId};
            const authToken = 'authToken';
            const serviceAuthorisation = 'serviceAuthorisation';
            const fees = new Fees(endpoint, 'abc123');
            const path = fees.replacePlaceholderInPath(config.services.orchestrator.paths.fees, 'ccdCaseId', ccdCaseId);
            nock(endpoint, {
                reqheaders: {
                    'Content-Type': 'application/json',
                    Authorization: authToken,
                    ServiceAuthorization: serviceAuthorisation
                }
            }
            ).post(path + '?probateType=PA')
                .reply(200, result);

            co(function* () {
                const actualForm = yield fees.updateFees(data, authToken, serviceAuthorisation, caseTypes.GOP);
                expect(actualForm).to.deep.equal(result);
                done();
            }).catch(err => {
                done(err);
            });
        });
    });
});
