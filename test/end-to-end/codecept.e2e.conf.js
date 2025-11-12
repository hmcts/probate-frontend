const testConfig = require('config');
const TestConfigurator = new (require('test/end-to-end/helpers/TestConfigurator'))();

exports.config = {
    tests: testConfig.TestPathToRun,
    output: `${process.cwd()}/${testConfig.TestOutputDir}`,
    helpers: {
        Playwright: {
            url: testConfig.TestE2EFrontendUrl,
            waitForTimeout: 120000,
            getPageTimeout: 120000,
            show: TestConfigurator.showBrowser(),
            chrome: {
                ignoreHTTPSErrors: true,
                'ignore-certificate-errors': true,
                defaultViewport: {
                    width: 1280,
                    height: 960
                },
                args: [
                    '--disable-gpu',
                    '--no-sandbox',
                    '--allow-running-insecure-content',
                    '--ignore-certificate-errors',
                    //'--disable-dev-shm-usage',
                    '--window-size=1440,1400'
                ]
            },
        },
        PlaywrightHelper: {
            require: './helpers/PlaywrightHelper.js'
        },
        JSWait: {
            require: './helpers/JSWait.js'
        },
        IDAMHelper: {
            require: './helpers/IDAMHelper.js'
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
        pauseOnFail: {
            enabled: TestConfigurator.showBrowser(),
        },
    },
    mocha: {
        timeout: 60000,
        reporter: 'mochawesome',
        reporterOptions: {
            reportDir: './functional-output',
            reportFilename: 'mochawesome',
            inlineAssets: true,
            overwrite: false,
            html: false,
            json: true
        }
    },
    bootstrap: TestConfigurator.bootStrapTestSuite(),
    multiple: {
        parallel: {
            chunks: 3,
            browsers: ['chrome']
        }
    },
    name: 'Probate FE E2E Test'
};
