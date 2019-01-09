'use strict';

/* eslint no-console: 0 */

const path = require('path');
const pact = require('@pact-foundation/pact-node');

const opts = {
    pactFilesOrDirs: [path.resolve(process.cwd(), '../../../pacts')],
    pactBroker: 'http://localhost:80',
    consumerVersion: '1.0.0'
};
pact.publishPacts(opts)
    .then(() => {
        console.log('Pact contract publishing complete!');
    })
    .catch(e => {
        console.log('Pact contract publishing failed: ', e);
    });
