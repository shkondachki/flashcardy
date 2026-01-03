# Flashcardy

A full-stack flashcard application for storing and studying interview questions. Built with React, TypeScript, Node.js, and PostgreSQL.

## ✨ Features

- **Flashcard Management** - Create, edit, and delete flashcards with rich text support
- **Search & Filter** - Search by content and filter by technology (JavaScript, TypeScript, React, Node.js) and categories
- **Study Mode** - Focused study interface with keyboard shortcuts for efficient learning
- **Authentication** - JWT-based authentication for secure access
- **Markdown Support** - Answers support markdown formatting with syntax highlighting

## 🛠️ Tech Stack

**Frontend**
- React + TypeScript + Vite
- SCSS for styling
- React Router for navigation

**Backend**
- Node.js + Express + TypeScript
- PostgreSQL + Prisma ORM
- JWT authentication

## 🚀 Quick Start

### Prerequisites

- Node.js (v18+)
- PostgreSQL (local or remote)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd flashcardy
   ```

2. **Set up the backend**
   ```bash
   # Install dependencies
   npm install
   
   # Configure environment variables
   cp .env.example .env
   # Edit .env with your database URL and other settings
   
   # Run migrations
   npm run db:migrate
   
   # Seed admin user
   npm run db:seed
   ```

3. **Set up the frontend**
   ```bash
   cd client
   npm install
   ```

4. **Start development servers**
   
   Backend (from root directory):
   ```bash
   npm run dev
   ```
   
   Frontend (from client directory):
   ```bash
   cd client
   npm run dev
   ```

The app will be available at `http://localhost:5173` (frontend) and `http://localhost:3000` (backend API).

## 📜 Available Scripts

### Backend (root directory)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm start` | Run production build |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed` | Seed admin user |
| `npm run db:studio` | Open Prisma Studio (database GUI) |

### Frontend (client directory)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## 📚 Documentation

- [API Documentation](./api.md) - Detailed API endpoint reference
- [Authentication Setup](./AUTH_SETUP.md) - Authentication configuration guide
- [Database Setup](./DATABASE_SETUP.md) - PostgreSQL setup instructions
- [Deployment Guide](./RAILWAY_DEPLOYMENT.md) - Railway deployment instructions

## 🏗️ Project Structure

```
flashcardy/
├── client/          # Frontend (React + Vite)
│   └── src/
│       ├── api/     # API client functions
│       ├── components/
│       ├── pages/
│       └── types/
├── src/             # Backend (Express + TypeScript)
│   ├── routes/      # API routes
│   ├── middleware/  # Auth middleware
│   └── lib/         # Utilities
└── prisma/          # Database schema & migrations
```

## 🔐 Environment Variables

See `.env.example` for required environment variables. Key variables:

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `ADMIN_EMAIL` - Admin user email
- `ADMIN_PASSWORD` - Admin user password
- `FRONTEND_URL` - Frontend URL (for CORS)

## 📝 License

ISC
