'use strict';

const initSteps = require('app/core/initSteps');
const {expect} = require('chai');
const content = require('app/resources/en/translation/will/newleft');
const journey = require('app/journeys/probate');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const NewWillLeft = steps.NewWillLeft;

describe('NewWillLeft', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = NewWillLeft.constructor.getUrl();
            expect(url).to.equal('/new-will-left');
            done();
        });
    });

    describe('nextStepUrl()', () => {
        it('should return url for the next step', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                left: 'Yes'
            };
            const NewWillLeft = steps.NewWillLeft;
            const nextStepUrl = NewWillLeft.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/new-will-original');
            done();
        });

        it('should return the url for the stop page', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                left: 'No'
            };
            const NewWillLeft = steps.NewWillLeft;
            const nextStepUrl = NewWillLeft.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/stop-page/noWill');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = NewWillLeft.nextStepOptions();
            expect(nextStepOptions).to.deep.equal({
                options: [{
                    key: 'left',
                    value: content.optionYes,
                    choice: 'withWill'
                }]
            });
            done();
        });
    });
});
