'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const rewire = require('rewire');
const setJourney = rewire('app/middleware/setJourney');

describe('setJourney', () => {
    describe('isIntestacyJourney()', () => {
        it('should return false if session.caseType and session.form.caseType are not set', (done) => {
            const session = {};
            const isIntestacyJourney = setJourney.isIntestacyJourney(session);
            expect(isIntestacyJourney).to.equal(false);
            done();
        });

        it('should return false if session.caseType is set to \'gop\'', (done) => {
            const session = {
                caseType: 'gop'
            };
            const isIntestacyJourney = setJourney.isIntestacyJourney(session);
            expect(isIntestacyJourney).to.equal(false);
            done();
        });

        it('should return false if session.form.caseType is set to \'gop\'', (done) => {
            const session = {
                form: {
                    caseType: 'gop'
                }
            };
            const isIntestacyJourney = setJourney.isIntestacyJourney(session);
            expect(isIntestacyJourney).to.equal(false);
            done();
        });

        it('should return true if session.caseType is set to \'intestacy\'', (done) => {
            const session = {
                caseType: 'intestacy'
            };
            const isIntestacyJourney = setJourney.isIntestacyJourney(session);
            expect(isIntestacyJourney).to.equal(true);
            done();
        });

        it('should return true if session.form.caseType is set to \'intestacy\'', (done) => {
            const session = {
                form: {
                    caseType: 'intestacy'
                }
            };
            const isIntestacyJourney = setJourney.isIntestacyJourney(session);
            expect(isIntestacyJourney).to.equal(true);
            done();
        });
    });

    describe('setCaseTypeFormdata()', () => {
        it('should return the original session if session.caseType does not exist', (done) => {
            const sessionToTest = {
                form: {}
            };
            const session = setJourney.setCaseTypeFormdata(sessionToTest);
            expect(session).to.deep.equal({
                form: {}
            });
            done();
        });

        it('should add session.caseType to the form data if session.caseType exists and session.caseType does not exist', (done) => {
            const sessionToTest = {
                form: {},
                caseType: 'gop'
            };
            const session = setJourney.setCaseTypeFormdata(sessionToTest);
            expect(session).to.deep.equal({
                form: {
                    caseType: 'gop'
                },
                caseType: 'gop'
            });
            done();
        });

        it('should add session.caseType to the form data if session.caseType exists and session.form.caseType does not exist', (done) => {
            const sessionToTest = {
                form: {},
                caseType: 'gop'
            };
            const session = setJourney.setCaseTypeFormdata(sessionToTest);
            expect(session).to.deep.equal({
                form: {
                    caseType: 'gop'
                },
                caseType: 'gop'
            });
            done();
        });

        it('should not add session.caseType to the form data if session.caseType exists and session.form.caseType exists', (done) => {
            const sessionToTest = {
                form: {
                    caseType: 'gop'
                },
                caseType: 'gop'
            };
            const session = setJourney.setCaseTypeFormdata(sessionToTest);
            expect(session).to.deep.equal({
                form: {
                    caseType: 'gop'
                },
                caseType: 'gop'
            });
            done();
        });
    });

    describe('setJourney()', () => {
        it('should set req.session with the probate journey when isIntestacyJourney is false', (done) => {
            const revert = setJourney.__set__('probateJourney', {journey: 'probate'});
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
                    journey: 'probate'
                }
            });
            expect(next.calledOnce).to.equal(true);

            revert();
            done();
        });

        it('should set req.session with the intestacy journey when isIntestacyJourney is true', (done) => {
            const revert = setJourney.__set__('intestacyJourney', {journey: 'intestacy'});
            const req = {
                session: {
                    form: {},
                    caseType: 'intestacy'
                }
            };
            const res = {};
            const next = sinon.spy();

            setJourney(req, res, next);

            expect(req.session).to.deep.equal({
                form: {
                    caseType: 'intestacy'
                },
                caseType: 'intestacy',
                journey: {
                    journey: 'intestacy'
                }
            });
            expect(next.calledOnce).to.equal(true);

            revert();
            done();
        });
    });

    describe('getJourneyName()', () => {
        it('should return \'gop\' if session.caseType and session.form.caseType are not set', (done) => {
            const session = {};
            const journeyName = setJourney.getJourneyName(session);
            expect(journeyName).to.equal('gop');
            done();
        });

        it('should return \'gop\' as journey name if session.caseType is set to \'gop\'', (done) => {
            const session = {
                caseType: 'gop'
            };
            const journeyName = setJourney.getJourneyName(session);
            expect(journeyName).to.equal('gop');
            done();
        });

        it('should return \'gop\' as journey name if session.form.caseType is set to \'gop\'', (done) => {
            const session = {
                form: {
                    caseType: 'gop'
                }
            };
            const journeyName = setJourney.getJourneyName(session);
            expect(journeyName).to.equal('gop');
            done();
        });

        it('should return \'intestacy\' if session.caseType is set to \'intestacy\'', (done) => {
            const session = {
                caseType: 'intestacy'
            };
            const journeyName = setJourney.getJourneyName(session);
            expect(journeyName).to.equal('intestacy');
            done();
        });

        it('should return \'intestacy\' if session.form.caseType is set to \'intestacy\'', (done) => {
            const session = {
                form: {
                    caseType: 'intestacy'
                }
            };
            const journeyName = setJourney.getJourneyName(session);
            expect(journeyName).to.equal('intestacy');
            done();
        });
    });
});
