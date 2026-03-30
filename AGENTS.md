# AGENTS.md — Business Text Panel Plugin

> Grafana panel plugin providing data-driven text with Markdown and Handlebars support.
> Plugin ID: `marcusolsson-dynamictext-panel` | Owner: `@grafana/dataviz-squad`

## Build / Lint / Test Commands

```bash
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
│   ├── CustomEditor/          # Base code editor
│   ├── ContentPartialsEditor/ # Partials management
│   └── ResourcesEditor/      # External resources management
├── constants/                 # Shared constants and test IDs
├── hooks/                     # Custom React hooks
├── types/                     # TypeScript interfaces and enums
└── utils/                     # Pure utility functions
test/                          # Playwright E2E tests
.config/                       # Grafana scaffolded config (DO NOT EDIT)
provisioning/                  # Grafana provisioning for local dev
```

## Code Style Guidelines

### Formatting (Prettier)

- Print width: **120**
- Single quotes, no JSX single quotes
- Trailing commas: `es5`
- Semicolons: always
- 2-space indentation, no tabs
- End of line: `auto`

### Imports

Three groups separated by blank lines, each group alphabetized:

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

- Use **enums** (not string unions) for option types (`RenderMode`, `EditorType`, `ResourceType`).
- Use **interfaces** for component props and options objects.
- Prefer explicit generics: `useState<RowItem[]>([])`, `useState<boolean>(false)`.
- Path alias `@/*` maps to `src/*` (configured in `tsconfig.json`).
- `@typescript-eslint/no-empty-object-type` is disabled.

### React Components

- **Functional components only** using `React.FC<Props>` with arrow functions.
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

### Key Dependencies

| Package                                            | Purpose                                     |
| -------------------------------------------------- | ------------------------------------------- |
| `handlebars`                                       | Template engine for dynamic content         |
| `markdown-it` + `highlight.js`                     | Markdown rendering with syntax highlighting |
| `@grafana/data`, `@grafana/ui`, `@grafana/runtime` | Grafana plugin SDK                          |
| `@volkovlabs/components`                           | AutosizeCodeEditor, CodeParametersBuilder   |
| `@grafana/scenes`                                  | Dashboard scene integration                 |
| `react-beautiful-dnd`                              | Drag-and-drop in editors                    |

### ESLint

Flat config (ESLint 9) extending `@grafana/eslint-config/flat.js`,
`@volkovlabs/eslint-config`, and `eslint-config-prettier`. Custom rule:
`@typescript-eslint/no-empty-object-type: off`. Test files, mocks, config
files, and server dirs are excluded from linting.

### Additional Rules

- `no-console` and `no-debugger` are errors
- `@typescript-eslint/no-deprecated` is a warning — avoid
  using deprecated APIs
- Unused variables are errors (except rest siblings)

### CI/CD

- **CI** (`.github/workflows/push.yml`): Runs on push to `main` and all PRs. Uses `grafana/plugin-ci-workflows`.
- **CD** (`.github/workflows/publish.yml`): Manual dispatch to dev/ops/prod environments.
- The `.config/` directory is **scaffolded by Grafana** — do not edit files in it.

## Critical Rules

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
- **Always run `npx markdownlint-cli`** on any `.md`
  file you create or modify (including `AGENTS.md`,
  `README.md`, `CHANGELOG.md`) and fix all reported
  issues before committing.
- **Always run cspell** after making changes:
  `npx cspell@6.13.3 -c cspell.config.json
"**/*.{ts,tsx,js,go,md,mdx,yml,yaml,json,scss,css}"`
  and fix any issues before committing. Add new words
  to `cspell.config.json` if they are legitimate.
- **Always update `CHANGELOG.md`** when committing any
  change. Include the changelog update in the same commit.
- **NEVER commit unless the user explicitly asks.**
  Do not commit as part of completing a task.
- **NEVER push unless the user explicitly asks.**
  Do not push as part of completing a task.
- **Prefer subagents** for research, code exploration,
  and multi-step work. Use the Task tool with
  `explore` or `general` agents rather than running
  many search/read commands directly. Launch multiple
  agents in parallel when tasks are independent.

## Changelog Policy

**Always update `CHANGELOG.md` when making changes.** Every commit that
modifies code, documentation, dependencies, or configuration must have a
corresponding entry in the changelog under the current unreleased version
section. Add entries as part of the same commit or as a follow-up commit
before pushing.

## Branching Policy

- **Never commit directly to `main`**. Always create a new branch for changes.
- Use descriptive branch names (e.g., `feat/add-feature`, `fix/bug-description`).
- When pushing new commits to a PR, always update the PR summary to reflect all
  changes.
- **Always create pull requests as drafts**
  (`gh pr create --draft`).
