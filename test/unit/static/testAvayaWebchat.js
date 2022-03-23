'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const AvayaWebchat = steps.AvayaWebchat;

describe('AvayaWebchat', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = AvayaWebchat.constructor.getUrl();
            expect(url).to.equal('/avaya-webchat');
            done();
        });
    });
});
