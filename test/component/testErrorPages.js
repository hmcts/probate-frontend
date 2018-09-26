'use strict';

const {expect} = require('chai');

describe('error-pages', () => {
    it('test 404', (done) => {
        const request = require('supertest');
        const server = new (require ('app').init)();
        const agent = request.agent(server.app);
        agent.get('/wibble')
            .expect('Content-type', /html/)
            .expect(404)
            .end((err, res) => {
                server.http.close();
                if (err) {
                    done(err);
                } else {
                    const text = res.text.toLowerCase();
                    expect(text).to.contain('page not found');
                    done();
                }
            });
    }).timeout(5000);

    it('test 500', (done) => {
        const request = require('supertest');
        const routes = require('app/routes');
        routes.get('/throwError', function () {
            throw new Error('Test error');
        });
        const server = new (require ('app').init)();

        const agent = request.agent(server.app);
        agent.get('/throwError')
            .expect('Content-type', /html/)
            .expect(500)
            .end((err, res) => {
                server.http.close();
                if (err) {
                    done(err);
                } else {
                    const text = res.text.toLowerCase();
                    expect(text).to.contain('sorry, we&rsquo;re having technical problems');
                    done();
                }
            });
    }).timeout(5000);
});
