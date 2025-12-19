const testConfig = require('config');

exports.config = {
    tests: testConfig.TestPathToRun,
    output: `${process.cwd()}/${testConfig.TestOutputDir}`,
    helpers: {
        WebDriver: {
            url: testConfig.TestE2EFrontendUrl,
            host: '127.0.0.1',
            port: 9515,
            path: '/',
            smartWait: 5000,
            browser: 'chrome',
            restart: false,
            windowSize: 'maximize',
            show: testConfig.TestShowBrowser,
            timeouts: {
                'script': 120000,
                'page load': 120000
            },
            desiredCapabilities: {
                chromeOptions: {
                    args: ['--disable-gpu', '--no-sandbox']
                }
            }
        },
        WebDriverHelper: {
            require: './helpers/WebDriverHelper.js'
        },
        JSWait: {
            require: './helpers/JSWait.js'
        },
        IDAMHelper: {
            require: './helpers/IDAMHelper.js'
        },
        Mochawesome: {
            uniqueScreenshotNames: 'true'
        }
    },
    include: {
        I: './pages/steps.js'
    },
    plugins: {
        screenshotOnFail: {
            enabled: true,
            fullPageScreenshots: true
        },
        retryFailedStep: {
            enabled: true,
            retries: 1
        },
        autoDelay: {
            enabled: true
        },
        wdio: {
            enabled: true,
            services: ['selenium-standalone']
        }
    },
    mocha: {
        reporterOptions: {
            'codeceptjs-cli-reporter': {
                stdout: '-',
                options: {steps: true}
            },
            'mocha-junit-reporter': {
                stdout: '-',
                options: {mochaFile: './functional-output/result.xml'}
            },
            mochawesome: {
                stdout: './functional-output/console.log',
                options: {
                    reportDir: testConfig.TestOutputDir || './functional-output',
                    reportName: 'index',
                    inlineAssets: true
                }
            }
        }
    },
    name: 'Probate FE Tests (Webdriver)'
};
