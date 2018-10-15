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
        'app/wrappers/*.js',
        '!test/component/deceased/*.js'
      ],
    files: ['**/*', '!**/node_modules/*'],
    maxConcurrentTestRunners: 2,
    symlinkNodeModules: false,
    htmlReporter: {baseDir: 'functional-output/mutation-wrappers'},
    mochaOptions: {
      files: [
          'test/component/deceased/*.js',
          'test/component/executors/*.js',
          'test/component/will/*.js',
          'test/unit/testDeceasedWrapper.js',
          'test/unit/testDetectDataChange.js',
          'test/unit/testExecutorsWrapper.js',
          'test/unit/testRegistryWrapper.js',
          'test/unit/testWillWrapper.js'
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
