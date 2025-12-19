'use strict';

const initSteps = require('app/core/initSteps');
const {expect} = require('chai');
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const DeceasedAliasNameOnWill = steps.DeceasedAliasNameOnWill;

describe('DeceasedAliasNameOnWill', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = DeceasedAliasNameOnWill.constructor.getUrl();
            expect(url).to.equal('/deceased-alias-name-on-will');
            done();
        });
    });

    describe('shouldHaveBackLink()', () => {
        it('should have a back link', (done) => {
            const actual = DeceasedAliasNameOnWill.shouldHaveBackLink();
            expect(actual).to.equal(true);
            done();
        });
    });

});
