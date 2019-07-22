'use strict';

const {expect} = require('chai');
const sinon = require('sinon');
const rewire = require('rewire');
const ProbateFormData = rewire('app/services/ProbateFormData');
const FormData = require('app/services/FormData');

describe('ProbateFormDataService', () => {
    describe('get()', () => {
        it('should call super.get()', (done) => {
            const endpoint = 'http://localhost';
            const id = 'fred@example.com';
            const probateFormData = new ProbateFormData(endpoint, 'abc123');
            const getStub = sinon.stub(FormData.prototype, 'get');

            probateFormData.get(id);

            expect(getStub.calledOnce).to.equal(true);
            expect(getStub.calledWith(
                'Get probate form data',
                `${endpoint}/${id}`
            )).to.equal(true);

            getStub.restore();
            done();
        });
    });

    describe('post()', () => {
        it('should call super.post()', (done) => {
            const endpoint = 'http://localhost';
            const id = 'fred@example.com';
            const data = {};
            const probateFormData = new ProbateFormData(endpoint, 'abc123');
            const postStub = sinon.stub(FormData.prototype, 'post');

            probateFormData.post(id, data);

            expect(postStub.calledOnce).to.equal(true);
            expect(postStub.calledWith(
                {
                    id: id,
                    formdata: data,
                },
                'Post probate form data',
                endpoint
            )).to.equal(true);

            postStub.restore();
            done();
        });
    });
});
