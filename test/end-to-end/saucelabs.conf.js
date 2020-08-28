/* eslint-disable no-console */

const supportedBrowsers = require('../crossbrowser/supportedBrowsers.js');

const browser = process.env.SAUCELABS_BROWSER || 'chrome';
const tunnelName = process.env.TUNNEL_IDENTIFIER || 'reformtunnel';

const getBrowserConfig = (browserGroup) => {
    const browserConfig = [];
    for (const candidateBrowser in supportedBrowsers[browserGroup]) {
        if (candidateBrowser) {
            const desiredCapability = supportedBrowsers[browserGroup][candidateBrowser];
            desiredCapability.tunnelIdentifier = tunnelName;
            desiredCapability.tags = ['probate'];
            browserConfig.push({
                browser: desiredCapability.browserName,
                desiredCapabilities: desiredCapability
            });
        } else {
            console.error('ERROR: supportedBrowsers.js is empty or incorrectly defined');
        }
    }
    return browserConfig;
};

const setupConfig = {
    tests: process.env.PATH_TO_TEST_FILES || './paths/**/*.js',
    output: './output',
    timeout: 20000,
    helpers: {
        WebDriverIO: {
            url: process.env.TEST_URL || 'https://localhost:3000',
            browser,
            smartWait: 10000,
            waitforTimeout: 60000,
            cssSelectorsEnabled: 'true',
            windowSize: '1600x900',
            timeouts: {
                script: 60000,
                'page load': 60000,
                implicit: 20000
            },
            host: 'ondemand.eu-central-1.saucelabs.com',
            port: 80,
            region: 'eu',
            user: process.env.SAUCE_USERNAME,
            key: process.env.SAUCE_ACCESS_KEY,
            desiredCapabilities: {}
        },
        SauceLabsReportingHelper: {
            require: './helpers/SauceLabsReportingHelper.js'
        },
        WebDriverHelper: {
            require: './helpers/WebDriverHelper.js'
        },
        JSWait: {
            require: './helpers/JSWait.js'
        }
    },
    plugins: {
        retryFailedStep: {
            enabled: true
        },
        autoDelay: {
            enabled: true,
            delayAfter: 2000
        }
    },
    include: {
        'I': './pages/steps.js'
    },
    mocha: {
        reporterOptions: {
            'codeceptjs-cli-reporter': {
                stdout: '-',
                options:
                    {steps: true}
            },
            mochawesome: {
                stdout: process.env.E2E_CROSSBROWSER_OUTPUT_DIR + 'console.log',
                options: {
                    reportDir: process.env.E2E_CROSSBROWSER_OUTPUT_DIR || './output',
                    reportName: 'index',
                    reportTitle: 'Crossbrowser results',
                    inlineAssets: true
                }
            }
        }
    },
    multiple: {
        microsoftIE11: {
            browsers: getBrowserConfig('microsoftIE11')
        },
        microsoftEdge: {
            browsers: getBrowserConfig('microsoftEdge')
        },
        chrome: {
            browsers: getBrowserConfig('chrome')
        },
        firefox: {
            browsers: getBrowserConfig('firefox')
        }
    },
    name: 'Probate FrontEnd Tests'
};

exports.config = setupConfig;
