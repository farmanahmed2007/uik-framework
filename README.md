# UIK Framework

[![CI](https://github.com/farmanahmed2007/uik-framework/actions/workflows/ci.yml/badge.svg)](https://github.com/farmanahmed2007/uik-framework/actions/workflows/ci.yml)
[![Keep a Changelog v0.3.4 badge][changelog-badge]][changelog]
[![Version 0.3.4 Badge][version-badge]][changelog]
[![MIT License Badge][license-badge]][license]

**UIK — Universal Interactive Kit.** A jQuery-based CSS and JavaScript UI kit: a
utility-first stylesheet plus a set of behaviours for forms, navigation, tables,
tabs, popups and cards.

---

## Contents

- [Project overview](#project-overview)
- [Architecture](#architecture)
- [Requirements](#requirements)
- [Installation](#installation)
- [Using UIK in a project](#using-uik-in-a-project)
- [Development](#development)
- [Build](#build)
- [Testing](#testing)
- [Linting](#linting)
- [Continuous integration](#continuous-integration)
- [Repository structure](#repository-structure)
- [Environment variables](#environment-variables)
- [Why there is no Dockerfile](#why-there-is-no-dockerfile)
- [Contributing](#contributing)
- [Known limitations](#known-limitations)

---

## Project overview

UIK ships two build artifacts — one stylesheet and one script — that you drop into
a page alongside jQuery. There is no JavaScript API to import and no components to
instantiate: **you opt into behaviour by using the documented CSS classes and DOM
structure**, and the bundled script wires itself up on DOM-ready.

That makes the public surface of this project **its CSS class names and markup
conventions**, not its function signatures. Renaming a class or a selector is a
breaking change for every consumer.

## Architecture

### Styles

`src/lib/sass/uik.scss` is the single entry point. It pulls in, in order:

| Directory | Contents |
| --- | --- |
| `partials/` | `_variables.scss`, `_mixins.scss`, `_extensions.scss` (`%placeholder` selectors) and `partials/base/` — 17 mixin files covering the grid, breakpoints and the button/input/pagination generators |
| `utils/` | 36 partials: reset, grid, typography, buttons, forms, tables, tabs, alerts, badges, the fontello icon font, flag icons, and the generated utility scales |
| `animations/` | 21 keyframe partials plus pre-loaders and page-loaders |
| `modules/` | 7 composite components: cards, boxes, panels, accordion, progress bar |
| `plugins/` | Vendored third-party CSS: pretty-checkbox, lightSlider, fancyBox, intl-tel-input |

Compiled output is a single stylesheet. It is large — see
[Known limitations](#known-limitations).

### Scripts

`src/lib/js/uik.js` is the webpack entry point. It `require`s each behaviour module
for its side effects, initialises [WOW.js](https://wowjs.uk/), then loads the
vendored jQuery plugins.

| Module | Responsibility |
| --- | --- |
| `utils/global.js` | In-page `#page…` anchors, empty-href guards, inline SVG replacement, alert dismissal |
| `utils/form-elements.js` | Floating labels, show-password, custom selects, multi-step forms, quantity spinners, max-length counters |
| `utils/navigation.js` | Slide-out menu, drop-downs, sticky and floating headers, responsive menu relocation |
| `utils/tables.js` | Sticky table header, paired horizontal scrollbars, arrow scrolling |
| `utils/tabs.js`, `accordian.js`, `tooltip.js`, `popup.js`, `buttons.js`, `card.js`, `back-top.js` | Small delegated behaviours |
| `plugins/` | Vendored: fancyBox 2.1.7 (+ buttons and thumbs helpers), lightSlider 1.1.6 |

`navigation.js` and `tables.js` keep their state private and expose a single
namespaced entry point each — `window.UIKNavigation` and `window.UIKTables` — both
with an idempotent `init()` you can re-run after injecting markup. The remaining
modules bind delegated handlers to `document` at DOM-ready and need no
initialisation.

### Build

webpack 4 compiles two entries into `src/dist/`:

```
src/lib/sass/uik.scss  ──▶  src/dist/css/uik.bundle.min.css  (+ .gz)
src/lib/js/uik.js      ──▶  src/dist/js/uik.bundle.min.js    (+ .gz)
                            src/dist/img/, src/dist/fonts/, manifest.json
```

Loader chain: `sass-loader` (Dart Sass) → `css-loader` → `MiniCssExtractPlugin`.
Assets referenced from the CSS are emitted by webpack 5 asset modules, with SVG
icons passed through `svgo-loader`. Minification is `terser-webpack-plugin` for JS
and `css-minimizer-webpack-plugin` for CSS; `compression-webpack-plugin` writes the
`.gz` siblings.

**jQuery is not bundled.** It must be a global on the page before `uik.bundle.min.js`
loads. It is declared as a peer dependency.

## Requirements

| | |
| --- | --- |
| **Node** | 20 or 22. Both are exercised in CI; 22 is the primary target. |
| **npm** | 8 or newer (any version shipping with the Node releases above). |
| **Browser (consumers)** | The stylesheet carries hand-written vendor prefixes and targets browsers roughly a decade old. There is no `.browserslistrc` and no autoprefixer step. |
| **Browser (tests)** | Chrome or Chromium. See [Testing](#testing). |

Node 18 and below are not tested.

## Installation

### As a dependency

```bash
npm install uik-framework jquery
```

### To work on the framework itself

```bash
git clone https://github.com/farmanahmed2007/uik-framework
cd uik-framework
npm ci
```

`npm ci` installs exactly the tree in `package-lock.json`. Use it rather than
`npm install` unless you intend to change dependency versions.

## Using UIK in a project

Load jQuery first, then the two bundles:

```html
<link rel="stylesheet" href="node_modules/uik-framework/src/dist/css/uik.bundle.min.css">

<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
<script src="node_modules/uik-framework/src/dist/js/uik.bundle.min.js"></script>
```

Or reference them from a bundler's asset pipeline:

```json
"styles": ["../node_modules/uik-framework/src/dist/css/uik.bundle.min.css"],
"scripts": ["../node_modules/uik-framework/src/dist/js/uik.bundle.min.js"]
```

To compile the SCSS yourself instead of using the prebuilt stylesheet, import the
source entry point and the assets it references:

```scss
@import "node_modules/uik-framework/src/lib/sass/uik";
```

If you inject markup after page load, re-run the relevant initialiser:

```js
UIKNavigation.init();  // re-scan for menus and headers
UIKTables.init();      // re-bind scroll handlers on new tables
```

Both are safe to call repeatedly.

## Development

| Command | What it does |
| --- | --- |
| `npm ci` | Install the exact locked dependency tree |
| `npm run build` | Compile SCSS and JS into `src/dist/` |
| `npm test` | Run the behaviour suite in headless Chrome |
| `npm run lint` | Run both linters |
| `npm run lint:js` | ESLint over `src/lib/js`, `test`, and the build/test configs |
| `npm run lint:scss` | Stylelint over `src/lib/sass` |

There is no watch task and no dev server. Edit sources, then run `npm run build`.

## Build

```bash
npm run build
```

Writes `src/dist/css/uik.bundle.min.css` and `src/dist/js/uik.bundle.min.js`, plus
their gzip siblings, the copied image and font assets, and `manifest.json`.

`src/dist/` is committed to the repository, because consumers reference those paths
directly. If your change affects the output, rebuild and commit the result as part
of the same change — and say so in the commit message, since the diff is minified
and not reviewable on its own.

The stylesheet is large; see [Known limitations](#known-limitations).

## Testing

```bash
npm test
```

Karma launches headless Chrome and runs QUnit specs from `test/`. Sinon is
available to specs for spies and stubs.

The suite loads jQuery, the vendored plugins and the behaviour modules in the same
order a real page does, then asserts against real DOM events dispatched into a
fixture container that is torn down after each test. jQuery animations are disabled
so assertions read settled DOM rather than racing timers.

**Chrome resolution.** `test/chrome-bin.js` looks for `CHROME_BIN`, then a
Playwright-managed Chromium, then the usual system paths. Override it explicitly if
needed:

```bash
CHROME_BIN=/usr/bin/chromium npm test
```

### What is covered

| Area | Coverage |
| --- | --- |
| `global.js` | Alert dismissal, empty-href guards, `#page` anchor interception including dangling targets |
| `form-elements.js` | Floating-label focus/blur/input transitions, show-password scoping, max-length counter badge and truncation |
| `navigation.js` | Drop-down open/close/exclusivity, sound toggle, responsive search, init idempotency, menu-relocation safety, absence of global leakage |
| `tables.js` | Sticky-header offset arithmetic, cloned-header population, init idempotency, group-scoped arrow scrolling |
| Small modules | Button toggle, tabs, tooltip, popup open/close, card flip, back-to-top injection |

When changing legacy behaviour, write the characterization test **first** — see
[CONTRIBUTING.md](./CONTRIBUTING.md).

## Linting

```bash
npm run lint
```

- **ESLint 10** (`eslint.config.js`, flat config) — `eslint:recommended` plus a small
  correctness-focused rule set. Vendored plugins under `src/lib/js/plugins/` are
  excluded so they stay re-syncable with upstream.
- **Stylelint 17** (`.stylelintrc.json`) — a narrow set of correctness rules (unknown
  properties, shorthand overriding longhand, duplicate declarations, invalid hex),
  parsed with `postcss-scss`. Formatting rules are deliberately not enforced across
  30k lines of legacy SCSS. Vendored plugin styles are excluded.

Both currently pass with zero errors. A handful of loose-equality warnings remain
where a number is compared against a raw HTML attribute string; those carry a scoped
`eslint-disable` with the reason, because tightening them without also coercing the
attribute would change behaviour.

## Continuous integration

`.github/workflows/ci.yml` runs on every push and pull request against Node 20 and 22:

```
Chrome check → npm ci → lint:js → lint:scss → test → build → assert both bundles exist
```

A pull request fails if dependencies cannot install, either linter reports an error,
any test fails, or the build does not emit both bundles. That last check exists
because the build previously exited successfully while producing nothing.

`.github/dependabot.yml` opens grouped weekly dev-dependency updates and monthly
GitHub Actions updates. Major bumps for `webpack`, `webpack-cli`, `svgo` and
`svgo-loader` are suppressed with reasons recorded inline.

## Repository structure

```
uik-framework/
├── .github/workflows/ci.yml   CI pipeline
├── .github/dependabot.yml     Dependency update policy
├── src/
│   ├── lib/                   SOURCE (also published)
│   │   ├── sass/              SCSS entry, partials, utils, animations, modules, plugins
│   │   ├── js/                uik.js entry, utils/ behaviours, plugins/ vendored
│   │   ├── img/               Flags, backgrounds, icons
│   │   └── fonts/             fontello icon font
│   └── dist/                  BUILD OUTPUT (committed)
├── test/                      QUnit specs, fixture helpers, Chrome resolver
├── karma.conf.js              Test runner configuration
├── webpack.config.js          Build configuration
├── AUDIT-BASELINE.md          Verified pre-modernization state
├── DEPENDENCY-AUDIT.md        Per-package classification
└── CONTRIBUTING.md            Branch, commit, test and PR expectations
```

## Environment variables

**UIK requires no environment variables** to install, build, test or run, and there
is no `.env` file. One optional variable affects the test run only:

| Variable | Purpose | Default |
| --- | --- | --- |
| `CHROME_BIN` | Path to the Chrome/Chromium binary Karma launches | Auto-detected by `test/chrome-bin.js` |

## Why there is no Dockerfile

UIK is a front-end kit with no server, no database and no external services. A
clean checkout installs, tests and builds with npm alone, on any machine with a
supported Node and a Chrome binary, and CI proves that on every push across two
Node versions.

Adding a Dockerfile or a Compose file would therefore add a second toolchain to
maintain without making anything more reproducible than `package-lock.json` and
`npm ci` already do. If a future change introduces a service — a docs site, a demo
server, a visual-regression runner — that is the point to revisit this.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). In short: branch, keep commits focused,
write a characterization test before changing legacy behaviour, and never rename a
CSS class or selector without establishing that it is internal.

## Known limitations

These are recorded rather than fixed, so they are not rediscovered. Fuller detail is
in [AUDIT-BASELINE.md](./AUDIT-BASELINE.md).

- **Stylesheet size.** The build emits a stylesheet well over webpack's recommended
  budget: ~11,800 rules and ~4,300 `!important` declarations, driven by exhaustively
  generated utility scales (`.rotate0`–`.rotate360`, `.w-0`–`.w-300`, padding and
  margin across eight directions × 0–100) and a 2,358-class icon font. There is no
  way to take a subset.
- **Accessibility.** `_reset.scss` sets an unqualified global `:focus { outline: 0 }`
  with no `:focus-visible` replacement anywhere, which makes keyboard focus invisible
  (WCAG 2.1 SC 2.4.7). There are no `prefers-reduced-motion` guards across 21
  animation partials plus WOW.js.
- **No autoprefixer step.** 445 vendor prefixes are hand-written in the SCSS. Wiring
  up autoprefixer with a `.browserslistrc` would let most of them be deleted.
- **Five orphaned SCSS partials** are written but never imported, so they are absent
  from the build: `_avatar.scss`, `_converter.scss`, `_positions.scss`,
  `_hover-effects.scss`, `_rotate.scss`.
- **Global element IDs.** The multi-step form claims `#next`, `#back` and `#submit`,
  and the table module claims `#table-1`, `#header-fixed` and `#headHtml`. Only one
  of each can exist per page. These are a shipped contract and cannot be changed
  without a major version.
- **Licensing.** `package.json` and `LICENSE` declare MIT, but the vendored
  fancyBox 2.1.7 is GPLv3 for non-commercial use and requires a paid licence
  otherwise, and the vendored SCSS for intl-tel-input, pretty-checkbox, lightSlider
  and fancyBox has had its copyright headers stripped. The fontello font ships with
  no licence manifest. **This needs a decision from the maintainer and is not
  something a code change can resolve.**
- **`src/dist/` is committed**, which is why `.git` is far larger than the working
  tree. Removing it would be a breaking change for consumers using those paths.
- **One broken asset reference.** `utils/_steps.scss` points at `url(/image/arrow.png)`,
  which does not exist anywhere in the repository and 404s for consumers. It is a
  root-absolute URL, so the bundler passes it through untouched rather than resolving
  it; the declaration needs either a real asset or removal.

## Licence

[MIT](./LICENSE) — but see the licensing note above regarding vendored third-party
code.

[changelog]: ./CHANGELOG.md
[changelog-badge]: https://img.shields.io/badge/changelog-v0.3.4-%23E05735
[license]: ./LICENSE
[version-badge]: https://img.shields.io/badge/version-0.3.4-blue.svg
[license-badge]: https://img.shields.io/badge/license-MIT-blue.svg
