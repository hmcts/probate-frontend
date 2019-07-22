'use strict';

const {expect} = require('chai');
const sinon = require('sinon');
const rewire = require('rewire');
const IntestacyFormData = rewire('app/services/IntestacyFormData');
const FormData = require('app/services/FormData');

describe('IntestacyFormDataService', () => {
    describe('get()', () => {
        it('should call super.get()', (done) => {
            const endpoint = 'http://localhost';
            const userId = 'fred@example.com';
            const intestacyFormData = new IntestacyFormData(endpoint, 'abc123');
            const getStub = sinon.stub(FormData.prototype, 'get');

            intestacyFormData.get(userId);

            expect(getStub.calledOnce).to.equal(true);
            expect(getStub.calledWith(
                'Get intestacy form data',
                `${endpoint}/${userId}`
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
            const postStub = sinon.stub(FormData.prototype, 'post');

            intestacyFormData.post(userId, data);

            expect(postStub.calledOnce).to.equal(true);
            expect(postStub.calledWith(
                {
                    id: userId,
                    formdata: data,
                },
                'Post intestacy form data',
                endpoint
            )).to.equal(true);

            postStub.restore();
            done();
        });
    });
});
