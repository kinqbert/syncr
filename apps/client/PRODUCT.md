# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences, weighted equally:

- **Small product teams** (owners, managers, members) who use Syncr day to day to plan projects, move tasks through a fixed Kanban flow, track deadlines, and talk to each other. Their job is to know what to work on, see what teammates are doing, and keep work moving without juggling separate tools.
- **Demo visitors** who open the read-only workspace at `demo.syncr.cc`, which is seeded with data and has simulated teammates acting in realtime. They are judging the product and the craft behind it, usually within a few minutes, and need the workspace to feel credible, alive, and finished on first contact.

Roles: owner, manager, member, with role-based permissions. Owners and managers see every project; members see only the projects they belong to.

## Product Purpose

Syncr is a project management and team collaboration workspace for small product teams. It brings projects, tasks, calendars, team management, notifications, and conversations together in one place. Success means a small team runs its work in Syncr without reaching for a separate task tracker, calendar, or chat tool, and a demo visitor leaves convinced it is a real, complete product.

## Positioning

All-in-one for small teams: tasks, calendar, chat, and team in one workspace, so a small team doesn't have to stitch together several tools. The bet is breadth that fits a small team, not enterprise depth or configurability.

## Operating Context

- Desktop-first workspace with a collapsible sidebar, plus a mobile layout with a drawer.
- Core loop: dashboard (my open tasks, due today, activity, birthdays) → project (overview, Kanban board, calendar) → task details (two-pane: content on the left, inline-editable properties that save as you go on the right).
- Realtime throughout over Socket.IO: task changes, activity feeds, notifications, chat messages, and typing indicators push live to everyone in the company.
- Optional Google Calendar sync for task deadlines.
- Company settings include work hours; users manage their profile, password, theme, and calendar connections.
- Demo mode runs on the `demo.` subdomain: read-only, signed in automatically as `demo@syncr.cc`, with simulated teammates moving tasks, commenting, and messaging.

## Capabilities and Constraints

- Kanban columns are fixed today (Backlog, Todo, In Progress, Review, Done). Custom columns are on the roadmap.
- Light, dark, and system themes are supported and must stay supported.
- **UI stays on MUI.** Components and theming go through MUI; no switch to another UI library.
- **Company branding is coming.** Per-company theming is on the roadmap, so the UI must accept a tenant's brand colour cleanly and must not depend on one fixed accent.
- Roadmap items not built yet: a richer dashboard (more stats, company news), a team page menu, per-project and per-task notification muting, a forgot-password flow, and real avatar image uploads.
- Stack: React 19, TypeScript, Vite, MUI, TanStack Query, Zustand, FullCalendar, dnd-kit; NestJS + PostgreSQL backend; shared types in `@syncr/packages`.

## Brand Commitments

None fixed beyond the existing name, Syncr. The current favicon (`public/favicon.svg`, a folder mark on an indigo tile) is not a binding commitment.

## Evidence on Hand

- Product screenshots in `assets/` at the repo root: dashboard, projects, Kanban, project overview, task details, calendar, conversations, team, notifications, dark-mode dashboard and Kanban, mobile dashboard and Kanban.
- A live seeded demo at `demo.syncr.cc`.
- There are no customers, testimonials, usage numbers, pricing, or press. Future work must not invent them.

## Product Principles

1. **One workspace, no tool-switching.** A new capability belongs in Syncr only if it saves a small team from needing another tool, and it should link naturally to tasks and projects.
2. **Alive by default.** Teammates' actions show up live. A static or stale screen is a defect, and the demo depends on this most.
3. **Small-team scale.** Sensible defaults over configuration, and no enterprise ceremony.
4. **Credible on first contact.** Every screen must hold up when someone sees it for the first time in the demo: real-looking data, finished states, no rough edges.
5. **Brandable without breaking.** Design choices must survive a company swapping in its own colour.
