const testConfig = require('test/config.js');

exports.config = {
    'tests': './paths/**/MultipleExecutorsPath.js',
    'output': './output',
    'helpers': {
        'Nightmare': {
            'url': testConfig.TestFrontendUrl || 'https://www-test.probate.reform.hmcts.net',
            'waitForTimeout': 10000,
            'show': true,
            waitForAction: 2000,
            'switches': {
                'ignore-certificate-errors': true
            }
        }
        ,
        'NightmareHelper': {
            'require': './helpers/NightmareHelper.js'
        }
    },
    'include': {
        'I': './pages/steps.js'
    },
    'bootstrap': 'test/service-stubs/persistence',
    'mocha': {
        'reporterOptions': {
            'reportDir': process.env.E2E_OUTPUT_DIR || './output',
            'reportName': 'index',
            'inlineAssets': true
        }
    },
    'name': 'Codecept Tests'
};

