'use strict';

const initSteps = require('app/core/initSteps');
const {expect} = require('chai');
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const AnyLivingDescendants = steps.AnyLivingDescendants;

describe(AnyLivingDescendants.name, () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = AnyLivingDescendants.constructor.getUrl();
            expect(url).to.equal('/any-living-descendants');
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
                        },
                        applicant: {
                            relationshipToDeceased: 'optionSibling'
                        }
                    }
                }
            };

            const ctx = AnyLivingDescendants.getContextData(req);
            expect(ctx.deceasedName).to.equal('John Doe');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const ctx = {};
            const nextStepOptions = AnyLivingDescendants.nextStepOptions(ctx);
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'siblings', value: true, choice: 'anyLivingParents'},
                    {key: 'parent', value: true, choice: 'adoptedIn'}
                ]
            });
            done();
        });
    });
});
