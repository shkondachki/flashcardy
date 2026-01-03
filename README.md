# Flashcardy - Interview Question Knowledge Base

A single-user MVP flashcard application for storing and studying interview questions for JavaScript, TypeScript, React, and Node.js.

## Tech Stack

### Backend
- **Node.js** + **TypeScript**
- **Express** - Chosen for its straightforward API, extensive ecosystem, and simplicity. For an MVP, Express provides all needed features without unnecessary complexity.
- **PostgreSQL** - Relational database for structured flashcard data
- **Prisma ORM** - Type-safe database access with excellent TypeScript support

### Frontend (Phase 2)
- React + TypeScript + Vite
- Custom CSS/SCSS (no Tailwind)

## Project Structure

```
flashcardy/
├── client/                   # Frontend (React + Vite)
│   ├── src/
│   │   ├── api/             # API client functions
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── types/           # TypeScript types
│   │   └── App.tsx          # Main app component
│   └── package.json
├── src/                      # Backend
│   ├── index.ts             # Express server entry point
│   └── routes/
│       └── flashcards.ts    # Flashcard CRUD endpoints
├── prisma/
│   └── schema.prisma        # Database schema
├── package.json             # Backend dependencies
└── tsconfig.json
```

## Data Model

```typescript
Flashcard {
  id: string              // UUID
  question: string        // The question text
  answer: string          // The answer text
  tech: "JavaScript" | "TypeScript" | "React" | "Node"
  categories: string[]    // Array of category tags
  difficulty?: "easy" | "medium" | "hard"
  createdAt: Date
  updatedAt: Date
}
```

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- PostgreSQL (running locally or accessible instance)

### Installation

#### Backend Setup

1. **Install backend dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Edit `.env` and fill in your values:
     - `DATABASE_URL` - Your PostgreSQL connection string
     - `JWT_SECRET` - Generate a secure random string (see .env.example)
     - `ADMIN_EMAIL` - Email for the admin account
     - `ADMIN_PASSWORD` - Password for the admin account
     - `FRONTEND_URL` - Frontend URL (default: http://localhost:5173)
   - **Never commit `.env` to version control!** It's already in `.gitignore`

3. **Run database migrations:**
   ```bash
   npm run db:migrate
   ```
   This will create the database tables and generate Prisma Client.

4. **Seed admin user:**
   ```bash
   npm run db:seed
   ```
   This creates the admin user with the credentials from your `.env` file.

5. **Start backend server:**
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:3000` (or port specified in `.env`).

#### Frontend Setup

1. **Install frontend dependencies:**
   ```bash
   cd client
   npm install
   ```

2. **Start frontend development server:**
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173` by default.

   **Note:** The frontend expects the backend API at `http://localhost:3000`. You can configure this by setting the `VITE_API_URL` environment variable in a `.env` file in the `client` directory.

## Available Scripts

### Backend Scripts (root directory)
- `npm run dev` - Start backend development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Run production build
- `npm run db:generate` - Generate Prisma Client
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed admin user
- `npm run db:studio` - Open Prisma Studio (database GUI)

### Frontend Scripts (client directory)
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Authentication

This app uses JWT-based authentication with a single admin account. All CRUD operations (create, update, delete flashcards) require authentication. Reading flashcards is public.

**Setup:** Configure `ADMIN_EMAIL` and `ADMIN_PASSWORD` in your `.env` file, then run `npm run db:seed` to create the admin user.

See [AUTH_SETUP.md](./AUTH_SETUP.md) for detailed authentication setup and configuration instructions.

## API Documentation

See [api.md](./api.md) for detailed endpoint documentation.

## Development Approach

This MVP follows a phased implementation approach:

- **Phase 1**: Backend Foundation ✅
- **Phase 2**: Frontend Foundation ✅
- **Phase 3**: Flashcard Management ✅
- **Phase 4**: Study Mode ✅

## Architecture Decisions

### Backend
- **Express over Fastify**: Chosen for simplicity and familiarity. The performance difference is negligible for MVP scale.
- **No service layer**: Routes contain business logic directly to avoid premature abstraction. Can be refactored later if needed.
- **REST API**: Simple, standard REST endpoints. No GraphQL complexity.
- **Prisma ORM**: Provides type safety and eliminates manual SQL for this MVP scope.

### Frontend
- **Native fetch**: No axios or other HTTP libraries. Simple, built-in fetch API is sufficient for MVP.
- **No global state**: Using React's useState for local component state. No Redux/Zustand needed yet.
- **Custom SCSS**: Component-scoped styles without Tailwind. Keeps styles simple and maintainable.
- **Controlled components**: All form inputs are controlled components for predictable state management.

## Current Features

### Flashcard Management
- ✅ View all flashcards
- ✅ Search flashcards by question/answer text
- ✅ Filter by technology (JS, TS, React, Node)
- ✅ Filter by category tags
- ✅ Create new flashcards with form validation
- ✅ Edit existing flashcards
- ✅ Delete flashcards (with confirmation)
- ✅ Clean, readable card display with syntax-friendly answer formatting
- ✅ Category management (add/remove tags)
- ✅ Difficulty levels (easy, medium, hard)

### Study Mode
- ✅ Focused study interface with question-first display
- ✅ Toggle to show/hide answers
- ✅ Navigate between flashcards (previous/next)
- ✅ Random card selection from filtered set
- ✅ Keyboard shortcuts for efficient studying:
  - `Space` / `→` - Next card
  - `←` - Previous card
  - `R` - Random card
  - `Enter` / `A` - Toggle answer
  - `Esc` - Back to list
- ✅ Card counter showing progress (e.g., "Card 3 of 10")
- ✅ Respects current filters from list view
