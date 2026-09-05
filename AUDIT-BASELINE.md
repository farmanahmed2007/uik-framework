# UIK Framework — Audit Baseline

**Recorded:** 2026-09-05 · **Commit:** `050634c` · **Version:** 0.3.4 · **Node used for verification:** v22.22.2 / npm 10.9.7

This document records the **verified, pre-modernization state** of the repository. Every claim
here was produced by executing the project, not by reading it. It is the reference point
against which all subsequent changes are measured.

---

## 1. Current architecture

UIK Framework is a **jQuery 3 plugin-style UI kit**: a global stylesheet plus a set of
IIFE-scoped jQuery behaviours, bundled by webpack 4 into two artifacts.

```
src/
├── lib/                       # SOURCE (also published to npm)
│   ├── sass/
│   │   ├── uik.scss           # SCSS entry point
│   │   ├── partials/          # variables, mixins, %placeholders
│   │   │   └── base/          # 17 mixin files (grid, responsive, generators)
│   │   ├── utils/             # 36 component/utility partials
│   │   ├── animations/        # 21 keyframe partials
│   │   ├── modules/           # 7 composite components
│   │   └── plugins/           # vendored 3rd-party CSS (4 plugins)
│   ├── js/
│   │   ├── uik.js             # JS entry point (CommonJS requires)
│   │   ├── utils/             # 11 first-party behaviour modules
│   │   └── plugins/           # 4 vendored jQuery plugins
│   ├── img/                   # 257 flag SVGs + backgrounds + icons
│   └── fonts/                 # fontello icon font (5 formats)
└── dist/                      # BUILD OUTPUT — committed to git
    ├── css/uik.bundle.min.css
    ├── js/uik.bundle.min.js
    ├── img/, fonts/           # duplicated copies of src/lib assets
    └── manifest.json
```

### Size reality
The "~1,200 LOC / 17 files" framing understates the codebase. Verified counts:

| Layer | Files | Lines |
|---|---:|---:|
| SCSS source | 105 | **30,024** |
| First-party JS | 11 | 742 |
| Vendored JS plugins | 4 | 336 |
| Build config | 1 | 232 |
| **Total source** | **121** | **31,334** |

`utils/_fontello.scss` alone is 7,093 lines (2,358 icon classes, 24% of all SCSS).

### Consumption model
Consumers load **global jQuery first**, then the two bundles. There is no module export:
`package.json` has no `main`, `module`, `browser`, `exports`, or `style` field, so
`require('uik-framework')` fails. The public surface is therefore **CSS class names and DOM
conventions**, not a JavaScript API. This is the single most important compatibility
constraint for this project.

---

## 2. Build process

Entry points (`webpack.config.js:23-30`): `src/lib/sass/uik.scss` and `src/lib/js/uik.js`.
Output: `src/dist/js/[name].bundle.min.js` + `MiniCssExtractPlugin` → `css/uik.bundle.min.css`,
plus gzip siblings via `CompressionPlugin`.

Pipeline: `import-glob-loader` (pre) → `css-loader` → `sass-loader` (dart `sass`) →
`MiniCssExtractPlugin`; `file-loader` for images/fonts/svg with `svgo-loader`;
`UglifyJsPlugin` + `OptimizeCssAssetsPlugin`(cssnano) as minimizers.

**Notably absent:** no `babel-loader` rule (Babel is declared but never runs), and no
`postcss-loader`/autoprefixer rule (445 vendor prefixes are hand-written in SCSS instead).

### Verified build status: **FAILS OUT OF THE BOX** — three independent blockers

| # | Blocker | Evidence |
|---|---|---|
| 1 | `npm install` aborts | `ERESOLVE`: `@angular/compiler@^5.2.0` vs `@angular/compiler-cli@^8.1.0` which peer-requires `@angular/compiler@8.2.14` |
| 2 | `webpack` refuses to start | `You have installed webpack-cli and webpack-command together... please remove one of them` → exit 1 |
| 3 | JS minification crashes on Node ≥17 | `Error: error:0308010C:digital envelope routines::unsupported` from `uglifyjs-webpack-plugin` (md4 under OpenSSL 3). No JS bundle emitted. |

With all three worked around (`--legacy-peer-deps`, remove `webpack-command`,
`NODE_OPTIONS=--openssl-legacy-provider`) the build **succeeds** and emits:

```
css/uik.bundle.min.css   728 KiB  [big]
js/uik.bundle.min.js    64.4 KiB
WARNING in asset size limit: css/uik.bundle.min.css (728 KiB) exceeds 244 KiB
```

### Build reproducibility: **NONE**
No lockfile. A rebuild from identical source produced byte-different output from the
committed `dist` (arrow-function module wrappers vs `function(e,t)` — a different minifier
version resolved). The **class set is identical (8,058 = 8,058)**, so `dist` is
content-current, merely not reproducible.

### SCSS compilation (dart-sass 1.69.5): **succeeds with warnings**
- 22 × `Using / for division ... will be removed in Dart Sass 2.0.0`
- 5 × `The selector "> .btn .btn-group..." is invalid CSS` — a real bug, see §7
- 100% `@import` (deprecated, slated for removal)

---

## 3. Dependency inventory

| Metric | Value |
|---|---:|
| Declared `dependencies` | **0** |
| Declared `devDependencies` | **97** |
| Resolved packages | **3,027** |
| Used by the actual build | **~16** |
| `npm audit` total | **267** |
| — critical | 55 |
| — high | 93 |
| — moderate | 111 |
| Direct devDeps with advisories | 50 of 97 |

**Exposure is limited to maintainers and CI.** `dependencies` is empty, so npm does not
install any of this for consumers of the published package.

Undeclared but required: **`cssnano`** (`webpack.config.js:222` requires it; the build only
works because a transitive hoist happens to place it).

Migration debt: `node-sass@4.14.1` is **still in the tree** via `@angular/cli@1.6.7` and
`sass-loader@10`, despite commit `f6bfd9f` "Replace node-sass with dart sass".

Large apparently-unused clusters: the Angular 5 stack (7 packages), protractor, codelyzer,
tslint, karma + 7 launchers/reporters, qunit, sinon, browserify + babelify + browserify-shim,
rollup + 3 plugins, less-loader, stylus-loader, and **both** Babel 6 (`babel`, `babel-core`)
and Babel 7 (`@babel/core`). Three bundlers are declared; one is wired up.

---

## 4. Packaging

`npm pack --dry-run`: **953 files · 17.24 MB unpacked · 9.64 MB tarball.**

No `files` field and no `.npmignore`, so npm falls back to `.gitignore`, which excludes
neither `src/lib` nor `src/dist`. The 257 flag SVGs ship **three times** (source, built copy,
249 pre-gzipped `.gz`); fonts ship twice.

Missing manifest fields: `main`, `module`, `browser`, `exports`, `style`, `sideEffects`,
`engines`, `peerDependencies` (the hard runtime dependency on global jQuery 3 is undeclared).

---

## 5. Public behaviour (compatibility surface)

Because there is no JS API, **these are the contracts that must not break**:

### CSS class names — 8,058 distinct classes in the built stylesheet
Includes exhaustively generated utility scales: `.rotate0`–`.rotate360`, `.w-0`–`.w-300`,
padding/margin × 8 directions × 0–100, `.delay-100`–`.delay-10000`, `.f-gap1`–`.f-gap50`,
2,358 `.icon-*` classes, 257 `.flag-icon-*` classes.

### DOM conventions consumed by the JS modules
| Module | Selectors it owns |
|---|---|
| `global.js` | `a[href^="#page"]`, `a[href=""]`, `img.svg`, `.form-control:disabled`, `.alert .close` |
| `form-elements.js` | `.interactive-forms .floating-inputs .form-control`, `.show_password`, `.login-form`, `.selecter`/`.selecter-list`/`.selecter-item`, `.with_steps form`, `.quantity`/`.quantity-up`/`.quantity-down`, `.max-validation input` |
| `navigation.js` | `.menu_wrapper`, `.menu_wrapper_slide`, `.uik_menu_slide_right`, `.sound-control a`, `.dropdown_btn`, `.dropdown_list`, `.keywordSearch`, `.uik_sticky_header #header`, `.uik_floating_header #header`, `#topBar .responsive-menu`, `#close_menu`, `#overlay` |
| `tables.js` | `.table-responsive`, `.table-responsive2`, `.scrollArrows .left/.right`, `.sidebar-toggle`, `#header-fixed`, `#table-1`, `#headHtml` |
| `tabs.js` | `.tabination .nav-tabs li` |
| `accordian.js` | `.accordian`, `.acc-trigger` |
| `tooltip.js` | `.tooltip`, `.tooltip-inner` |
| `popup.js` | `.popup`, `.popup-btn`, `.popup-inner`, `.popup-header .close-btn` |
| `buttons.js` | `.btn-toggle` |
| `card.js` | `.cards.style11 .toggle-btn` |
| `back-top.js` | injects `#back-top` into `<body>` at DOM-ready |

### Applied classes / state
`.active`, `.focused`, `.float`, `.open`, `.is_sticky`, `.logo-mini`, `.hide`, `.show`,
`.current`, `.checked`, `.disabled`, `.input-error`, `.password-visible`, `.replaced-svg`,
`.badge.bg-green.min`, `.badge.bg-red.max`.

### Element IDs the framework claims globally
`#next`, `#back`, `#submit`, `#table-1`, `#header-fixed`, `#headHtml`, `#overlay`,
`#close_menu`, `#topBar`, `#back-top`, `#barcode`. **A framework owning page-level IDs is a
design flaw, but it is also a shipped contract — changing these is a breaking change.**

### Browser-compatibility assumptions
No `.browserslistrc`; autoprefixer declared but not wired into the build. 445 hand-written
vendor prefixes (`-webkit-transform` ×105, `-webkit-animation-name` ×57, …), i.e. the
stylesheet targets browsers roughly a decade old. `wow.js` is bundled and auto-animates on
scroll.

---

## 6. Global mutable state

`src/lib/js/utils/navigation.js` declares four variables and two functions at **module top
level, outside any IIFE**. Because there is no `babel-loader` and webpack 4 wraps each module
in a function scope, these are *module*-scoped rather than truly global — but they are shared
mutable state across unrelated features:

```js
var overLayVisible = false;   // written by sideSlide(), read by responsiveMenu()
var isMobile       = false;   // written by ready-handler and responsiveMenu()
var is_sticky      = false;   // SHARED by two independent features (see §7)
var tabletL        = 1024;    // magic number, duplicated from SCSS $tablet-landscape-width
function sideSlide()      {}  // module-scoped
function responsiveMenu() {}  // module-scoped
```

`tables.js` additionally holds `sideBarOpened` across handlers.

---

## 7. Known defects (verified, pre-existing)

| # | Location | Defect |
|---|---|---|
| D1 | `tables.js:8` | Operator precedence: the ternary binds to the whole `A + B`, so `left` evaluates to `"245px"` in virtually all cases regardless of scroll or sidebar state. Lines 28–31 do the same thing correctly. |
| D2 | `tables.js:12` | `$("#table-1").offset('top')` — `.offset()` takes no string. jQuery treats it as a setter, returns the **jQuery object**, and sets `position:relative` as a side effect. `offset >= tableOffset` then compares number to object → always false. **The fixed table header never shows or hides.** |
| D3 | `navigation.js:19-22` | `sideSlide()` is called conditionally, then unconditionally one line later → **every open/close handler is bound twice**, running two identical animate chains. |
| D4 | `navigation.js:16` | `.detach().appendTo('.menu_wrapper_slide')` — if that container is absent, `appendTo` on an empty set inserts nothing and the **detached menu is permanently lost from the DOM**. |
| D5 | `navigation.js:59-87` | `is_sticky` is shared by the sticky-header and floating-header features; each `else` branch clobbers the other's state. Latent (inert when only one is present). |
| D6 | `form-elements.js:46` | `$('input[type=password]')` is unscoped — one "show password" checkbox reveals **every** password field on the page. |
| D7 | `form-elements.js:40` | `focused` is added to `$(this).parent()` but removed from `$(this)`. Combined with the `window.load` block (11-19) that floats *every* label regardless of content, floating labels start floated on empty fields and un-float while still focused. |
| D8 | `form-elements.js:249` | `eval()` on an already-numeric expression. |
| D9 | `_buttons.scss:606` | Stray `&`: `> .btn &:last-child` compiles to a leading-combinator selector that browsers drop. dart-sass warns ×5. The intended border-radius squaring never applies. |
| D10 | `_typography.scss:349` | `.text-with-divider` is defined in **both** `_dividers.scss` and `_typography.scss`; typography is imported later, so `display:block` silently overrides the intended `display:flex`. `.DoubleSepY` is a byte-identical duplicate in the same two files. |
| D11 | `_sizing.scss:38` | `.min-w-*` sets `width`, not `min-width`. |
| D12 | `card.js:5` | `console.log("132")` ships in the minified bundle (verified present in `dist`). |
| D13 | `global.js:6` | Uses the implicit global `event` with no handler parameter. |
| D14 | `global.js:83-128` | 45-line `SmoothScroll` implementation defined and never instantiated — dead code. |
| D15 | 4 call sites | `fadeOut("3000")` / `fadeTo('3000','1')` pass strings where jQuery wants numbers → silently falls back to 400 ms. |
| D16 | `back-top.js:24` | `.add('btn btn-lg no-rad')` — a class list used as a selector. |
| D17 | `navigation.js:53` | Unthrottled scroll handler doing two selector queries plus a layout-forcing `.height()` on every scroll event. |
| D18 | 5 SCSS partials | `_avatar.scss` (160 lines), `_converter.scss` (144), `_positions.scss`, `_hover-effects.scss`, `_rotate.scss` are **never imported** — written but absent from the build. |

### Accessibility (framework-wide)
- `_reset.scss:66` — `:focus { outline: 0 }`, unqualified and global, plus `outline:none` 24
  more times. **No `:focus-visible` anywhere** in 30k lines → WCAG 2.1 SC 2.4.7 (AA) failure.
- **Zero `prefers-reduced-motion` guards** across 21 animation partials + WOW.js.
- 221 `px` font-sizes vs 4 `rem`/`em`.

### Licensing (highest-severity finding, out of scope for this modernization)
`package.json` and `LICENSE` declare **MIT**, but `jquery.fancybox.js` is **fancyBox v2.1.7**
— GPLv3 for non-commercial use, paid commercial licence otherwise — vendored and bundled into
`dist`. The vendored SCSS for intl-tel-input, pretty-checkbox, lightSlider and fancybox has had
all copyright headers stripped (MIT requires retention). The fontello font (2,358 glyphs) ships
with no licence manifest. **This requires a legal decision by the maintainer and is explicitly
NOT addressed by code changes in this effort.**

---

## 8. Current status of quality gates

| Gate | Status | Evidence |
|---|---|---|
| Install | **BROKEN** | `ERESOLVE` on `npm install` |
| Lockfile | **ABSENT** | no `package-lock.json`, no `yarn.lock` |
| Build | **BROKEN** | 2 further blockers after install |
| Tests | **NONE** | 0 spec files; no `karma.conf.js`; `"scripts": {}` |
| JS lint | **NOT ENFORCED** | `eslint@5` declared; no `.eslintrc*`; no script |
| SCSS lint | **NOT ENFORCED** | `stylelint@9` declared; no `.stylelintrc*`; no script |
| CI | **NONE** | no `.github/` directory |
| Package manager | **npm** (inferred) | README uses `npm install`/`npm init`; one `yarn install` mention; `/yarn.lock` is *gitignored*, indicating npm is intended |

## 9. Repository hygiene

`.git` is 35 MB for a 17 MB working tree because `src/dist` is committed — history holds 4+
copies of the ~1 MB minified CSS plus deleted binaries (`loginbg2.png` 2.9 MB,
`data-sync.png` 1.5 MB, `photo4.jpg` 1.1 MB). 49 commits since 2020-01-25; message style is
predominantly `updated`. No `.editorconfig`, `.browserslistrc`, `.npmignore`, or CI config.

README's licence badge links to `./LICENSE.md`; the actual file is `LICENSE`.

---

## 10. Risks to the modernization

| Risk | Severity | Mitigation |
|---|---|---|
| The public API is *implicit* (CSS classes + DOM conventions), so any selector or class rename is a silent breaking change for consumers | **Critical** | Freeze all selectors/classes; characterization tests before every refactor |
| No demo/example HTML exists in the repo, so there is no reference for intended markup | **High** | Derive expected markup from the selectors in §5; encode it in test fixtures |
| `dist/` is committed and consumed directly via CDN-style paths | **High** | Do not alter build output in this effort; verify byte-level equivalence of the class set |
| webpack 4 + `uglifyjs-webpack-plugin` are structurally incompatible with modern Node | **High** | Smallest fix now (`--openssl-legacy-provider`); flag terser migration as follow-up |
| 267 advisories are almost all transitive through unused packages | **Medium** | Remove only *proven*-unused packages; keep cleanup in isolated commits |
| Stylelint against 30k lines of legacy SCSS will produce thousands of violations | **Medium** | Adopt a narrow, defect-oriented rule set rather than `stylelint-config-twbs-bootstrap` |
| Karma 3 / QUnit 2.9 / ESLint 5 may not run on modern Node | **Medium** | Verify empirically; bump only what is proven broken |
| Fixing D1/D2/D3 changes runtime behaviour | **Medium** | Each is *demonstrably* broken; cover with a failing test first, then fix |

---

## 11. Proposed modernization sequence

1. **Stabilize install** — minimal dependency correction to resolve the peer conflict; commit `package-lock.json`; `npm ci` must work.
2. **Stabilize build** — remove the `webpack-cli`/`webpack-command` collision; declare `cssnano`; add real `scripts`; `npm run build` must work.
3. **Characterize** — `karma.conf.js` + QUnit specs asserting *current* behaviour of `global`, `form-elements`, `navigation`, `tables`.
4. **Refactor behind tests** — isolate module state in `navigation.js`, then `tables.js`, then `global.js`; fix D1–D5 with failing-test-first.
5. **Quality gates** — `.eslintrc.json`, `.stylelintrc.json`, lint scripts, CI workflow.
6. **Dependency forensics** — `DEPENDENCY-AUDIT.md`; remove only proven-unused packages; add Dependabot.
7. **Documentation** — rewrite `README.md`, add `CONTRIBUTING.md`.
8. **Clean-room verification** — fresh clone → `npm ci && npm run lint && npm test && npm run build`.

**Explicitly out of scope:** the licensing conflict (§7), the 728 KB stylesheet, the
accessibility failures, `dist/` de-committing, and any change to CSS class names or DOM
conventions. Each is recorded here so it is not lost.
