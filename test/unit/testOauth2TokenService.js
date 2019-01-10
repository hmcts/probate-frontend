'use strict';

const {expect} = require('chai');
const sinon = require('sinon');
const Oauth2Token = require('app/services/Oauth2Token');
const config = require('app/config');

describe('Oauth2TokenService', () => {
    describe('post()', () => {
        it('should call log() and fetchJson()', (done) => {
            const endpoint = 'http://localhost';
            const fetchOptions = {method: 'POST'};
            const oauth2Token = new Oauth2Token(endpoint, 'abc123');
            const logSpy = sinon.spy(oauth2Token, 'log');
            const fetchJsonSpy = sinon.spy(oauth2Token, 'fetchJson');
            const fetchOptionsStub = sinon.stub(oauth2Token, 'fetchOptions').returns(fetchOptions);

            oauth2Token.post('authcode', `${endpoint}/oauth`);

            expect(oauth2Token.log.calledOnce).to.equal(true);
            expect(oauth2Token.log.calledWith('Post oauth2 token')).to.equal(true);
            expect(oauth2Token.fetchJson.calledOnce).to.equal(true);
            expect(oauth2Token.fetchJson.calledWith(endpoint + config.services.idam.probate_oauth_token_path, fetchOptions)).to.equal(true);

            logSpy.restore();
            fetchJsonSpy.restore();
            fetchOptionsStub.restore();
            done();
        });
    });
});
