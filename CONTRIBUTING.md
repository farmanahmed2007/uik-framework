# Contributing to UIK Framework

Thanks for helping. This project is a long-lived jQuery/SCSS UI kit with real
consumers, so the guidance below is mostly about **not breaking them**.

---

## The one rule that matters most

**UIK's public API is its CSS class names and DOM conventions, not its function
signatures.** There is nothing to import and nothing to instantiate — consumers opt
into behaviour by writing markup that matches documented selectors.

That means renaming a class, changing a selector, or altering the markup a module
expects is a **breaking change**, even though no exported symbol changed.

Before changing any selector or class name:

1. Search the whole repository for it, in both `src/lib/js` and `src/lib/sass`.
2. Check `AUDIT-BASELINE.md` §5, which lists the selectors each module owns.
3. Check `git log -S '<the-name>'` to see why it exists.
4. If it is reachable from consumer markup, **leave it alone** and add rather than rename.

If you cannot establish that something is internal, treat it as public.

## Getting set up

```bash
git clone https://github.com/farmanahmed2007/uik-framework
cd uik-framework
npm ci
npm run lint && npm test && npm run build
```

All four should succeed on a clean checkout with Node 20 or 22. If any of them do
not, that is a bug — please open an issue rather than working around it.

## Branching

- Branch off `master`. Do not commit to `master` directly.
- Name branches for what they do: `fix/sticky-header-offset`, `test/navigation-coverage`,
  `docs/architecture`, `chore/drop-unused-deps`.
- Rebase on `master` before opening a pull request; keep history linear.
- Do not rewrite published history.

## Commits

Keep commits focused. One concern per commit.

Use a conventional prefix:

| Prefix | For |
| --- | --- |
| `feat:` | New capability |
| `fix:` | A defect fix |
| `refactor:` | Behaviour-preserving restructuring |
| `test:` | Tests only |
| `docs:` | Documentation only |
| `chore:` | Dependencies, tooling, config |
| `ci:` | Pipeline changes |
| `build:` | Build configuration or output |

**Do not combine** dependency cleanup, formatting, refactoring, feature work and
test creation into one commit. If a change is hard to describe in one sentence, it
is probably several commits.

Explain **why** in the body, not just what. The diff already shows what changed.
For anything non-obvious, state what you verified and how.

## Testing

### Every behaviour change needs a test

`npm test` must pass before you push. New behaviour needs new assertions.

### Changing legacy behaviour: characterize first

This codebase has behaviour nobody documented and consumers may depend on. So:

1. **Write a test that captures what the code does today.** Not what you think it
   should do — what it actually does.
2. **Run it and watch it pass.** If it fails, your understanding was wrong; fix your
   understanding, not the test.
3. **Refactor.**
4. **Run the same test again.** It must still pass.

Only change what a test proves is broken. "Cleaner" is not the same as "correct",
and an odd-looking line is often load-bearing. Two examples already in the tree:

- `fadeOut("3000")` looks like a three-second animation. jQuery does not recognise
  that string and silently uses its 400 ms default, so 400 ms is the behaviour that
  shipped. It was replaced with `400`, not `3000`.
- Two `==` comparisons put a number against a raw HTML attribute string. Tightening
  them to `===` without also coercing the attribute would break step completion, so
  they carry a scoped `eslint-disable` with the reason instead.

### Writing specs

Specs live in `test/*.spec.js` and run under QUnit in headless Chrome.

```js
QUnit.test('describes the behaviour, not the implementation', function (assert) {
    UIKTest.set('<div class="alert"><a class="close">x</a></div>');

    UIKTest.find('.close').trigger('click');

    assert.strictEqual(UIKTest.find('.alert').length, 0, 'alert is removed');
});
```

- `UIKTest.set(html)` fills the fixture; it is emptied after every test.
- `UIKTest.find(selector)` searches inside the fixture only.
- jQuery animations are disabled globally, so assert on settled DOM.
- Dispatch real events with `.trigger()` rather than calling handlers directly.
- Give every assertion a message. A bare `assert.ok(x)` tells a future reader nothing.

Most modules bind delegated handlers to `document` at DOM-ready, so fixture markup
injected during a test is picked up automatically. Modules that cannot delegate —
`tables.js`, because scroll events do not bubble — expose an idempotent `init()`;
call it after setting your fixture.

## Linting

```bash
npm run lint
```

Both linters must report zero errors.

- Do not add blanket rule disables. If a rule genuinely cannot apply, use a
  line-scoped `eslint-disable-next-line` **with a comment explaining why**.
- Do not run an autoformatter across the repository. Large cosmetic diffs bury the
  real change and make `git blame` useless.
- Vendored code under `src/lib/js/plugins/` and `src/lib/sass/plugins/` is excluded
  from linting on purpose — it is kept byte-identical to upstream so it can be
  re-synced. Do not reformat it.

## Build output

`src/dist/` is **not** tracked in git. It is build output, regenerated at publish
time by the `prepack` script and shipped to npm through the `files` allowlist.

Run `npm run build` when you need the bundles locally. Never `git add -f` them.

If your change alters the generated CSS or JS, say so in the commit message, since
reviewers cannot see it in the diff.

## Dependencies

- `dependencies` is intentionally empty. jQuery is a `peerDependency`.
- Before adding a devDependency, check whether something already present does the job.
- Before removing one, prove it is unused: search the build config, the test config,
  every npm script, both lint configs, and all source. Record the finding in
  `DEPENDENCY-AUDIT.md`.
- Keep dependency changes in their own commit, separate from functional work.

## Pull requests

A pull request should:

- [ ] Pass CI on both Node 20 and 22 (install, both linters, tests, build).
- [ ] Contain focused commits with explanatory messages.
- [ ] Include tests for any behaviour change.
- [ ] Leave every CSS class and selector intact, or justify each change explicitly.
- [ ] Update `README.md` if it changes commands, requirements or architecture.
- [ ] Note any change to `src/dist/` and why.

In the description, say what you verified and how. "Tests pass" is less useful than
"reproduced the sticky header staying hidden, added a failing assertion, fixed the
offset arithmetic, confirmed it now tracks scroll position."

## Reporting bugs

Include the UIK version, the browser, a minimal markup snippet that reproduces the
problem, what you expected, and what happened. A snippet that can be dropped into a
blank page with jQuery and the two bundles is worth more than a description.

## Known limitations

Please read the **Known limitations** section of [README.md](./README.md) before
filing. Several rough edges — stylesheet size, the global focus-outline reset,
missing `prefers-reduced-motion` guards, orphaned SCSS partials, framework-owned
element IDs, and the vendored-fancyBox licence conflict — are known, deliberate
records rather than undiscovered bugs. Additional context is in
[AUDIT-BASELINE.md](./AUDIT-BASELINE.md).
