// Resolves a usable Chrome/Chromium binary.
//
// Order: an explicit CHROME_BIN, then the Playwright-managed Chromium that CI
// images and this project's dev containers already ship, then the usual system
// paths. Karma fails with an opaque "No binary for ChromeHeadless" if this is
// wrong, so the error below names what was actually tried.
const fs = require('fs');

const CANDIDATES = [
  process.env.CHROME_BIN,
  '/opt/pw-browsers/chromium',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable'
];

module.exports = (function resolveChrome() {
  for (const candidate of CANDIDATES) {
    if (candidate && fs.existsSync(candidate)) {
      return fs.realpathSync(candidate);
    }
  }
  throw new Error(
    'No Chrome/Chromium binary found. Set CHROME_BIN to a Chrome executable.\nTried:\n  ' +
      CANDIDATES.filter(Boolean).join('\n  ')
  );
})();
