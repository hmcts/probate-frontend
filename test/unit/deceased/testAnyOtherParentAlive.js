'use strict';

const initSteps = require('app/core/initSteps');
const {expect} = require('chai');
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const AnyOtherParentAlive = steps.AnyOtherParentAlive;

describe(AnyOtherParentAlive.name, () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = AnyOtherParentAlive.constructor.getUrl();
            expect(url).to.equal('/any-other-parent-alive');
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

            const ctx = AnyOtherParentAlive.getContextData(req);
            expect(ctx.deceasedName).to.equal('John Doe');
            done();
        });
    });
});
