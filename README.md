# escape_room_builder — local dev startup

This project is a Next.js app. This README explains how to start a local Postgres database and a Prisma helper container (for migrations and Prisma Studio) using Docker Compose, then run the Next.js app locally.

Prerequisites
- Docker and Docker Compose installed
- Node.js (recommended v18+) and npm installed locally for running the Next.js app

1) Copy environment variables

Open a PowerShell terminal in the project root and copy the example env file:

```powershell
cp .env.example .env
```

Edit `.env` if you need non-default credentials or a different DB name.

2) Start Postgres + Prisma helper

Bring up the services in the background:

```powershell
docker-compose up -d
```

This starts a Postgres instance (service name `db`) and a `prisma` helper container. The Postgres server is exposed on the host at port 5432.

3) Initialize your Prisma schema

If you plan to use Prisma, create a `prisma/schema.prisma` file in the repo root describing your data models. Example minimal schema:

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id   Int    @id @default(autoincrement())
  name String
}
```

Then run from your host machine (PowerShell):

```powershell
# Apply schema to the database (create tables)
docker-compose run --rm prisma prisma db push

# Or create and run a migration (if you prefer migrations)
docker-compose run --rm prisma prisma migrate dev --name init

# Open Prisma Studio (browse the DB)
docker-compose run --rm -p 5555:5555 prisma prisma studio --port 5555
```

4) Run the Next.js app locally

Install dependencies and start the dev server (from project root):

```powershell
npm install
npm run dev
```

Then open http://localhost:3000.

Notes and troubleshooting
- If `DATABASE_URL` is missing in `.env`, Prisma commands will fail. Ensure `.env` exists and contains `DATABASE_URL=postgresql://POSTGRES_USER:POSTGRES_PASSWORD@db:5432/POSTGRES_DB?schema=public` (the `.env.example` is prefilled with this format).
- The `prisma` helper container is a convenience; it installs `prisma` in the container and leaves the container running. Commands are executed using `docker-compose run --rm prisma <prisma command>` which runs a short-lived container using the same image and workspace mount.
- If you already have a Postgres instance on host port 5432, change the port mapping in `docker-compose.yml` or stop the host Postgres before bringing up the containers.
- To stop and remove containers and volumes:

```powershell
docker-compose down -v
```

Next steps (optional)
- I can add a starter `prisma/schema.prisma` and run an initial migration for you.
- If you want the `prisma` service to only run for CLI invocations (rather than stay running), I can change the compose file to remove the `tail -f` command and make it purely run-on-demand.


// Running prisma commands:
1. docker compose up -d
2. docker-compose exec web npx prisma studio --hostname 0.0.0.0
and then studio is available at localhost:5555

// Lighthouse report ! - from the browser

// Playright test:
1. App is running at localhost:3000
2. Run:
   # Normal
   npx playwright test tests/login.spec.ts

   # Interactive with UI
    npx playwright test tests/login.spec.ts --ui
