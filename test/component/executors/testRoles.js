const initSteps = require('app/core/initSteps'),
    assert = require('chai').assert,
    TestWrapper = require('test/util/TestWrapper'),
    ExecutorNotified = require('app/steps/ui/executors/notified/index'),
    DeceasedName = require('app/steps/ui/deceased/name/index'),
    executorRolesContent = require('app/resources/en/translation/executors/executorcontent');

describe('executor-roles', () => {
    const expectedNextUrlForDeceasedName = DeceasedName.getUrl();
    const expectedNextUrlForExecNotified = ExecutorNotified.getUrl(1);

    const steps = initSteps([__dirname + '/../../../app/steps/action/', __dirname + '/../../../app/steps/ui']);

    const reasons = {
        'optionPowerReserved': 'This executor doesn&rsquo;t want to apply now, but may do in the future (this is also known as power reserved)',
        'optionRenunciated': 'This executor doesn&rsquo;t want to apply now, and gives up the right to do so in the future (this is also known as renunciation, and the executor will need to fill in a form)'
    }
    let testWrapper, sessionData;

    beforeEach(() => {
        testWrapper = new TestWrapper('ExecutorRoles');
        sessionData = {
            'applicant': {
                'firstName': 'john', 'lastName': 'theapplicant'
            },
            'executors': {
                'executorsNumber': 2,
                'list': [
                    {'firstName': 'john', 'lastName': 'theapplicant', 'isApplying': 'Yes', 'isApplicant': true},
                    {'fullName': 'Mana Manah', 'isApplying': 'No', 'isDead': false},
                    {'fullName': 'Mee Mee', 'isApplying': 'No', 'isDead': true},
                    {'fullName': 'Boo Boo', 'isApplying': 'No'}

                ]
            }
        };
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {

        it('test correct content is loaded on executor applying page', (done) => {

            testWrapper.agent.post('/prepare-session/form')
                    .send(sessionData)
                    .end(() => {

                const contentData = {executorFullName: 'Mana Manah'};

                testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl(1);

                testWrapper.testContent(done, [], contentData);
            });
        });

        it('test schema validation when executor is not applying', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                    .send(sessionData)
                    .end(() => {
                const errorsToTest = ['notApplyingReason'];
                const data = {
                  notApplyingReason: null
                };
                testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl(1);

                testWrapper.testErrors(done, data, 'required', errorsToTest);
            });
        });

        it(`test it redirects to notified page: ${expectedNextUrlForExecNotified}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                    .send(sessionData)
                    .end(() => {
                const data = {
                    notApplyingReason: executorRolesContent.optionPowerReserved
                };
                testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl(1);
                testWrapper.testRedirect(done, data, expectedNextUrlForExecNotified);
            });
        });

      it(`test it redirects to deceased name page: ${expectedNextUrlForDeceasedName}`, (done) => {
        testWrapper.agent.post('/prepare-session/form')
              .send(sessionData)
              .end(() => {
                const data = {
                  notApplyingReason: executorRolesContent.optionRenunciated
                };
                testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl(2);
                testWrapper.testRedirect(done, data, expectedNextUrlForDeceasedName);
          });
      });

    });

  describe('handlePost', function () {
    it('Adds the keys to the context', function () {

      const ExecutorRoles = steps.ExecutorRoles;

      let ctx =
      {
        'list': [{
          'lastName': 'the',
          'firstName': 'applicant',
          'isApplying': 'Yes',
          'isApplicant': true
        }, {
          'fullName': 'another executor',
          'isDead': false
        }],
        'index': 1,
        'isApplying': 'No',
        'notApplyingReason': reasons.optionRenunciated
      };

      [ctx] = ExecutorRoles.handlePost(ctx).next().value;
      assert.containsAllKeys(ctx.list[1], ['isApplying', 'notApplyingReason', 'notApplyingKey']);
    });

    it('Gets the reason key from the json and adds it to the context', function () {

      const ExecutorRoles = steps.ExecutorRoles;
      let ctx =
      {
        'list': [{
          'lastName': 'the',
          'firstName': 'applicant',
          'isApplying': 'Yes',
          'isApplicant': true
        }, {
          'fullName': 'another executor',
          'isDead': false
        }],
        'index': 1,
        'isApplying': 'No',
        'notApplyingReason': reasons.optionRenunciated
      };

      Object.keys(reasons)
        .forEach(
          function (key) {
            ctx.notApplyingReason = reasons[key];
            [ctx] = ExecutorRoles.handlePost(ctx).next().value;
            assert.exists(ctx.list[1].notApplyingKey, 'key not found - this key is needed for CCD data');
            assert(ctx.list[1].notApplyingKey === key, ctx.list[1].notApplyingKey + ' is unrecognised');
          }
        );
    });

  });


});
