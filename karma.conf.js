// Karma configuration for UIK Framework.
//
// The framework ships as plain browser scripts that attach jQuery behaviours to
// `document` — there is no module system to hook into, so the suite loads jQuery,
// then the behaviour modules, then the specs, exactly as a consuming page would.
process.env.CHROME_BIN = process.env.CHROME_BIN || require('./test/chrome-bin');

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['qunit', 'sinon'],

    files: [
      // 1. jQuery must be global before anything else, as in a real page.
      'node_modules/jquery/dist/jquery.js',

      // 2. Vendored plugins, so the suite also proves they still register.
      'src/lib/js/plugins/lightslider.min.js',
      'src/lib/js/plugins/jquery.fancybox.js',
      'src/lib/js/plugins/jquery.fancybox-buttons.js',
      'src/lib/js/plugins/jquery.fancybox-thumbs.js',

      // 3. First-party behaviour modules (the units under test).
      'src/lib/js/utils/*.js',

      // 4. Specs.
      'test/helpers.js',
      'test/**/*.spec.js'
    ],

    exclude: [],
    reporters: ['dots'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['ChromeHeadlessNoSandbox'],

    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        // Required in containers/CI where the sandbox is unavailable.
        flags: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage', '--window-size=1280,1024']
      }
    },

    singleRun: true,
    concurrency: 1,
    captureTimeout: 60000,
    browserNoActivityTimeout: 60000,

    client: {
      clearContext: true,
      qunit: {
        showUI: false,
        testTimeout: 10000,
        reorder: false
      }
    }
  });
};
