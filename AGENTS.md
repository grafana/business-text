# AGENTS.md — Business Text Panel Plugin

> Grafana panel plugin providing data-driven text with Markdown and Handlebars support.
> Plugin ID: `marcusolsson-dynamictext-panel` | Owner: `@grafana/dataviz-squad`

## Build / Lint / Test Commands

```bash
# Install
npm install                    # Install dependencies (use npm ci in CI)

# Build
npm run build                  # Production webpack build
npm run dev                    # Dev build with watch mode

# Lint & Format
npm run lint                   # ESLint (flat config, TS-aware)
npm run lint:fix               # ESLint with auto-fix
npm run typecheck              # TypeScript type-check (tsc --noEmit)

# Unit Tests (Jest + @testing-library/react)
npm test                       # Watch mode, only changed files
npm run test:ci                # CI mode with coverage (--maxWorkers 4)
npx jest src/utils/handlebars.test.ts          # Run a single test file
npx jest --testPathPattern="TextPanel"         # Run tests matching a pattern
npx jest -t "Should find component"            # Run a single test by name

# E2E Tests (Playwright + @grafana/plugin-e2e)
npm run test:e2e               # Headless Playwright
npm run test:e2e:dev           # Playwright UI mode
npm run test:e2e:docker        # Full Docker Compose (Grafana + tests)

# Local Development
npm run markdownlint             # markdownlint-cli2 on AGENTS.md, CHANGELOG.md, README.md
npm run spellcheck               # cspell on all source files
npm run start                  # Start Grafana via Docker Compose (latest)
npm run stop                   # Stop Docker containers
```

Node version: **24** (see `.nvmrc` / `mise.toml`). Minimum supported: `>=24`.

## Project Structure

```text
src/
├── module.ts                  # Plugin entry point
├── plugin.json                # Plugin manifest
├── migration.ts               # Options migration logic
├── @types/                    # Ambient type declarations
├── __mocks__/                 # Jest mocks for @grafana packages
├── components/                # React components (one directory each)
│   ├── TextPanel/             # Main panel component
│   ├── Text/                  # Content renderer
│   ├── Row/                   # Per-row renderer
│   ├── AutosizeCodeEditor/    # Monaco editor with autosize and toolbar
│   ├── CustomEditor/          # Base code editor
│   ├── ContentPartialsEditor/ # Partials management
│   └── ResourcesEditor/      # External resources management
├── constants/                 # Shared constants and test IDs
├── hooks/                     # Custom React hooks
├── img/                       # Plugin icons and images
├── types/                     # TypeScript interfaces and enums
└── utils/                     # Pure utility functions
test/                          # Playwright E2E tests
.config/                       # Grafana scaffolded config (DO NOT EDIT)
provisioning/                  # Grafana provisioning for local dev
```

## Architecture

No backend component. Uses webpack via `.config/` for bundling and SWC
for transpilation.

1. **Entry point** — `src/module.ts` exports a `PanelPlugin<PanelOptions>`
   using the builder pattern to register custom editors and field config.
2. **Migration** — `setMigrationHandler(getMigratedOptions)` runs on load
   to upgrade deprecated options via `src/migration.ts`.
3. **Rendering** — `TextPanel` receives panel props, resolves external
   resources (CSS/JS), and delegates to `Text` / `Row` components.
4. **Templating** — Content is processed through Handlebars (with custom
   helpers) and/or markdown-it with highlight.js for syntax highlighting.
5. **Editors** — Custom option editors (`TextEditor`, `HelpersEditor`,
   `StylesEditor`, `ResourcesEditor`, `ContentPartialsEditor`,
   `AfterRenderEditor`) are registered via `addCustomEditor()`.

## Code Style Guidelines

### Formatting (Prettier)

- Print width: **120**
- Single quotes, no JSX single quotes
- Trailing commas: `es5`
- Semicolons: always
- 2-space indentation, no tabs
- End of line: `auto`

### Imports

Three groups separated by blank lines, each group alphabetized.
Destructured members sorted alphabetically within braces:

1. **External packages** — `@emotion/css`, `@grafana/*`, `react`, `handlebars`, etc.
2. **Internal absolute imports** — relative paths from `src/` (`../../constants`, `../../types`)
3. **Sibling/local imports** — `./TextPanel.styles`, `../Text`

```typescript
import { css, cx } from '@emotion/css';
import { PanelProps } from '@grafana/data';
import { useStyles2, useTheme2 } from '@grafana/ui';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { TEST_IDS } from '../../constants';
import { useExternalResources } from '../../hooks';
import { PanelOptions, RenderMode } from '../../types';

import { getStyles } from './TextPanel.styles';
```

### Naming Conventions

| Element             | Convention                              | Example                                      |
| ------------------- | --------------------------------------- | -------------------------------------------- |
| Component files     | `PascalCase.tsx`                        | `TextPanel.tsx`                              |
| Style files         | `ComponentName.styles.ts`               | `TextPanel.styles.ts`                        |
| Test files          | `ComponentName.test.tsx`                | `TextPanel.test.tsx`                         |
| Hook files          | `useName.ts`                            | `useDashboardRefresh.ts`                     |
| Utility files       | `kebab-case.ts`                         | `code-parameters.ts`                         |
| Constants           | `SCREAMING_SNAKE_CASE`                  | `TEST_IDS`, `DEFAULT_OPTIONS`                |
| Enums               | PascalCase name, SCREAMING_SNAKE values | `enum RenderMode { EVERY_ROW = 'everyRow' }` |
| Interfaces          | PascalCase                              | `PanelOptions`, `Props`                      |
| Functions/variables | camelCase                               | `getStyles`, `onChangeFrame`                 |
| Barrel exports      | Every directory has `index.ts`          | `export * from './TextPanel'`                |

### TypeScript

- **Named exports only** — no default exports anywhere.
- Use **enums** (not string unions) for option types (`RenderMode`, `EditorType`, `ResourceType`).
  Use `const enum` for internal-only enums; regular `enum` when values are iterated at runtime.
- Use **interfaces** for object shapes and component props; use `type` for unions and intersections.
- Prefer explicit generics: `useState<RowItem[]>([])`, `useState<boolean>(false)`.
- Avoid `as any` in production code; acceptable in test mocks and partial objects.
  Use `as never` for Grafana API type escapes. Prefer `unknown` or proper generics over `any`.
- `@typescript-eslint/no-empty-object-type` is disabled.

### React Components

- **Functional components only** using `React.FC<Props>` with arrow functions.
- Props destructured in the function signature, not inside the body.
- Styles via `@emotion/css` + Grafana's `useStyles2(getStyles)` pattern.
- Style functions: `(theme: GrafanaTheme2) => ({ className: css\`...\` })`.
- Wrap callbacks in `useCallback` with explicit dependency arrays.
- All testable elements must use `data-testid={TEST_IDS.section.element}`.
- Centralized test IDs live in `src/constants/tests.ts`.

### JSDoc Comments

This codebase uses **pervasive JSDoc comments**. Add `/** ... */` blocks above:

- Every interface and each of its properties (include `@type` tags on properties)
- Every function and constant declaration
- Logical sections within function bodies (state, theme, callbacks, return)

```typescript
/**
 * Properties
 */
interface Props {
  /**
   * Content
   *
   * @type {string}
   */
  content: string;
}

/**
 * Text Panel
 */
export const TextPanel: React.FC<Props> = ({ content }) => {
  /**
   * Styles
   */
  const styles = useStyles2(getStyles);

  /**
   * Return
   */
  return <div className={styles.wrapper}>{content}</div>;
};
```

### Error Handling

- Use **try/catch** in async effects; store errors in state with `setError(e)`.
- Display errors with Grafana's `<Alert severity="error">` component.
- Format: `error instanceof Error ? error.message : \`${error}\``.
- Wrap `new Function(...)` calls in try/catch; return a no-op on failure and log with `console.error`.
- Effects that subscribe must return cleanup functions calling `unsubscribe()`.

### Testing Patterns (Jest + Testing Library)

- Mock external modules at file top: `jest.mock('@grafana/runtime')`.
- Define a `getComponent` factory returning a rendered component with sensible defaults.
- Use `describe`/`it` blocks with JSDoc section comments.
- Assert with `screen.getByTestId(TEST_IDS.xxx.yyy)`.
- Clean up in `beforeEach`/`afterAll` with `jest.clearAllMocks()` / `jest.resetAllMocks()`.
- Use `act()` + `render()` for components with async side effects.
- Jest sets `process.env.TZ = 'UTC'` globally (`jest.config.js`) so tests
  run consistently regardless of local timezone.

### Key Dependencies

| Package                                            | Purpose                                     |
| -------------------------------------------------- | ------------------------------------------- |
| `handlebars`                                       | Template engine for dynamic content         |
| `markdown-it` + `highlight.js`                     | Markdown rendering with syntax highlighting |
| `@grafana/data`, `@grafana/ui`, `@grafana/runtime` | Grafana plugin SDK                          |
| `@grafana/scenes`                                  | Dashboard scene integration                 |
| `@hello-pangea/dnd`                                | Drag-and-drop in editors                    |

### Migration Pattern

When removing or renaming panel options, update `src/migration.ts`:

- Define deprecated fields in the `OutdatedPanelOptions` interface with
  JSDoc noting the removal version.
- Use spread destructuring to extract legacy options:
  `const { legacyField, ...actualOptions } = panel.options`.
- Use `semver.lt()` for version-gated migrations.
- Use `Array.isArray` / type checks for format changes when needed.
- Add corresponding tests in `migration.test.ts`.

### ESLint

Flat config (ESLint 9) extending `@grafana/eslint-config/flat.js`
and `eslint-config-prettier`. Custom rule:
`@typescript-eslint/no-empty-object-type: off`. Test files, mocks, config
files, and server dirs are excluded from linting.

### Additional Rules

- `no-console` and `no-debugger` are errors (note: the inherited
  `@grafana/eslint-config` allows `console.error`, `console.log`,
  `console.warn`, and `console.info`)
- `@typescript-eslint/no-deprecated` is a warning — avoid
  using deprecated APIs
- `@typescript-eslint/no-unused-vars` is off (inherited from
  `@grafana/eslint-config`) — rely on IDE/TypeScript to catch
  unused variables

### CI/CD

- **CI** (`.github/workflows/push.yml`): Runs on push to `main` and all PRs.
  Uses `grafana/plugin-ci-workflows`. E2E tests run via Docker Compose against
  Grafana `>=12.3 <13.0`. The dev image is skipped but the React 19 preview
  image is included (`run-playwright-with-skip-grafana-react-19-preview-image: false`).
- **CD** (`.github/workflows/publish.yml`): Manual dispatch to dev/ops/prod environments.
- **Coverage** (`.github/workflows/coverage.yml`): Compares PR test coverage against
  base branch and posts a coverage comparison comment on the PR.
- **PR Files** (`.github/workflows/pr-files.yml`): Posts a categorized file changes
  summary comment on PRs (Source, Tests, CI/CD, Config, Docs).
- The `.config/` directory is **scaffolded by Grafana** — do not edit files in it.
- **Do NOT pin `grafana/plugin-ci-workflows` to a commit SHA.** Grafana's CI
  enforces tagged releases only (e.g., `@ci-cd-workflows/v7.0`). SHA pinning
  will fail the "Check for release channel" job. All other GitHub Actions
  should be pinned to SHAs.

## Critical Rules

- **Do not use `volkovlabs.io` URLs** anywhere in the
  codebase. This project was forked from Volkov Labs
  and all references should point to Grafana equivalents
  (e.g., `grafana.com`).
- **Never modify anything inside `.config/`** —
  managed by Grafana plugin tooling.
- **Never change `id` or `type`** in `src/plugin.json`.
- Changes to `plugin.json` require a
  **Grafana server restart**.
- Use webpack from `.config/` for builds;
  do not add a custom bundler.
- Use `@grafana/plugin-e2e` for E2E tests.
- Grafana API docs:
  <https://grafana.com/developers/plugin-tools/llms.txt>
- **Always run `npm run typecheck`** when `src/` files
  are changed and fix any type errors before committing.
- **Always run `npm run lint`** before committing changes
  to `src/`. Fix errors with `npm run lint:fix` and
  verify no errors remain.
- **Always run `npm run markdownlint`** on any `.md` file you create or modify (including `AGENTS.md`,
  `README.md`, `CHANGELOG.md`) and fix all reported issues before committing.
- **Always run `npm run spellcheck`** before committing. Fix any issues and add new words to
  `cspell.config.json` if they are legitimate.
- **Always update `CHANGELOG.md` before committing.**
  Every commit must include the corresponding changelog
  entry. Do not commit code changes without first updating
  the changelog in the same commit.
- **NEVER commit unless the user explicitly asks.**
  Do not commit as part of completing a task.
- **NEVER push unless the user explicitly asks.**
  Do not push as part of completing a task.
  Never chain `git commit && git push` in one command.
  Always wait for the user to explicitly ask to push.
- **After pushing, always update the PR summary** if a
  PR exists for the current branch. Treat push and PR
  update as an atomic pair — never stop between them.
  Use `gh pr edit` to update the title and body with
  well-formatted text that reflects all changes across
  the entire branch.
- **Do not add a `Co-Authored-By` line** to commit messages.
- **Never add "Generated with Claude" or similar
  attribution lines** to PR summaries, commit messages,
  or any other output.
- **Prefer subagents** for research, code exploration,
  and multi-step work. Use the Task tool with
  `explore` or `general` agents rather than running
  many search/read commands directly. Launch multiple
  agents in parallel when tasks are independent.

## Changelog Policy

Add entries under the current `[Unreleased]` section in `CHANGELOG.md`.
Categorize under `### Added`, `### Changed`, `### Removed`,
`### Fixed`, or `### Project Updates` as appropriate.

## Branching Policy

- **Never commit directly to `main`**. Always create a new branch for changes.
- Use descriptive branch names (e.g., `feat/add-feature`, `fix/bug-description`).
- When pushing new commits to a PR, always update the PR summary to reflect all
  changes.
- **Always create pull requests as drafts**
  (`gh pr create --draft`).
- When checking out a branch or `main`, always
  `git fetch` and `git pull` to ensure you have
  the latest changes.
- **Always run `git status`** before constructing
  `git add` commands. Only add files that are unstaged
  or untracked — do not add files that are already
  staged or deleted.

## PR Summary Policy

- **Wrap PR summary lines at 120 characters** — use the
  full width, do not wrap shorter than necessary.
- **Use categories in PR summaries** to organize changes.
  Group bullet points under headings like `### Added`,
  `### Fixed`, `### Changed`, `### Removed`,
  `### Dependencies`, `### CI/CD`, `### Documentation`,
  `### AGENTS.md`, `### Tooling`, etc.
- Always include a `## Test plan` section with a
  checklist of manual or automated verification steps.
