'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const rewire = require('rewire');
const setJourney = rewire('app/middleware/setJourney');
const caseTypes = require('app/utils/CaseTypes');

describe('setJourney', () => {
    describe('setJourney()', () => {
        it('should set req.journey with the probate journey when no caseType', (done) => {
            const revert = setJourney.__set__('probateJourney', {journey: 'a probate journey'});
            const req = {
                session: {
                    form: {}
                }
            };
            const res = {};
            const next = sinon.spy();

            setJourney(req, res, next);

            expect(req.session).to.deep.equal({
                form: {},
                journey: {
                    journey: 'a probate journey'
                }
            });
            expect(next.calledOnce).to.equal(true);

            revert();
            done();
        });

        it('should set req.journey with the probate journey when session form only caseType exists', (done) => {
            const revert = setJourney.__set__('probateJourney', {journey: 'a probate journey'});
            const req = {
                session: {
                    form: {
                        caseType: caseTypes.GOP
                    }
                }
            };
            const res = {};
            const next = sinon.spy();

            setJourney(req, res, next);

            expect(req.session).to.deep.equal({
                form: {
                    caseType: caseTypes.GOP,
                },
                journey: {
                    journey: 'a probate journey'
                }
            });
            expect(next.calledOnce).to.equal(true);

            revert();
            done();
        });

        it('should set req.journey with the intestacy journey when session form caseType is intestacy', (done) => {
            const revert = setJourney.__set__('intestacyJourney', {journey: 'an intestacy journey'});
            const req = {
                session: {
                    form: {
                        caseType: caseTypes.INTESTACY
                    },
                }
            };
            const res = {};
            const next = sinon.spy();

            setJourney(req, res, next);

            expect(req.session).to.deep.equal({
                form: {
                    caseType: caseTypes.INTESTACY,
                },
                journey: {
                    journey: 'an intestacy journey'
                }
            });
            expect(next.calledOnce).to.equal(true);

            revert();
            done();
        });

        it('should set req.journey with the new probate death certificate journey when feature toggle is on and caseType is probate', (done) => {
            const revert = setJourney.__set__('probateNewDeathCertFlow', {journey: 'a new probate journey'});
            const req = {
                session: {
                    form: {
                        caseType: caseTypes.GOP
                    },
                    featureToggles: {
                        'ft_new_deathcert_flow': true
                    }
                }
            };
            const res = {};
            const next = sinon.spy();

            setJourney(req, res, next);

            expect(req.session).to.deep.equal({
                form: {
                    caseType: caseTypes.GOP,
                },
                featureToggles: {
                    'ft_new_deathcert_flow': true
                },
                journey: {
                    journey: 'a new probate journey'
                }
            });
            expect(next.calledOnce).to.equal(true);

            revert();
            done();
        });

        it('should set req.journey with the new intestacy death certificate journey if feature toggle is on and caseType is intestacy', (done) => {
            const revert = setJourney.__set__('intestacyNewDeathCertFlow', {journey: 'a new intestacy journey'});
            const req = {
                session: {
                    form: {
                        caseType: caseTypes.INTESTACY
                    },
                    featureToggles: {
                        'ft_new_deathcert_flow': true
                    }
                }
            };
            const res = {};
            const next = sinon.spy();

            setJourney(req, res, next);

            expect(req.session).to.deep.equal({
                form: {
                    caseType: caseTypes.INTESTACY,
                },
                featureToggles: {
                    'ft_new_deathcert_flow': true
                },
                journey: {
                    journey: 'a new intestacy journey'
                }
            });
            expect(next.calledOnce).to.equal(true);

            revert();
            done();
        });
    });

});
