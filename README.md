# 🎮 Escape Room Builder & Player

A full-stack web application that allows users to create and play custom escape room games. Built with Next.js, featuring a drag-and-drop builder interface and an interactive player experience.

## 📋 Table of Contents
- [Overview](#overview)
- [Technologies & Services](#technologies--services)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [How to Use the Application](#how-to-use-the-application)
- [Testing](#testing)
- [Database Management](#database-management)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

This application provides two main modes:
- **Builder Mode**: Create custom escape rooms with puzzles, themes, and timers
- **Player Mode**: Play escape rooms created by builders and solve puzzles

## 🛠️ Technologies & Services

### Frontend Framework
- **Next.js 15.5.4** - React framework with App Router
- **React 19.1.0** - UI library
- **TypeScript 5** - Type-safe development

### UI & Styling
- **Bootstrap 5.3.8** - CSS framework for responsive design
- **Bootstrap Icons 1.13.1** - Icon library
- **React Bootstrap 2.10.10** - React components for Bootstrap
- **Tailwind CSS 4** - Utility-first CSS framework

### Backend & Database
- **PostgreSQL 15** - Relational database (running in Docker)
- **Prisma ORM 6.17.1** - Type-safe database client and migrations
- **Next.js API Routes** - RESTful API endpoints

### Logging & Monitoring
- **Winston 3.18.3** - Professional logging library
- **winston-daily-rotate-file 5.0.0** - Rotating log files

### Testing
- **Playwright 1.56.0** - End-to-end testing framework

### Development Tools
- **Docker & Docker Compose** - Containerized development environment
- **ESLint** - Code linting
- **Prisma Studio** - Database GUI

## ✅ Prerequisites
- Docker and Docker Compose installed
- Node.js (recommended v20+) and npm installed locally

## 🚀 Getting Started

### 1) Setup Environment Variables

Open a PowerShell terminal in the project root:

```powershell
cp .env.example .env
```

Edit `.env` if needed. Default configuration:
- `DATABASE_URL=postgresql://postgres:postgres@db:5432/appdb`
- `LOG_LEVEL=debug`
- `NODE_ENV=development`

### 2) Start Docker Services

Start PostgreSQL database and Next.js application:

```powershell
docker-compose up -d
```

This starts three services:
- **db** - PostgreSQL 15 database (port 5432)
- **web** - Next.js application (port 3000)
- **prisma** - Prisma helper container for migrations

### 3) Verify Application is Running

Open your browser and navigate to:
```
http://localhost:3000
```

You should see the home page with two options: **Builder Mode** and **Player Mode**.

### 4) Initialize Database (First Time Setup)

The database schema is already defined in `prisma/schema.prisma` with the following models:
- **User** - Stores user accounts (username, password, role: BUILDER/PLAYER)
- **Room** - Escape room details (name, description, theme, timer)
- **RoomObject** - Interactive objects/puzzles in rooms
- **Session** - Game play sessions
- **Attempt** - Individual puzzle attempts during gameplay

Migrations run automatically when containers start. To manually run migrations:

```powershell
docker-compose exec web npx prisma migrate deploy
```

## 📖 How to Use the Application

### 🏗️ Builder Mode - Creating an Escape Room

1. **Access Builder Mode**
   - Navigate to http://localhost:3000
   - Click on **"Builder Mode"**

2. **Sign Up / Login**
   - **New User**: Click "Sign up", enter username and password
   - **Existing User**: Enter credentials and click "Login"
   - Your role will automatically be set to **BUILDER**

3. **Create a New Room**
   - Click **"New Room"** button
   - Enter:
     - **Room Name** - Title of your escape room
     - **Description** - Brief description of the room
     - **Theme** - Choose between:
       - 🏛️ Ancient (temple/ruins theme)
       - 🚀 Space (futuristic/sci-fi theme)
     - **Timer** - Set time limit (1-60 minutes)
   - Click **"Create Room"**

4. **Add Objects & Puzzles**
   - **Select Object Type** from the left panel:
     - 📦 **Chest** - Treasure box puzzle
     - 🚪 **Door** - Exit door puzzle
     - 🔑 **Key** - Key collection puzzle
     - 💎 **Artifact** - Ancient artifact puzzle
     - 🖼️ **Painting** - Art puzzle
     - 🗿 **Statue** - Statue puzzle
   
   - **Drag & Drop** object onto the canvas
   - **Position & Resize** objects as needed

5. **Configure Each Puzzle**
   - Click on any placed object to configure:
     - **Question** - The puzzle/riddle for players to solve
     - **Correct Answer** - The solution (case-insensitive)
     - **Hint** - Optional hint for players
     - **Points** - Score awarded for correct answer (1-100)
   - Click **"Save"**

6. **Save Your Room**
   - Click **"Save Room"** in the top bar
   - Your room is now published and available for players!

7. **Edit Existing Rooms**
   - Click **"Load Room"** to see your created rooms
   - Select a room to edit
   - Make changes and click **"Save Room"** again

### 🎮 Player Mode - Playing an Escape Room

1. **Access Player Mode**
   - Navigate to http://localhost:3000
   - Click on **"Player Mode"**

2. **Sign Up / Login**
   - **New Player**: Click "Sign up", enter username and password
   - **Existing Player**: Enter credentials and click "Login"
   - Your role will automatically be set to **PLAYER**

3. **Select a Room**
   - Browse available escape rooms
   - View room details:
     - Name and description
     - Theme
     - Time limit
     - Number of puzzles
   - Click **"Start Game"** to begin

4. **Play the Game**
   - **Timer** - Countdown appears at the top
   - **Explore** - Click on objects to interact
   - **Solve Puzzles** - Each object presents a puzzle:
     - Read the question/riddle
     - Use **"Show Hint"** if stuck
     - Enter your answer
     - Click **"Submit Answer"**
   
5. **Game Progress**
   - ✅ **Correct Answer** - Earn points, object turns green
   - ❌ **Wrong Answer** - Try again, no penalty
   - **Score** - Accumulates with each correct answer

6. **Win Conditions**
   - **Success** - Solve all puzzles before time runs out! 🎉
   - **Failure** - Time expires before completing all puzzles 😢

7. **View Results**
   - Final score and time taken
   - Option to play again or select a different room

## 🧪 Testing

### Automated End-to-End Tests

The application includes Playwright tests for authentication flows.

**Prerequisites**: Ensure Docker containers are running
```powershell
docker-compose up -d
```

**Run Tests:**

```powershell
# Run all tests
npx playwright test

# Run specific test files
npx playwright test tests/login.spec.ts
npx playwright test tests/signin.spec.ts

# Run with visible browser
npx playwright test --headed

# Interactive UI mode (recommended)
npx playwright test --ui
```

**Test Coverage:**
- ✅ User signup flow (Builder mode)
- ✅ User login flow (Builder mode)
- ✅ Navigation and form validation

## 🗄️ Database Management

### Prisma Studio (Database GUI)

Access the visual database editor:

```powershell
docker-compose exec web npx prisma studio --hostname 0.0.0.0
```

Then open: **http://localhost:5555**

**Features:**
- View all database tables
- Browse and search records
- Edit data directly
- Add/delete records
- Test queries

### Common Database Commands

```powershell
# View database in Prisma Studio
docker-compose exec web npx prisma studio --hostname 0.0.0.0

# Run migrations
docker-compose exec web npx prisma migrate deploy

# Reset database (WARNING: Deletes all data!)
docker-compose exec web npx prisma migrate reset

# Generate Prisma Client (after schema changes)
docker-compose exec web npx prisma generate
```

## 🔧 Troubleshooting

### Application Won't Start

**Issue**: Docker containers fail to start
```powershell
# Check container status
docker-compose ps

# View logs
docker-compose logs web
docker-compose logs db

# Restart containers
docker-compose down
docker-compose up -d
```

**Issue**: Port already in use (3000 or 5432)
```powershell
# Stop conflicting services or change ports in docker-compose.yml
# For port 3000: Change "3000:3000" to "3001:3000"
# For port 5432: Change "5432:5432" to "5433:5432"
```

### Database Connection Issues

**Issue**: `DATABASE_URL` missing or invalid
- Ensure `.env` file exists with correct format:
  ```
  DATABASE_URL=postgresql://postgres:postgres@db:5432/appdb
  ```
- Restart containers after changing `.env`

**Issue**: Database tables missing
```powershell
# Run migrations
docker-compose exec web npx prisma migrate deploy
```

### Authentication Issues

**Issue**: Can't login or signup
- Clear browser localStorage: Open DevTools > Application > Local Storage > Clear
- Check if database is running: `docker-compose ps`
- View API logs in Docker logs

### Development Commands

```powershell
# Stop all containers
docker-compose down

# Stop and remove all data (CAUTION: Deletes database!)
docker-compose down -v

# Rebuild containers (after dependency changes)
docker-compose up -d --build

# View real-time logs
docker-compose logs -f web

# Access web container shell
docker-compose exec web sh
```

## 📊 Logging

Application logs are managed by Winston and stored in:
- `logs/combined-YYYY-MM-DD.log` - All logs (debug, info, warn, error)
- `logs/error-YYYY-MM-DD.log` - Error logs only

Logs rotate daily and are retained for 14 days.

## 🌐 API Endpoints

The application provides RESTful API endpoints:

**User Management:**
- `POST /api/users` - Create new user (signup)
- `POST /api/users/login` - Authenticate user (login)
- `GET /api/users/[id]` - Get user details
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user

**Room Management:**
- `GET /api/rooms` - List all rooms
- `POST /api/rooms` - Create new room
- `GET /api/rooms/[id]` - Get room details
- `PUT /api/rooms/[id]` - Update room
- `DELETE /api/rooms/[id]` - Delete room
- `GET /api/rooms/[id]/objects` - Get room objects
- `POST /api/rooms/[id]/objects` - Add object to room

**Game Sessions:**
- `POST /api/sessions` - Start game session
- `POST /api/attempts` - Submit puzzle answer

## 📝 Performance Testing

**Lighthouse Report:**
- Open application in Chrome/Edge
- Open DevTools (F12) > Lighthouse tab
- Click "Generate report"
- Analyze performance, accessibility, best practices, and SEO scores

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Ensure all tests pass: `npx playwright test`
5. Submit a pull request

## 📄 License

This project is for educational purposes as part of CSE3CWA coursework.

---

**Need Help?** Check the troubleshooting section or review Docker logs with `docker-compose logs -f`
