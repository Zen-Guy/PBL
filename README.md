# 🧠 MindfulPath

[![Built with React](https://img.shields.io/badge/Frontend-React%2018-blue.svg)](https://reactjs.org/)
[![Backend](https://img.shields.io/badge/Backend-Express%205-green.svg)](https://expressjs.com/)
[![Database](https://img.shields.io/badge/Database-PostgreSQL-blue.svg)](https://www.postgresql.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**MindfulPath** is a premium, empathetic mental health assessment platform designed to help users track their well-being, gain clinical insights, and receive continuous support through advanced AI and automated checking systems.

---

## ✨ Key Features

### 📝 Intelligent Assessment
- **Likert-Scale Quiz**: 10-question scientifically-backed mental health evaluation.
- **Insincerity Detection**: Built-in algorithm detects "fake" responses based on user interaction timing (flagging average responses < 2s).
- **Categorized Results**: Instant feedback classifying status into *Healthy*, *Moderate*, or *Serious* with tailored advice.

### 📊 Personal Analytics
- **Progress Tracking**: Visualize mental health trends over time with dynamic line charts.
- **Historical Logs**: Complete record of past assessments for long-term health monitoring.
- **Insight Cards**: Quick-reference statistics on average scores and check-in frequency.

### 🤖 AI Wellness Assistant
- **Empathetic AI**: Integrated streaming chatbot powered by **OpenRouter (GPT-3.5 Turbo)**.
- **Specialized Support**: Trained specifically for mental health, wellness, and stress management guidance.
- **Real-time SSE Support**: Smooth, streaming responses for a professional and fluid interaction experience.

### 📧 Automated Reminders
- **Weekly Check-ins**: Automated email system using **Node-Cron** and **Nodemailer**.
- **Sunday Sessions**: Sends personalized reminders every Sunday at 10:00 AM to encourage regular self-reflection.

### 📚 Wellness Library & Resources
- **Curated Tips**: Specialized sections for Anxiety, Sleep, and Mindfulness.
- **Emergency Resources**: Quick access to professional help and international crisis hotlines.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **State Management**: TanStack Query (React Query)
- **UI & Styling**: Tailwind CSS, Radix UI (shadcn/ui), Framer Motion
- **Visualizations**: Recharts
- **Router**: Wouter (High-performance routing)

### Backend
- **Runtime**: Node.js (Express 5)
- **Database**: PostgreSQL with **Drizzle ORM**
- **Authentication**: Passport.js (Secure session-based auth)
- **Services**: Node-cron (Scheduling), Nodemailer (SMTP)
- **AI Integration**: OpenRouter API with Server-Sent Events (SSE)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database
- Gmail Account (for reminders)

### Installation

1. **Clone & Install Dependencies**
   ```bash
   npm install
   ```

2. **Database Setup**
   Ensure your PostgreSQL instance is running, then run the push command to sync the schema:
   ```bash
   npm run db:push
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/mental_health
   SESSION_SECRET=your_secret_key
   OPENROUTER_API_KEY=your_openrouter_key
   GMAIL_USER=your_email@gmail.com
   GMAIL_APP_PASSWORD=xxxx_xxxx_xxxx_xxxx
   ```

4. **Launch Application**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5000`.

---

## 📁 Project Structure

```text
├── client/              # React frontend application
│   ├── src/
│   │   ├── components/  # Reusable UI primitives & features
│   │   ├── hooks/       # Custom React hooks (Auth, AI, etc.)
│   │   ├── lib/         # Utility functions & API clients
│   │   └── pages/       # Page-level components
├── server/              # Express backend application
│   ├── services/        # Email, Cron, and external logic
│   ├── integrations/    # AI/Chatbot implementations
│   ├── auth.ts          # Passport authentication logic
│   └── index.ts         # Server entry point
├── shared/              # Shared TypeScript types and Drizzle schemas
└── migrations/          # Database migration files
```

---

## 🛡️ Security & Performance
- **Password Hashing**: Secure encryption using scrypt.
- **Session Management**: `httpOnly` cookies with secure session storage.
- **Rate Limiting**: Integrated safeguards for AI API usage.
- **Optimized Builds**: Bundled via Vite and esbuild for maximum production performance.

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

Developed for **Project Based Learning (PBL)**.
