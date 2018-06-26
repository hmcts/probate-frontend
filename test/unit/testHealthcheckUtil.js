'use strict';

const Healthcheck = require('app/utils/Healthcheck');
const config = require('app/config');
const chai = require('chai');
const expect = chai.expect;
let businessStub;
let submitStub;
let persistenceStub;
const startStubs = () => {
    businessStub = require('test/service-stubs/business');
    submitStub = require('test/service-stubs/submit');
    persistenceStub = require('test/service-stubs/persistence');
};
const stopStubs = () => {
    businessStub.close();
    submitStub.close();
    persistenceStub.close();
    delete require.cache[require.resolve('test/service-stubs/business')];
    delete require.cache[require.resolve('test/service-stubs/submit')];
    delete require.cache[require.resolve('test/service-stubs/persistence')];
};

describe('Healthcheck.js', () => {
    describe('formatUrl()', () => {
        it('should return a correctly formatted health url', (done) => {
            const healthcheck = new Healthcheck();
            const url = healthcheck.formatUrl(config.endpoints.health)(config.services.validation.url);
            expect(url).to.equal('http://localhost:8080/health');
            done();
        });

        it('should return a correctly formatted info url', (done) => {
            const healthcheck = new Healthcheck();
            const url = healthcheck.formatUrl(config.endpoints.info)(config.services.validation.url);
            expect(url).to.equal('http://localhost:8080/info');
            done();
        });
    });

    describe('createServicesList()', () => {
        it('should return a list of services', (done) => {
            const healthcheck = new Healthcheck();
            const url = healthcheck.formatUrl(config.endpoints.health);
            const services = healthcheck.createServicesList(url, config.services);
            expect(services).to.deep.equal([
                {name: 'Validation Service', url: 'http://localhost:8080/health'},
                {name: 'Submit Service', url: 'http://localhost:8181/health'},
                {name: 'Persistence Service', url: 'http://localhost:8282/health'}
            ]);
            done();
        });
    });

    describe('createPromisesList()', () => {
        describe('should return a list of health statuses for each of the backend services', () => {
            describe('with a status of UP', () => {
                before(() => startStubs());

                it('when the backend services /health endpoint is up', (done) => {
                    const healthcheck = new Healthcheck();
                    const url = healthcheck.formatUrl(config.endpoints.health);
                    const services = healthcheck.createServicesList(url, config.services);
                    const promises = healthcheck.createPromisesList(services, healthcheck.health);
                    Promise.all(promises).then((data) => {
                        expect(data).to.deep.equal([
                            {name: 'Validation Service', status: 'UP'},
                            {name: 'Submit Service', status: 'UP'},
                            {name: 'Persistence Service', status: 'UP'}
                        ]);
                        done();
                    });
                });

                it('when the backend services /info endpoint is up', (done) => {
                    const healthcheck = new Healthcheck();
                    const url = healthcheck.formatUrl(config.endpoints.info);
                    const services = healthcheck.createServicesList(url, config.services);
                    const promises = healthcheck.createPromisesList(services, healthcheck.info);
                    Promise.all(promises).then((data) => {
                        expect(data).to.deep.equal([
                            {gitCommitId: 'e210e75b38c6b8da03551b9f83fd909fe80832e1'},
                            {gitCommitId: 'e210e75b38c6b8da03551b9f83fd909fe80832e2'},
                            {gitCommitId: 'e210e75b38c6b8da03551b9f83fd909fe80832e3'}
                        ]);
                        done();
                    });
                });

                after(() => stopStubs());
            });

            it('with a status of DOWN when the backend services are down', (done) => {
                const healthcheck = new Healthcheck();
                const url = healthcheck.formatUrl(config.endpoints.health);
                const services = healthcheck.createServicesList(url, config.services);
                const promises = healthcheck.createPromisesList(services, healthcheck.health);
                Promise.all(promises).then((data) => {
                    expect(data).to.deep.equal([{
                        name: 'Validation Service',
                        status: 'DOWN',
                        error: 'Error: FetchError: request to http://localhost:8080/health failed, reason: connect ECONNREFUSED 127.0.0.1:8080'
                    }, {
                        name: 'Submit Service',
                        status: 'DOWN',
                        error: 'Error: FetchError: request to http://localhost:8181/health failed, reason: connect ECONNREFUSED 127.0.0.1:8181'
                    }, {
                        name: 'Persistence Service',
                        status: 'DOWN',
                        error: 'Error: FetchError: request to http://localhost:8282/health failed, reason: connect ECONNREFUSED 127.0.0.1:8282'
                    }]);
                    done();
                });
            });
        });
    });

    describe('health()', () => {
        it('should return the service name and status when there is no error', (done) => {
            const healthcheck = new Healthcheck();
            const service = {name: 'Validation Service'};
            const json = {status: 'UP'};
            const data = healthcheck.health({service: service, json: json});
            expect(data).to.deep.equal({name: service.name, status: json.status});
            done();
        });

        it('should return the service name, status and error when there is an error', (done) => {
            const healthcheck = new Healthcheck();
            const service = {name: 'Validation Service'};
            const err = {error: 'An internal server error occurred'};
            const data = healthcheck.health({err: err, service: service});
            expect(data).to.deep.equal({name: service.name, status: 'DOWN', error: err.toString()});
            done();
        });
    });

    describe('info()', () => {
        it('should return the git commit id when there is no error', (done) => {
            const healthcheck = new Healthcheck();
            const json = {git: {commit: {id: 'e210e75b38c6b8da03551b9f83fd909fe80832e1'}}};
            const data = healthcheck.info({json: json});
            expect(data).to.deep.equal({gitCommitId: json.git.commit.id});
            done();
        });

        it('should return the error when there is an error', (done) => {
            const healthcheck = new Healthcheck();
            const err = {error: 'An internal server error occurred'};
            const data = healthcheck.info({err: err});
            expect(data).to.deep.equal({gitCommitId: err.toString()});
            done();
        });
    });

    describe('getDownstream()', () => {
        before(() => startStubs());

        it('should return the correct downstream data', (done) => {
            const healthcheck = new Healthcheck();
            healthcheck.getDownstream(healthcheck.health, downstream => {
                expect(downstream).to.deep.equal([
                    {name: 'Validation Service', status: 'UP'},
                    {name: 'Submit Service', status: 'UP'},
                    {name: 'Persistence Service', status: 'UP'}
                ]);
                done();
            });
        });

        after(() => stopStubs());
    });

    describe('status()', () => {
        it('should return UP when all the downstream services are up', (done) => {
            const healthcheck = new Healthcheck();
            const status = healthcheck.status([{status: 'UP'}, {status: 'UP'}]);
            expect(status).to.equal('UP');
            done();
        });

        it('should return DOWN when any of the downstream services are down', (done) => {
            const healthcheck = new Healthcheck();
            const status = healthcheck.status([{status: 'DOWN'}, {status: 'UP'}]);
            expect(status).to.equal('DOWN');
            done();
        });
    });

    describe('mergeInfoAndHealthData()', () => {
        it('should return a list of merged health and info data', (done) => {
            const healthcheck = new Healthcheck();
            const healthDownstream = [
                {name: 'Validation Service', status: 'UP'},
                {name: 'Submit Service', status: 'UP'},
                {name: 'Persistence Service', status: 'UP'}
            ];
            const infoDownstream = [
                {gitCommitId: 'e210e75b38c6b8da03551b9f83fd909fe80832e1'},
                {gitCommitId: 'e210e75b38c6b8da03551b9f83fd909fe80832e2'},
                {gitCommitId: 'e210e75b38c6b8da03551b9f83fd909fe80832e3'}
            ];
            const mergedData = healthcheck.mergeInfoAndHealthData(healthDownstream, infoDownstream);
            expect(mergedData).to.deep.equal([{
                    name: 'Validation Service',
                    status: 'UP',
                    gitCommitId: 'e210e75b38c6b8da03551b9f83fd909fe80832e1'
                }, {
                    name: 'Submit Service',
                    status: 'UP',
                    gitCommitId: 'e210e75b38c6b8da03551b9f83fd909fe80832e2'
                }, {
                    name: 'Persistence Service',
                    status: 'UP',
                    gitCommitId: 'e210e75b38c6b8da03551b9f83fd909fe80832e3'
                }]);
            done();
        });
    });
});
