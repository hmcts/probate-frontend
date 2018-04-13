const {mapValues, get} = require('lodash'),
      steps = require('app/core/initSteps').steps;
const ExecutorsWrapper = require('app/wrappers/Executors');


const submitData = function (ctx, data) {

    const mappedData = mapValues(dataMap,  path => get(data, path));

    mappedData.copiesUK = get(data, 'copies.uk', 0);

    if (get(data, 'assets.assetsoverseas') === steps.AssetsOverseas.generateContent(ctx).optionNo) {
        mappedData.copiesOverseas = 0;
    }

    const ihtMethod = get(data, 'iht.method');
    if (ihtMethod === steps.IhtMethod.generateContent(ctx).paperOption) {
        mappedData.ihtIdentifier = steps.CopiesOverseas.commonContent().notApplicable;
    } else {
        mappedData.ihtIdentifier = get(data, 'iht.identifier');
        mappedData.ihtForm = 'online';
    }

    const executorsWrapper = new ExecutorsWrapper(data.executors);

    mappedData.noOfApplicants = executorsWrapper.executorsApplying().length;
    mappedData.executorsApplying = executorsWrapper.executorsApplying(true);
    mappedData.executorsNotApplying = executorsWrapper.executorsNotApplying(true);

    return mappedData;
};

const dataMap = {
    applicantFirstName: 'applicant.firstName',
    applicantLastName: 'applicant.lastName',
    applicantAddress: 'applicant.address',
    applicantPostcode: 'applicant.postcode',
    applicantPhone: 'applicant.phoneNumber',
    applicantEmail: 'applicant.email',
    applicantIsExecutor: 'applicant.executor',
    deceasedFirstname: 'deceased.firstName',
    deceasedSurname: 'deceased.lastName',
    deceasedAliasAssets: 'deceased.alias',
    deceasedOtherNames: 'deceased.otherNames',
    deceasedMarriedAfterDateOnWill: 'deceased.married',
    deceasedAddress: 'deceased.address',
    deceasedPostcode: 'deceased.postcode',
    deceasedDod: 'deceased.dod_formattedDate',
    deceasedDob: 'deceased.dob_formattedDate',
    deceasedDomicile: 'deceased.domicile',
    noOfExecutors: 'executors.executorsNumber',
    dealingWithEstate: 'executors.otherExecutorsApplying',
    willLeft: 'will.left',
    willOriginal: 'will.original',
    willWithDate: 'will.isWillDate',
    willWithCodicils: 'will.codicils',
    willCodicilsNumber: 'will.codicilsNumber',
    willCodicilsWithDate: 'will.isCodicilsDate',
    willCodicilsDate: 'will.codicilsDate_formattedDate',
    willDate: 'will.willDate_formattedDate',
    ihtCompleted: 'iht.completed',
    ihtForm: 'iht.form',
    ihtIdentifier: 'iht.identifier',
    ihtGrossValue: 'iht.grossValue',
    ihtNetValue: 'iht.netValue',
    copiesUK: 'copies.uk',
    copiesOverseas: 'copies.overseas',
    totalFee: 'payment.total',
    paymentReference: 'payment.paymentReference',
    legalStatement: 'declaration.legalStatement',
    declaration: 'declaration.declaration',
    payloadVersion: 'payloadVersion'
};

module.exports = submitData;
