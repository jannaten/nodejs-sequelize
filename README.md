# Node.js Sequelize Skeleton

A production-ready Node.js REST API skeleton built with **TypeScript**, **Express**, **Sequelize v6**, and **PostgreSQL**. Designed as a starting point for backend services — everything from local development to CI is already wired up.

## What's inside

| Layer            | Technology                                 |
| ---------------- | ------------------------------------------ |
| Language         | TypeScript (strict mode)                   |
| Runtime          | Node.js 24                                 |
| Framework        | Express 5                                  |
| ORM              | Sequelize v6                               |
| Database         | PostgreSQL 17                              |
| Migrations       | sequelize-cli                              |
| Containerisation | Docker + Docker Compose                    |
| Linting          | ESLint 9 (flat config) + typescript-eslint |
| Formatting       | Prettier                                   |
| Git hooks        | Husky + lint-staged                        |
| CI               | GitHub Actions                             |

---

## Project structure

```
src/
├── config/
│   └── config.ts          # DB config for development / test / production
├── migrations/
│   └── *-create-user.ts   # Schema migrations (run by sequelize-cli)
├── models/
│   ├── index.ts           # Auto-loads all models and exports db object
│   └── user.ts            # User model with full TypeScript types
├── routes/
│   └── users.ts           # GET /users, GET /users/:id
├── seeders/
│   └── *-demo-user.ts     # Demo data (development only)
└── index.ts               # Express app entry point
```

---

## Getting started

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Node.js 24+ (only needed if running outside Docker)

### 1. Clone and configure environment

```bash
git clone https://github.com/jannaten/nodejs-sequelize.git
cd nodejs-sequelize
cp .env.example .env
```

Edit `.env` with your local database credentials (defaults work out of the box with Docker).

### 2. Start with Docker

```bash
docker compose up --build
```

This will:

- Start a PostgreSQL 17 container
- Wait for the database to be healthy
- Run all pending migrations automatically
- Seed demo data (development only)
- Start the Express server with hot-reload via nodemon

The API is available at `http://localhost:3000`.

### 3. Run without Docker

```bash
npm install
npm run db:migrate
npm run db:seed:all
npm run dev
```

---

## API endpoints

| Method | Path         | Description             |
| ------ | ------------ | ----------------------- |
| `GET`  | `/health`    | Health check            |
| `GET`  | `/users`     | List all users          |
| `GET`  | `/users/:id` | Get a single user by ID |

### Example

```bash
curl http://localhost:3000/users
curl http://localhost:3000/users/1
```

---

## Database commands

```bash
# Run all pending migrations
npm run db:migrate

# Undo the last migration
npm run db:migrate:undo

# Run all seeders (development only)
npm run db:seed:all

# Undo all seeders
npm run db:seed:undo:all

# Generate a new migration file
npm run migration:generate -- --name your-migration-name

# Generate a new model + migration
npm run model:generate -- --name ModelName --attributes field:type
```

Inside Docker:

```bash
docker compose exec app npm run db:migrate
```

---

## Development scripts

```bash
npm run dev            # Start with nodemon hot-reload
npm run build          # Compile TypeScript to dist/
npm run start          # Run compiled production build
npm run lint           # ESLint
npm run lint:fix       # ESLint with auto-fix
npm run format         # Prettier write
npm run format:check   # Prettier check (used in CI)
```

---

## How migrations work

Migrations run automatically before the app starts via `entrypoint.sh`:

| Environment   | Migrations                              | Seeders       |
| ------------- | --------------------------------------- | ------------- |
| `development` | runs on start                           | runs on start |
| `test`        | not auto-run (test suite manages state) | never         |
| `production`  | runs on start (safety net)              | never         |

In production the recommended approach is to run migrations as a separate CI/CD step before deploying — this ensures they run exactly once regardless of replica count, and a failed migration blocks the deployment.

---

## Code quality

### Pre-commit hook

Every `git commit` runs lint-staged automatically:

- ESLint auto-fix on staged `.ts` files
- Prettier auto-format on staged `.ts`, `.json`, `.yaml`, `.md` files

### CI pipeline

On every push and pull request to `main`:

1. `npm ci` — install dependencies
2. `npm run lint` — ESLint must pass
3. `npm run format:check` — Prettier must pass
4. `npm run db:migrate` — migrations run against a real Postgres service
5. `npm run build` — TypeScript must compile

---

## Environment variables

Copy `.env.example` to `.env` and fill in your values.

| Variable       | Description                         | Default                |
| -------------- | ----------------------------------- | ---------------------- |
| `NODE_ENV`     | Environment name                    | `development`          |
| `PORT`         | HTTP port                           | `3000`                 |
| `DB_HOST`      | Postgres host                       | `127.0.0.1`            |
| `DB_PORT`      | Postgres port                       | `5432`                 |
| `DB_USER`      | Postgres user                       | `postgres`             |
| `DB_PASSWORD`  | Postgres password                   | —                      |
| `DB_NAME`      | Database name                       | `database_development` |
| `DATABASE_URL` | Full connection string (production) | —                      |

---

## Docker stages

The `Dockerfile` has three stages:

| Stage         | Purpose                                       |
| ------------- | --------------------------------------------- |
| `development` | Hot-reload with nodemon, all dev dependencies |
| `build`       | Compiles TypeScript to `dist/`                |
| `production`  | Lean runtime image, no dev dependencies       |

Build the production image:

```bash
docker build --target production -t nodejs-sequelize:prod .
```
