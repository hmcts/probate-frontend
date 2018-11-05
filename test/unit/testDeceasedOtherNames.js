'use strict';

const initSteps = require('app/core/initSteps');
const chai = require('chai');
const expect = chai.expect;
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const jsonOtherNames = require('app/resources/en/translation/deceased/otherNames');
const jsonAddAlias = require('app/resources/en/translation/addAlias');

describe('DeceasedOtherNames.js', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const deceasedOtherNames = steps.DeceasedOtherNames;
            const url = deceasedOtherNames.constructor.getUrl();
            expect(url).to.equal('/other-names');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const deceasedOtherNames = steps.DeceasedOtherNames;
            const nextStepOptions = deceasedOtherNames.nextStepOptions();
            expect(nextStepOptions).to.deep.equal({
                options: [{
                    key: 'deceasedMarriedAfterDateOnCodicilOrWill',
                    value: true,
                    choice: 'deceasedMarriedAfterDateOnCodicilOrWill'
                }]
            });
            done();
        });
    });

    describe('getContextData()', () => {
        it('sets the ctx correctly if otherNames does not exist', (done) => {
            const req = {
                sessionID: 'A',
                session: {
                    form: {
                        deceased: {
                            deathCertificate: 'Yes',
                            firstName: 'First',
                            lastName: 'Last',
                            alias: 'Yes',
                            deceasedName: 'First Last',
                            sessionID: 'A'
                        }
                    }
                }
            };

            const deceasedOtherNames = steps.DeceasedOtherNames;
            const ctx = deceasedOtherNames.getContextData(req);

            expect(ctx.otherNames.name_0).to.deep.equal({firstName: '', lastName: ''});
            done();
        });

        it('sets the ctx correctly if otherNames is exists', (done) => {
            const req = {
                sessionID: 'A',
                session: {
                    form: {
                        deceased: {
                            deathCertificate: 'Yes',
                            firstName: 'First',
                            lastName: 'Last',
                            alias: 'Yes',
                            deceasedName: 'First Last',
                            sessionID: 'A',
                            otherNames: {
                                name_0: {
                                    firstName: 'Harry',
                                    lastName: 'Potter'
                                }
                            }
                        }
                    }
                }
            };

            const deceasedOtherNames = steps.DeceasedOtherNames;
            const ctx = deceasedOtherNames.getContextData(req);

            expect(ctx.otherNames.name_0).to.deep.equal({firstName: 'Harry', lastName: 'Potter'});
            done();
        });
    });

    describe('validate()', () => {
        const invalid = [{
            param: 'firstName',
            msg: jsonOtherNames.errors.firstName.invalid
        },
        {
            param: 'lastName',
            msg: jsonOtherNames.errors.lastName.invalid
        }];

        it('returns correct values if less than 100 otherNames and valid names', (done) => {
            const ctx = {
                otherNames: {
                    name_0: {
                        firstName: 'Harry',
                        lastName: 'Potter'
                    }
                }
            };
            const formdata = {};

            const deceasedOtherNames = steps.DeceasedOtherNames;
            const [allValid, allErrors] = deceasedOtherNames.validate(ctx, formdata);
            expect([allValid, allErrors]).to.deep.equal([true, []]);
            done();
        });

        it('returns correct values if less than 100 otherNames and invalid names', (done) => {
            const ctx = {
                otherNames: {
                    name_0: {
                        firstName: 1,
                        lastName: 1
                    }
                }
            };

            const formdata = {};

            const deceasedOtherNames = steps.DeceasedOtherNames;
            const [allValid, allErrors] = deceasedOtherNames.validate(ctx, formdata);
            expect(allValid).to.deep.equal(false);
            expect(allErrors[0][0]).to.deep.equal('name_0');
            expect(allErrors[0][1]).to.deep.equal(invalid);
            done();
        });

        it('returns correct values if exactly 100 otherNames and valid names', (done) => {
            const ctx = {
                otherNames: {}
            };

            for (let i=0; i<100; i++) {
                ctx.otherNames['name_' + i] = {
                    firstName: 'Harry',
                    lastName: 'Potter'
                };
            }

            const formdata = {};

            const deceasedOtherNames = steps.DeceasedOtherNames;
            const [allValid, allErrors] = deceasedOtherNames.validate(ctx, formdata);
            expect(allValid).to.deep.equal(true);
            expect(allErrors[0][0]).to.deep.equal('name_101');
            done();
        });

        it('returns correct values if exactly 100 otherNames and invalid names', (done) => {
            const ctx = {
                otherNames: {}
            };

            for (let i=0; i<99; i++) {
                ctx.otherNames['name_' + i] = {
                    firstName: 'Harry',
                    lastName: 'Potter'
                };
                if (i == 0) {
                    ctx.otherNames[i] = {
                        firstName: 1,
                        lastName: 1
                    };
                }
            }

            const formdata = {};

            const deceasedOtherNames = steps.DeceasedOtherNames;
            const [allValid, allErrors] = deceasedOtherNames.validate(ctx, formdata);
            expect(allValid).to.deep.equal(false);
            expect(allErrors[0][0]).to.deep.equal('name_101');
            done();
        });
    });
});
