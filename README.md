# AuthApp - Fullstack Authentication System

A minimalistic and beautiful fullstack web application with email/password authentication, user management, and admin dashboard. Built with React, tRPC, Drizzle ORM, and PostgreSQL.

## Features

- **Email/Password Authentication** - Secure registration and login with bcrypt password hashing
- **JWT Sessions** - Cookie-based authentication with secure JWT tokens
- **Role-Based Access Control** - User and Admin roles with protected routes
- **Admin Dashboard** - View all registered users with statistics
- **Minimalist Design** - Clean, modern UI with subtle animations

## Tech Stack

- **Frontend**: React 19 + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Hono + tRPC 11 + Drizzle ORM
- **Database**: PostgreSQL
- **Authentication**: bcrypt + JWT (jose library)

## Deploy to Hosting

### 1. Set up PostgreSQL Database

Create a PostgreSQL database on your hosting provider (or local server):

```sql
CREATE DATABASE auth_app;
```

### 2. Environment Variables

Set these environment variables on your hosting platform:

```env
APP_SECRET=your-super-secret-key-min-32-characters-long
DATABASE_URL=postgresql://username:password@host:port/auth_app
```

**Example DATABASE_URL formats:**
- Local: `postgresql://postgres:postgres@localhost:5432/auth_app`
- Supabase: `postgresql://postgres.xxx:password@aws-0-region.pooler.supabase.com:6543/postgres`
- Railway: `postgresql://postgres:password@containers.railway.app:5432/railway`

### 3. Database Setup

Run migrations and seed the admin user:

```bash
# Push schema to database
npm run db:push

# Seed admin user (email: admin@admin.com, password: admin)
npx tsx db/seed.ts
```

### 4. Build and Start

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Start the server
npm start
```

The app will be available at `http://localhost:3000` (or your server's port).

## Default Admin Account

After seeding, you can log in as admin:

- **Email**: `admin@admin.com`
- **Password**: `admin`

## Project Structure

```
├── api/                    # Backend API
│   ├── auth-router.ts      # Auth tRPC router (login, register, me, logout)
│   ├── local-auth.ts       # JWT session & password hashing
│   ├── context.ts          # tRPC context with auth
│   ├── middleware.ts       # Auth & admin middleware
│   ├── boot.ts             # Hono server entry
│   └── queries/            # Database queries
├── db/                     # Database
│   ├── schema.ts           # PostgreSQL schema
│   └── seed.ts             # Admin user seed
├── contracts/              # Shared types
├── src/                    # Frontend
│   ├── pages/              # Page components
│   │   ├── Home.tsx        # Landing page
│   │   ├── Login.tsx       # Login/Register page
│   │   ├── Admin.tsx       # Admin dashboard
│   │   └── NotFound.tsx    # 404 page
│   ├── hooks/
│   │   └── useAuth.ts      # Authentication hook
│   └── providers/
│       └── trpc.tsx        # tRPC client provider
└── .env                    # Environment variables
```

## API Endpoints (tRPC)

All API calls go through `/api/trpc`:

| Procedure | Type | Auth Required | Description |
|-----------|------|---------------|-------------|
| `auth.register` | mutation | No | Register new user |
| `auth.login` | mutation | No | Login with email/password |
| `auth.me` | query | Yes | Get current user |
| `auth.logout` | mutation | Yes | Clear session |
| `auth.listUsers` | query | Admin only | List all users |

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run check` | Type-check TypeScript |
| `npm run db:push` | Sync schema to database |
| `npm run db:generate` | Generate migration SQL |
| `npm run db:migrate` | Apply pending migrations |

## Security Notes

- Change `APP_SECRET` to a strong random string in production
- The `admin@admin.com` account should have its password changed after first login
- All passwords are hashed with bcrypt (12 rounds)
- JWT tokens expire after 30 days
- Session cookies are httpOnly and secure in production
