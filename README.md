# MindfulPath - Mental Health Assessment Web Application

## Overview

MindfulPath is a full-stack mental health assessment web application designed for college students. It provides self-assessment quizzes, wellness tips, professional contact resources, analytics dashboards, and an AI-powered chatbot. The app detects potentially insincere quiz responses based on response timing, categorizes results (fake/healthy/moderate/serious), and tracks user progress over time with interactive charts.

## System Architecture

### Frontend

- **Framework**: React 18 with TypeScript, bundled via Vite
- **Routing**: Wouter (lightweight client-side router)
- **State Management**: TanStack React Query for server state, local React state for UI
- **UI Components**: shadcn/ui (new-york style) built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming (light/dark mode support), custom calming teal/lavender color palette
- **Animations**: Framer Motion for page transitions and micro-interactions
- **Charts**: Recharts for analytics (line charts, score trends)
- **Fonts**: DM Sans (body), Outfit (display/headings)
- **Path aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

### Backend

- **Framework**: Express 5 on Node.js with TypeScript (tsx for dev, esbuild for production)
- **Authentication**: Passport.js with Local Strategy, express-session with MemoryStore, scrypt password hashing
- **Session**: Cookie-based sessions (httpOnly), MemoryStore in dev (should be replaced with connect-pg-simple for production)
- **API Design**: REST endpoints under `/api/` prefix, Zod validation on inputs, shared route definitions in `shared/routes.ts`
- **AI Chatbot**: OpenAI-compatible API via AI Integrations, SSE streaming for chat responses at `POST /api/conversations/:id/messages`
- **Build**: Custom build script (`script/build.ts`) using esbuild for server + Vite for client, outputs to `dist/`

### Database

- **Database**: PostgreSQL (required, referenced via `DATABASE_URL` environment variable)
- **ORM**: Drizzle ORM with `drizzle-zod` for schema-to-validation integration
- **Schema location**: `shared/schema.ts` and `shared/models/chat.ts`
- **Migrations**: Drizzle Kit with `db:push` command for schema sync
- **Tables**:
  - `users` - id, username (unique), password (hashed), name, studentId, mobile, role
  - `quiz_results` - id, userId (FK nullable), score, category (fake/healthy/moderate/serious), timeTaken, responses (JSONB), createdAt
  - `conversations` - id, title, createdAt (for chatbot)
  - `messages` - id, conversationId (FK cascade delete), role, content, createdAt (for chatbot)

### Key Pages

- **Home** (`/`) - Landing page with hero section, mental health awareness content
- **Auth** (`/auth`) - Login/Register with tabs, redirects to dashboard on success
- **Quiz** (`/quiz`) - 10 Likert-scale questions with timing-based fake detection (< 2s avg per question), protected route
- **Results** (`/results`) - Score display with category-specific recommendations, uses URL query params
- **Tips** (`/tips`) - Tabbed wellness library (Sleep, Anxiety, Mindfulness) with self-help content
- **Contact** (`/contact`) - Emergency numbers, helpline info, online therapy resources
- **Analytics** (`/analytics`) - Dashboard with score trends (line chart), stats cards, protected route

### AI Integrations

Located in `server/integrations/`:

- **Chat** - Text-based AI chatbot with conversation persistence and SSE streaming
- **Audio** - Voice chat capabilities with PCM16 audio processing, AudioWorklet playback
- **Image** - Image generation via OpenAI-compatible API (gpt-image-1)
- **Batch** - Batch processing utilities with rate limiting and retries

### Protected Routes

Quiz, Results, and Analytics pages require authentication. The `ProtectedRoute` component checks auth status and redirects to `/auth` if not logged in.

## External Dependencies

### Required Environment Variables

- `DATABASE_URL` - PostgreSQL connection string (must be provisioned)
- `SESSION_SECRET` - Session encryption key (has fallback default, should be set in production)
- `AI_INTEGRATIONS_OPENAI_API_KEY` - OpenAI API key for chatbot and AI features
- `AI_INTEGRATIONS_OPENAI_BASE_URL` - OpenAI-compatible API base URL (AI Integrations)

### Key NPM Packages

- **Server**: express, passport, passport-local, express-session, drizzle-orm, pg, openai, zod
- **Client**: react, wouter, @tanstack/react-query, recharts, framer-motion, date-fns, shadcn/ui components (Radix UI)
- **Shared**: drizzle-zod, zod (validation schemas shared between client and server)

### Third-Party Services

- **PostgreSQL** - Primary data store
- **OpenAI API** (via AI Integrations) - Powers the chatbot, image generation, and audio features
- **External links** - BetterHelp, crisis hotlines (988, 911) referenced on Contact page
