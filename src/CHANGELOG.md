# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Build / Tooling

- Added `playwright-report/**` to cspell `ignorePaths` to exclude generated test artifacts from spell checking.
- Added `playwright-report/**` to ESLint `ignores` to exclude generated test artifacts from linting.
- Updated CI/CD workflows.
- Updated development scripts and tooling.
- Updated development documentation.

### Code Quality

- Suppressed new `react-hooks/set-state-in-effect` rule violations in `AutosizeCodeEditor` (intentional prop-sync patterns).
- Removed unused `eslint-disable no-console` directive from `src/utils/code.ts`.

### E2E / Docker

### Dependencies

- Updated `@grafana/plugin-e2e` to 3.6.1 (Grafana 13 dashboard layout support, dashboard smoke testing, e2e-selectors bumps).
- Updated `@swc/core` to 1.15.32, `@typescript-eslint/{eslint-plugin,parser}` to 8.59.1,
  `eslint-plugin-react-hooks` to 7.1.1, `markdownlint-cli2` to 0.22.1, `prettier` to 3.8.3,
  `terser-webpack-plugin` to 5.5.0, `webpack` to 5.106.2, `uuid` to 13.0.1,
  `@grafana/scenes` to 7.4.2, `@emotion/css` to 11.13.5.
- Pinned `@grafana/data`, `@grafana/i18n`, `@grafana/runtime`, `@grafana/schema`, and `@grafana/ui` to exact version 12.4.2.
