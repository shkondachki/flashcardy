# Database Setup Guide

## Quick Setup Options

### Option 1: Local PostgreSQL

1. **Install PostgreSQL** from https://www.postgresql.org/download/
2. **Create the database:**
   ```sql
   CREATE DATABASE flashcardy;
   ```
   (You can do this in `psql` or pgAdmin)
3. **Create `.env` file in the project root** with:
   ```
   DATABASE_URL="postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/flashcardy"
   ```
   Replace `YOUR_USERNAME` and `YOUR_PASSWORD` with your PostgreSQL credentials.

### Option 2: Docker (Easiest)

Run this command to start PostgreSQL in Docker:

```bash
docker run --name flashcardy-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=flashcardy -p 5432:5432 -d postgres:15
```

Then create `.env` file with:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/flashcardy"
```

### Option 3: Cloud Services (for production)

Popular options:
- **Neon** (free tier): https://neon.tech
- **Supabase** (free tier): https://supabase.com
- **Railway**: https://railway.app
- **Render**: https://render.com

They'll provide a connection string like:
```
DATABASE_URL="postgresql://user:pass@host.region.provider.com:5432/dbname"
```

## Steps After Setting Up

1. **Create `.env` file** in the project root (same folder as `package.json`)
2. **Add your DATABASE_URL** to the `.env` file
3. **Run migrations:**
   ```bash
   npm run db:migrate
   ```
   This creates the tables automatically!

## Example .env File

Create a file named `.env` (not `.env.example`) in the root directory:

```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/flashcardy"
PORT=3000
```

**Important:** 
- The `.env` file is in `.gitignore`, so it won't be committed to git
- Never commit real database credentials to version control
- Replace `yourpassword` with your actual PostgreSQL password



