'use strict';

const initSteps = require('app/core/initSteps');
const journey = require('app/journeys/intestacy');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const CoApplicantName = steps.CoApplicantName;
const namePath = '/coapplicant-name/';
const content = require('../../../app/resources/en/translation/executors/coapplicantname.json');

describe('Co-applicant-name', () => {
    describe('getUrl()', () => {
        it('returns the url with a * param when no index is given', (done) => {
            const url = CoApplicantName.constructor.getUrl();

            expect(url).to.equal(namePath + '*');
            done();
        });

        it('returns the url with the index as a param when an index is given', (done) => {
            const param = 1;
            const url = CoApplicantName.constructor.getUrl(param);

            expect(url).to.equal(namePath + param);
            done();
        });
    });

    describe('CoApplicantName handleGet', () => {
        let ctx;

        beforeEach(() => {
            ctx = {
                list: [
                    {fullName: 'Applicant'},
                    {fullName: 'CoApplicant 1', coApplicantRelationshipToDeceased: 'optionChild'},
                    {coApplicantRelationshipToDeceased: 'optionGrandchild'},
                ],
                index: 0
            };
        });

        it('should set coApplicantName to current ctx from list', () => {
            ctx.index = 1;
            [ctx] = CoApplicantName.handleGet(ctx);
            expect(ctx.fullName).to.equal('CoApplicant 1');
        });

        it('should not set coApplicantName when fullName is not present', () => {
            ctx.index = 2;
            [ctx] = CoApplicantName.handleGet(ctx);
            // eslint-disable-next-line no-undefined
            expect(ctx.fullName).to.equal(undefined);
        });
    });
    describe('CoApplicantName nextStepUrl', () => {
        let ctx;
        let req;
        beforeEach(() => {
            ctx = {
                fullName: '',
                index: 0,
                list: [
                    {firstName: 'John', lastName: 'Doe'},
                    {coApplicantRelationshipToDeceased: 'optionChild'},
                    {coApplicantRelationshipToDeceased: 'optionGrandchild'},
                ]
            };
            req = {
                session: {
                    journey: journey
                }
            };
        });

        it('should return the correct URL if the index is there', () => {
            ctx.index = 1;
            const url = CoApplicantName.nextStepUrl(req, ctx);
            expect(url).to.equal('/coapplicant-adopted-in/1');
        });

        it('should return the correct URL with param as * if the index is -1', () => {
            ctx.index = -1;
            const url = CoApplicantName.nextStepUrl(req, ctx);
            expect(url).to.equal('/coapplicant-adopted-in/*');
        });
    });
    describe('handlePost()', () => {
        let ctx;
        let errors;
        let formdata;
        const session = {};

        it('should set coApplicantName in the list if ctx has name', (done) => {
            ctx = {
                list: [
                    {firstName: 'John', lastName: 'Doe'},
                    {coApplicantRelationshipToDeceased: 'optionChild'},
                    {coApplicantRelationshipToDeceased: 'optionGrandchild'},
                ],
                index: 1,
                fullName: 'COApplicant 1'
            };
            errors = [];
            [ctx, errors] = CoApplicantName.handlePost(ctx, errors, formdata, session);
            expect(ctx).to.deep.equal({
                list: [{firstName: 'John', lastName: 'Doe'},
                    {coApplicantRelationshipToDeceased: 'optionChild', fullName: 'COApplicant 1'},
                    {coApplicantRelationshipToDeceased: 'optionGrandchild'},],
                index: 1,
                fullName: 'COApplicant 1'
            });
            done();
        });
        it('should return the min length error when name has length of 1', (done) => {
            ctx = {
                list: [
                    {firstName: 'John', lastName: 'Doe'},
                    {coApplicantRelationshipToDeceased: 'optionChild'},
                    {coApplicantRelationshipToDeceased: 'optionGrandchild'},
                ],
                index: 1,
                fullName: 'C'
            };
            errors = [];
            [ctx, errors] = CoApplicantName.handlePost(ctx, errors, formdata, session);
            expect(errors).to.deep.equal([
                {
                    field: 'fullName',
                    href: '#fullName',
                    msg: content.errors.fullName.minLength
                }
            ]);
            done();
        });
        it('should return the error when last name is more than 100 characters', (done) => {
            ctx = {
                list: [
                    {firstName: 'John', lastName: 'Doe'},
                    {coApplicantRelationshipToDeceased: 'optionChild'},
                    {coApplicantRelationshipToDeceased: 'optionGrandchild'},
                ],
                index: 1,
                fullName: 'ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXY'
            };
            errors = [];
            [ctx, errors] = CoApplicantName.handlePost(ctx, errors, formdata, session);
            expect(errors).to.deep.equal([
                {
                    field: 'fullName',
                    href: '#fullName',
                    msg: content.errors.fullName.maxLength
                }
            ]);
            done();
        });
    });

    describe('getContextData()', () => {
        it('sets the index when there is a numeric url param', (done) => {
            const req = {
                session: {
                    form: {
                        deceased: {
                            firstName: 'John',
                            lastName: 'Doe'
                        },
                        executors: {
                            list: [
                                {
                                    'firstName': 'Dave',
                                    'lastName': 'Bassett',
                                    'isApplying': true,
                                    'isApplicant': true
                                }
                            ]
                        }
                    }
                },
                params: [1]
            };
            const ctx = CoApplicantName.getContextData(req);

            expect(ctx.index).to.equal(1);
            expect(ctx.deceasedName).to.equal('John Doe');
            done();
        });

        it('recalculates index when there is a * url param', (done) => {
            const req = {
                session: {
                    form: {
                        deceased: {
                            firstName: 'John',
                            lastName: 'Doe'
                        },
                        executors: {
                            list: [
                                {fullName: 'Prince', isApplying: true, isApplicant: false},
                                {fullName: 'Cher', isApplying: true}
                            ]
                        }
                    },
                },
                params: ['*']
            };
            const ctx = CoApplicantName.getContextData(req);

            expect(ctx.index).to.equal(1);
            expect(ctx.deceasedName).to.equal('John Doe');
            done();
        });
    });
});
