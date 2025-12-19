'use strict';

const expect = require('chai').expect;
const ServiceMapper = require('app/utils/ServiceMapper.cjs');
const FormData = require('app/services/FormData.cjs');

describe('ServiceMapper', () => {
    describe('map()', () => {
        it('should return a intestacy formdata class', (done) => {
            const params = ['url', 'id'];
            const service = ServiceMapper.map('FormData', params);
            expect(service).to.be.instanceof(FormData);
            done();
        });
    });
});
