'use strict';

const expect = require('chai').expect;
const config = require('app/config');
const FormatUrl = require('app/utils/FormatUrl');
const logger = require('app/components/logger')('Init');
const request = require('supertest');

const VALIDATION_SERVICE_URL = config.services.validation.url;
const VALID_SESSION_ID = '012233456789';
const INVALID_TEST_NUMBER = '+$447701111111';
const VALID_INTERNATIONAL_TEST_NUMBER = '+61437112945';
const VALID_UK_WITH_PREFIX_TEST_NUMBER = '+447535538319';
const VALID_UK_LOCAL_TEST_NUMBER = '07535538319';
const VALID_PIN_CONTENT_LENGTH = '6';

describe('Pin Creation API Tests', () => {

    const pinServiceUrl = FormatUrl.format(VALIDATION_SERVICE_URL, '/pin');

    describe('Invalid number which should produce a 400 Bad Request', () => {
        it('Returns HTTP 400 status', (done) => {
            request(pinServiceUrl)
                .get('')
                .query({phoneNumber: INVALID_TEST_NUMBER})
                .set('Session-Id', VALID_SESSION_ID)
                .expect(400)
                .end((err, res) => {
                    if (err) {
                        logger.error(`error raised: ${err}`);
                    }
                    expect(err).to.be.equal(null);
                    expect(res.text).to.equal('');
                    done();
                });
        });
    });

    describe('Missing Session-Id which should produce a 400 Bad Request', () => {
        it('Returns HTTP 400 status', (done) => {
            request(pinServiceUrl)
                .get('')
                .query({phoneNumber: VALID_UK_LOCAL_TEST_NUMBER})
                .expect(400)
                .end((err, res) => {
                    if (err) {
                        logger.error(`error raised: ${err}`);
                    }
                    expect(err).to.be.equal(null);
                    expect(res.text).to.contain('Bad Request');
                    done();
                });
        });
    });

    describe('Valid International Number', () => {
        it('Returns HTTP 200 status and pin number', (done) => {
            request(pinServiceUrl)
                .get('')
                .query({phoneNumber: VALID_INTERNATIONAL_TEST_NUMBER})
                .set('Session-Id', VALID_SESSION_ID)
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        logger.error(`error raised: ${err}`);
                    }
                    expect(err).to.be.equal(null);
                    expect(res.header).to.have.property('content-length').eq(VALID_PIN_CONTENT_LENGTH);
                    expect(res.text).is.not.equal(null);
                    done();
                });
        });
    });

    describe('Valid UK With 44 Prefix Number', () => {
        it('Returns HTTP 200 status and pin number', (done) => {
            request(pinServiceUrl)
                .get('')
                .query({phoneNumber: VALID_UK_WITH_PREFIX_TEST_NUMBER})
                .set('Session-Id', VALID_SESSION_ID)
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        logger.error(`error raised: ${err}`);
                    }
                    expect(err).to.be.equal(null);
                    expect(res.header).to.have.property('content-length').eq(VALID_PIN_CONTENT_LENGTH);
                    expect(res.text).is.not.equal(null);
                    done();
                });
        });
    });

   describe('Valid UK Local Number', () => {
        it('Returns HTTP 200 status and pin number', (done) => {
            request(pinServiceUrl)
                .get('')
                .query({phoneNumber: VALID_UK_LOCAL_TEST_NUMBER})
                .set('Session-Id', VALID_SESSION_ID)
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        logger.error(`error raised: ${err}`);
                    }
                    expect(err).to.be.equal(null);
                    expect(res.header).to.have.property('content-length').eq(VALID_PIN_CONTENT_LENGTH);
                    expect(res.text).is.not.equal(null);
                    done();
                });
        });
    });
});
