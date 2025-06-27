'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const DeceasedNameAsOnWill = steps.DeceasedNameAsOnWill;

describe('DeceasedNameAsOnWill', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = DeceasedNameAsOnWill.constructor.getUrl();
            expect(url).to.equal('/deceased-name-as-on-will');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct next step options', (done) => {
            const result = DeceasedNameAsOnWill.nextStepOptions();
            expect(result).to.deep.equal({
                options: [{
                    key: 'nameAsOnTheWill',
                    value: 'optionNo',
                    choice: 'hasAlias'
                }]
            });
            done();
        });
    });

    describe('getContextData()', () => {
        let ctx;
        let req;

        it('should return the context with the deceased name', (done) => {
            req = {
                session: {
                    form: {
                        deceased: {
                            firstName: 'John',
                            lastName: 'Doe',
                            'dod-date': '2022-01-01',
                        }
                    }
                }
            };

            ctx = DeceasedNameAsOnWill.getContextData(req);
            expect(ctx.deceasedName).to.equal('John Doe');
            done();
        });
    });

    describe('shouldHaveBackLink()', () => {
        it('should have a back link', (done) => {
            const actual = DeceasedNameAsOnWill.shouldHaveBackLink();
            expect(actual).to.equal(true);
            done();
        });
    });

});
