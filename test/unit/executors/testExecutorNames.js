'use strict';
const initSteps = require('app/core/initSteps');
const content = require("../../../app/resources/en/translation/executors/names.json");
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const ExecutorsNames = steps.ExecutorsNames;

describe('ExecutorsNames', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = ExecutorsNames.constructor.getUrl();
            expect(url).to.equal('/executors-names');
            done();
        });
    });

    describe('getContextData()', () => {
        let ctx;
        let req;

        beforeEach(() => {
            req = {
                session: {
                    form: {
                        applicant: {
                            firstName: 'Steve',
                            lastName: 'Madden'
                        }
                    }
                }
            };
        });

        it('should return the lead applicant first name and last name in the context for applicantCurrentName', (done) => {
            ctx = ExecutorsNames.getContextData(req);
            expect(ctx.applicantCurrentName).to.deep.equal('Steve Madden');
            done();
        });

        it('should return the lead applicant alias in the context for applicantCurrentName', (done) => {
            req.session.form.applicant.alias = 'Bob Alias';
            ctx = ExecutorsNames.getContextData(req);
            expect(ctx.applicantCurrentName).to.deep.equal('Bob Alias');
            done();
        });

        it('should return an empty string in the context for applicantCurrentName when no lead applicant name provided', (done) => {
            delete req.session.form.applicant;
            ctx = ExecutorsNames.getContextData(req);
            expect(ctx.applicantCurrentName).to.deep.equal('');
            done();
        });
    });
    describe('handlePost', () => {
        it('should initialize ctx.list if it does not exist', () => {
            const ctx = {};
            const errors = [];
            ExecutorsNames.handlePost(ctx, errors);
            expect(ctx.list).to.deep.equal([]);
        });

        it('should add executorName to ctx.list if executorName exists and is not empty', () => {
            let ctx = {executorName: 'John Doe'};
            let errors = [];
            [ctx, errors] = ExecutorsNames.handlePost(ctx, errors, {}, {language: 'en'});
            expect(errors).to.deep.equal([]);
            expect(ctx.list).to.deep.equal([{fullName: 'John Doe'}]);
        });
        it('should return the executorName errors correctly', (done) => {
            let ctx = {executorName: 'http://executorName'};
            let errors = [];
            [ctx, errors] = ExecutorsNames.handlePost(ctx, errors, {}, {language: 'en'});
            expect(ctx).to.deep.equal({
                executorName: 'http://executorName',
                list: []
            });
            expect(errors).to.deep.equal([
                {
                    field: 'executorName',
                    href: '#executorName',
                    msg: content.errors.executorName.invalid
                }
            ]);
            done();
        });
    });
    describe('action', () => {
        it('should delete applicantCurrentName and executorName from ctx', () => {
            const ctx = {applicantCurrentName: 'John Doe', executorName: 'Jane Doe'};
            const formdata = {};
            const result = ExecutorsNames.action(ctx, formdata);
            expect(result).to.deep.equal([{}, formdata]);
        });
    });
});
