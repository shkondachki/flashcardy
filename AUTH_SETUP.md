# Authentication Setup Guide

This guide explains how to set up authentication for Flashcardy.

## Overview

The app uses **JWT-based authentication with httpOnly cookies** for security. There is a single admin account that you manage, and you can share the credentials with trusted users.

## Initial Setup

### 1. Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Edit `.env` and configure:
- `DATABASE_URL` - Your PostgreSQL connection string
- `JWT_SECRET` - Generate a secure random string (see .env.example for command)
- `ADMIN_EMAIL` - Email for the admin account
- `ADMIN_PASSWORD` - Secure password for the admin account
- `FRONTEND_URL` - Frontend URL (default: http://localhost:5173)
- `NODE_ENV` - Environment (development/production)

**Important:** 
- Never commit `.env` to version control (it's in `.gitignore`)
- Generate a secure JWT_SECRET for production
- Use strong passwords

### 2. Database Migration

Run the migration to create the User table:

```bash
npm run db:migrate
```

This will create the `users` table in your database.

### 3. Seed Admin User

**⚠️ You must set ADMIN_EMAIL and ADMIN_PASSWORD in your .env file before running the seed script!**

Create the admin user with your credentials:

```bash
npm run db:seed
```

This will create/update the admin user with the email and password from your `.env` file.

## How It Works

### Authentication Flow

1. User logs in with email/password via `POST /auth/login`
2. Backend validates credentials and creates a JWT token
3. Token is stored in an httpOnly cookie (sent automatically with requests)
4. Protected routes check for the token in the cookie
5. If valid, request proceeds; if not, returns 401 Unauthorized

### Protected Routes

The following routes require authentication:
- `POST /flashcards` - Create flashcard
- `PUT /flashcards/:id` - Update flashcard
- `DELETE /flashcards/:id` - Delete flashcard

Public routes (no auth required):
- `GET /flashcards` - List flashcards
- `GET /flashcards/:id` - Get single flashcard

### Frontend

- Login link appears in header when not authenticated
- All API calls include `credentials: 'include'` to send cookies
- App checks auth status on mount using `GET /auth/me`

## Changing the Password

To change the admin password:

1. Update `ADMIN_PASSWORD` in your `.env` file
2. Run the seed script again: `npm run db:seed`
3. The password hash will be updated in the database

## Security Features

- ✅ **httpOnly cookies** - Prevents XSS attacks (JavaScript can't access token)
- ✅ **Secure flag** - Only sent over HTTPS in production
- ✅ **SameSite=strict** - CSRF protection
- ✅ **bcrypt password hashing** - Industry standard, secure
- ✅ **JWT expiration** - Tokens expire after 7 days
- ✅ **CORS protection** - Configured for your frontend domain

## Production Deployment

When deploying to production:

1. **Generate a strong JWT_SECRET:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Use a strong admin password** in your `.env` file

3. **Set NODE_ENV=production** - Enables secure cookie flags

4. **Configure FRONTEND_URL** - Set to your production frontend URL

5. **Use HTTPS** - Required for secure cookies

## Troubleshooting

### "Unauthorized" errors
- Check that you're logged in (cookies are being sent)
- Verify JWT_SECRET is set correctly
- Check that cookies are enabled in your browser

### Login not working
- Verify the user exists in the database (`npm run db:studio`)
- Check that password matches what's in `.env`
- Check backend logs for errors

### CORS errors
- Verify `FRONTEND_URL` matches your frontend URL exactly
- Check that `credentials: 'include'` is set in fetch calls
