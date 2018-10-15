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
          'app/steps/ui/applicant/**/index.js',
          '!test/component/**/*.js'
      ],
      files: ['**/*', '!**/node_modules/*'],
      maxConcurrentTestRunners: 2,
      symlinkNodeModules: false,
      htmlReporter: {baseDir: 'functional-output/mutation-applicant'},
      mochaOptions: {
          files: [
              'test/component/applicant/test*.js'
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
