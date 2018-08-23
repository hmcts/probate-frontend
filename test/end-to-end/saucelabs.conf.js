const supportedBrowsers = require('../crossbrowser/supportedBrowsers.js');

const browser = requiredValue(process.env.SAUCELABS_BROWSER, 'SAUCELABS_BROWSER');
const tunnelName = process.env.TUNNEL_IDENTIFIER || '';


const setupConfig = {
    'tests': './paths/*.js',
    'output': './output',
    'timeout': 20000,
    'helpers': {
        WebDriverIO: {
            url: process.env.TEST_URL || 'https://localhost:3000',
            browser: supportedBrowsers[browser].browserName,
            waitforTimeout: 60000,
            cssSelectorsEnabled: 'true',
            windowSize: '1600x900',
            timeouts: {
                script: 60000,
                'page load': 60000,
                implicit: 20000
            },
            host: 'ondemand.saucelabs.com',
            port: 80,
            user: process.env.SAUCE_USERNAME,
            key: process.env.SAUCE_ACCESS_KEY,
            desiredCapabilities: getDesiredCapabilities()
        },

        JSWait: {
            'require': './helpers/JSWaitHelper.js'
        },

        SauceLabsReportingHelper: {
            'require': './helpers/SauceLabsReportingHelper.js'
        }
    },
    include: {
        I: './pages/steps.js'
    },
    mocha: {
        'reporterOptions': {
            'reportDir': process.env.E2E_CROSSBROWSER_OUTPUT_DIR || './output',
            'reportName': browser + '_report',
            'reportTitle': 'Crossbrowser results for: ' + browser.toUpperCase(),
            'inlineAssets': true
        }
    },
    name: 'frontEnd Tests'
};

function getDesiredCapabilities() {
    const desiredCapability = supportedBrowsers[browser];
    desiredCapability.tunnelIdentifier = tunnelName;
    desiredCapability.tags = ['probate'];
    return desiredCapability;
}

function requiredValue(envVariableValue, variableName) {
  if (envVariableValue && envVariableValue.trim().length > 0) {
    return envVariableValue.trim();
  }
  throw new Error(`${variableName} is a required environment variable, but wasn't set`);
}

exports.config = setupConfig;
