const initSteps = require('app/core/initSteps');
const {expect} = require('chai');

describe('StopPage unit tests', () => {
    const req = {
        session: {
            form: {}
        },
        params: {0: 'noWill'},
        query: {}
    };
    const steps = initSteps([__dirname + '/../../app/steps/action/', __dirname + '/../../app/steps/ui/']);

    describe('getUrl()', () => {
        it('should return correct url', (done) => {
            const stopPage = steps.StopPage;
            const url = stopPage.constructor.getUrl();
            expect(url).to.include('/stop-page');
            done();
        });

        it('should return url with * when no index', (done) => {
            const stopPage = steps.StopPage;
            const url = stopPage.constructor.getUrl();
            expect(url).to.equal('/stop-page/*');
            done();
        });

        it('should return url with index when no index', (done) => {
            const stopPage = steps.StopPage;
            const url = stopPage.constructor.getUrl('noWill');
            expect(url).to.equal('/stop-page/noWill');
            done();
        });
    });

    describe('getContextData()', () => {
        it('should return valid ctx', (done) => {
            const stopPage = steps.StopPage;
            const ctx = stopPage.getContextData(req);
            expect(ctx.stopReason).to.equal('noWill');
            done();
        });
    });
});
