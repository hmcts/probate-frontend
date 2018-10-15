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
          'app/steps/ui/will/**/index.js',
          '!test/component/**/*.js'
      ],
      files: ['**/*', '!**/node_modules/*'],
      maxConcurrentTestRunners: 2,
      symlinkNodeModules: false,
      htmlReporter: {baseDir: 'functional-output/mutation-will'},
      mochaOptions: {
          files: [
              'test/component/will/test*.js'
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
