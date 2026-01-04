import { Header } from '../components/Header';
import styles from './Documentation.module.scss';
import {CircleSmall} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface DocumentationProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

const SECTION_IDS = [
  'architecture',
  'tech-stack',
  'backend',
  'middleware',
  'frontend',
  'data-flow',
  'styling',
  'database',
  'api',
  'authentication-flow'
];

export function Documentation({ isAuthenticated, onLogout }: DocumentationProps) {
  const [activeSection, setActiveSection] = useState<string>('architecture');
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Create intersection observer to track which section is in view
    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Find entries that are intersecting (visible)
        const visibleEntries = entries.filter(entry => entry.isIntersecting);
        
        if (visibleEntries.length > 0) {
          // Sort by intersection ratio (how much is visible) and bounding box top position
          // Prefer sections that are closer to the top of the viewport
          const sortedEntries = visibleEntries.sort((a, b) => {
            // First, prioritize by how close to the top they are
            const aTop = a.boundingClientRect.top;
            const bTop = b.boundingClientRect.top;
            const topDiff = Math.abs(aTop - 120) - Math.abs(bTop - 120); // 120px accounts for header
            
            if (Math.abs(topDiff) > 50) {
              return topDiff; // If one is significantly closer to top, prefer it
            }
            // Otherwise prefer the one with higher intersection ratio
            return b.intersectionRatio - a.intersectionRatio;
          });
          
          setActiveSection(sortedEntries[0].target.id);
        }
      },
      {
        rootMargin: '-120px 0px -60% 0px', // Account for sticky header (110px) + padding
        threshold: [0, 0.1, 0.25, 0.5] // Trigger at various visibility levels
      }
    );

    // Observe all sections
    SECTION_IDS.forEach((id) => {
      const element = document.getElementById(id);
      if (element && observerRef.current) {
        observerRef.current.observe(element);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return (
    <>
      <Header
        isAuthenticated={isAuthenticated}
        onLogout={onLogout}
      />
      <div className={styles.container}>
        <div className={`${styles.sidebar} largeDesktopOnly`}>
          <section className={styles.tocWrapper}>
            <ul className={styles.toc}>
              <h3>Table of Contents</h3>
              <li>
                <a 
                  href="#architecture" 
                  className={activeSection === 'architecture' ? styles.active : ''}
                >
                  <CircleSmall size={16}/> Architecture Overview
                </a>
              </li>
              <li>
                <a 
                  href="#tech-stack" 
                  className={activeSection === 'tech-stack' ? styles.active : ''}
                >
                  <CircleSmall size={16}/> Tech Stack
                </a>
              </li>
              <li>
                <a 
                  href="#backend" 
                  className={activeSection === 'backend' ? styles.active : ''}
                >
                  <CircleSmall size={16}/> Backend Architecture
                </a>
              </li>
              <li>
                <a 
                  href="#middleware" 
                  className={activeSection === 'middleware' ? styles.active : ''}
                >
                  <CircleSmall size={16}/> Middleware & Authentication
                </a>
              </li>
              <li>
                <a 
                  href="#frontend" 
                  className={activeSection === 'frontend' ? styles.active : ''}
                >
                  <CircleSmall size={16}/> Frontend Architecture
                </a>
              </li>
              <li>
                <a 
                  href="#data-flow" 
                  className={activeSection === 'data-flow' ? styles.active : ''}
                >
                  <CircleSmall size={16}/> Data Flow
                </a>
              </li>
              <li>
                <a 
                  href="#styling" 
                  className={activeSection === 'styling' ? styles.active : ''}
                >
                  <CircleSmall size={16}/> Styling Architecture
                </a>
              </li>
              <li>
                <a 
                  href="#database" 
                  className={activeSection === 'database' ? styles.active : ''}
                >
                  <CircleSmall size={16}/> Database Schema
                </a>
              </li>
              <li>
                <a 
                  href="#api" 
                  className={activeSection === 'api' ? styles.active : ''}
                >
                  <CircleSmall size={16}/> API Endpoints
                </a>
              </li>
              <li>
                <a 
                  href="#authentication-flow" 
                  className={activeSection === 'authentication-flow' ? styles.active : ''}
                >
                  <CircleSmall size={16}/> Authentication Flow
                </a>
              </li>
            </ul>
          </section>
        </div>
        <div className={styles.content}>
        <h1>Documentation</h1>
        <p className={styles.subtitle}>
          Complete guide to understanding how the application works from backend to frontend
        </p>

        <section id="architecture" className={styles.section}>
          <h2>Architecture Overview</h2>
          <p>
            Flashcardy is a full-stack web application following a REST API architecture pattern.
            The backend serves as an API server, while the frontend is a Single Page Application (SPA)
            that consumes the API.
          </p>

          <div className={styles.diagram}>
            <pre>{`
┌────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │          React SPA (Vite + TypeScript)               │  │
│  │      ┌──────────┐  ┌────────────┐  ┌──────────┐      │  │
│  │      │  Pages   │  │ Components │  │   API    │      │  │
│  │      │          │  │            │  │  Client  │      │  │
│  │      └──────────┘  └────────────┘  └──────────┘      │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬───────────────────────────────────┘
                         │ HTTP Requests (REST API)
                         │ Cookies (JWT tokens)
                         │
┌────────────────────────▼───────────────────────────────────┐
│                   BACKEND SERVER                           │
│                  (Express + TypeScript)                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                    Middleware Layer                  │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐      │  │
│  │  │    CORS    │  │   Cookie   │  │    Auth    │      │  │
│  │  │            │  │   Parser   │  │            │      │  │
│  │  └────────────┘  └────────────┘  └────────────┘      │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                      Routes Layer                    │  │
│  │      ┌──────────┐  ┌─────────────┐  ┌─────────┐      │  │
│  │      │  /auth   │  │ /flashcards │  │ /health │      │  │
│  │      └──────────┘  └─────────────┘  └─────────┘      │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                   Business Logic                     │  │
│  │            (Directly in route handlers)              │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬───────────────────────────────────┘
                         │ Prisma ORM
                         │
┌────────────────────────▼───────────────────────────────────┐
│              PostgreSQL Database                           │
│  ┌──────────────────┐      ┌──────────────────┐            │
│  │   users table    │      │ flashcards table │            │
│  └──────────────────┘      └──────────────────┘            │
└────────────────────────────────────────────────────────────┘
            `}</pre>
          </div>
        </section>

        <section id="tech-stack" className={styles.section}>
          <h2>Tech Stack</h2>
          
          <div className={styles.techGrid}>
            <div className={styles.techCard}>
              <h3>Backend</h3>
              <ul>
                <li><strong>Node.js</strong> - JavaScript runtime</li>
                <li><strong>TypeScript</strong> - Type-safe JavaScript</li>
                <li><strong>Express</strong> - Web framework</li>
                <li><strong>Prisma</strong> - Type-safe ORM</li>
                <li><strong>PostgreSQL</strong> - Relational database</li>
                <li><strong>JWT</strong> - Authentication tokens</li>
                <li><strong>bcrypt</strong> - Password hashing</li>
                <li><strong>compression</strong> - Response compression middleware</li>
              </ul>
            </div>

            <div className={styles.techCard}>
              <h3>Frontend</h3>
              <ul>
                <li><strong>React</strong> - UI library</li>
                <li><strong>TypeScript</strong> - Type safety</li>
                <li><strong>Vite</strong> - Build tool & dev server</li>
                <li><strong>React Router</strong> - Client-side routing</li>
                <li><strong>SCSS/Sass</strong> - Styling with modules and global utilities</li>
                <li><strong>react-markdown</strong> - Markdown rendering</li>
                <li><strong>Native Fetch API</strong> - HTTP requests</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="backend" className={styles.section}>
          <h2>Backend Architecture</h2>
          
          <h3>Project Structure</h3>
          <div className={styles.codeBlock}>
            <pre>{`src/
├── index.ts              # Server entry point
├── lib/                  # Shared utilities
│   ├── prisma.ts        # Prisma Client singleton
│   ├── env.ts           # Environment variable validation
│   ├── constants.ts     # Application constants
│   └── errors.ts        # Standardized error responses
├── middleware/
│   └── auth.ts          # JWT authentication middleware
└── routes/
    ├── auth.ts          # Authentication routes (login, logout, me)
    └── flashcards.ts    # Flashcard CRUD routes`}</pre>
          </div>

          <h3>Server Setup (index.ts)</h3>
          <p>The server initializes with:</p>
          <ol>
            <li><strong>Environment validation</strong> - Validates required environment variables on startup</li>
            <li><strong>Compression middleware</strong> - Gzip compression for responses</li>
            <li><strong>CORS middleware</strong> - Allows frontend to make requests</li>
            <li><strong>JSON parser</strong> - Parses request bodies (10MB limit)</li>
            <li><strong>Cookie parser</strong> - Handles httpOnly cookies for auth</li>
            <li><strong>Route handlers</strong> - Mounted at /auth and /flashcards</li>
          </ol>

          <h3>Route Handlers</h3>
          <p>
            Routes contain business logic directly (no separate service layer for MVP simplicity).
            Each route handler:
          </p>
          <ul>
            <li>Validates input data</li>
            <li>Performs database operations via Prisma</li>
            <li>Returns standardized JSON error responses</li>
            <li>Uses Prisma Client singleton from <code>lib/prisma.ts</code></li>
          </ul>

          <h3>Shared Utilities (lib/)</h3>
          <p>The <code>lib/</code> directory contains shared utilities used across the backend:</p>
          <ul>
            <li><strong>prisma.ts</strong> - Singleton Prisma Client instance to prevent connection pool exhaustion</li>
            <li><strong>env.ts</strong> - Environment variable validation and access helpers</li>
            <li><strong>constants.ts</strong> - Centralized application constants (JWT expiration, pagination limits, etc.)</li>
            <li><strong>errors.ts</strong> - Standardized error response format for consistent API error handling</li>
          </ul>
        </section>

        <section id="middleware" className={styles.section}>
          <h2>Middleware & Authentication</h2>

          <h3>Middleware Stack</h3>
          <p>The application uses the following middleware (in order):</p>
          <ul>
            <li><strong>Compression</strong> - Gzip compression for all responses</li>
            <li><strong>CORS</strong> - Cross-origin resource sharing configuration</li>
            <li><strong>JSON Parser</strong> - Parses JSON request bodies with size limits</li>
            <li><strong>Cookie Parser</strong> - Parses cookies for authentication</li>
            <li><strong>requireAuth</strong> - Custom middleware for protected routes (validates JWT tokens)</li>
          </ul>

          <h3>Authentication Middleware (requireAuth)</h3>
          <div className={styles.codeBlock}>
            <pre>{`┌─────────────────────────────────────────┐
│  Request arrives at protected route     │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Extract JWT token from httpOnly cookie │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Verify token signature using JWT_SECRET│
└──────────────┬──────────────────────────┘
               │
        ┌──────┴──────┐
        │             │
     Valid        Invalid
        │             │
        ▼             ▼
┌──────────┐   ┌──────────┐
│ Extract  │   │ Return   │
│ userId   │   │ 401      │
└────┬─────┘   └──────────┘
     │
     ▼
┌─────────────────────────────────────────┐
│  Attach userId to req object           │
│  Call next() to continue               │
└─────────────────────────────────────────┘`}</pre>
          </div>

          <h3>How Authentication Works</h3>
          <ol>
            <li><strong>Login</strong>: User submits email/password → Backend validates → Creates JWT → Sets httpOnly cookie</li>
            <li><strong>Subsequent Requests</strong>: Browser automatically sends cookie → Middleware validates → Grants access</li>
            <li><strong>Logout</strong>: Backend clears cookie → User must login again</li>
          </ol>

          <h3>Security Features</h3>
          <ul>
            <li>✅ <strong>httpOnly cookies</strong> - JavaScript can't access tokens (prevents XSS)</li>
            <li>✅ <strong>bcrypt password hashing</strong> - Passwords never stored in plain text</li>
            <li>✅ <strong>JWT expiration</strong> - Tokens expire after 7 days</li>
            <li>✅ <strong>Secure flag</strong> - Cookies only sent over HTTPS in production</li>
            <li>✅ <strong>SameSite=strict</strong> - CSRF protection</li>
          </ul>
        </section>

        <section id="frontend" className={styles.section}>
          <h2>Frontend Architecture</h2>

          <h3>Component Hierarchy</h3>
          <div className={styles.diagram}>
            <pre>{`
App (AppProvider Context)
├── Router
    ├── Route "/"
    │   ├── Header (global navigation, Study Mode, Login/Logout, Create)
    │   └── FlashcardsList
    │       ├── SearchAndFilters
    │       └── FlashcardCard[] (with Edit/Delete if authenticated)
    │
    ├── Route "/study-mode"
    │   ├── Header (global navigation)
    │   └── StudyMode
    │       ├── Filter dropdowns (Tech, Category)
    │       └── FlashcardCard (study mode with navigation)
    │
    ├── Route "/documentation"
    │   ├── Header (global navigation)
    │   └── Documentation
    │
    └── Route "/login"
        └── Login
`}</pre>
          </div>

          <h3>State Management</h3>
          <p>
            The app uses React's built-in state management (useState, useEffect) with a minimal context
            for shared UI state. No global state library (Redux/Zustand) is used to keep the MVP simple.
          </p>
          <ul>
            <li><strong>App.tsx</strong> - Manages authentication state and routing, wrapped with ErrorBoundary</li>
            <li><strong>AppContext</strong> - Provides shared state for create form visibility (showCreateForm)</li>
            <li><strong>FlashcardsList</strong> - Manages flashcard list, filters, pagination</li>
            <li><strong>StudyMode</strong> - Manages its own filters (Tech, Category), current card index, show/hide answer</li>
            <li><strong>Header</strong> - Globally accessible, manages flashcards count for Study Mode button</li>
          </ul>

          <h3>Reusable Components</h3>
          <p>
            The application includes several reusable components used throughout:
          </p>
          <ul>
            <li><strong>Preloader</strong> - Reusable loading spinner component with variants (fullscreen, inline, spinnerOnly) and size options (small, medium, large). Used throughout the app for loading states in FlashcardsList, StudyMode, and other components.</li>
            <li><strong>ErrorBoundary</strong> - React error boundary component that catches JavaScript errors anywhere in the component tree and displays a fallback UI, preventing the entire application from crashing. Wraps the main App component.</li>
            <li><strong>MarkdownRenderer</strong> - Component for rendering markdown content in flashcards, supports code blocks (with syntax highlighting), tables, lists, links, and other markdown features.</li>
          </ul>

          <h3>Error Handling</h3>
          <p>
            The frontend uses React Error Boundaries to catch and handle component errors gracefully,
            preventing the entire application from crashing. Error boundaries display a fallback UI
            when errors occur. The app is wrapped with an ErrorBoundary component at the root level.
          </p>

          <h3>Configuration & Constants</h3>
          <ul>
            <li><strong>Environment Variables</strong> - API URL configured via <code>VITE_API_URL</code> (defaults to localhost:3000)</li>
            <li><strong>Constants</strong> - Shared constants (tech options, difficulty levels, pagination limits) in <code>constants/index.ts</code></li>
          </ul>
        </section>

        <section id="styling" className={styles.section}>
          <h2>Styling Architecture</h2>
          
          <p>
            The application uses SCSS Modules for component-scoped styling combined with global utility classes.
            This approach provides a balance between encapsulation and reusability.
          </p>

          <h3>Styling Approach</h3>
          <ul>
            <li><strong>SCSS Modules</strong> - Each component has its own `.module.scss` file for scoped styles</li>
            <li><strong>Global Styles</strong> - Shared styles, typography, and utility classes in `styles/global.scss`</li>
            <li><strong>Shared SCSS</strong> - Variables, mixins, button utilities, and form utilities in `styles/` directory</li>
            <li><strong>Responsive Design</strong> - Uses mixins for breakpoints and responsive utility classes</li>
          </ul>
        </section>

        <section id="data-flow" className={styles.section}>
          <h2>Data Flow</h2>

          <h3>Creating a Flashcard</h3>
          <div className={styles.diagram}>
            <pre>{`
1. User clicks "Create Flashcard"
   │
   ▼
2. FlashcardForm component opens (modal)
   │
   ▼
3. User fills form and submits
   │
   ▼
4. FlashcardsList.handleCreate() called
   │
   ▼
5. api/flashcards.createFlashcard() → POST /flashcards
   │   (includes credentials: 'include' for cookie)
   │
   ▼
6. Backend: auth middleware validates JWT
   │
   ▼
7. Backend: route handler validates data
   │
   ▼
8. Backend: Prisma creates flashcard in database
   │
   ▼
9. Backend: Returns created flashcard JSON
   │
   ▼
10. Frontend: Updates local state, refreshes list
   │
   ▼
11. UI updates with new flashcard
`}</pre>
          </div>

          <h3>Reading Flashcards</h3>
          <p>
            Reading flashcards is <strong>public</strong> (no authentication required). The flow is:
          </p>
          <ol>
            <li>Component mounts → calls `getFlashcards()`</li>
            <li>API client makes GET request to `/flashcards`</li>
            <li>Backend queries database via Prisma</li>
            <li>Returns paginated JSON response</li>
            <li>Frontend updates state and renders cards</li>
          </ol>

          <p className={styles.note}>
            <strong>Note:</strong> Categories/tags are fetched separately on component mount via 
            <code>GET /flashcards/categories</code> to show all available tags in the filter dropdown, 
            not just from currently loaded flashcards. This ensures users can filter by any category 
            that exists in the database, regardless of pagination.
          </p>
        </section>

        <section id="database" className={styles.section}>
          <h2>Database Schema</h2>

          <h3>Users Table</h3>
          <div className={styles.codeBlock}>
            <pre>{`model User {
  id           String   @id @default(uuid())
  email        String   @unique
  passwordHash String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}`}</pre>
          </div>

          <h3>Flashcards Table</h3>
          <div className={styles.codeBlock}>
            <pre>{`model Flashcard {
  id         String      @id @default(uuid())
  question   String
  answer     String
  tech       Tech        // JavaScript | TypeScript | React | Node
  categories String[]    // Array of category tags
  difficulty Difficulty? // easy | medium | hard (optional)
  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt
}

enum Tech {
  JavaScript
  TypeScript
  React
  Node
}

enum Difficulty {
  easy
  medium
  hard
}`}</pre>
          </div>
        </section>

        <section id="api" className={styles.section}>
          <h2>API Endpoints</h2>

          <h3>Authentication Endpoints</h3>
          <div className={styles.endpointTable}>
            <table>
              <thead>
                <tr>
                  <th>Method</th>
                  <th>Endpoint</th>
                  <th>Auth</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>POST</code></td>
                  <td><code>/auth/login</code></td>
                  <td>❌</td>
                  <td>Login with email/password, returns JWT cookie</td>
                </tr>
                <tr>
                  <td><code>POST</code></td>
                  <td><code>/auth/logout</code></td>
                  <td>❌</td>
                  <td>Clear authentication cookie</td>
                </tr>
                <tr>
                  <td><code>GET</code></td>
                  <td><code>/auth/me</code></td>
                  <td>✅</td>
                  <td>Get current authenticated user info</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>Flashcard Endpoints</h3>
          <div className={styles.endpointTable}>
            <table>
              <thead>
                <tr>
                  <th>Method</th>
                  <th>Endpoint</th>
                  <th>Auth</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>GET</code></td>
                  <td><code>/flashcards</code></td>
                  <td>❌</td>
                  <td>List flashcards (supports ?tech=, ?category=, ?search=)</td>
                </tr>
                <tr>
                  <td><code>GET</code></td>
                  <td><code>/flashcards/:id</code></td>
                  <td>❌</td>
                  <td>Get single flashcard</td>
                </tr>
                <tr>
                  <td><code>GET</code></td>
                  <td><code>/flashcards/categories</code></td>
                  <td>❌</td>
                  <td>Get all unique categories across all flashcards (sorted alphabetically)</td>
                </tr>
                <tr>
                  <td><code>POST</code></td>
                  <td><code>/flashcards</code></td>
                  <td>✅</td>
                  <td>Create new flashcard</td>
                </tr>
                <tr>
                  <td><code>PUT</code></td>
                  <td><code>/flashcards/:id</code></td>
                  <td>✅</td>
                  <td>Update flashcard</td>
                </tr>
                <tr>
                  <td><code>DELETE</code></td>
                  <td><code>/flashcards/:id</code></td>
                  <td>✅</td>
                  <td>Delete flashcard</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>Health Check Endpoint</h3>
          <div className={styles.endpointTable}>
            <table>
              <thead>
                <tr>
                  <th>Method</th>
                  <th>Endpoint</th>
                  <th>Auth</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>GET</code></td>
                  <td><code>/health</code></td>
                  <td>❌</td>
                  <td>Server health check, verifies database connectivity</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>Error Responses</h3>
          <p>
            All API endpoints return standardized error responses in the format:
            <code>{`{ "error": "Error message", "code": "ERROR_CODE" }`}</code>
            Error codes include: <code>AUTH_ERROR</code>, <code>VALIDATION_ERROR</code>, <code>NOT_FOUND</code>, etc.
          </p>

          <p className={styles.note}>
            ✅ = Requires authentication | ❌ = Public (no auth required)
          </p>
        </section>

        <section id="authentication-flow" className={styles.section}>
          <h2>Complete Authentication Flow</h2>

          <div className={styles.diagram}>
            <pre>{`
┌─────────────┐
│   Browser   │
│  (Frontend) │
└──────┬──────┘
       │
       │ 1. User visits /login
       │    Enters email + password
       │
       ▼
┌─────────────────────────────────────────┐
│  POST /auth/login                       │
│  Body: { email, password }              │
│  credentials: 'include'                 │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  Backend: /auth/login route             │
│  1. Find user by email                  │
│  2. Compare password with bcrypt        │
│  3. Generate JWT token                  │
│  4. Set httpOnly cookie                 │
└──────┬──────────────────────────────────┘
       │
       │ 2. Response: { success: true }
       │    + Set-Cookie header
       │
       ▼
┌─────────────────────────────────────────┐
│  Browser stores cookie (httpOnly)       │
│  Frontend: navigate to /                │
└──────┬──────────────────────────────────┘
       │
       │ 3. Subsequent requests
       │    (e.g., POST /flashcards)
       │
       ▼
┌─────────────────────────────────────────┐
│  Browser automatically includes cookie  │
│  Request: Cookie: token=xxx             │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  Backend: requireAuth middleware        │
│  1. Extract token from cookie           │
│  2. Verify JWT signature                │
│  3. Extract userId                      │
│  4. Attach to req.userId                │
│  5. Call next() → route handler         │
└─────────────────────────────────────────┘
`}</pre>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Key Design Decisions</h2>
          
          <h3>Why httpOnly Cookies Instead of localStorage?</h3>
          <ul>
            <li>✅ More secure (JavaScript can't access, prevents XSS)</li>
            <li>✅ Automatically sent with requests (no manual header management)</li>
            <li>✅ Better for production deployment</li>
          </ul>

          <h3>Why No Global State Management?</h3>
          <ul>
            <li>✅ MVP simplicity - React's built-in state is sufficient</li>
            <li>✅ No complex state sharing needed</li>
            <li>✅ Can easily add Redux/Zustand later if needed</li>
          </ul>

          <h3>Why Express Over Fastify?</h3>
          <ul>
            <li>✅ More familiar to most developers</li>
            <li>✅ Sufficient performance for MVP scale</li>
            <li>✅ Extensive ecosystem and documentation</li>
          </ul>

          <h3>Why Public Read, Private Write?</h3>
          <ul>
            <li>✅ Anyone can view and study flashcards</li>
            <li>✅ Only authenticated users can create/edit/delete</li>
            <li>✅ Better user experience (no login required to view)</li>
            <li>✅ Flexible for future features (sharing, public decks, etc.)</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Development Workflow</h2>
          
          <h3>Making Changes</h3>
          <ol>
            <li><strong>Backend changes</strong>: Edit TypeScript files in `src/` → tsx watch restarts server</li>
            <li><strong>Frontend changes</strong>: Edit React files in `client/src/` → Vite hot-reloads</li>
            <li><strong>Database changes</strong>: Edit `prisma/schema.prisma` → Run `npm run db:migrate`</li>
            <li><strong>New migrations</strong>: Creates SQL files in `prisma/migrations/`</li>
          </ol>

          <h3>Database Operations</h3>
          <ul>
            <li><code>npm run db:migrate</code> - Create/apply migrations</li>
            <li><code>npm run db:seed</code> - Seed admin user</li>
            <li><code>npm run db:studio</code> - Open Prisma Studio (database GUI)</li>
            <li><code>npm run db:generate</code> - Regenerate Prisma Client</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Additional Resources</h2>
          <ul>
            {/*<li><a href="/api.md" target="_blank">API Documentation</a> - Detailed endpoint docs</li>*/}
            {/*<li><a href="/AUTH_SETUP.md" target="_blank">Authentication Setup Guide</a> - Auth configuration</li>*/}
            {/*<li><a href="/DATABASE_SETUP.md" target="_blank">Database Setup Guide</a> - PostgreSQL setup</li>*/}
            <li><a href="https://www.prisma.io/docs" target="_blank" rel="noopener noreferrer">Prisma Documentation</a></li>
            <li><a href="https://react.dev" target="_blank" rel="noopener noreferrer">React Documentation</a></li>
          </ul>
        </section>
        </div>
      </div>
    </>
  );
}

