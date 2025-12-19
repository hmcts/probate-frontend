'use strict';

const expect = require('chai').expect;
const co = require('co');
const rewire = require('rewire');
const AddressLookup = rewire('app/steps/action/addressLookup');
const content = require('app/resources/en/translation/addressLookup');

const expectedResponse = [{
    formattedAddress: 'Ministry Of Justice,Seventh Floor,103 Petty France,London,SW1H 9AJ',
    postcode: 'SW1H 9AJ'
}, {
    formattedAddress: 'Ministry Of Justice,Seventh Floor,102 Petty France,London,SW1H 9AJ',
    postcode: 'SW1H 9AJ'
}];

describe('AddressLookup', () => {
    let steps;
    let section;
    let templatePath;
    let i18next;
    let schema;
    let ctxToTest;
    let formdata;
    let req;

    beforeEach(() => {
        steps = {
            ApplicantAddress: {
                section: 'applicant'
            }
        };
        section = 'applicant';
        templatePath = 'addressLookup';
        i18next = {};
        schema = {
            $schema: 'http://json-schema.org/draft-07/schema',
            properties: {}
        };
        ctxToTest = {
            referrer: 'ApplicantAddress',
            postcode: 'SW1H 9AJ'
        };
        formdata = {
            applicant: {
                someThingToLookFor: 'someThingToLookFor'
            }
        };
        req = {
            session: {
                form: {
                    caseType: 'gop'
                }
            },
            sessionID: 'abc12345'
        };
    });

    describe('handlePost()', () => {
        it('should add addresses to formdata', (done) => {
            const revert = AddressLookup.__set__('PostcodeAddress', class {
                get() {
                    return expectedResponse;
                }
            });
            const addressLookup = new AddressLookup(steps, section, templatePath, i18next, schema);

            co(function* () {
                yield addressLookup.handlePost(ctxToTest, [], formdata, req);

                expect(formdata.applicant.addresses).to.deep.equal(expectedResponse);
                expect(formdata.applicant.addressFound).to.equal('true');
                revert();
                done();
            });
        });

        it('should create an error if address not found', (done) => {
            const revert = AddressLookup.__set__('PostcodeAddress', class {
                get() {
                    return [];
                }
            });
            const addressLookup = new AddressLookup(steps, section, templatePath, i18next, schema);
            const errorsToTest = {
                field: 'postcode',
                href: '#postcode',
                msg: content.errors.postcode.noAddresses
            };

            ctxToTest = {
                referrer: 'ApplicantAddress',
                postcode: 'N55'
            };

            co(function* () {
                yield addressLookup.handlePost(ctxToTest, [errorsToTest], formdata, req);

                expect(formdata.applicant.errors[0]).to.deep.equal(errorsToTest);
                revert();
                done();
            }).catch((err) => {
                done(err);
            });
        });
    });

    describe('getReferrerData()', () => {
        it('should get the referer data section from the formdata', () => {
            const addressLookup = new AddressLookup(steps, section, templatePath, i18next, schema);
            const referrerData = addressLookup.getReferrerData(ctxToTest, formdata);
            expect(referrerData).to.deep.equal({
                someThingToLookFor: 'someThingToLookFor'
            });
        });

        it('should create the referer data section from the formdata if one does not exist', () => {
            formdata = {};
            const addressLookup = new AddressLookup(steps, section, templatePath, i18next, schema);
            const referrerData = addressLookup.getReferrerData(ctxToTest, formdata);
            expect(referrerData).to.deep.equal({});
        });
    });

    describe('pruneReferrerData()', () => {
        it('should delete the referer data', () => {
            const addressLookup = new AddressLookup(steps, section, templatePath, i18next, schema);
            const referrerDataToTest = {
                addresses: 'addresses',
                addressFound: 'addressFound',
                errors: 'errors'
            };
            const referrerData = addressLookup.pruneReferrerData(referrerDataToTest);
            expect(referrerData).to.deep.equal({});
        });
    });
});
