'use strict';

const expect = require('chai').expect;
const rewire = require('rewire');
const sinon = require('sinon');
const EligibilityValidationStep = rewire('app/core/steps/EligibilityValidationStep');
const schema = require('app/steps/ui/screeners/deathcertificate/schema');
const steps = {};
const section = 'deceased';
const resourcePath = 'screeners/deathcertificate';
const i18next = {};
const pageUrl = '/death-certificate';
const nextStepUrl = '/deceased-domicile';
const fieldKey = 'deathCertificate';
const fieldValue = 'Yes';

describe('EligibilityValidationStep', () => {
    describe('setFeatureTogglesOnCtx()', () => {
        it('should set feature toggles in the context', (done) => {
            let ctx = {};
            const featureToggles = {
                isTestToggleEnabled: true
            };

            const eligibilityValidationStep = new EligibilityValidationStep(steps, section, resourcePath, i18next, schema);
            ctx = eligibilityValidationStep.setFeatureTogglesOnCtx(ctx, featureToggles);

            expect(ctx).to.deep.equal({
                isTestToggleEnabled: true
            });
            done();
        });
    });

    describe('getContextData()', () => {
        let req;
        let res;

        beforeEach(() => {
            req = {
                method: 'GET',
                session: {
                    form: {
                        caseType: 'gop',
                        ccdCase: {
                            id: 1234567890123456,
                            state: 'Pending'
                        }
                    },
                    caseType: 'gop'
                },
                sessionID: 'abc123'
            };
            res = {};
        });

        it('a GET request should not set ctx.answerValue when an answer value is not given and call eligibilityCookie.getAnswer()', (done) => {
            const revert = EligibilityValidationStep.__set__('eligibilityCookie', {getAnswer: sinon.spy()});
            const eligibilityValidationStep = new EligibilityValidationStep(steps, section, resourcePath, i18next, schema);
            const ctx = eligibilityValidationStep.getContextData(req, res, pageUrl, fieldKey);

            expect(EligibilityValidationStep.__get__('eligibilityCookie.getAnswer').calledOnce).to.equal(true);
            expect(EligibilityValidationStep.__get__('eligibilityCookie.getAnswer').calledWith(req, pageUrl, fieldKey)).to.equal(true);
            expect(ctx).to.deep.equal({
                sessionID: 'abc123',
                caseType: 'gop',
                userLoggedIn: false,
                ccdCase: {
                    id: 1234567890123456,
                    state: 'Pending'
                }
            });

            revert();
            done();
        });

        it('a GET request should set ctx.answerValue when an answer value is given', (done) => {
            const revert = EligibilityValidationStep.__set__('eligibilityCookie', {getAnswer: sinon.stub().returns('Yes')});
            const eligibilityValidationStep = new EligibilityValidationStep(steps, section, resourcePath, i18next, schema);
            const ctx = eligibilityValidationStep.getContextData(req, res, pageUrl, fieldKey);

            expect(ctx).to.deep.equal({
                sessionID: 'abc123',
                caseType: 'gop',
                userLoggedIn: false,
                deathCertificate: 'Yes',
                ccdCase: {
                    id: 1234567890123456,
                    state: 'Pending'
                }
            });

            revert();
            done();
        });

        it('a POST request should call nextStepUrl() and setEligibilityCookie()', (done) => {
            req.method = 'POST';
            req.session.form = {
                ccdCase: {
                    id: 1234567890123456,
                    state: 'Pending'
                },
                deceased: {
                    deathCertificate: 'Yes'
                },
                caseType: 'gop'
            };
            const featureToggles = {
                isTestToggleEnabled: true
            };
            const eligibilityValidationStep = new EligibilityValidationStep(steps, section, resourcePath, i18next, schema);
            const nextStepUrlStub = sinon.stub(eligibilityValidationStep, 'nextStepUrl').returns(nextStepUrl);
            const setEligibilityCookieStub = sinon.stub(eligibilityValidationStep, 'setEligibilityCookie');
            const ctx = eligibilityValidationStep.getContextData(req, res, pageUrl, fieldKey, featureToggles);

            expect(nextStepUrlStub.calledOnce).to.equal(true);
            expect(nextStepUrlStub.calledWith(req, {sessionID: 'abc123', caseType: 'gop', deathCertificate: 'Yes', isTestToggleEnabled: true, userLoggedIn: false, ccdCase: {id: 1234567890123456, state: 'Pending'}})).to.equal(true);
            expect(setEligibilityCookieStub.calledOnce).to.equal(true);
            expect(setEligibilityCookieStub.calledWith(req, res, nextStepUrl, fieldKey, fieldValue)).to.equal(true);
            expect(ctx).to.deep.equal({
                sessionID: 'abc123',
                caseType: 'gop',
                userLoggedIn: false,
                deathCertificate: 'Yes',
                isTestToggleEnabled: true,
                ccdCase: {
                    id: 1234567890123456,
                    state: 'Pending'
                }
            });

            nextStepUrlStub.restore();
            setEligibilityCookieStub.restore();
            done();
        });
    });

    describe('persistFormData()', () => {
        it('should return an empty object', () => {
            const eligibilityValidationStep = new EligibilityValidationStep(steps, section, resourcePath, i18next, schema);
            const result = eligibilityValidationStep.persistFormData();
            expect(result).to.deep.equal({});
        });
    });

    describe('setEligibilityCookie()', () => {
        it('should call eligibilityCookie.setCookie()', (done) => {
            const revert = EligibilityValidationStep.__set__('eligibilityCookie', {setCookie: sinon.spy()});
            const req = {};
            const res = {cookie: () => true};
            const eligibilityValidationStep = new EligibilityValidationStep(steps, section, resourcePath, i18next, schema);

            eligibilityValidationStep.setEligibilityCookie(req, res, nextStepUrl, fieldKey, fieldValue);

            expect(EligibilityValidationStep.__get__('eligibilityCookie.setCookie').calledOnce).to.equal(true);
            expect(EligibilityValidationStep.__get__('eligibilityCookie.setCookie').calledWith(req, res, nextStepUrl, fieldKey, fieldValue)).to.equal(true);

            revert();
            done();
        });
    });
});
