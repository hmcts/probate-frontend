const strykerConfiguration = config => {
  config.set({
    testRunner: 'mocha',
    mutator: 'javascript',
    transpilers: [],
    reporter:
      [
        'clear-text',
        'progress',
        'html'
      ],
    testFramework: 'mocha',
    coverageAnalysis: 'perTest',
    mutate:
      [
        'app/components/*.js',
        '!test/unit/*.js'
      ],
    files: ['**/*', '!**/node_modules/*'],
    maxConcurrentTestRunners: 2,
    symlinkNodeModules: false,
    htmlReporter: {baseDir: 'functional-output/mutation-components'},
    mochaOptions: {
      files:
        [
          'test/unit/testPaymentBreakdown.js',
          'test/unit/testPaymentData.js',
          'test/unit/testPaymentStatus.js',
          'test/unit/testSecurity.js',
          'test/unit/testSubmitData.js',
          'test/unit/testSubmitService.js'
        ],
      timeout: 8000
    },
    logLevel: 'debug',
    plugins:
      [
        'stryker-mocha-runner',
        'stryker-mocha-framework',
        'stryker-javascript-mutator',
        'stryker-html-reporter'
      ]
  });
};

module.exports = strykerConfiguration;
