# Flashcardy Project Structure Explained

## 🏗️ High-Level Overview

This is a **full-stack application** with a clear separation between **Frontend (FE)** and **Backend (BE)**:

```
flashcardy/
├── 📁 Backend (Node.js + Express + PostgreSQL)
│   ├── src/              → Backend code (API server)
│   ├── prisma/           → Database schema & migrations
│   ├── package.json      → Backend dependencies
│   └── tsconfig.json     → TypeScript config for backend
│
└── 📁 Frontend (React + Vite)
    └── client/
        ├── src/          → Frontend code (React app)
        ├── package.json  → Frontend dependencies
        └── vite.config.ts → Vite build configuration
```

---

## 🎯 Frontend (Client) - What the User Sees

**Location:** `client/` directory

The frontend is a **React Single Page Application (SPA)** that runs in the browser.

### Frontend Structure

```
client/
├── src/
│   ├── 📄 main.tsx                    # Entry point - mounts React app to DOM
│   ├── 📄 App.tsx                     # Root component - handles view routing
│   ├── 📄 index.css                   # Global styles
│   │
│   ├── 📁 pages/                      # Page-level components
│   │   ├── FlashcardsList.tsx         # Main list view (CRUD operations)
│   │   ├── FlashcardsList.scss        # Styles for list page
│   │   ├── StudyMode.tsx              # Study mode view (question/answer)
│   │   └── StudyMode.scss             # Styles for study mode
│   │
│   ├── 📁 components/                 # Reusable UI components
│   │   ├── FlashcardCard.tsx          # Displays single flashcard card
│   │   ├── FlashcardCard.scss         # Card styles
│   │   ├── FlashcardForm.tsx          # Form for create/edit flashcard
│   │   ├── FlashcardForm.scss         # Form styles
│   │   ├── SearchAndFilters.tsx       # Search & filter controls
│   │   └── SearchAndFilters.scss      # Filter styles
│   │
│   ├── 📁 api/                        # API client functions
│   │   └── flashcards.ts              # Functions to call backend API
│   │
│   └── 📁 types/                      # TypeScript type definitions
│       └── index.ts                   # Shared types (Flashcard, Tech, etc.)
│
├── 📄 index.html                      # HTML template
├── 📄 vite.config.ts                  # Vite configuration (dev server, build)
└── 📄 package.json                    # Frontend dependencies
```

### How Frontend Works

1. **Entry Point (`main.tsx`)**:
   - Finds the `<div id="root">` in `index.html`
   - Renders the React app starting with `<App />`

2. **App Component (`App.tsx`)**:
   - Manages which view to show (`list` or `study`)
   - Acts as a simple router (no React Router library needed for MVP)

3. **Pages**:
   - `FlashcardsList.tsx`: Main page showing all flashcards, with search/filter/create/edit/delete
   - `StudyMode.tsx`: Study interface showing one card at a time

4. **Components**:
   - Reusable pieces like `FlashcardCard`, `FlashcardForm`, `SearchAndFilters`
   - Each component is self-contained with its own styles

5. **API Layer (`api/flashcards.ts`)**:
   - Uses native `fetch()` to make HTTP requests to the backend
   - Functions like `getFlashcards()`, `createFlashcard()`, `updateFlashcard()`, `deleteFlashcard()`
   - Returns promises that resolve to TypeScript-typed data

6. **Types (`types/index.ts`)**:
   - Defines the structure of data (Flashcard interface, Tech enum, etc.)
   - Ensures type safety between frontend and backend

---

## 🔧 Backend (Server) - The API & Database

**Location:** Root directory (`src/`, `prisma/`)

The backend is a **REST API server** that handles database operations.

### Backend Structure

```
flashcardy/ (root)
├── src/
│   ├── 📄 index.ts                    # Entry point - starts Express server
│   └── 📁 routes/
│       └── flashcards.ts              # API endpoints (CRUD operations)
│
├── prisma/
│   ├── 📄 schema.prisma               # Database schema definition
│   └── 📁 migrations/                 # Database migration history
│
├── 📄 package.json                    # Backend dependencies
└── 📄 tsconfig.json                   # TypeScript config for backend
```

### How Backend Works

1. **Server Entry (`src/index.ts`)**:
   - Creates Express app
   - Sets up middleware (CORS, JSON parsing)
   - Mounts routes (e.g., `/flashcards`)
   - Starts listening on port 3000

2. **Routes (`src/routes/flashcards.ts`)**:
   - Defines REST endpoints:
     - `GET /flashcards` - List all (with optional filters)
     - `GET /flashcards/:id` - Get one by ID
     - `POST /flashcards` - Create new
     - `PUT /flashcards/:id` - Update existing
     - `DELETE /flashcards/:id` - Delete
   - Each endpoint uses Prisma Client to interact with the database
   - Returns JSON responses

3. **Database Schema (`prisma/schema.prisma`)**:
   - Defines the `Flashcard` model
   - Specifies columns, types, relationships
   - Prisma uses this to generate:
     - SQL migrations
     - TypeScript types
     - Prisma Client (database access library)

4. **Database (PostgreSQL)**:
   - Stores actual data in the `flashcards` table
   - Running in Docker container
   - Accessible via connection string in `.env`

---

## 🔄 How Data Flows

### Example: Creating a Flashcard

```
1. User fills form → FlashcardForm.tsx
                     ↓
2. Form submits → handleCreate() in FlashcardsList.tsx
                     ↓
3. API call → createFlashcard() in api/flashcards.ts
                     ↓
4. HTTP POST → http://localhost:3000/flashcards
                     ↓
5. Backend receives → POST /flashcards route in routes/flashcards.ts
                     ↓
6. Database insert → Prisma Client → PostgreSQL
                     ↓
7. Response → JSON with created flashcard
                     ↓
8. Frontend updates → loadFlashcards() refreshes the list
                     ↓
9. UI updates → New flashcard appears in list
```

### Example: Viewing Flashcards

```
1. Component mounts → FlashcardsList.tsx useEffect()
                     ↓
2. API call → getFlashcards() in api/flashcards.ts
                     ↓
3. HTTP GET → http://localhost:3000/flashcards?tech=React
                     ↓
4. Backend queries → Prisma Client filters database
                     ↓
5. Database returns → PostgreSQL returns matching rows
                     ↓
6. JSON response → Array of Flashcard objects
                     ↓
7. State update → setFlashcards(data)
                     ↓
8. UI renders → FlashcardCard components displayed
```

---

## 🛠️ Key Technologies & Their Roles

### Frontend Stack

| Technology | Purpose |
|------------|---------|
| **React** | UI library - components and state management |
| **TypeScript** | Type safety - catches errors before runtime |
| **Vite** | Build tool & dev server - fast development, hot reload |
| **SCSS** | CSS preprocessor - nested styles, variables |
| **Fetch API** | HTTP requests - native browser API (no Axios needed) |

### Backend Stack

| Technology | Purpose |
|------------|---------|
| **Node.js** | JavaScript runtime - runs server code |
| **Express** | Web framework - handles HTTP requests/responses |
| **TypeScript** | Type safety - same language as frontend |
| **Prisma** | ORM (Object-Relational Mapping) - type-safe database access |
| **PostgreSQL** | Database - stores flashcard data |

---

## 📦 Dependencies Explained

### Frontend (`client/package.json`)

- **react**, **react-dom**: Core React libraries
- **@types/react**, **@types/react-dom**: TypeScript type definitions
- **vite**: Build tool and dev server
- **@vitejs/plugin-react**: Vite plugin for React support
- **sass**, **sass-embedded**: SCSS preprocessor
- **typescript**: TypeScript compiler

### Backend (`package.json`)

- **express**: Web framework
- **@prisma/client**: Generated database client
- **cors**: Enable cross-origin requests (frontend → backend)
- **prisma**: CLI tool for migrations and schema management
- **tsx**: Run TypeScript files directly (dev server)
- **typescript**: TypeScript compiler

---

## 🗂️ File Organization Principles

### Why This Structure?

1. **Separation of Concerns**:
   - Frontend code in `client/`
   - Backend code in root `src/`
   - Clear boundaries, easy to understand

2. **Component-Based Architecture** (Frontend):
   - Each component in its own file
   - Styles co-located with components (`.scss` files)
   - Easy to find and modify

3. **API-First Design** (Backend):
   - Routes grouped by resource (`flashcards.ts`)
   - RESTful endpoints
   - Easy to extend with new endpoints

4. **Type Safety**:
   - Shared types in `types/` directory
   - Prisma generates types from schema
   - Catch errors at compile time

5. **Scalability**:
   - Easy to add new pages/components
   - Easy to add new API endpoints
   - Can split further if needed (e.g., `services/`, `utils/`)

---

## 🚀 Development Workflow

### Running the App

1. **Start Database** (Docker):
   ```bash
   docker-compose up
   ```

2. **Start Backend** (Terminal 1):
   ```bash
   npm run dev        # Runs on http://localhost:3000
   ```

3. **Start Frontend** (Terminal 2):
   ```bash
   cd client
   npm run dev        # Runs on http://localhost:5173
   ```

### Making Changes

- **Frontend changes**: Vite hot-reloads automatically
- **Backend changes**: tsx watch mode restarts server
- **Database changes**: Run `npm run db:migrate` after updating `schema.prisma`

---

## 🎓 Key Concepts for This Project

### 1. **Single Page Application (SPA)**
- Frontend is one HTML page
- Navigation happens in JavaScript (no page reloads)
- All data fetched via API

### 2. **REST API**
- Backend exposes endpoints via HTTP
- Standard methods: GET (read), POST (create), PUT (update), DELETE (delete)
- JSON for data exchange

### 3. **Component State**
- React components manage their own state with `useState`
- No global state library (Redux/Zustand) - not needed for MVP
- State flows down via props, events flow up via callbacks

### 4. **Type Safety**
- TypeScript ensures data structures match
- Frontend and backend share type definitions
- Catches errors before code runs

### 5. **Database ORM**
- Prisma abstracts SQL queries
- Type-safe database access
- Migrations track schema changes

---

## 🔍 Where to Find Things

| What You Need | Where to Look |
|---------------|---------------|
| Add a new page | `client/src/pages/` |
| Add a new component | `client/src/components/` |
| Add a new API endpoint | `src/routes/flashcards.ts` |
| Change database schema | `prisma/schema.prisma` |
| Frontend API calls | `client/src/api/flashcards.ts` |
| Frontend types | `client/src/types/index.ts` |
| Backend server config | `src/index.ts` |
| Styling | `.scss` files next to components |

---

## 💡 Architecture Decisions Explained

### Why Express over Fastify?
- More familiar to most developers
- Sufficient performance for MVP
- Easier to find documentation/examples

### Why No React Router?
- MVP only has 2 views (list and study)
- Simple state-based routing is enough
- Can add React Router later if needed

### Why No Global State (Redux)?
- Component state (`useState`) is sufficient
- No complex state sharing needed
- Keeps code simpler

### Why Prisma over raw SQL?
- Type safety
- Easier migrations
- Better developer experience

### Why SCSS over Tailwind?
- Project requirement (no Tailwind)
- Component-scoped styles
- More control over styling

---

This structure is designed to be:
- ✅ **Clear** - Easy to understand what goes where
- ✅ **Maintainable** - Easy to modify and extend
- ✅ **Scalable** - Can grow without major refactoring
- ✅ **Type-safe** - Catches errors early
- ✅ **Simple** - No unnecessary complexity

