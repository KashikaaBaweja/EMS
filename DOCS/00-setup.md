# 00 — Environment Setup

> ⏱ ~20 minutes. Do this before anything else.

---

## Step 1 — Install Node.js

Download the **LTS version** from https://nodejs.org

Verify it worked:
```bash
node -v   # should show v20+
npm -v    # should show v10+
```

---

## Step 2 — Install Cursor

Download from https://cursor.sh and install it.

Cursor = VS Code + AI built in. All your code goes here.

---

## Step 3 — Scaffold the Project

Open your terminal and run:

```bash
npx create-next-app@latest ems-store --typescript --tailwind --app --src-dir --import-alias "@/*"
```

When it asks questions, choose:
- TypeScript → **Yes**
- ESLint → **Yes**
- Tailwind CSS → **Yes**
- `src/` directory → **Yes**
- App Router → **Yes**
- Customize import alias → **Yes** (use `@/*`)

Then open the project in Cursor:
```bash
cd ems-store
cursor .
```

---

## Step 4 — Install Project Dependencies

In the Cursor terminal (`Ctrl+`` backtick`), run:

```bash
npm install prisma @prisma/client next-auth zustand @prisma/adapter-pg pg
npm install -D @types/node @types/pg
npx prisma init
```

Prisma 7 with PostgreSQL uses a driver adapter in code (`@prisma/adapter-pg` + `pg`); `DATABASE_URL` is read from the project root `.env` via `prisma.config.ts`.

---

## Step 5 — Create the `.cursorrules` File

In the **root** of your project, create a file called `.cursorrules` with this content:

```
You are a Next.js expert helping a Swift/SwiftUI developer learn web development.

This is a monolithic e-commerce app called EMS Store using:
- Next.js 16 App Router (NOT pages router)
- TypeScript (strict mode)
- Tailwind CSS for all styling
- Prisma 7 + PostgreSQL for database (driver adapter with `pg`)
- NextAuth.js for authentication
- Zustand for client-side cart state

Coding rules:
- Always use Server Components by default
- Only add "use client" when the component needs interactivity (onClick, useState, etc.)
- Use Server Actions for all form mutations (not API routes)
- Never use useEffect to fetch data — fetch server-side in Server Components
- Keep components small and single-responsibility
- All TypeScript types go in /src/types/index.ts
- Use Tailwind for all styles — no CSS files

When explaining things, use SwiftUI analogies where helpful.
```

This file tells Cursor how to behave in **every** conversation for this project. It's like a permanent system prompt.

---

## Step 6 — Set Up the Database

You have two options:

### Option A — Local PostgreSQL (recommended)
Install PostgreSQL from https://www.postgresql.org/download/ (on Mac with Homebrew: `brew install postgresql@17` then `brew services start postgresql@17`, then `createdb ems_store`).

Create the database if needed, then set **`DATABASE_URL` in the project root `.env`** (not under `prisma/` — this template loads env via `prisma.config.ts`):

```
DATABASE_URL="postgresql://YOUR_USER@localhost:5432/ems_store"
```

Use your OS username if local auth is trust/peer (common on Homebrew). Then run `npx prisma migrate dev` after your schema is defined.

### Option B — Free cloud DB (easier, no install)
Go to https://neon.tech → create a free project → copy the connection string into the **root** `.env` as `DATABASE_URL`.

---

## ✅ Verify Everything Works

```bash
npm run dev
```

Open http://localhost:3000 — you should see the app home (e.g. EMS Store links once the project is customized, or the default Next.js starter until you replace `page.tsx`).

---

## 🎯 Your first Cursor prompt

Open Cursor chat (`Cmd+L` on Mac, `Ctrl+L` on Windows) and type:

> "I just set up a Next.js project with App Router. I know SwiftUI. Explain the folder structure to me using SwiftUI analogies. What does `app/page.tsx` map to? What is `layout.tsx`?"

Read the response, then open `01-swift-to-nextjs.md`.
