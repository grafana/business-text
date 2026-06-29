# Developer Changelog

All notable changes to this project will be documented in this file.
This changelog is internal and developer facing, unlike the root [CHANGELOG.md](../CHANGELOG.md) which is included in the
[catalog page](https://grafana.com/grafana/plugins/marcusolsson-dynamictext-panel/?tab=changelog) which is also
displayed within Grafana
([example](http://localhost:3000/plugins/marcusolsson-dynamictext-panel?page=changelog)).
> Note:: Run `npm run check-changelog` (or the full `npm run prerelease`) before publishing. The release workflow
> (`check-changelog` job in [publish.yml](../.github/workflows/publish.yml)) runs the same validation and will fail if
> changelogs are not stamped for the `package.json` version.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [6.3.0]

### Build / Tooling

- Added `test:e2e:install` script to install the Playwright Chromium binary via the project's pinned local CLI
  (avoids `npx` resolving a mismatched Playwright version and works with `ignore-scripts=true`).
- `playwright.config.ts`: added an env-gated `channel` option. Set `PLAYWRIGHT_CHANNEL=chrome` to run E2E against a
  locally installed Google Chrome and skip the bundled Chromium download; left undefined in CI/Docker.
- Added `check-changelog` and `prerelease` npm scripts; extracted changelog validation into `scripts/check-changelog.sh`
  (shared by `publish.yml` and local release prep). `prerelease` also runs typecheck, lint, spellcheck, markdownlint,
  unit tests, build, and levitate compatibility checks.

## [6.2.3] - 2026-05-21

### Build / Tooling

- Added `playwright-report/**` to cspell `ignorePaths` and ESLint `ignores` to exclude generated test artifacts.
- `publish.yml`: replace `stamp-changelog` with `check-changelog` (read-only pre-flight validation);
  validates both `CHANGELOG.md` and `src/CHANGELOG.md` before release.
- `coverage.yml`:
  - Add concurrency group.
  - Bump `actions/setup-node` to v6.4.0.
  - Add base-branch checkout with `clean: true` and re-run setup-node.
  - Add `continue-on-error` on base coverage run.
  - Guard base coverage copy with file-existence check.
  - Re-checkout PR branch and restore both coverage files before reporting.
  - Add conditional compare path (skips comparison when base has no coverage).
  - Switch `file-coverage-mode` to `changes-affected`.
  - Bump `davelosert/vitest-coverage-report-action` to v2.12.0.
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
