# Syncr

Syncr is a full-stack project management and team collaboration app built around projects, task ownership, calendar planning, team communication, and realtime workplace updates. It is designed as a practical workspace for small product teams: users can organize project work, move tasks through a Kanban flow, review activity, manage company members, receive notifications, and discuss work in conversations.

> Media below uses placeholders for now.

<p align="center">
  <img src="https://placehold.co/1280x720?text=Syncr+Dashboard+Screenshot" alt="Syncr dashboard screenshot placeholder" width="100%" />
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

| Dashboard                                                                             | Projects                                                                                 | Kanban Tasks                                                                                |
| ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| <img src="https://placehold.co/640x400?text=Dashboard" alt="Dashboard placeholder" /> | <img src="https://placehold.co/640x400?text=Projects" alt="Projects page placeholder" /> | <img src="https://placehold.co/640x400?text=Kanban+Board" alt="Kanban board placeholder" /> |

| Task Details                                                                                | Calendar                                                                            | Conversations                                                                                 |
| ------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| <img src="https://placehold.co/640x400?text=Task+Details" alt="Task details placeholder" /> | <img src="https://placehold.co/640x400?text=Calendar" alt="Calendar placeholder" /> | <img src="https://placehold.co/640x400?text=Conversations" alt="Conversations placeholder" /> |

## Demo GIF Placeholders

| Workflow                                 | Preview                                                                                                                                    |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Creating a project and task              | <img src="https://placehold.co/900x506?text=GIF:+Create+Project+and+Task" alt="Create project and task GIF placeholder" />                 |
| Dragging a task through the Kanban board | <img src="https://placehold.co/900x506?text=GIF:+Kanban+Drag+and+Drop" alt="Kanban drag and drop GIF placeholder" />                       |
| Realtime conversation and notifications  | <img src="https://placehold.co/900x506?text=GIF:+Realtime+Chat+and+Notifications" alt="Realtime chat and notifications GIF placeholder" /> |

## Roadmap

### Pending

- [ ] Implement demonstration environment with seeded data and demo user accounts
- [ ] Improve main dashboard with more stats, activity feed, and company news
- [ ] Live activity feed for tasks, projects and dashboard
- [ ] Implement menu for team page
- [ ] Display of a person typing in conversations
- [ ] Restrict displaying projects and tasks based on
- [ ] Implement CI/CD pipeline for automated testing and deployment
- [ ] Option to turn off notifications for specific projects or tasks
- [ ] Option to create more columns on the Kanban board and customize column names
- [ ] Add actual image uploads for user avatars

### Done

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
