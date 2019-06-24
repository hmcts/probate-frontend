'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const rewire = require('rewire');
const setJourney = rewire('app/middleware/setJourney');
const caseTypes = require('app/utils/CaseTypes');

describe('setJourney', () => {
    describe('setJourney()', () => {
        it('should set req.session with the probate journey when isIntestacyJourney is false', (done) => {
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

        it('should set req.session with the intestacy journey when isIntestacyJourney is true', (done) => {
            const revert = setJourney.__set__('intestacyJourney', {journey: 'an intestacy journey'});
            const req = {
                session: {
                    form: {},
                    caseType: caseTypes.INTESTACY
                }
            };
            const res = {};
            const next = sinon.spy();

            setJourney(req, res, next);

            expect(req.session).to.deep.equal({
                form: {
                    caseType: caseTypes.INTESTACY
                },
                caseType: caseTypes.INTESTACY,
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
