# Docker Setup for Escape Room Builder

This document explains how to run the Next.js application in Docker alongside the PostgreSQL database in **development mode**.

## Files Created

- **Dockerfile**: Development setup with hot-reload
- **docker-compose.yml**: Complete development environment with database
- **.dockerignore**: Excludes unnecessary files from Docker builds
- **.env**: Environment variables (already configured)

## Prerequisites

- Docker Desktop installed
- Docker Compose installed

## Setup Instructions

### 1. Start the Services

Start both the database and Next.js app:
```bash
docker-compose up -d
```

This will:
- Start PostgreSQL database on port 5432
- Build and start the Next.js app on port 3000
- Run Prisma migrations automatically
- Enable hot-reload for development (code changes will auto-refresh!)

### 3. Access the Application

Open your browser and navigate to: **http://localhost:3000**

### 4. View Logs

```bash
# All services
docker-compose logs -f

# Just the web app
docker-compose logs -f web

# Just the database
docker-compose logs -f db
```

### 5. Stop the Services

```bash
docker-compose down
```

To also remove volumes (database data):
```bash
docker-compose down -v
```

## Useful Commands

### Rebuild the Next.js Container

```bash
docker-compose up -d --build web
```

### Run Prisma Commands

```bash
# Generate Prisma Client
docker-compose exec web npx prisma generate

# Run migrations
docker-compose exec web npx prisma migrate deploy

# Create a new migration
docker-compose exec web npx prisma migrate dev --name your_migration_name

# Open Prisma Studio
docker-compose exec web npx prisma studio
```

### Access Database Directly

```bash
docker-compose exec db psql -U postgres -d appdb
```

### Shell Access

```bash
# Access web container shell
docker-compose exec web sh

# Access database container shell
docker-compose exec db bash
```

### Clean Up Everything

```bash
# Stop all containers and remove volumes
docker-compose down -v

# Remove all unused Docker resources
docker-compose down -v
```

## Troubleshooting

### Port Already in Use

If port 3000 or 5432 is already in use:

1. Stop the conflicting service
2. Or change the port mapping in `docker-compose.yml`:
   ```yaml
   ports:
     - "3001:3000"  # Map to different host port
   ```

### Database Connection Issues

1. Ensure the `DATABASE_URL` uses `db` as hostname (not `localhost`)
2. Check if database is ready:
   ```bash
   docker-compose exec db pg_isready -U postgres
   ```

### Hot Reload Not Working

1. Ensure volumes are properly mounted in `docker-compose.yml`
2. Try rebuilding the container:
   ```bash
   docker-compose up -d --build web
   ```

### Permission Issues (Linux/Mac)

If you encounter permission issues:
```bash
sudo chown -R $USER:$USER .
```

## How It Works

- **Dockerfile** installs all dependencies and runs `npm run dev`
- **Volumes** mount your local code into the container for hot-reload
- **Network** connects web and database containers via `app-network`
- **Automatic migrations** run when the container starts
- Changes to your code are reflected immediately without rebuilding!

## Environment Variables

The `.env` file is already configured with default values. You can modify it if needed:

- `POSTGRES_USER`: Database username (default: postgres)
- `POSTGRES_PASSWORD`: Database password (default: postgres)
- `POSTGRES_DB`: Database name (default: appdb)
- `DATABASE_URL`: Full connection string for Prisma
- `NODE_ENV`: Environment mode (development)

## Quick Reference

```bash
# Start everything
docker-compose up -d

# Stop everything
docker-compose down

# View logs
docker-compose logs -f web

# Rebuild after package.json changes
docker-compose up -d --build web

# Access web container
docker-compose exec web sh

# Run Prisma Studio
docker-compose exec web npx prisma studio
```
