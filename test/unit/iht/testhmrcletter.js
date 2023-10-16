'use strict';

const initSteps = require('app/core/initSteps');
const probateJourney = require('app/journeys/probate');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const HmrcLetter = steps.HmrcLetter;

describe('HmrcLetter', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = HmrcLetter.constructor.getUrl();
            expect(url).to.equal('/hmrc-letter');
            done();
        });
    });

    let req;
    let ctx;

    beforeEach(() => {
        req = {
            method: 'GET',
            session: {
                language: 'en',
                form: {
                    caseType: 'gop',
                    ccdCase: {
                        id: 1234567890123456,
                        state: 'Pending'
                    }
                },
                caseType: 'gop',
                journey: probateJourney,
            },
            sessionID: 'abc123'
        };
        ctx = {
            hmrcLetterId: ''
        };
    });

    it('should set nextStep to UniqueProbateCode when optionYes', (done) => {
        ctx.hmrcLetterId = 'optionYes';
        const expectedStep = steps.UniqueProbateCode;
        const returnedStep = HmrcLetter.next(req, ctx);
        expect(returnedStep).to.equal(expectedStep);
        done();
    });

    it('should set nextStep to WaitingForHmrc when optionNo', (done) => {
        ctx.hmrcLetterId = 'optionNo';
        const expectedStep = steps.WaitingForHmrc;
        const returnedStep = HmrcLetter.next(req, ctx);
        expect(returnedStep).to.equal(expectedStep);
        done();
    });

});
