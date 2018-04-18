const taskListContent = require('app/resources/en/translation/tasklist.json');
const previousPage = require('app/steps/ui/will/left/index');

const commonContent = require('app/resources/en/translation/common.json');

Feature('Back button');

Scenario.skip('Back button redirects to the previous page', function* (I) {
    I.startApplication();
    I.selectATask(taskListContent.taskNotStarted);
    I.selectPersonWhoDiedLeftAWill();
    I.click(commonContent.back);

    I.seeCurrentUrlEquals(previousPage.getUrl()+ '?source=back');
});
