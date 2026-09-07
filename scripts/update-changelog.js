#!/usr/bin/env node
/**
 * Inserts a section for the current package.json version into CHANGELOG.md,
 * built from the git commits since the previous release tag.
 *
 * Run automatically by the `version` npm lifecycle script, so `npm version
 * <patch|minor|major>` bumps the version and writes the changelog in one step.
 * Safe to run by hand too — re-running for a version that already has a
 * section replaces that section rather than adding a second one.
 *
 * No dependencies: this has to keep working years from now without a install
 * step of its own.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const CHANGELOG = path.join(ROOT, 'CHANGELOG.md');

/**
 * Conventional-commit type -> Keep a Changelog heading. The existing file uses
 * "Added" / "Removed" / "Fixed", so new sections match that vocabulary.
 */
const SECTIONS = [
  ['Added', ['feat']],
  ['Fixed', ['fix', 'perf']],
  ['Changed', ['refactor', 'style', 'build', 'chore', 'ci', 'revert']],
  ['Documentation', ['docs']],
  ['Tests', ['test']]
];

function git(args) {
  try {
    // stderr is discarded: `git describe` legitimately fails on a repository
    // with no version tags yet, and that is a supported case, not an error to
    // show the user.
    return execFileSync('git', args, {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim();
  } catch {
    return '';
  }
}

/** The most recent version tag that is an ancestor of HEAD, if there is one. */
function previousTag() {
  const tag = git(['describe', '--tags', '--abbrev=0', '--match', 'v*']);
  return tag || '';
}

function commitsSince(tag) {
  const range = tag ? tag + '..HEAD' : 'HEAD';
  const raw = git(['log', range, '--no-merges', '--pretty=format:%s']);
  return raw ? raw.split('\n').filter(Boolean) : [];
}

/** Splits "feat(scope): subject" into its type and subject. */
function parse(subject) {
  const match = /^(\w+)(?:\([^)]*\))?!?:\s*(.+)$/.exec(subject);
  if (!match) {
    return { type: 'other', text: subject };
  }
  return { type: match[1].toLowerCase(), text: match[2] };
}

function today() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return pad(d.getDate()) + '-' + pad(d.getMonth() + 1) + '-' + d.getFullYear();
}

function buildSection(version, commits) {
  const parsed = commits.map(parse);
  const lines = ['## [' + version + '] - ' + today()];

  let wrote = false;
  for (const [heading, types] of SECTIONS) {
    const matching = parsed.filter((c) => types.indexOf(c.type) !== -1);
    if (!matching.length) {
      continue;
    }
    wrote = true;
    lines.push('### ' + heading);
    for (const c of matching) {
      lines.push('- ' + c.text.charAt(0).toUpperCase() + c.text.slice(1));
    }
    lines.push('');
  }

  const other = parsed.filter(
    (c) => !SECTIONS.some(([, types]) => types.indexOf(c.type) !== -1)
  );
  if (other.length) {
    wrote = true;
    lines.push('### Changed');
    for (const c of other) {
      lines.push('- ' + c.text.charAt(0).toUpperCase() + c.text.slice(1));
    }
    lines.push('');
  }

  if (!wrote) {
    lines.push('### Changed');
    lines.push('- Maintenance release; no user-facing changes recorded.');
    lines.push('');
  }

  return lines.join('\n');
}

function main() {
  const version = require(path.join(ROOT, 'package.json')).version;
  const tag = previousTag();
  const commits = commitsSince(tag);

  const section = buildSection(version, commits);
  const existing = fs.readFileSync(CHANGELOG, 'utf8');

  // Replace an existing section for this same version, so re-runs are safe.
  const dup = new RegExp(
    '^## \\[' + version.replace(/\./g, '\\.') + '\\][^\\n]*\\n(?:(?!^## \\[)[\\s\\S])*',
    'm'
  );

  let next;
  if (dup.test(existing)) {
    next = existing.replace(dup, section + '\n');
  } else {
    // Insert directly beneath the file's preamble, above the newest entry.
    const firstEntry = existing.search(/^## \[/m);
    if (firstEntry === -1) {
      next = existing.replace(/\s*$/, '\n\n') + section + '\n';
    } else {
      next =
        existing.slice(0, firstEntry) + section + '\n' + existing.slice(firstEntry);
    }
  }

  fs.writeFileSync(CHANGELOG, next);

  process.stdout.write(
    'CHANGELOG.md updated for ' +
      version +
      ' (' +
      commits.length +
      ' commit' +
      (commits.length === 1 ? '' : 's') +
      ' since ' +
      (tag || 'the start of history') +
      ')\n'
  );
}

main();
