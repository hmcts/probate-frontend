const {expect} = require('chai');

describe('healthcheck', () => {

    it('test should return status up', (done) => {

        const server = require('app').init();

        const request = require('supertest');
        const agent = request.agent(server.app);

        agent.get('/health')
            .expect(200)
            .end((err, res) => {
                server.http.close();
                if (err) {
                    throw err;
                }

                const text = res.text.toLowerCase();
                expect(text).to.contain('"status":"up"');
                done();
            });
    });
});
