'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const AnyChildren = steps.AnyChildren;
const content = require('app/resources/en/translation/deceased/anychildren');

describe('AnyChildren', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = AnyChildren.constructor.getUrl();
            expect(url).to.equal('/any-children');
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

            const ctx = AnyChildren.getContextData(req);
            expect(ctx.deceasedName).to.equal('John Doe');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = AnyChildren.nextStepOptions();
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'anyChildren', value: content.optionYes, choice: 'hadChildren'},
                ]
            });
            done();
        });
    });
});
