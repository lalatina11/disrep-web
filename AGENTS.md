# Agent Guidelines & Project Instructions

This repository is **Disrep Web**, a frontend application built with TanStack Start, React 19, Tailwind CSS v4, and shadcn/ui.

---

## 1. Package Manager Rules

- **Default Package Manager**: Always use `bun` as the primary package manager.
  - Development: `bun dev` (or `bun --bun run dev`)
  - Build: `bun run build`
  - Install dependencies: `bun add <package>` / `bun add -d <package>`
  - Linting & Formatting: `bun run check` / `bun run lint` / `bun run format`
- **Fallback**: If `bun` is unavailable or fails in the environment, use `pnpm` as the fallback package manager (`pnpm install`, `pnpm add <pkg>`, `pnpm run build`).
- **Do not use `npm` or `yarn`** unless explicitly instructed by the user.

---

## 2. Styling & Color Rules (shadcn/ui Semantic Tokens)

- **NEVER use explicit/hardcoded Tailwind color utility classes** (e.g., `bg-blue-500`, `text-red-600`, `border-gray-200`, `text-zinc-400`, `bg-stone-100`, `text-slate-700`, `bg-emerald-600`, etc.).
- **ALWAYS use semantic shadcn UI color tokens** defined in the design system (`src/styles.css` / CSS variables) to maintain full light/dark mode compatibility and theme consistency:
  - **Base / Surfaces**: `bg-background`, `text-foreground`
  - **Cards & Surfaces**: `bg-card`, `text-card-foreground`
  - **Popovers & Menus**: `bg-popover`, `text-popover-foreground`
  - **Primary**: `bg-primary`, `text-primary-foreground`, `hover:bg-primary/90`
  - **Secondary**: `bg-secondary`, `text-secondary-foreground`, `hover:bg-secondary/80`
  - **Muted**: `bg-muted`, `text-muted-foreground`
  - **Accent**: `bg-accent`, `text-accent-foreground`
  - **Destructive / Errors**: `bg-destructive`, `text-destructive-foreground`, `text-destructive`
  - **Borders & Inputs**: `border-border`, `border-input`, `ring-ring`, `outline-ring`
  - **Sidebar Tokens**: `bg-sidebar`, `text-sidebar-foreground`, `bg-sidebar-primary`, `text-sidebar-primary-foreground`, `bg-sidebar-accent`, `border-sidebar-border`
- All component styles must align with shadcn/ui components (`src/components/ui/`) and support dark mode seamlessly via CSS variables (`.dark` class).

---

## 3. Project Architecture & Conventions

### Directory Structure & Path Aliases
- Use the `#/*` import path alias (maps to `./src/*`):
  - `#/components/ui/*` - shadcn UI primitives
  - `#/components/forms/*` - Modular form components
  - `#/components/provider/*` - Context and state providers (Theme, QueryClient, etc.)
  - `#/components/templates/*` - Layout/page templates (e.g., NotFound)
  - `#/lib/server-actions/*` - TanStack Start server functions (`createServerFn`)
  - `#/lib/validations/*` - Zod validation schemas
  - `#/lib/stores/*` - Zustand global state stores
  - `#/lib/types/*` - TypeScript interfaces, types, and enums
  - `#/lib/client-fetch.ts` - Client-side fetch helper with auth retry/refresh mechanism
  - `#/lib/utils.ts` - Utility functions (`cn` helper)
  - `#/routes/*` - TanStack Router file-based routes

### Form Validation & Handling
- Use `react-hook-form` with `@hookform/resolvers/zod` and schema definitions in `src/lib/validations/`.
- Use shadcn `Field`, `FieldLabel`, `FieldDescription`, `FieldError`, `FieldSet` components from `#/components/ui/field`.

### Localization
- Ensure all user-facing UI text, form labels, descriptions, placeholders, buttons, toasts, and error messages are written in **Indonesian (Bahasa Indonesia)**.
- HTML root attribute must remain `<html lang="id">`.

### Linting & Formatting
- The project uses **Biome** (`biome.json`).
- Indentation style: `tab`.
- Quote style: `double`.
- Keep code clean and verify formatting/linting using `bun run check`.

---

## 4. Git & Contribution Rules

- **No AI Attribution**: Never include AI agents, bot identities, or assistants as contributors, authors, or co-authors in git commits (e.g., no `Co-authored-by:` trailers mentioning AI), pull requests, or GitHub contributor lists. All commits, metadata, and contributions must reflect only the human user.

