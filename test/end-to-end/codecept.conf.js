const testConfig = require('test/config.js');

exports.config = {
    'tests': './paths/**/*.js',
    'output': './output',
    'helpers': {
        'Puppeteer': {
            'url': testConfig.TestE2EFrontendUrl || 'http://localhost:3000',
            'waitForTimeout': 60000,
            waitForAction: 7000,
            'show': false,
            'chrome': {
                'ignoreHTTPSErrors': true,
                'ignore-certificate-errors': true,
                args: [
                    '--no-sandbox',
                    '--proxy-server=proxyout.reform.hmcts.net:8080',
                    '--proxy-bypass-list=*beta*LB.reform.hmcts.net'
                ]
            },
        },
        'PuppeteerHelper': {
            'require': './helpers/PuppeteerHelper.js'
        },
        'JSWaitHelper': {
            'require': './helpers/JSWaitHelper.js'
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
