'use strict';

const journey = require('app/journeys/intestacy');
const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const DivorcePlace = steps.DivorcePlace;
const contentMaritalStatus = require('app/resources/en/translation/deceased/maritalstatus');
const content = require('app/resources/en/translation/deceased/divorceplace');
const commonContent = require('app/resources/en/translation/common');

describe('DivorcePlace', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = DivorcePlace.constructor.getUrl();
            expect(url).to.equal('/deceased-divorce-or-separation-place*');
            done();
        });
    });

    describe('getContextData()', () => {
        let ctx;
        let req;

        it('should return the context with the legal process string in case of divorce', (done) => {
            req = {
                session: {
                    language: 'en',
                    form: {
                        deceased: {
                            maritalStatus: 'optionDivorced'
                        }
                    }
                }
            };

            ctx = DivorcePlace.getContextData(req);
            expect(ctx.legalProcess).to.equal(contentMaritalStatus.divorce);
            done();
        });

        it('should return the context with the legal process string in case of separation', (done) => {
            req = {
                session: {
                    language: 'en',
                    form: {
                        deceased: {
                            maritalStatus: 'optionSeparated'
                        }
                    }
                }
            };

            ctx = DivorcePlace.getContextData(req);
            expect(ctx.legalProcess).to.equal(contentMaritalStatus.separation);
            done();
        });
    });

    describe('generateFields()', () => {
        it('should return the correct content fields', (done) => {
            const ctx = {
                language: 'en',
                legalProcess: 'divorce'
            };
            const errors = [
                {
                    field: 'divorcePlace',
                    href: '#divorcePlace',
                    msg: content.errors.divorcePlace.required
                }
            ];

            const fields = DivorcePlace.generateFields('en', ctx, errors);
            expect(fields).to.deep.equal({
                language: {
                    error: false,
                    value: 'en'
                },
                divorcePlace: {
                    error: true,
                    href: '#divorcePlace',
                    errorMessage: content.errors.divorcePlace.required.replace('{legalProcess}', 'divorce')
                },
                legalProcess: {
                    error: false,
                    value: 'divorce'
                },
                title: `Where the divorce took place - ${commonContent.serviceName}`
            });
            done();
        });
    });

    describe('nextStepUrl()', () => {
        it('should return the correct url when Yes is given', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                divorcePlace: 'optionYes'
            };
            const nextStepUrl = DivorcePlace.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/task-list*');
            done();
        });

        it('should return the correct url when No is given and legal act is Divorce', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                legalProcess: 'divorce',
                divorcePlace: 'optionNo'
            };
            const nextStepUrl = DivorcePlace.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/stop-page/divorcePlace');
            done();
        });

        it('should return the correct url when No is given and legal act is Separation', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                legalProcess: 'separation',
                divorcePlace: 'optionNo'
            };
            const nextStepUrl = DivorcePlace.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/stop-page/separationPlace');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = DivorcePlace.nextStepOptions();
            expect(nextStepOptions).to.deep.equal({
                options: [{
                    key: 'divorcePlace',
                    value: 'optionYes',
                    choice: 'inEnglandOrWales'
                }]
            });
            done();
        });
    });

    describe('action()', () => {
        it('test that context variables are removed and empty object returned', () => {
            let formdata = {};
            let ctx = {
                legalProcess: 'divorce'
            };
            [ctx, formdata] = DivorcePlace.action(ctx, formdata);
            expect(ctx).to.deep.equal({});
        });
    });
});
