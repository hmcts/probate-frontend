'use strict';

const ShutterPage = require('app/steps/ui/shutterpage');
const chai = require('chai');
const expect = chai.expect;

describe('ShutterPage.js', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = ShutterPage.getUrl();
            expect(url).to.equal('/shutter-page');
            done();
        });
    });
});
