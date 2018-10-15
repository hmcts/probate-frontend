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
      mutate: [
          'app/steps/ui/iht/**/index.js',
          '!test/component/**/*.js'
      ],
      files: ['**/*', '!**/node_modules/*'],
      maxConcurrentTestRunners: 2,
      symlinkNodeModules: false,
      htmlReporter: {baseDir: 'functional-output/mutation-iht'},
      mochaOptions: {
          files: [
              'test/component/iht/test*.js'
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
