'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const journeyCheck = require('app/middleware/journeyCheck');
const caseTypes = require('app/utils/CaseTypes');

describe('Security component', () => {
    it('should load the next page in the journey if case types match', () => {
        const req = {
            session: {
                form: {
                    type: caseTypes.GOP
                }
            }
        };
        const res = {};
        const next = sinon.spy();

        journeyCheck(caseTypes.GOP, req, res, next);

        expect(next.calledOnce).to.equal(true);
    });

    it('should redirect to task list if case types do not match', (done) => {
        const req = {
            session: {
                form: {
                    type: caseTypes.INTESTACY
                }
            }
        };
        const res = {
            redirect: sinon.spy(),
        };
        const next = sinon.spy();

        journeyCheck(caseTypes.GOP, req, res, next);

        sinon.assert.calledOnce(res.redirect);
        expect(res.redirect).to.have.been.calledWith('/task-list');

        done();
    });
});
