'use strict';

const initSteps = require('app/core/initSteps');
const {expect} = require('chai');
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const DeceasedChildAlive = steps.DeceasedChildAlive;

describe('DeceasedChildAlive', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = DeceasedChildAlive.constructor.getUrl();
            expect(url).to.equal('/mainapplicantsparent-alive');
            done();
        });
    });

    describe('getContextData()', () => {
        it('should return the context with the deceased name', (done) => {
            const req = {
                session: {
                    form: {
                        deceased: {
                            firstName: 'John',
                            lastName: 'Doe'
                        }
                    }
                }
            };

            const ctx = DeceasedChildAlive.getContextData(req);
            expect(ctx.deceasedName).to.equal('John Doe');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = DeceasedChildAlive.nextStepOptions();
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'childAlive', value: 'optionNo', choice: 'childNotAlive'},
                ]
            });
            done();
        });
    });
});
