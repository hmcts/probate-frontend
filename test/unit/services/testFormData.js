'use strict';

const expect = require('chai').expect;
const FormData = require('app/services/FormData');
const co = require('co');
const caseTypes = require('app/utils/CaseTypes');
const config = require('config');
const nock = require('nock');

describe('FormDataService', () => {
    afterEach(() => {
        nock.cleanAll();
    });

    it('should call get() successfully', (done) => {
        const endpoint = 'http://localhost';
        const ccdCaseId = 1234567890123456;
        const probateType = 'PA';
        const expectedForm = {caseType: caseTypes.GOP, ccdCase: {state: 'Pending', id: 1234567890123456}, deceased: {name: 'test'}};
        const authToken = 'authToken';
        const serviceAuthorisation = 'serviceAuthorisation';
        const formData = new FormData(endpoint, 'abc123');
        const path = formData.replacePlaceholderInPath(config.services.orchestrator.paths.forms, 'ccdCaseId', ccdCaseId);
        nock(endpoint, {
            reqheaders: {
                'Content-Type': 'application/json',
                Authorization: authToken,
                ServiceAuthorization: serviceAuthorisation
            }
        }).get(path + '?probateType=PA')
            .reply(200, expectedForm);

        co(function* () {
            const actualForm = yield formData.get(authToken, serviceAuthorisation, ccdCaseId, probateType);
            expect(actualForm).to.deep.equal(expectedForm);
            done();
        }).catch(err => {
            done(err);
        });
    });

    it('should call post() successfully', (done) => {
        const endpoint = 'http://localhost';
        const ccdCaseId = 1234567890123456;
        const lastModifiedDateTime = '2018-01-01T12:12:12.123';
        const inputForm = {caseType: caseTypes.GOP, deceased: {name: 'test'}};
        const expectedForm = {type: caseTypes.GOP, caseType: caseTypes.GOP, deceased: {name: 'test'}};
        const authToken = 'authToken';
        const serviceAuthorisation = 'serviceAuthorisation';
        const formData = new FormData(endpoint, 'abc123');
        let path = formData.replacePlaceholderInPath(config.services.orchestrator.paths.save_forms, 'ccdCaseId', ccdCaseId);
        path = formData.replacePlaceholderInPath(path, 'lastModifiedDateTime', lastModifiedDateTime);
        nock(endpoint, {
            reqheaders: {
                'Content-Type': 'application/json',
                Authorization: authToken,
                ServiceAuthorization: serviceAuthorisation
            }
        }).post(path, expectedForm)
            .reply(200, expectedForm);

        co(function* () {
            const actualForm = yield formData.post(authToken, serviceAuthorisation, ccdCaseId, lastModifiedDateTime, inputForm);
            expect(actualForm).to.deep.equal(expectedForm);
            done();
        }).catch(err => {
            done(err);
        });
    });

    it('should return 409 Conflict', (done) => {
        const endpoint = 'http://localhost';
        const ccdCaseId = 1234567890123456;
        const lastModifiedDateTime = '2018-01-01T12:12:12.123';
        const inputForm = {caseType: caseTypes.GOP, deceased: {name: 'test'}};
        const expectedForm = {type: caseTypes.GOP, caseType: caseTypes.GOP, deceased: {name: 'test'}};
        const authToken = 'authToken';
        const serviceAuthorisation = 'serviceAuthorisation';
        const formData = new FormData(endpoint, 'abc123');
        let path = formData.replacePlaceholderInPath(config.services.orchestrator.paths.save_forms, 'ccdCaseId', ccdCaseId);
        path = formData.replacePlaceholderInPath(path, 'lastModifiedDateTime', lastModifiedDateTime);
        nock(endpoint, {
            reqheaders: {
                'Content-Type': 'application/json',
                Authorization: authToken,
                ServiceAuthorization: serviceAuthorisation
            }
        }).post(path, expectedForm)
            .reply(409, expectedForm);

        co(function* () {
            const result = yield formData.post(authToken, serviceAuthorisation, ccdCaseId, lastModifiedDateTime, inputForm);
            expect(result.name).to.deep.equal('Error');
            expect(result.message).to.deep.equal('Conflict');
            done();
        }).catch(err => {
            done(err);
        });
    });
});
