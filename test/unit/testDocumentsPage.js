'use strict';
const initSteps = require('app/core/initSteps');
const {assert, expect} = require('chai');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);

describe('Documents', () => {
    const Documents = steps.Documents;

    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = Documents.constructor.getUrl();
            expect(url).to.equal('/documents');
            done();
        });
    });

    describe('action', () => {
        it('cleans up context', () => {
            let ctx = {
                registryAddress: 'test',
                hasCodicils: true,
                codicilsNumber: '4',
                hasMultipleApplicants: true,
                hasRenunciated: false,
                is205: true,
                executorsNameChangedByDeedPollList: [],
                ccdReferenceNumber: '1234-1235-1236-1237',
                isDocumentUploadToggleEnabled: true
            };
            [ctx] = Documents.action(ctx);
            assert.deepEqual(ctx, {});
        });
    });
});
