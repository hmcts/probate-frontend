const DetectDataChange = require('app/wrappers/DetectDataChange');
const chai = require('chai');
const expect = chai.expect;

describe('DetectDataChange.js', () => {
    describe('isNotEqual()', () => {
        describe('should return true', () => {
            it('when the values are not equal and the same type', (done) => {
                const detectDataChange = new DetectDataChange();
                expect(detectDataChange.isNotEqual('30', '31')).to.equal(true);
                done();
            });

            it('when the values are not equal and a different type', (done) => {
                const detectDataChange = new DetectDataChange();
                expect(detectDataChange.isNotEqual('30', 31)).to.equal(true);
                done();
            });
        });

        describe('should return false', () => {
            it('when the values are equal and the same type', (done) => {
                const detectDataChange = new DetectDataChange();
                expect(detectDataChange.isNotEqual('30', '30')).to.equal(false);
                done();
            });

            it('when the values are equal and a different type', (done) => {
                const detectDataChange = new DetectDataChange();
                expect(detectDataChange.isNotEqual('30', 30)).to.equal(false);
                done();
            });
        });
    });

    describe('sectionDataKey()', () => {
        it('should return address when paramsKey is postcodeAddress', (done) => {
            const detectDataChange = new DetectDataChange();
            expect(detectDataChange.sectionDataKey('postcodeAddress')).to.equal('address');
            done();
        });

        it('should return address when paramsKey is freeTextAddress', (done) => {
            const detectDataChange = new DetectDataChange();
            expect(detectDataChange.sectionDataKey('freeTextAddress')).to.equal('address');
            done();
        });

        it('should return the paramsKey when paramsKey is not postcodeAddress or freeTextAddress', (done) => {
            const detectDataChange = new DetectDataChange();
            expect(detectDataChange.sectionDataKey('dob_day')).to.equal('dob_day');
            done();
        });
    });

    describe('hasChanged()', () => {
        describe('should return true', () => {
            it('when the values are not equal', (done) => {
                const params = {
                    dob_day: '30'
                };
                const sectionData = {
                    dob_day: '31'
                };
                const detectDataChange = new DetectDataChange();
                expect(detectDataChange.hasChanged(params, sectionData)).to.equal(true);
                done();
            });

            it('when freeTextAddress is set', (done) => {
                const params = {
                    freeTextAddress: '1 Silver Street London L23 3LP'
                };
                const sectionData = {
                    address: '11 Silver Street London L23 3LP'
                };
                const detectDataChange = new DetectDataChange();
                expect(detectDataChange.hasChanged(params, sectionData)).to.equal(true);
                done();
            });

            it('when postcodeAddress is set', (done) => {
                const params = {
                    postcodeAddress: '1 Silver Street London L23 3LP'
                };
                const sectionData = {
                    address: '11 Silver Street London L23 3LP'
                };
                const detectDataChange = new DetectDataChange();
                expect(detectDataChange.hasChanged(params, sectionData)).to.equal(true);
                done();
            });
        });

        it('should return false when the values are equal', (done) => {
            const params = {
                dob_day: '30'
            };
            const sectionData = {
                dob_day: '30'
            };
            const detectDataChange = new DetectDataChange();
            expect(detectDataChange.hasChanged(params, sectionData)).to.equal(false);
            done();
        });
    });

    describe('hasDataChanged()', () => {
        let ctx;
        let req;
        let step;
        beforeEach(() => {
            ctx = {
                executorsNumber: 1
            };
            req = {
                session: {
                    form: {
                        executors: {
                            list: [{
                                isApplicant: true,
                                isApplying: true
                            }, {
                                isApplying: true,
                                fullName: 'James Miller',
                                address: '11 Red Street, London, L21 1LL',
                                email: 'jamesmiller@example.com'
                            }, {
                                isApplying: true,
                                fullName: 'Ed Brown',
                                address: '20 Green Street, London, L12 9LN'
                            }]
                        },
                        iht: {
                            identifier: 'abc123'
                        },
                        declaration: {}
                    },
                    haveAllExecutorsDeclared: 'false'
                },
                params: {},
                body: {
                    identifier: 'ref001'
                }
            };
            step = {
                section: 'iht',
                schemaFile: {
                    id: 'iht-identifier'
                }
            };
        });

        describe('should return true', () => {
            it('when the values are not equal from a non-executors section', (done) => {
                const detectDataChange = new DetectDataChange();
                expect(detectDataChange.hasDataChanged(ctx, req, step)).to.equal(true);
                done();
            });

            it('when the executors address is not equal and req.params[0] is set', (done) => {
                req.params[0] = 1;
                req.body.freeTextAddress = ['1 Red Street, London, L21 1LL'];
                step.section = 'executors';
                const detectDataChange = new DetectDataChange();
                expect(detectDataChange.hasDataChanged(ctx, req, step)).to.equal(true);
                done();
            });

            it('when the executors address is not equal and indexPosition is set', (done) => {
                req.session.indexPosition = 1;
                req.params[0] = '*';
                req.body.freeTextAddress = ['1 Red Street, London, L21 1LL'];
                step.section = 'executors';
                const detectDataChange = new DetectDataChange();
                expect(detectDataChange.hasDataChanged(ctx, req, step)).to.equal(true);
                done();
            });

            it('when the executors email is not equal and req.params[0] is set', (done) => {
                req.params[0] = 1;
                req.body.email = ['jmiller@example.com'];
                step.section = 'executors';
                const detectDataChange = new DetectDataChange();
                expect(detectDataChange.hasDataChanged(ctx, req, step)).to.equal(true);
                done();
            });

            it('when the executors names are not equal', (done) => {
                req.body.executorName = ['Joe Smith', 'Ed Brown'];
                const detectDataChange = new DetectDataChange();
                expect(detectDataChange.hasDataChanged(ctx, req, step)).to.equal(true);
                done();
            });

            it('when multiple applicants are changed to a single applicant', (done) => {
                delete req.session.haveAllExecutorsDeclared;
                req.session.form.executors.executorsNumber = 3;
                req.session.form.executors.otherExecutorsApplying = 'true';
                req.body = {executorsNumber: 1};
                step.section = 'executors';
                const detectDataChange = new DetectDataChange();
                expect(detectDataChange.hasDataChanged(ctx, req, step)).to.equal(true);
                done();
            });

            it('when executors applying tick boxes have been changed', (done) => {
                req.session.form.executors.list[1].isApplying = false;
                step.section = 'executors';
                req.body = {executorsApplying: ['James Miller', 'Ed Brown']};
                req.session.haveAllExecutorsDeclared = 'false';
                const detectDataChange = new DetectDataChange();
                expect(detectDataChange.hasDataChanged(ctx, req, step)).to.equal(true);
                done();
            });

            it('when executors whoDied tick boxes have been changed', (done) => {
                step.section = 'executors';
                req.body = {executorsWhoDied: ['James Miller']};
                req.session.haveAllExecutorsDeclared = 'false';
                const detectDataChange = new DetectDataChange();
                expect(detectDataChange.hasDataChanged(ctx, req, step)).to.equal(true);
                done();
            });
        });

        describe('should return false', () => {
            it('when the values are equal', (done) => {
                req.body.identifier = 'abc123';
                const detectDataChange = new DetectDataChange();
                expect(detectDataChange.hasDataChanged(ctx, req, step)).to.equal(false);
                done();
            });

            it('when there is a single applicant', (done) => {
                req.session.form.executors.list = [req.session.form.executors.list.shift()];
                const detectDataChange = new DetectDataChange();
                expect(detectDataChange.hasDataChanged(ctx, req, step)).to.equal(false);
                done();
            });

            it('when all executors have declared', (done) => {
                req.session.haveAllExecutorsDeclared = 'true';
                const detectDataChange = new DetectDataChange();
                expect(detectDataChange.hasDataChanged(ctx, req, step)).to.equal(false);
                done();
            });

            it('when executors applying tick boxes have not been changed', (done) => {
                step.section = 'executors';
                req.body.executorsApplying = ['James Miller', 'Ed Brown'];
                const detectDataChange = new DetectDataChange();
                expect(detectDataChange.hasDataChanged(ctx, req, step)).to.equal(false);
                done();
            });

            it('when executors whoDied tick boxes have not been changed', (done) => {
                req.session.form.executors.list[1].isDead = true;
                req.session.form.executors.list[1].isApplying = false;
                req.session.form.executors.list[2].isDead = false;
                req.session.form.executors.list[2].isApplying = true;
                step.section = 'executors';
                req.body = {executorsWhoDied: ['James Miller']};
                req.session.haveAllExecutorsDeclared = 'false';
                const detectDataChange = new DetectDataChange();
                expect(detectDataChange.hasDataChanged(ctx, req, step)).to.equal(false);
                done();
            });

            it('on the /executors-invite page', (done) => {
                step.schemaFile.id = 'executors-invite';
                const detectDataChange = new DetectDataChange();
                expect(detectDataChange.hasDataChanged(ctx, req, step)).to.equal(false);
                done();
            });

            it('when the formdata does not exist', (done) => {
                delete req.session.form.executors;
                const detectDataChange = new DetectDataChange();
                expect(detectDataChange.hasDataChanged(ctx, req, step)).to.equal(false);
                done();
            });

            it('when a data change has already been flagged', (done) => {
                req.session.form.declaration.hasDataChanged = true;
                const detectDataChange = new DetectDataChange();
                expect(detectDataChange.hasDataChanged(ctx, req, step)).to.equal(false);
                done();
            });

            it('when step.schemaFile is undefined', (done) => {
                delete step.schemaFile;
                const detectDataChange = new DetectDataChange();
                expect(detectDataChange.hasDataChanged(ctx, req, step)).to.equal(false);
                done();
            });
        });
    });
});
