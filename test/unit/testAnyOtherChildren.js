'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const AnyOtherChildren = steps.AnyOtherChildren;
const content = require('app/resources/en/translation/deceased/anyotherchildren');

describe('AnyOtherChildren', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = AnyOtherChildren.constructor.getUrl();
            expect(url).to.equal('/any-other-children');
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

            const ctx = AnyOtherChildren.getContextData(req);
            expect(ctx.deceasedName).to.equal('John Doe');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = AnyOtherChildren.nextStepOptions();
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'anyOtherChildren', value: content.optionYes, choice: 'hadOtherChildren'},
                ]
            });
            done();
        });
    });
});
