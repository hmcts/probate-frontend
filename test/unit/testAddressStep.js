'use strict';

const AddressStep = require('app/core/steps/AddressStep');
const expect = require('chai').expect;

describe('AddressStep', () => {
    let steps;
    let section;
    let templatePath;
    let i18next;
    let schema;
    let ctxToTest;
    let error;

    beforeEach(() => {
        steps = {};
        section = 'executors';
        templatePath = 'addressLookup';
        i18next = {};
        schema = {
            $schema: 'http://json-schema.org/draft-04/schema#',
            properties: {}
        };
        ctxToTest = {};
        error = {
            field: 'address',
            message: 'Please enter an address'
        };
    });

    describe('getContextData()', () => {

        it('should set individual address fields when address already exists', (done) => {
            const addressStep = new AddressStep(steps, section, templatePath, i18next, schema);
            const req = {
                session: {
                    form: {
                        executors: {
                            address: {
                                addressLine1: 'line1',
                                addressLine2: 'line2',
                                addressLine3: 'line3',
                                postTown: 'town',
                                county: 'county',
                                postCode: 'postcode',
                                country: 'country'
                            }
                        }
                    }
                }
            };
            const ctx = addressStep.getContextData(req);
            expect(ctx.addressLine1).to.equal('line1');
            expect(ctx.addressLine2).to.equal('line2');
            expect(ctx.addressLine3).to.equal('line3');
            expect(ctx.postTown).to.equal('town');
            expect(ctx.county).to.equal('county');
            expect(ctx.newPostCode).to.equal('postcode');
            expect(ctx.country).to.equal('country');
            done();
        });
    });

    describe('handleGet()', () => {
        it('should return ctx when there are no errors', (done) => {
            const addressStep = new AddressStep(steps, section, templatePath, i18next, schema);
            const ctx = addressStep.handleGet(ctxToTest, null);
            expect(ctx).to.deep.equal([ctxToTest]);
            done();
        });

        it('should return ctx and errors when there are errors', (done) => {
            const formdata = {
                executors: {errors: error}
            };
            ctxToTest.errors = error;
            const addressStep = new AddressStep(steps, section, templatePath, i18next, schema);
            const ctx = addressStep.handleGet(ctxToTest, formdata);
            expect(ctx).to.deep.equal([ctxToTest, error]);
            expect(formdata).to.deep.equal({
                executors: {}
            });
            done();
        });

    });

    describe('handlePost()', () => {
        describe('should return formatted address', () => {
            it('when an address exists', (done) => {
                ctxToTest = {
                    addressLine1: 'line1',
                    addressLine2: 'line2',
                    addressLine3: 'line3',
                    postTown: 'town',
                    county: 'county',
                    newPostCode: 'postcode',
                    country: 'country'
                };
                const addressStep = new AddressStep(steps, section, templatePath, i18next, schema);
                const ctx = addressStep.handlePost(ctxToTest, null);
                expect(ctx[0].address).to.deep.equal({
                    addressLine1: 'line1',
                    addressLine2: 'line2',
                    addressLine3: 'line3',
                    formattedAddress: 'line1 line2 line3 town postcode county country ',
                    postTown: 'town',
                    postCode: 'postcode',
                    county: 'county',
                    country: 'country'
                });
                done();
            });

        });
    });
});
