'use strict';

const {expect} = require('chai');
const sinon = require('sinon');
const rewire = require('rewire');
const IntestacyFormData = rewire('app/services/IntestacyFormData');
const FormData = require('app/services/FormData');
const config = require('app/config');

describe('IntestacyFormDataService', () => {
    describe('get()', () => {
        it('should call super.get()', (done) => {
            const endpoint = 'http://localhost';
            const userId = 'fred@example.com';
            const intestacyFormData = new IntestacyFormData(endpoint, 'abc123');
            const path = intestacyFormData.replaceEmailInPath(config.services.orchestrator.paths.forms, userId);
            const getStub = sinon.stub(FormData.prototype, 'get');

            intestacyFormData.get(userId);

            expect(getStub.calledOnce).to.equal(true);
            expect(getStub.calledWith(
                'Get intestacy form data',
                endpoint + path
            )).to.equal(true);

            getStub.restore();
            done();
        });
    });

    describe('post()', () => {
        it('should call super.post()', (done) => {
            const endpoint = 'http://localhost';
            const userId = 'fred@example.com';
            const data = {dataObject: true};
            const intestacyFormData = new IntestacyFormData(endpoint, 'abc123');
            const path = intestacyFormData.replaceEmailInPath(config.services.orchestrator.paths.forms, userId);
            const postStub = sinon.stub(FormData.prototype, 'post');

            intestacyFormData.post(userId, data);

            expect(postStub.calledOnce).to.equal(true);
            expect(postStub.calledWith(
                data,
                'Post intestacy form data',
                endpoint + path
            )).to.equal(true);

            postStub.restore();
            done();
        });
    });
});
