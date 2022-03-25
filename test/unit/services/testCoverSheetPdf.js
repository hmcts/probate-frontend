'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const CoverSheetPdf = require('app/services/CoverSheetPdf');
const Pdf = require('app/services/Pdf');
const config = require('config');

let postStub;

describe('CoverSheetPdfService', () => {
    describe('post()', () => {

        afterEach(() => {
            postStub.restore();
        });

        it('should call super.post()', (done) => {
            const endpoint = 'http://localhost';
            const formdata = {
                applicant: {
                    firstName: 'Joe',
                    lastName: 'Bloggs',
                    address: {
                        formattedAddress: '1 Red Road, London, L1 1LL'
                    }
                },
                ccdCase: {
                    id: 'ccd123'
                },
                registry: {
                    address: 'Digital Application, Oxford District Probate Registry, Combined Court Building, St Aldates, Oxford, OX1 1LY'
                }
            };
            const coverSheetPdf = new CoverSheetPdf(endpoint, 'abc123');
            postStub = sinon.stub(Pdf.prototype, 'post');

            const req = {
                session: {
                    form: formdata,
                    language: 'en'
                }
            };

            coverSheetPdf.post(req);

            expect(postStub.calledOnce).to.equal(true);
            expect(postStub.calledWith(
                config.pdf.template.coverSheet,
                {
                    applicantAddress: '1 Red Road, London, L1 1LL',
                    applicantName: 'Joe Bloggs',
                    caseReference: 'ccd123',
                    submitAddress: 'Digital Application, Oxford District Probate Registry, Combined Court Building, St Aldates, Oxford, OX1 1LY',
                    checkListItems: [
                        {'text': 'the original will (by law, we must keep your original will as it becomes a public document)', 'type': 'textOnly'}]
                },
                'Post cover sheet pdf'
            )).to.equal(true);

            postStub.restore();
            done();
        });

        it('should call super.post() and call with relevant checklist items', (done) => {
            const endpoint = 'http://localhost';
            const formdata = {
                applicant: {
                    firstName: 'Joe',
                    lastName: 'Bloggs',
                    address: {
                        formattedAddress: '1 Red Road, London, L1 1LL'
                    },
                    relationshipToDeceased: 'optionChild',
                    spouseNotApplyingReason: 'optionRenouncing'
                },
                ccdCase: {
                    id: 'ccd123'
                },
                registry: {
                    address: 'Digital Application, Oxford District Probate Registry, Combined Court Building, St Aldates, Oxford, OX1 1LY'
                },
                deceased: {
                    maritalStatus: 'optionMarried',
                    anyOtherChildren: 'optionNo'
                },
            };
            const coverSheetPdf = new CoverSheetPdf(endpoint, 'abc123');
            postStub = sinon.stub(Pdf.prototype, 'post');

            const req = {
                session: {
                    form: formdata,
                    language: 'en'
                }
            };

            coverSheetPdf.post(req);

            expect(postStub.calledOnce).to.equal(true);
            expect(postStub.calledWith(
                config.pdf.template.coverSheet,
                {
                    applicantAddress: '1 Red Road, London, L1 1LL',
                    applicantName: 'Joe Bloggs',
                    caseReference: 'ccd123',
                    submitAddress: 'Digital Application, Oxford District Probate Registry, Combined Court Building, St Aldates, Oxford, OX1 1LY',
                    checkListItems: [
                        {text: 'the original will (by law, we must keep your original will as it becomes a public document)', 'type': 'textOnly'},
                        {text: 'renunciation form (opens in a new window)', 'type': 'textWithLink', 'url': 'https://www.gov.uk/government/publications/form-pa15-apply-for-renunciation-will', 'beforeLinkText': 'a ', 'afterLinkText': ' filled in by the spouse or civil partner of the deceased who is permanently giving up the right to make this application for probate'},
                        {text: 'Give up probate administrator rights paper form', type: 'textWithLink', url: config.links.spouseGivingUpAdminRightsPA16Link, beforeLinkText: '', afterLinkText: ' - Form PA16'}
                    ]
                },
                'Post cover sheet pdf'
            )).to.equal(true);

            postStub.restore();
            done();
        });
    });
});
