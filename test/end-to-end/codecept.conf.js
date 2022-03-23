const testConfig = require('config');

exports.config = {
    tests: testConfig.TestPathToRun,
    output: `${process.cwd()}/${testConfig.TestOutputDir}`,
    helpers: {
        Puppeteer: {
            url: testConfig.TestE2EFrontendUrl,
            waitForTimeout: 120000,
            getPageTimeout: 120000,
            show: testConfig.TestShowBrowser,
            chrome: {
                ignoreHTTPSErrors: true,
                'ignore-certificate-errors': true,
                defaultViewport: {
                    width: 1280,
                    height: 960
                },
                args: [
                    '--headless', '--disable-gpu', '--no-sandbox', '--allow-running-insecure-content', '--ignore-certificate-errors', '--disable-dev-shm-usage',
                    //'--proxy-server=proxyout.reform.hmcts.net:8080',
                    //'--proxy-bypass-list=*beta*LB.reform.hmcts.net',
                    '--window-size=1440,1400'
                ]
            },
        },
        PuppeteerHelper: {
            require: './helpers/PuppeteerHelper.js'
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
    multiple: {
        parallel: {
            chunks: 4,
            browsers: ['chrome']
        }
    },
    name: 'Probate FE Tests'
};
