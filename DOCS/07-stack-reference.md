# 07 — Stack Reference Cheatsheet

> Quick lookup for everything you'll use. Bookmark this.

---

## Tech Stack

| Layer | Tool | Docs |
|-------|------|------|
| Framework | **Next.js 16** (App Router) | https://nextjs.org/docs |
| UI | **React 19** | https://react.dev |
| Language | TypeScript | https://www.typescriptlang.org |
| Styling | **Tailwind CSS v4** | https://tailwindcss.com/docs |
| Database ORM | **Prisma 7** | https://www.prisma.io/docs |
| DB driver | **`pg`** + **`@prisma/adapter-pg`** (Postgres) | Prisma “driver adapters” docs |
| Prisma client | Generated to **`src/generated/prisma/`** (see `schema.prisma` `generator`) | — |
| Config | **`prisma.config.ts`** + root **`.env`** (`DATABASE_URL`) | Prisma 7 config |
| Auth | **NextAuth.js v4** + **`@auth/prisma-adapter`** | https://next-auth.js.org/getting-started/introduction |
| Passwords | **bcryptjs** | — |
| Client State | Zustand 5 | https://zustand-demo.pmnd.rs |
| DB (local) | PostgreSQL (e.g. Homebrew `postgresql@17`) | https://www.postgresql.org |
| DB (cloud) | Neon | https://neon.tech/docs |
| Deploy | Vercel | https://vercel.com/docs |

**This repo:** `import { prisma } from "@/lib/prisma"` (singleton + `PrismaPg`). Use `import { Prisma } from "@/generated/prisma/client"` for `Decimal`, etc.

---

## Prisma Commands

```bash
# Create and apply a migration after changing schema.prisma
npx prisma migrate dev --name describe-what-changed

# Regenerate the Prisma client after schema changes
npx prisma generate

# Open Prisma Studio (visual DB browser)
npx prisma studio

# Seed the database (configure "prisma.seed" in package.json, e.g. tsx prisma/seed.ts)
npx prisma db seed

# Reset DB and re-run all migrations (WARNING: deletes all data)
npx prisma migrate reset
```

Promote a user to **ADMIN** (this repo):

```bash
npm run make-admin -- your@email.com
```

---

## Next.js Patterns

### Server Component (default — no directive needed)
```tsx
import { prisma } from "@/lib/prisma"

export default async function Page() {
  const data = await prisma.product.findMany()
  return <div>{/* render data */}</div>
}
```

### Client Component
```tsx
"use client"
import { useState } from "react"

export default function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
```

### Server Action
```tsx
// In a separate actions.ts file or in the same file with "use server"
"use server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"

export async function createProduct(formData: FormData) {
  const name = formData.get("name") as string
  await prisma.product.create({ data: { name, /* ... */ } })
  revalidatePath("/products")
}
```

### Dynamic Route with Params
```tsx
// app/products/[id]/page.tsx — Next.js 15+ often passes params as a Promise
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"

type Props = { params: Promise<{ id: string }> }

export default async function ProductPage({ params }: Props) {
  const { id } = await params
  const product = await prisma.product.findUnique({ where: { id } })
  if (!product) notFound()
  return <div>{product.name}</div>
}
```

### Getting the Session (Server Component)
Prefer the project helper (wraps `getServerSession` for the App Router):

```tsx
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function Page() {
  const session = await getSession()
  if (!session?.user) redirect("/login")
  return <div>Hello {session.user.name}</div>
}
```

Equivalent inline (if you ever need it):

```tsx
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

const session = await getServerSession(authOptions)
```

### Getting the Session (Client Component)
Root layout must wrap the app with **`SessionProvider`** (this repo: `src/components/providers.tsx`).

```tsx
"use client"
import { useSession } from "next-auth/react"

export default function UserBadge() {
  const { data: session, status } = useSession()
  if (status === "loading") return <span>Loading...</span>
  if (!session) return <a href="/login">Login</a>
  return <span>{session.user?.name}</span>
}
```

**Session shape:** `session.user.id` and `session.user.role` are set in this app (see `src/types/next-auth.d.ts`).

### Middleware (Edge)
`getSession()` is **not** available in Edge middleware. Use **`getToken`** from **`next-auth/jwt`** (with `NEXTAUTH_SECRET`) or follow the official NextAuth “Middleware” docs for your version.

---

## Tailwind Quick Reference

### Layout
```
flex flex-row flex-col       → flexbox direction
items-center justify-between → alignment
gap-4                        → space between items
grid grid-cols-3             → CSS grid
col-span-2                   → span columns
```

### Spacing
```
p-4    → padding all sides (1rem)
px-6   → padding horizontal
py-2   → padding vertical
mt-4   → margin top
mx-auto → center horizontally
```

### Sizing
```
w-full max-w-7xl             → width
h-screen h-64               → height
aspect-square               → 1:1 ratio
```

### Typography
```
text-sm text-base text-xl text-3xl   → size
font-bold font-medium                → weight
text-gray-600 text-white             → color
truncate line-clamp-2                → overflow
```

### Colors & Visual
Tailwind v4 still uses utility classes; you’ll often see **zinc** scales in this project (`bg-zinc-50`, `text-zinc-600`). Gray utilities also exist.

```
bg-white bg-zinc-50 bg-blue-600      → background
text-blue-600                        → text color
border border-zinc-200               → border
rounded-lg rounded-full              → border radius
shadow shadow-md                     → shadow
```

### Responsive
```
sm:text-lg   → applies at 640px+
md:grid-cols-2 → applies at 768px+
lg:flex-row  → applies at 1024px+
```

### Hover/Focus
```
hover:bg-blue-700
focus:outline-none focus:ring-2 focus:ring-blue-500
```

---

## Zustand Store Pattern

```ts
import { create } from "zustand"

type State = {
  count: number
  increment: () => void
  reset: () => void
}

export const useCountStore = create<State>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  reset: () => set({ count: 0 }),
}))

// Usage in a Client Component:
// const { count, increment } = useCountStore()
```

---

## Common Errors & Fixes

| Error | Fix |
|-------|-----|
| `useClient hooks in Server Component` | Add `"use client"` at top of file |
| `Cannot read property of undefined` | Data might be null — add null check: `product?.name` |
| Prisma types out of sync / missing fields on `Order`, etc. | Run `npx prisma generate` after migrations |
| `DATABASE_URL is not set` | Set **`DATABASE_URL`** in root **`.env`**; Prisma CLI loads via **`prisma.config.ts`** |
| `NEXTAUTH_SECRET missing` | Add to `.env` file |
| `Module not found` | Run `npm install` |
| `Hydration error` | Something different rendered server vs client — usually a date or random value |
| Next.js “multiple lockfiles” / wrong workspace root | Remove stray **`package-lock.json`** outside the app, or set **`turbopack.root`** in `next.config` to this project folder |

---

## Environment Variables

Never commit `.env` to git. Your `.env` should contain:

```
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"
```

For production (on Vercel), add these in the Vercel dashboard under Settings → Environment Variables.

---

## Cursor Prompts That Always Work

**"I'm getting this error, explain and fix it:"**
```
@src/app/products/page.tsx
I'm getting this error: [paste error]
Explain what's causing it and fix it.
```

**"Explain this code to me like I'm a SwiftUI developer:"**
```
@src/app/api/auth/[...nextauth]/route.ts
Explain what this file does in terms a SwiftUI developer would understand.
What's the equivalent concept in iOS development?
```

**"Review my code:"**
```
@src/app/checkout/page.tsx
Review this component. Are there any bugs, missing error handling, 
or TypeScript issues? What would you improve?
```
