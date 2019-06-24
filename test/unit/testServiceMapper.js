'use strict';

const {expect} = require('chai');
const ServiceMapper = require('app/utils/ServiceMapper');
const caseTypes = require('app/utils/CaseTypes');
const IntestacyFormData = require('app/services/IntestacyFormData');
const ProbateFormData = require('app/services/ProbateFormData');

describe('ServiceMapper', () => {
    describe('map()', () => {

        it('should return a intestacy formdata class', (done) => {
            const params = ['url', 'id'];
            const service = ServiceMapper.map('FormData', params, caseTypes.INTESTACY);
            expect(service).to.be.instanceof(IntestacyFormData);
            done();
        });

        it('should return a intestacy formdata class', (done) => {
            const params = ['url', 'id'];
            const service = ServiceMapper.map('FormData', params, caseTypes.INTESTACY);
            expect(service).not.to.be.instanceof(ProbateFormData);
            done();
        });

        it('should return a probate formdata class', (done) => {
            const params = ['url', 'id'];
            const service = ServiceMapper.map('FormData', params, caseTypes.GOP);
            expect(service).to.be.instanceof(ProbateFormData);
            done();
        });

        it('should return a probate formdata class', (done) => {
            const params = ['url', 'id'];
            const service = ServiceMapper.map('FormData', params, caseTypes.GOP);
            expect(service).not.to.be.instanceof(IntestacyFormData);
            done();
        });

    });
});
