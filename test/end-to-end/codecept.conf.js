const testConfig = require('test/config.js');

exports.config = {
    'tests': './paths/**/*.js',
    'output': './output',
    'helpers': {
        'Puppeteer': {
            'url': testConfig.TestFrontendUrl || 'https://localhost:3000',
            'waitForTimeout': 10000,
            'show': true,
            waitForAction: 2000,
            'switches': {
                'ignore-certificate-errors': true
            }
        },
        'PuppeteerHelper': {
            'require': './helpers/PuppeteerHelper.js'
        }
    },
    'include': {
        'I': './pages/steps.js'
    },
    'mocha': {
        'reporterOptions': {
            'reportDir': process.env.E2E_OUTPUT_DIR || './output',
            'reportName': 'index',
            'inlineAssets': true
        }
    },
    'name': 'Codecept Tests'
};
