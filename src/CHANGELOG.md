# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Build / Tooling

- Added `playwright-report/**` to cspell `ignorePaths` to exclude generated test artifacts from spell checking.
- Added `playwright-report/**` to ESLint `ignores` to exclude generated test artifacts from linting.
- Updated CI/CD workflows.
- `publish.yml`: bump `actions/create-github-app-token` to v3.1.1; stamp and `git add` `src/CHANGELOG.md`
  conditionally on release.
- `coverage.yml`: add concurrency group; bump `actions/setup-node` to v6.4.0; add base-branch checkout with
  `clean: true` and re-run setup-node; add `continue-on-error` on base coverage run; guard base coverage
  copy with file-existence check; re-checkout PR branch and restore both coverage files; add conditional
  compare path; switch `file-coverage-mode` to `changes-affected`; bump
  `davelosert/vitest-coverage-report-action` to v2.11.2; add `coverage-detail` job using
  `ArtiomTr/jest-coverage-report-action` v2.3.1.
- `pr-files.yml`: add concurrency group; bump `tj-actions/changed-files` to v47.0.6 with `separator: '|'`;
  bump `actions/github-script` to v9.0.0; update JS parsing to use pipe separator; add `.dockerignore` to
  Config category; add early return when no files changed.
- Updated development scripts and tooling.
- Updated development documentation.

### Code Quality

- Suppressed new `react-hooks/set-state-in-effect` rule violations in `AutosizeCodeEditor` (intentional prop-sync patterns).
- Removed unused `eslint-disable no-console` directive from `src/utils/code.ts`.

### E2E / Docker

- Added `provisioning/dashboards/e2e-empty.json` (empty dashboard) and switched the `Should add default text
  panel` test to use it, avoiding tooltip interference from other panels loaded in `e2e.json`.

### Dependencies

- Updated `@grafana/plugin-e2e` to 3.6.1 (Grafana 13 dashboard layout support, dashboard smoke testing, e2e-selectors bumps).
- Updated `@swc/core` to 1.15.32, `@typescript-eslint/{eslint-plugin,parser}` to 8.59.1,
  `eslint-plugin-react-hooks` to 7.1.1, `markdownlint-cli2` to 0.22.1, `prettier` to 3.8.3,
  `terser-webpack-plugin` to 5.5.0, `webpack` to 5.106.2, `uuid` to 13.0.1,
  `@grafana/scenes` to 7.4.2, `@emotion/css` to 11.13.5.
- Pinned `@grafana/data`, `@grafana/i18n`, `@grafana/runtime`, `@grafana/schema`, and `@grafana/ui` to exact version 12.4.2.
