'use strict';

const initSteps = require('app/core/initSteps');
const {expect} = require('chai');
const journey = require('app/journeys/probate');
const content = require('app/resources/en/translation/will/newleft');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const NewWillLeft = steps.NewWillLeft;

describe('NewWillLeft', () => {
    describe('handlePost()', () => {
        it('should remove session.form and set session.willLeft', (done) => {
            const ctxToTest = {
                left: 'Yes'
            };
            const errorsToTest = {};
            const formdata = {};
            const session = {
                form: {}
            };
            const [ctx, errors] = NewWillLeft.handlePost(ctxToTest, errorsToTest, formdata, session);
            expect(session).to.deep.equal({
                willLeft: 'Yes'
            });
            expect(ctx).to.deep.equal({
                left: 'Yes'
            });
            expect(errors).to.deep.equal({});
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
