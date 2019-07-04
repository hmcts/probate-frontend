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
                'form': {
                    'caseType': 'gop'
                },
                journey: {
                    journey: 'a probate journey'
                }
            });
            expect(next.calledOnce).to.equal(true);

            revert();
            done();
        });

        it('should set req.journey with the probate journey when session only caseType exists', (done) => {
            const revert = setJourney.__set__('probateJourney', {journey: 'a probate journey'});
            const req = {
                session: {
                    caseType: caseTypes.GOP,
                    form: {}
                }
            };
            const res = {};
            const next = sinon.spy();

            setJourney(req, res, next);

            expect(req.session).to.deep.equal({
                caseType: caseTypes.GOP,
                form: {
                    caseType: caseTypes.GOP
                },
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

        it('should set req.journey with the intestacy journey when session caseType is intestacy', (done) => {
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
                    caseType: caseTypes.INTESTACY
                },
                journey: {
                    journey: 'an intestacy journey'
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
    });

});
