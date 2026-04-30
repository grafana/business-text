# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Build / Tooling

- Added `playwright-report/**` to cspell `ignorePaths` and ESLint `ignores` to exclude generated test artifacts.
- `publish.yml`: bump `actions/create-github-app-token` to v3.1.1; stamp and `git add` `src/CHANGELOG.md`
  conditionally on release.
- `coverage.yml`:
  - Add concurrency group.
  - Bump `actions/setup-node` to v6.4.0.
  - Add base-branch checkout with `clean: true` and re-run setup-node.
  - Add `continue-on-error` on base coverage run.
  - Guard base coverage copy with file-existence check.
  - Re-checkout PR branch and restore both coverage files before reporting.
  - Add conditional compare path (skips comparison when base has no coverage).
  - Switch `file-coverage-mode` to `changes-affected`.
  - Bump `davelosert/vitest-coverage-report-action` to v2.11.2.
  - Add `coverage-detail` job using `ArtiomTr/jest-coverage-report-action` v2.3.1.
- `pr-files.yml`:
  - Add concurrency group.
  - Bump `tj-actions/changed-files` to v47.0.6 with `separator: '|'`.
  - Bump `actions/github-script` to v9.0.0.
  - Update JS parsing to use pipe separator.
  - Add early return when no files changed.

### Code Quality

- Suppressed new `react-hooks/set-state-in-effect` rule violations in `AutosizeCodeEditor` (intentional prop-sync patterns).
- Removed unused `eslint-disable no-console` directive from `src/utils/code.ts`.

### E2E / Docker

- Added `.dockerignore` to exclude `node_modules/`, `dist/`, `.git/`, coverage, and other large directories
  from the Docker build context, speeding up playwright image builds.
- Added `provisioning/dashboards/e2e-empty.json` (empty dashboard) and switched the `Should add default text
  panel` test to use it, avoiding tooltip interference from other panels loaded in `e2e.json`.
- Optimized `test/Dockerfile`:
  - Removed redundant `npx playwright install --with-deps chromium` (already bundled in base image).
  - Switched to `npm ci --omit=prod` to skip unused production dependencies.
  - Replaced `COPY . .` with selective copies for better layer caching.

### Dependencies

- Updated `@grafana/plugin-e2e` to 3.6.1 (Grafana 13 dashboard layout support, dashboard smoke testing, e2e-selectors bumps).
- Updated `@swc/core` to 1.15.32, `@typescript-eslint/{eslint-plugin,parser}` to 8.59.1,
  `eslint-plugin-react-hooks` to 7.1.1, `markdownlint-cli2` to 0.22.1, `prettier` to 3.8.3,
  `terser-webpack-plugin` to 5.5.0, `webpack` to 5.106.2, `@grafana/scenes` to 7.4.2,
  `@emotion/css` to 11.13.5.
- Pinned `@grafana/data`, `@grafana/i18n`, `@grafana/runtime`, `@grafana/schema`, and `@grafana/ui` to exact version 12.4.2.
- Upgraded `uuid` to 14.0.0 (security fix for buffer bounds validation in v3/v5/v6; v4 API unchanged).
- Upgraded `cspell` to 10.0.0.
