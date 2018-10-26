const submitData = require('app/components/submit-data');
const formData = require('test/data/complete-form-multipleapplicants');
const initSteps = require('app/core/initSteps');
const assert = require('chai').assert;

describe('submit-data', () => {
    let ctx = {};
    const req = {
        session: {
            form: {}
        },
        query: {}
    };

    const steps = initSteps([__dirname + '/../../app/steps/action/', __dirname + '/../../app/steps/ui/']);

    it('maps forms data', () => {
        const data = formData;
        req.session.form = data;
        const sessionData = steps.PaymentStatus;
        ctx = sessionData.getContextData(req);

        const mappedData = submitData(ctx, data);

        const deceasedOtherNames = {
            'name_0': {
                'firstName': 'new_died_firstname',
                'lastName': 'new_died_lastname'
            }};

        const legalState = {
            'applicant': 'We, Bob Richard Smith of Adam & Eve 81 Petty France London SW1H 9EX and exec_3_new_name of exec_3_address\r\n, make the following statement:',
            'deceased': 'died_firstname died_lastname was born on 1 January 1950 and died on 1 January 2018, domiciled in England and Wales.',
            'deceasedOtherNames': 'They were also known as new_died_firstname new_died_lastname.',
            'executorsApplying': [
                {'name': 'Bob Richard Smith, an executor named in the will or codicils, is applying for probate.',
                    'sign': 'Bob Richard Smith will sign and send to the probate registry what they believe to be the true and original last will and testament of died_firstname died_lastname.'},
                {'name': 'exec_3_new_name , an executor named in the will or codicils as executor_3_name, is applying for probate.',
                    'sign': 'exec_3_new_name will sign a photocopy of what they believe to be the true and original last will and testament of died_firstname died_lastname. Bob Richard Smith will send the signed photocopy to the probate registry.'
                }],
            'deceasedEstateValue': 'The gross value for the estate amounts to &pound;123456 and the net value for the estate amounts to &pound;12345.',
            'deceasedEstateLand': 'To the best of our knowledge, information and belief, there was no land vested in died_firstname died_lastname which was settled previously to the death (and not by the will) of died_firstname died_lastname and which remained settled land notwithstanding such death.',
            'executorsNotApplying': [
                'executor_2_name, an executor named in the will or codicils, is not making this application because they died before died_firstname died_lastname died.',
                'executor_4_name, an executor named in the will or codicils, is not making this application now and gives up the right to do so in the future.'
            ],
            'intro': 'This statement is based on the information Bob Richard Smith has given in their application. It will be stored as a public record.'
        };

        const dec = {
            'confirm': 'We confirm that we will administer the estate of died_firstname died_lastname, according to law. We will:',
            'confirmItem1': 'collect the whole estate',
            'confirmItem2': 'keep full details (an inventory) of the estate',
            'confirmItem3': 'keep a full account of how the estate has been administered',
            'requests': 'If the probate registry (court) asks us to do so, we will:',
            'requestsItem1': 'provide the full details of the estate and how it has been administered',
            'requestsItem2': 'return the grant of probate to the court',
            'understand': 'We understand that:',
            'understandItem1': 'our application will be rejected if we do not answer any questions about the information we have given',
            'understandItem2': 'criminal proceedings for fraud may be brought against us if we are found to have been deliberately untruthful or dishonest',
            'accept': 'I confirm that I will administer the estate of the person who died according to law, and that my application is truthful.',
            'submitWarning': 'Once everyone has agreed the legal statement and made their declaration, this information can&rsquo;t be changed.'
        };

        const execsApplyingArray = [{
            'fullName': 'executor_3_name',
            'isApplying': true,
            'hasOtherName': true,
            'currentName': 'exec_3_new_name ',
            'email': 'haji58@hotmail.co.uk',
            'mobile': '07963723856',
            'address': 'exec_3_address\r\n',
            'freeTextAddress': 'exec_3_address\r\n',
            'inviteId': {},
            'emailSent': true
        }];

        const execsNotApplyingArray = [{
            'fullName': 'executor_2_name',
            'isDead': true,
            'diedBefore': 'Yes',
            'notApplyingReason': 'This executor died (before the person who has died)',
            'notApplyingKey': 'optionDiedBefore',
            'isApplying': false,
            'hasOtherName': false
        },
        {
            'fullName': 'executor_4_name',
            'isDead': false,
            'isApplying': false,
            'hasOtherName': false,
            'notApplyingReason': 'This executor doesn&rsquo;t want to apply now, and gives up the right to do so in the future (this is also known as renunciation, and the executor will need to fill in a form)',
            'notApplyingKey': 'optionRenunciated'
        }
        ];

        const registry = {
            'name': 'Oxford',
            'email': 'oxford@email.com',
            'address': 'Line 1 Ox\nLine 2 Ox\nLine 3 Ox\nPostCode Ox\n',
            'sequenceNumber': 10034
        };

        const payment = {
            'applicationFee': '215',
            'copies': {
                'overseas': {
                    'cost': '0',
                    'number': '0'
                },
                'status': 'success',
                'uk': {
                    'cost': '1.5',
                    'number': '3'
                }
            },
            'paymentId': '1',
            'paymentReference': 'CODE4$$$diedlastname7297$$$CODE5$$$CODE1$CODE2/3',
            'status': 'success',
            'total': '216.50',
            'userId': '999999999',
        };

        assert.nestedPropertyVal(mappedData, 'applicantFirstName', 'Bob Richard');
        assert.nestedPropertyVal(mappedData, 'applicantLastName', 'Smith');
        assert.nestedPropertyVal(mappedData, 'applicantSameWillName', 'No');
        assert.nestedPropertyVal(mappedData, 'applicantAlias', 'Bobby Richard Smith');
        assert.nestedPropertyVal(mappedData, 'applicantAliasReason', 'other');
        assert.nestedPropertyVal(mappedData, 'applicantOtherReason', 'nickname');
        assert.nestedPropertyVal(mappedData, 'applicantAddress', 'Adam & Eve 81 Petty France London SW1H 9EX');
        assert.nestedPropertyVal(mappedData, 'applicantPostcode', 'SW1H 9EX');
        assert.nestedPropertyVal(mappedData, 'applicantPhone', '07934235245');
        assert.nestedPropertyVal(mappedData, 'applicantEmail', 'test@hotmail.com');
        assert.nestedPropertyVal(mappedData, 'applicantIsExecutor', 'Yes');
        assert.nestedPropertyVal(mappedData, 'deceasedFirstname', 'died_firstname');
        assert.nestedPropertyVal(mappedData, 'deceasedSurname', 'died_lastname');
        assert.nestedPropertyVal(mappedData, 'deceasedAliasAssets', 'Yes');
        assert.deepNestedPropertyVal(mappedData, 'deceasedOtherNames', deceasedOtherNames);
        assert.nestedPropertyVal(mappedData, 'deceasedMarriedAfterDateOnWill', 'No');
        assert.nestedPropertyVal(mappedData, 'deceasedAddress', 'Adam & Eve 81 Petty France London SW1H 9EX');
        assert.nestedPropertyVal(mappedData, 'deceasedPostcode', 'SW1H 9EX');
        assert.nestedPropertyVal(mappedData, 'deceasedDod', '1 January 2018');
        assert.nestedPropertyVal(mappedData, 'deceasedDob', '1 January 1950');
        assert.nestedPropertyVal(mappedData, 'deceasedDomicile', 'live (domicile) permanently in England or Wales');
        assert.nestedPropertyVal(mappedData, 'noOfExecutors', 4);
        assert.nestedPropertyVal(mappedData, 'dealingWithEstate', 'Yes');
        assert.nestedPropertyVal(mappedData, 'willLeft', 'Yes');
        assert.nestedPropertyVal(mappedData, 'willOriginal', 'Yes');
        assert.nestedPropertyVal(mappedData, 'willWithCodicils', 'Yes');
        assert.nestedPropertyVal(mappedData, 'willCodicilsNumber', 1);
        assert.nestedPropertyVal(mappedData, 'ihtCompleted', 'Yes');
        assert.nestedPropertyVal(mappedData, 'ihtForm', 'IHT205');
        assert.nestedPropertyVal(mappedData, 'ihtGrossValue', '123456');
        assert.nestedPropertyVal(mappedData, 'ihtNetValue', '12345');
        assert.nestedPropertyVal(mappedData, 'copiesUK', '3');
        assert.nestedPropertyVal(mappedData, 'copiesOverseas', 0);
        assert.nestedPropertyVal(mappedData, 'totalFee', '216.50');
        assert.nestedPropertyVal(mappedData, 'paymentReference', 'CODE4$$$diedlastname7297$$$CODE5$$$CODE1$CODE2/3');
        assert.deepNestedPropertyVal(mappedData, 'legalStatement', legalState);
        assert.deepNestedPropertyVal(mappedData, 'declaration', dec);
        assert.nestedPropertyVal(mappedData, 'payloadVersion', '2.8.2');
        assert.nestedPropertyVal(mappedData, 'noOfApplicants', 2);
        assert.deepNestedPropertyVal(mappedData, 'executorsApplying', execsApplyingArray);
        assert.deepNestedPropertyVal(mappedData, 'executorsNotApplying', execsNotApplyingArray);
        assert.deepNestedPropertyVal(mappedData, 'payment', payment);
        assert.deepNestedPropertyVal(mappedData, 'registry', registry);
        assert.deepNestedPropertyVal(mappedData, 'caseId', 1535395401245028);
        assert.deepNestedPropertyVal(mappedData, 'submissionReference', 97);
    });
});
