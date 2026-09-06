# UIK Framework — Dependency Audit

**Recorded:** 2026-09-05 · **Baseline:** 97 devDependencies, 0 dependencies, 3,027 resolved packages, 267 npm advisories.

Every package below was checked against `webpack.config.js`, `karma.conf.js`, the
`scripts` block, the `.eslintrc.json` / `.stylelintrc.json` configs, and a full-text
search of all source, config and documentation files. Nothing was removed on the
strength of its name or age alone.

## Summary

| Classification | Count |
| --- | ---: |
| Required — build | 18 |
| Required — bundled at runtime | 1 |
| Required — test | 7 |
| Required — quality gates | 3 |
| Removed as proven unused | 65 |
| **Total classified** | **94** |

## Retained

### Build pipeline

| Package | Version | Why it is required |
| --- | --- | --- |
| `webpack` | `^4.4.1` | Bundler. Entry points and loader chain in webpack.config.js. |
| `webpack-cli` | `^3.3.10` | Provides the `webpack` binary the build script invokes. |
| `clean-webpack-plugin` | `^0.1.19` | Clears src/dist before each build. |
| `compression-webpack-plugin` | `^1.1.11` | Emits the .gz siblings alongside each asset. |
| `mini-css-extract-plugin` | `1.4.0` | Extracts the SCSS entry into css/uik.bundle.min.css. |
| `optimize-css-assets-webpack-plugin` | `^5.0.0` | CSS minification wrapper around cssnano. |
| `uglifyjs-webpack-plugin` | `^1.1.8` | JS minifier configured in optimization.minimizer. |
| `webpack-manifest-plugin` | `^3.1.1` | Writes src/dist/manifest.json. |
| `webpack-fix-style-only-entries` | `^0.3.0` | Drops the stub JS chunk of the style-only entry. |
| `cssnano` | `^4.1.11` | Required directly by webpack.config.js as the CSS processor. |
| `sass` | `^1.69.5` | Dart Sass; passed to sass-loader as `implementation`. |
| `sass-loader` | `^10.4.1` | Compiles src/lib/sass/uik.scss. |
| `css-loader` | `^1.0.0` | Resolves url() references inside the compiled CSS. |
| `file-loader` | `^1.1.5` | Emits images, fonts and SVGs referenced from the CSS. |
| `import-glob-loader` | `^1.1.0` | Pre-loader applied to every .scss file. |
| `svgo-loader` | `^2.2.2` | Optimises the 257 flag SVGs during the build. |
| `svgo` | `^1.3.2` | Peer of svgo-loader. Pinned to 1.x; svgo 2+ changes the plugin format. |
| `cross-env` | `^5.2.1` | Sets NODE_OPTIONS in the build script cross-platform. |

### Bundled at runtime

| Package | Version | Why it is required |
| --- | --- | --- |
| `wow.js` | `^1.2.2` | Required by src/lib/js/uik.js and bundled into the shipped JS. |

### Test

| Package | Version | Why it is required |
| --- | --- | --- |
| `karma` | `^3.1.4` | Test runner. |
| `karma-qunit` | `^3.1.3` | QUnit adapter; auto-loaded by frameworks: [qunit]. |
| `qunit` | `2.9.2` | Assertion library used by every spec. |
| `karma-sinon` | `^1.0.5` | Sinon adapter; auto-loaded by frameworks: [sinon]. |
| `sinon` | `^7.5.0` | Available to specs for spies and stubs. |
| `karma-chrome-launcher` | `^3.1.0` | Launches the ChromeHeadless browser used by the suite. |
| `jquery` | `^3.4.1` | Loaded first in karma.conf.js. Also the framework runtime peer. |

### Quality gates

| Package | Version | Why it is required |
| --- | --- | --- |
| `eslint` | `^5.16.0` | JS linting (npm run lint:js). |
| `stylelint` | `^9.10.1` | SCSS linting (npm run lint:scss). |
| `npm-run-all` | `^4.1.5` | Composes lint:js + lint:scss into `npm run lint`. |

## Removed — proven unused

Each entry had zero references in the build config, the test config, any npm script,
any lint config, and any source file.

| Package | Evidence it is unused |
| --- | --- |
| `@angular/compiler` | Angular 5 stack. No Angular and no TypeScript anywhere in the repository. |
| `@angular/compiler-cli` | As above. Its peer range against @angular/compiler is what broke `npm install`. |
| `@angular/core` | As above. |
| `@angular/language-service` | As above; an editor plugin, never part of a build. |
| `@angular/platform-browser` | As above. |
| `@angular/platform-browser-dynamic` | As above. |
| `@types/node` | TypeScript types. No .ts files and no tsconfig.json. |
| `codelyzer` | Angular-specific TSLint rules. |
| `tslint` | TypeScript linter. No TypeScript. |
| `protractor` | Angular e2e runner. Deprecated upstream; no e2e suite exists. |
| `babel` | Babel 6 meta-package. No babel-loader rule exists, so Babel never runs. |
| `babel-core` | Babel 6 core, superseded by @babel/core which is also unused. |
| `babel-preset-es2015` | Babel 6 preset. Unused. |
| `babel-preset-stage-2` | Babel 6 preset. Unused. |
| `@babel/cli` | Babel 7 CLI. No script invokes it. |
| `@babel/core` | Babel 7 core. No loader or script uses it. |
| `@babel/preset-env` | Babel 7 preset. Unused. |
| `@babel/plugin-proposal-object-rest-spread` | Babel 7 plugin. Unused. |
| `babel-loader` | Declared but never added to module.rules; source ships untranspiled. |
| `babel-eslint` | Alternative ESLint parser. .eslintrc.json uses the default parser. |
| `babelify` | Browserify + Babel transform. Neither is wired up. |
| `babel-plugin-istanbul` | Coverage instrumentation. No coverage reporter configured. |
| `istanbul-instrumenter-loader` | As above. |
| `karma-coverage-istanbul-reporter` | As above. |
| `browserify` | Second bundler. The project builds with webpack. |
| `browserify-shim` | Browserify companion. |
| `rollup` | Third bundler. Unused. |
| `rollup-plugin-babel` | Rollup companion. |
| `rollup-plugin-commonjs` | Rollup companion. |
| `rollup-plugin-node-resolve` | Rollup companion. |
| `less-loader` | No .less files exist. |
| `stylus-loader` | No .styl files exist. |
| `style-loader` | Not in module.rules; MiniCssExtractPlugin.loader is used instead. |
| `url-loader` | Not in module.rules. |
| `raw-loader` | Not in module.rules. |
| `extract-loader` | Not in module.rules. |
| `svg-url-loader` | Not in module.rules; the SVG rule uses file-loader + svgo-loader. |
| `postcss-loader` | Not in module.rules, so no PostCSS step runs at all. |
| `postcss-cli` | No script invokes it. |
| `postcss-import` | PostCSS companion; no PostCSS step. |
| `postcss-url` | PostCSS companion; no PostCSS step. |
| `autoprefixer` | Never wired into the build. The SCSS carries 445 hand-written prefixes instead. See the note below. |
| `copy-webpack-plugin` | Imported but its only usage in webpack.config.js is commented out. |
| `circular-dependency-plugin` | Not in the plugins array. |
| `fork-ts-checker-webpack-plugin` | TypeScript type-checking plugin. No TypeScript. |
| `webpack-extraneous-file-cleanup-plugin` | Not in the plugins array. |
| `gzipper` | CompressionPlugin already produces the .gz assets. |
| `uglify-js` | Standalone CLI. uglifyjs-webpack-plugin bundles its own copy. |
| `clean-css-cli` | No script invokes it; CSS minification runs through cssnano. |
| `clean-html` | No script invokes it; no HTML is generated. |
| `karma-browserstack-launcher` | No BrowserStack configuration or credentials. |
| `karma-firefox-launcher` | karma.conf.js runs ChromeHeadless only. |
| `karma-detect-browsers` | karma.conf.js names its browser explicitly. |
| `stylelint-config-twbs-bootstrap` | .stylelintrc.json does not extend it; see the note below. |
| `find-unused-sass-variables` | No script invokes it. |
| `broken-link-checker` | No script invokes it. |
| `vnu-jar` | HTML validator. No HTML is produced or checked. |
| `http-server` | No script invokes it; there is no demo page to serve. |
| `nodemon` | No watch script exists. |
| `shelljs` | Not required by any script or config. |
| `shx` | Not required by any script or config. |
| `glob` | Not required by any script or config. |
| `ip` | Not required by any script or config. |
| `popper.js` | No source file references it. |
| `hammer-simulator` | Touch-gesture test helper. No test uses it. |

## Removed earlier, to make installation work

These five were removed before this audit because they blocked `npm install` or
`npm ci` outright rather than merely sitting unused. They are recorded here for
completeness; the reasoning is in the commit `chore: make installation reproducible`.

| Package | Reason |
| --- | --- |
| `extract-text-webpack-plugin` | Peer-requires webpack ^3; superseded by `mini-css-extract-plugin`. |
| `html-webpack-plugin` | Peer-requires webpack <=3; imported in the config but never used. |
| `@angular/cli` | Sole source of `node-sass@4.14.1`, whose node-gyp build fails on Node >= 17. |
| `bundlesize` | Pulled `brotli-size` -> `iltorb`, a native addon that fails to build on modern Node. |
| `webpack-command` | Collided with `webpack-cli`; webpack 4 refuses to start when both are present. |

## Notes on two judgement calls

**`autoprefixer` and the PostCSS packages.** These are removed because nothing runs
them: there is no `postcss-loader` rule in `webpack.config.js`, so no PostCSS step
exists at any point in the build. The SCSS sources instead carry 445 hand-written
vendor prefixes. That is worth changing — a real autoprefixer step driven by a
`.browserslistrc` would let those be deleted — but wiring it up changes the generated
stylesheet, so it belongs in its own reviewed change rather than in a dependency
cleanup. Re-add them deliberately at that point.

**`stylelint-config-twbs-bootstrap`.** Removed because `.stylelintrc.json` does not
extend it. It was evaluated: applied to 30,024 lines of legacy SCSS it produces
thousands of stylistic violations that would have to be either mass-auto-fixed or
blanket-disabled, and neither outcome makes the code more correct. The config that
replaced it is a narrow set of correctness rules, and it found four genuine defects
on its first run.

## Re-removal after PR #5 (2026-09-05)

Six of the packages below — `rollup`, `rollup-plugin-babel`, `rollup-plugin-commonjs`,
`rollup-plugin-node-resolve`, `shelljs` and `shx` — briefly returned to `package.json`.

A Dependabot pull request bumping `rollup` 2.79.2 -> 2.80.0 had been opened *before* this
cleanup landed. When `master` was merged into that branch, the merge resolved in favour of
the older `package.json`, restoring all six entries, while `package-lock.json` resolved in
favour of the newer file, which no longer contained them.

The result was a `package.json` and `package-lock.json` that disagreed, so `npm ci` failed
with `EUSAGE — Missing: rollup@2.80.0 from lock file` and CI on `master` went red. `npm
install` still worked, because it rewrites the lockfile rather than requiring it to match,
which is why the breakage was invisible to anyone not running `npm ci`.

They are removed again rather than restored: all six remain unreferenced by any script,
config or source file, and the advisory the bump addressed does not apply to a package the
project does not use. Removing `rollup` resolves it more completely than upgrading it.

## Result

| Metric | Before | After |
| --- | ---: | ---: |
| Declared devDependencies | 97 | 29 |
| Resolved packages | 3,027 | see below |
| Native addons requiring node-gyp | 2 | 0 |
| Packages actually used by the build | ~16 | 29 (all of them) |

The remaining tree is still webpack-4 era and still carries advisories, almost all
transitive through `webpack`, `karma` and `eslint` themselves. Those are development
tools: `dependencies` is empty, so none of this reaches a consumer of the published
package. Reducing them further means upgrading webpack, Karma and ESLint to current
majors, which is a larger change than this effort covers and is tracked as remaining
technical debt.


---

## webpack 5 migration (2026-09-05)

The Dependabot backlog stalled on a wall of majors that all shared one blocker:

```
compression-webpack-plugin@12.0.0 -> peer {"webpack":"^5.1.0"}
css-loader@7.1.5                  -> peer {"webpack":"^5.27.0"}
cssnano@9.0.3                     -> peer {"postcss":"^8.5.28"}
```

The project was on `webpack@^4.4.1`, so none of them could resolve. ESLint 10 and
Stylelint 17 were blocked separately, having dropped `.eslintrc` and the
`--syntax` flag respectively. The toolchain was migrated rather than pinning
those five PRs shut.

### Replaced by webpack 5 built-ins

| Removed | Replaced by |
| --- | --- |
| `clean-webpack-plugin` | `output.clean: true` |
| `file-loader` | asset modules (`type: 'asset/resource'`) |
| `uglifyjs-webpack-plugin` | `terser-webpack-plugin` |
| `optimize-css-assets-webpack-plugin` + `cssnano` | `css-minimizer-webpack-plugin` |
| `webpack-fix-style-only-entries` | `webpack-remove-empty-scripts` |
| `import-glob-loader` | nothing — no `.scss` file used a glob `@import` |

### Two behavioural differences that needed handling

- **css-loader 7 resolves root-absolute URLs.** css-loader 1 left `url(/...)`
  alone. `utils/_steps.scss` references `url(/image/arrow.png)`, which does not
  exist in the repository, so the build began failing on a dead reference that had
  been shipping as a 404 for years. A `url.filter` restores the old behaviour and
  keeps the emitted CSS identical; the broken reference is recorded in the README.
- **svgo 4 rejects the SVG webfont.** `fontello.svg` is a font, not an icon, and
  svgo's parser errors on it. The font directory is now excluded from `svgo-loader`
  and emitted untouched.

### Result

| Metric | webpack 4 | webpack 5 |
| --- | ---: | ---: |
| Resolved packages | 1,219 | 657 |
| `npm audit` total | 115 | **4** |
| — critical | 8 | **0** |
| — high | 37 | **1** |
| `NODE_OPTIONS=--openssl-legacy-provider` needed | yes | **no** |

Output is unchanged: 8,058 CSS classes before and after, 0 added and 0 removed,
286 asset URLs, and identical emitted paths (`url(../img/flags/4x3/ad.svg)`).
All 49 behaviour tests pass.
