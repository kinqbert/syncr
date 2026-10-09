# Syncr

Syncr is a full-stack project management and team collaboration app built around projects, task ownership, calendar planning, team communication, and realtime workplace updates. It is designed as a practical workspace for small product teams: users can organize project work, move tasks through a Kanban flow, review activity, manage company members, receive notifications, and discuss work in conversations.

<p align="center">
  <a href="https://demo.syncr.cc"><strong>Open the live demo</strong></a>
</p>

<p align="center">
  <img src="./assets/dashboard.png" alt="Syncr dashboard" width="100%" />
</p>

## Features

- **Workspace dashboard** with your open tasks, due-today work, completed tasks, active projects, team size and unread notifications, plus tasks by status, recent activity and upcoming birthdays.
- **Projects** in a table or grid view with status filters, progress, members and due dates, and a sidebar list for jumping straight into any project.
- **Project overview** with a task summary, status distribution, team workload and an activity timeline.
- **Kanban board** with Backlog, Todo, In Progress, Review and Done columns, drag and drop, inline task creation, priorities, assignees and due dates.
- **Task details** in a two-pane layout: description, acceptance criteria, comments and activity on the left, and inline-editable properties that save as you go on the right.
- **Personal and project calendars** for task deadlines, with optional **Google Calendar** sync.
- **Team management** with role-based permissions, invitations and per-member workload.
- **Notifications inbox** with filters, day grouping and mark-as-read, delivered in realtime over Socket.IO.
- **Realtime conversations** for direct and group chats, with live messages and typing indicators.
- **Workspace settings** including company work hours, profile, password and calendar connections.
- **Light, dark and system themes**, switchable under Settings → Appearance.
- **Responsive UI** with a collapsible sidebar on desktop and a drawer on mobile.
- **Read-only demo mode** with a seeded workspace, served on the `demo.` subdomain.

## Product Preview

| Dashboard                                               | Projects                                              | Kanban board                                         |
| ------------------------------------------------------- | ----------------------------------------------------- | ---------------------------------------------------- |
| <img src="./assets/dashboard.png" alt="Dashboard" />    | <img src="./assets/projects.png" alt="Projects" />    | <img src="./assets/kanban.png" alt="Kanban board" /> |

| Project overview                                                | Task details                                                 | Calendar                                             |
| --------------------------------------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------- |
| <img src="./assets/project-overview.png" alt="Project overview" /> | <img src="./assets/task-details.png" alt="Task details" /> | <img src="./assets/calendar.png" alt="Calendar" />   |

| Conversations                                                  | Team                                         | Notifications                                                 |
| -------------------------------------------------------------- | -------------------------------------------- | ------------------------------------------------------------- |
| <img src="./assets/conversations.png" alt="Conversations" />   | <img src="./assets/team.png" alt="Team" />   | <img src="./assets/notifications.png" alt="Notifications" />  |

### Dark mode

| Dashboard                                                         | Kanban board                                                    |
| ----------------------------------------------------------------- | --------------------------------------------------------------- |
| <img src="./assets/dashboard-dark.png" alt="Dashboard, dark" />   | <img src="./assets/kanban-dark.png" alt="Kanban board, dark" /> |

### Mobile

<p align="center">
  <img src="./assets/mobile-dashboard.png" alt="Dashboard on mobile" width="260" />
  &nbsp;&nbsp;
  <img src="./assets/mobile-kanban.png" alt="Kanban board on mobile" width="260" />
</p>

## Roadmap

### Pending

- [ ] Add random realtime events to the demo environment
- [ ] Improve main dashboard with more stats, activity feed, and company news
- [ ] Live activity feed for tasks, projects and dashboard
- [ ] Implement menu for team page
- [ ] Restrict displaying projects and tasks based on
- [ ] Implement CI/CD pipeline for automated testing and deployment
- [ ] Option to turn off notifications for specific projects or tasks
- [ ] Option to create more columns on the Kanban board and customize column names
- [ ] Company branding and theming
- [ ] Forgot password flow for user accounts
- [ ] Add actual image uploads for user avatars

### Done

- [x] ~~Company-specific settings like working hours~~
- [x] ~~Light and dark themes~~
- [x] ~~UI/UX rework~~
- [x] ~~Implement demonstration environment with seeded data and demo user accounts~~
- [x] ~~Display of a person typing in conversations~~
- [x] ~~Mobile adaptation~~
- [x] ~~Main dashboard~~
- [x] ~~Settings page~~
- [x] ~~Calendar page~~
- [x] ~~Calendar integration~~
- [x] ~~Chat feature for team communication~~
- [x] ~~Invitations to the company~~

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, React Router, MUI, TanStack Query, Zustand, React Hook Form, Zod, FullCalendar, dnd-kit, Socket.IO Client
- **Backend:** NestJS, TypeScript, PostgreSQL, Drizzle ORM, Passport JWT, cookie-based auth, Socket.IO gateways
- **Shared package:** `@syncr/packages` for cross-app TypeScript types and enums
- **Tooling:** npm workspaces, ESLint, Jest, Docker Compose for local PostgreSQL

## Architecture

```text
syncr/
  apps/
    client/      React + Vite frontend
    server/      NestJS API, sockets, database access
  packages/      Shared TypeScript contracts used by client and server
```

The client talks to the API through `/api` endpoints and connects to the server over Socket.IO for realtime notifications and conversation messages. The server persists data in PostgreSQL through Drizzle ORM and seeds core role/permission records on startup.

## Getting Started

### Prerequisites

- Node.js compatible with npm workspaces
- npm `11.x`
- Docker and Docker Compose for local PostgreSQL (recommended but optional if you have another PostgreSQL instance)

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create `apps/server/.env`:

```bash
CLIENT_URL=http://localhost:5173
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/syncr-db
DEMO_DATABASE_URL=postgresql://postgres:postgres@localhost:5433/syncr-demo-db

ACCESS_TOKEN_SECRET=replace-with-a-long-random-secret
REFRESH_TOKEN_SECRET=replace-with-a-long-random-secret

GOOGLE_CALENDAR_CLIENT_ID=
GOOGLE_CALENDAR_CLIENT_SECRET=
GOOGLE_CALENDAR_REDIRECT_URI=http://localhost:3000/api/calendar-connections/google/callback
CALENDAR_TOKEN_SECRET=replace-with-a-long-random-secret
```

Create `apps/client/.env`:

```bash
CLIENT_API_URL=http://localhost:3000/api
CLIENT_SOCKET_URL=http://localhost:3000
```

Google Calendar credentials are optional for basic project and task workflows. Add real credentials only when testing calendar connection flows.

### 3. Start PostgreSQL

```bash
cd apps/server
docker compose up -d
```

### 4. Apply Database Migrations

```bash
npm run db:migrate -w server
```

If the schema changes in the future, generate and apply a new migration before launching the app.

### 5. Build the Shared Package

```bash
npm run build:shared
```

### 6. Start the API

```bash
npm run dev:server
```

The server runs at `http://localhost:3000` and exposes API routes under `http://localhost:3000/api`.

### 7. Start the Client

Open another terminal:

```bash
npm run dev:client
```

The client runs at `http://localhost:5173`.

### Demo Mode

Open `http://demo.localhost:5173` to use the seeded demo workspace. It signs you in automatically as `demo@syncr.cc`, uses `DEMO_DATABASE_URL`, and is read-only.

## Useful Scripts

```bash
npm run dev:client      # Start the Vite frontend
npm run dev:server      # Start the NestJS API in watch mode
npm run build:shared    # Build shared TypeScript package outputs
npm run build           # Build all workspaces that define a build script
npm run lint            # Run workspace lint scripts
npm run db:migrate -w server
```

## DigitalOcean Deployment

The repository includes `.github/workflows/deploy-digitalocean.yml`, which builds the client and server Docker images, pushes them to GitHub Container Registry, writes the deployment `.env` from GitHub Actions secrets, runs database migrations, and starts the stack on a DigitalOcean Droplet.

Configure these GitHub Actions secrets:

```bash
CLIENT_API_URL=https://your-domain.com/api
CLIENT_SOCKET_URL=https://your-domain.com
CLIENT_URL=https://your-domain.com
CLIENT_PORT=5173
SERVER_PORT=3000
DATABASE_URL=postgresql://postgres:replace-with-a-strong-password@postgres:5432/syncr-db
DEMO_DATABASE_URL=postgresql://postgres:replace-with-a-strong-password@demo-postgres:5432/syncr-demo-db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=replace-with-a-strong-password
POSTGRES_DB=syncr-db
DEMO_POSTGRES_USER=postgres
DEMO_POSTGRES_PASSWORD=replace-with-a-strong-password
DEMO_POSTGRES_DB=syncr-demo-db
ACCESS_TOKEN_SECRET=replace-with-a-long-random-secret
REFRESH_TOKEN_SECRET=replace-with-a-long-random-secret
GOOGLE_CALENDAR_CLIENT_ID=
GOOGLE_CALENDAR_CLIENT_SECRET=
GOOGLE_CALENDAR_REDIRECT_URI=https://your-domain.com/api/calendar-connections/google/callback
CALENDAR_TOKEN_SECRET=replace-with-a-long-random-secret
DO_HOST=your-droplet-ip-or-hostname
DO_USER=root
DO_SSH_KEY=your-private-ssh-key
DO_SSH_PORT=22
DO_APP_DIR=/opt/syncr
```
