'use strict';

const expect = require('chai').expect;
const testConfig = require('config');
const FormatUrl = require('app/utils/FormatUrl.cjs');
const logger = require('app/components/logger.cjs')('Init');
const request = require('supertest');

const TEST_VALIDATION_SERVICE_URL = testConfig.services.validation.url;
const VALID_SESSION_ID = '012233456789';
const INVALID_TEST_NUMBER = '0770111111111111111';
const VALID_INTERNATIONAL_TEST_NUMBER = '%2B61437112945';
const VALID_UK_WITH_PREFIX_TEST_NUMBER = '%2B447535538319';
const VALID_UK_LOCAL_TEST_NUMBER = '07535538319';
const VALID_PIN_CONTENT_LENGTH = 6;

describe('Pin Creation API Tests', () => {

    const pinServiceUrl = FormatUrl.format(TEST_VALIDATION_SERVICE_URL, '/pin');
    const numberMatchRE = new RegExp(/^[0-9]+$/);

    describe('Invalid number which should produce a 400 Bad Request', () => {
        it('Returns HTTP 400 status', (done) => {
            request(pinServiceUrl)
                .post('')
                .send({PhonePin: {phoneNumber: INVALID_TEST_NUMBER}})
                .set('Session-Id', VALID_SESSION_ID + '_0')
                .expect(500)
                .end((err, res) => {
                    if (err) {
                        logger.error(`error raised: ${err} using URL ${pinServiceUrl}`);
                        done(err);
                    } else {
                        expect(err).to.be.equal(null);
                        const res_json = JSON.parse(res.text);
                        expect(res_json.status).to.be.equal(500);
                        expect(res_json.error).to.be.equal('Internal Server Error');
                        done();
                    }
                });
        });
    });

    describe('Missing Session-Id which should produce a 400 Bad Request', () => {
        it('Returns HTTP 400 status', (done) => {
            request(pinServiceUrl)
                .post('')
                .send({PhonePin: {phoneNumber: VALID_UK_LOCAL_TEST_NUMBER}})
                .expect(400)
                .end((err, res) => {
                    if (err) {
                        logger.error(`error raised: ${err} using URL ${pinServiceUrl}`);
                        done(err);
                    } else {
                        expect(err).to.be.equal(null);
                        expect(res.text).to.contain('Bad Request');
                        done();
                    }
                });
        });
    });

    describe('Valid International Number', () => {
        it('Returns HTTP 200 status and pin number', (done) => {
            request(pinServiceUrl)
                .post('')
                .send({PhonePin: {phoneNumber: VALID_INTERNATIONAL_TEST_NUMBER}})
                .set('Session-Id', VALID_SESSION_ID + '_1')
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        logger.error(`error raised: ${err} using URL ${pinServiceUrl}`);
                        done(err);
                    } else {
                        expect(err).to.be.equal(null);
                        expect(res.text).to.match(numberMatchRE);
                        expect(res.text.length).to.equal(VALID_PIN_CONTENT_LENGTH);
                        expect(res.text).is.not.equal(null);
                        done();
                    }
                });
        });
    });

    describe('Valid UK With 44 Prefix Number', () => {
        it('Returns HTTP 200 status and pin number', (done) => {
            request(pinServiceUrl)
                .post('')
                .send({PhonePin: {phoneNumber: VALID_UK_WITH_PREFIX_TEST_NUMBER}})
                .set('Session-Id', VALID_SESSION_ID + '_2')
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        logger.error(`error raised: ${err} using URL ${pinServiceUrl}`);
                        done(err);
                    } else {
                        expect(err).to.be.equal(null);
                        expect(res.text).to.match(numberMatchRE);
                        expect(res.text.length).to.equal(VALID_PIN_CONTENT_LENGTH);
                        expect(res.text).is.not.equal(null);
                        done();
                    }
                });
        });
    });

    describe('Valid UK Local Number', () => {
        it('Returns HTTP 200 status and pin number', (done) => {
            request(pinServiceUrl)
                .post('')
                .send({PhonePin: {phoneNumber: VALID_UK_LOCAL_TEST_NUMBER}})
                .set('Session-Id', VALID_SESSION_ID + '_3')
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        logger.error(`error raised: ${err} using URL ${pinServiceUrl}`);
                        done(err);
                    } else {
                        expect(err).to.be.equal(null);
                        expect(res.text).to.match(numberMatchRE);
                        expect(res.text.length).to.equal(VALID_PIN_CONTENT_LENGTH);
                        expect(res.text).is.not.equal(null);
                        done();
                    }
                });
        });
    });
});
