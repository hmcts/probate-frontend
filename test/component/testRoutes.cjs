'use strict';

const app = require('app');
const request = require('supertest');

describe('routes', () => {
    describe('/inviteIdList', () => {

        it('should receive 200 response', (done) => {
            const server = app.init();
            const agent = request.agent(server.app);
            agent.get('/inviteIdList')
                .expect(200)
                .end((err) => {
                    server.http.close();
                    if (err) {
                        throw err;
                    }
                    done();
                });
        });
    });
});
