# Syncr

Syncr is a full-stack project management and team collaboration app built around projects, task ownership, calendar planning, team communication, and realtime workplace updates. It is designed as a practical workspace for small product teams: users can organize project work, move tasks through a Kanban flow, review activity, manage company members, receive notifications, and discuss work in conversations.

<p align="center">
  <a href="https://demo.syncr.cc"><strong>Open the live demo</strong></a>
</p>

> Media below uses placeholders for now.

<p align="center">
  <img src="./assets/dashboard.png" alt="Syncr dashboard screenshot placeholder" width="100%" />
</p>

## Features

- **Workspace dashboard** with active project counts, completed tasks, due-today work, assigned tasks, unread notifications, birthdays, weekly completion trends, and recent activity.
- **Project management** with project creation, project overview pages, team member visibility, progress summaries, and project-specific navigation.
- **Kanban task board** with Backlog, Todo, In Progress, Review, and Done columns, drag-and-drop task movement, assignees, labels, priorities, and due dates.
- **Task details** with editable task metadata, acceptance criteria, comments, and an activity timeline for work history.
- **Personal and project calendars** for viewing task deadlines in calendar form.
- **Google Calendar integration** support for connecting external calendar workflows.
- **Team management** with company membership, role-based permissions, invitation flows, and team statistics.
- **Realtime notifications** for project, task, invitation, and collaboration events through Socket.IO.
- **Realtime conversations** for direct or team communication, including conversation lists, message history, and live message updates.
- **Authentication and company setup** with registration, login, JWT cookies, company selection, and protected application routes.
- **Responsive UI** built for desktop and mobile layouts.

## Product Preview

| Dashboard                                                        | Projects                                                            | Kanban Tasks                                                     |
| ---------------------------------------------------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------- |
| <img src="./assets/dashboard.png" alt="Dashboard placeholder" /> | <img src="./assets/projects.png" alt="Projects page placeholder" /> | <img src="./assets/kanban.png" alt="Kanban board placeholder" /> |

| Task Details                                                           | Calendar                                                       | Conversations                                                            |
| ---------------------------------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------ |
| <img src="./assets/task-details.png" alt="Task details placeholder" /> | <img src="./assets/calendar.png" alt="Calendar placeholder" /> | <img src="./assets/conversations.png" alt="Conversations placeholder" /> |

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
- [ ] Company-specific settings like working hours
- [ ] Forgot password flow for user accounts
- [ ] Add actual image uploads for user avatars

### Done

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
