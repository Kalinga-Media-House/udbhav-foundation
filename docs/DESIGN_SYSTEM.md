# UDBHAV Foundation - Design System Architecture

This document explains the enterprise UI architecture.

## Overview
We utilize a headless-first component library approach. Our base components are heavily inspired by `shadcn/ui` and built on top of Radix UI primitives. They use Tailwind CSS for styling and `class-variance-authority` (cva) for managing component variants.

## Component Hierarchy
All core UI components live in `src/components/ui/`.
- **Atoms:** `Button`, `Input`, `Label`, `Badge`, `Typography`
- **Molecules:** `Card`

## Generating Complex Components
For complex components requiring deep state management and accessibility bindings (like `Dialog`, `DropdownMenu`, `Select`, `DataTable`), we explicitly mandate scaffolding them via the `shadcn/ui` CLI instead of hand-rolling them.

**Example Command for Future Development:**
```bash
npx shadcn@latest add dialog select table
```

## Styling & Tokens
All global CSS tokens are defined in `src/styles/tokens.ts` and mapped to `globals.css` via Next.js Tailwind integration. We use HSL color spaces strictly.
- **Primary:** Branding, main call-to-actions.
- **Destructive:** Danger states (e.g. Delete buttons).
- **Muted:** Secondary text, subtle backgrounds.

## Accessibility (WCAG 2.2 AA)
All primitives here are fully accessible:
- `Label` connects to inputs.
- `Button` manages disabled states, hover effects, and `focus-visible` rings explicitly for keyboard navigation.
- Colors are strictly designed for high contrast ratios in both light and dark modes.

## Utility `cn()`
The `cn()` function located in `src/utils/cn.ts` safely merges Tailwind classes, preventing style conflicts (e.g. `p-4 p-8` resolves to `p-8`). Always use it when composing class names on components.
