# 05 — Phase 2: Auth + Cart

> Build: Login/Register → Protected routes → Cart page
> ⏱ ~2 hours

---

## Before you start — how this repo is set up

- **`src/lib/auth.ts`** exports **`authOptions`** and **`getSession()`**, which wraps **`getServerSession(authOptions)`** from **`next-auth/next`**. Prefer **`getSession()`** in Server Components and Server Actions (same pattern as Phase 3 docs).
- **Prisma adapter:** **`@auth/prisma-adapter`** with **`User`**, **`Account`**, **`Session`**, **`VerificationToken`** in **`prisma/schema.prisma`**. The singleton client lives in **`src/lib/prisma.ts`** (Prisma 7 + **`PrismaPg`**).
- **Route handler:** **`src/app/api/auth/[...nextauth]/route.ts`** already exports **GET/POST** for NextAuth.
- **Client session:** Root layout wraps the app with **`SessionProvider`** in **`src/components/providers.tsx`** — required for **`useSession`**, **`signIn`**, **`signOut`**.
- **Already in the repo:** **`/cart`** (basic), **`/checkout`**, **`/orders`**, **`/admin`** (Phase 3). Phase 2 below adds **register/login**, **middleware**, **Navbar auth UI**, and a richer **cart** — merge carefully with existing files instead of duplicating routes.

---

## Step 1 — Set Up NextAuth

### Create the auth config

**Cursor prompt:**
```
Create src/lib/auth.ts with NextAuth configuration.

Use Credentials provider (email + password, no OAuth for now).

It should:
1. Import PrismaAdapter from @auth/prisma-adapter and the prisma client from @src/lib/prisma.ts
2. Add a Credentials provider that:
   - Takes email and password
   - Finds the user in the DB by email
   - Compares password using bcrypt (install bcryptjs)
   - Returns the user object on success, null on failure
3. Set session strategy to "jwt"
4. Add callbacks to include user.id and user.role in the session token
5. Export authOptions and export a getSession() helper that calls getServerSession(authOptions) from "next-auth/next"

TypeScript: extend the Session and JWT types to include id and role (see src/types/next-auth.d.ts in this repo — avoid augmenting next-auth User in a way that breaks the Prisma adapter types).
```

Install bcrypt:
```bash
npm install bcryptjs @auth/prisma-adapter
npm install -D @types/bcryptjs
```

### Create the API route

**Cursor prompt:**
```
Create src/app/api/auth/[...nextauth]/route.ts.
It should import authOptions from @src/lib/auth.ts and export GET and POST handlers
using NextAuth(authOptions).
```

### Add env variables to `.env`:
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret-string-here
```

Generate a secret:
```bash
openssl rand -base64 32
```

---

## Step 2 — Register Page

**Cursor prompt:**
```
Create src/app/(auth)/register/page.tsx as a Client Component.

It should have a registration form with:
- Name input
- Email input
- Password input
- Confirm password input
- Submit button

On submit:
1. Validate that passwords match
2. POST to a Server Action (create src/app/(auth)/register/actions.ts)
3. Show success message and redirect to /login, or show error message

The Server Action should:
1. Validate inputs (email format, password min 8 chars)
2. Check if email already exists in DB
3. Hash password with bcrypt (10 rounds)
4. Create user in DB using Prisma
5. Return { success: true } or { error: "message" }

Style the form nicely with Tailwind — centered card layout.
```

---

## Step 3 — Login Page

**Cursor prompt:**
```
Create src/app/(auth)/login/page.tsx as a Client Component.

It should have a login form with:
- Email input
- Password input  
- Submit button
- Link to /register

On submit, call signIn("credentials", { email, password, callbackUrl: "/" }) from next-auth/react.
Show error message if login fails (check for error in useSearchParams).

Style consistently with the register page.
```

---

## Step 4 — Protect Routes with Middleware

**Cursor prompt:**
```
Create middleware.ts in the project root (not inside src/).

It should:
1. Protect these routes — redirect to /login if not authenticated:
   - /cart
   - /checkout
   - /orders
   - /admin (also check for ADMIN role, redirect to / if not admin)
2. Redirect logged-in users away from /login and /register to /
3. Use NextAuth-compatible token checks in middleware (Edge runtime):
   - Often getToken({ req, secret: process.env.NEXTAUTH_SECRET }) from "next-auth/jwt"
   - See NextAuth.js "Advanced: Middleware" docs for your NextAuth version

Export a config matcher that only runs on the protected paths.
```

**Note:** `getSession()` does **not** run in Edge middleware — use **`getToken`** or the pattern from the official NextAuth middleware guide. Until middleware exists, **`createOrder`** and order pages still enforce auth server-side.

---

## Step 5 — Update Navbar with Auth State

**Cursor prompt:**
```
Create or update @src/components/features/Navbar.tsx to show auth state.

Add a user menu on the right side (next to cart icon):
- If not logged in: show "Login" link to /login
- If logged in: show user's name/email and a dropdown with:
  - "My Orders" → /orders
  - "Admin" → /admin (only if user.role === "ADMIN")
  - "Sign Out" button that calls signOut() from next-auth/react

Use useSession() from next-auth/react to get the session.
The component must be a Client Component ("use client") because of useSession / signOut.
```

---

## Step 6 — Cart Page

**Cursor prompt:**
```
Create src/app/cart/page.tsx as a Client Component (needs cart store).

Import the cart store from @src/store/cartStore.ts.

It should show:
- Page title "Your Cart"
- If cart is empty: empty state with a "Browse Products" link
- If has items: 
  - A list of CartItem components (create src/components/features/CartItem.tsx)
  - Each CartItem shows: image, name, price, quantity stepper (+/-), remove button, line total
  - Order summary on the right (or below on mobile):
    - Subtotal
    - Shipping (free over $50, else $9.99)
    - Total
    - "Proceed to Checkout" button → /checkout

CartItem.tsx should:
- Accept a CartItem type from @src/types/index.ts
- Have +/- buttons that call updateQuantity from the cart store
- Have a trash icon button that calls removeItem
- Use formatPrice from @src/lib/utils.ts

Style it like a real cart page (think Amazon cart layout).
```

**Note:** This repo already has a **simpler** **`/cart`** (inline list, flat shipping message on checkout). Use the prompt above to refactor into **`CartItem`** rows and a richer summary, or keep the simple version until you need the layout.

---

## ✅ Phase 2 Checkpoint

Test these before moving on:
- [ ] `/register` — Can create a new account
- [ ] `/login` — Can log in with that account
- [ ] Navbar shows user name when logged in
- [ ] Navbar shows "Login" when logged out
- [ ] `/cart` redirects to `/login` when not logged in (after **middleware** is added; until then, checkout may still enforce auth in the Server Action)
- [ ] `/cart` shows correct items and totals after adding products
- [ ] Quantity update and remove work in cart
- [ ] Sign out works

---

Open `06-phase3-checkout.md` next.
