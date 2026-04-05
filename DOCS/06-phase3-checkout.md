# 06 — Phase 3: Checkout + Orders + Admin

> Build: Checkout → Order confirmation → Order history → Admin dashboard
> ⏱ ~2 hours

---

## Before you start — how this repo implements Phase 3

**Prisma `Order` model:** Checkout needs more than `total` alone. This project stores **`subtotal`**, **`shipping`**, **`total`**, and shipping address fields (`shipName`, `shipEmail`, `shipAddress1`, `shipAddress2?`, `shipCity`, `shipState`, `shipZip`). Run `npx prisma migrate dev` after updating `schema.prisma`, then `npx prisma generate`.

**Session on the server:** Use **`getSession()`** from `src/lib/auth.ts` (it wraps `getServerSession(authOptions)` for the App Router). In prompts you can say “verify session with `getSession()`” instead of pasting `getServerSession` everywhere.

**Session on the client:** Checkout pre-fills email/name from **`useSession()`** in `next-auth/react`. The root layout wraps the app with **`SessionProvider`** (`src/components/providers.tsx`).

**Dynamic route `params`:** On **Next.js 15+**, page props use `params: Promise<{ id: string }>` — **`await params`** before reading `id`.

**Admin script:** The repo uses **`tsx`** and loads `.env` with **dotenv**. Run:

```bash
npm run make-admin -- your@email.com
```

---

## Step 1 — Checkout Page

**Cursor prompt:**
```
Create src/app/checkout/page.tsx as a Client Component.

It should be a 2-step checkout form:

Step 1 — Shipping Info:
- Full name, email (pre-filled from session)
- Address line 1, Address line 2 (optional)
- City, State, ZIP
- "Continue to Payment" button

Step 2 — Review & Pay:
- Summary of cart items (read-only) from @src/store/cartStore.ts
- Shipping address summary from step 1
- Order total breakdown (subtotal + shipping + total)
- "Place Order" button

On "Place Order":
- Call a Server Action: src/app/checkout/actions.ts → createOrder()
- createOrder should:
  1. Get the current session (user must be logged in)
  2. Receive cart items + shipping info
  3. Create an Order in DB with OrderItems using @src/lib/prisma.ts
  4. Decrement stock for each product
  5. Return the new order ID
- On success: redirect to /orders/[id]/confirmation (e.g. `redirect()` in the Server Action — do not swallow redirect inside a catch-all try/catch)
- On failure: return an error object/string so the client can show a message

Use a step indicator (Step 1/2) at the top.
Style like a real checkout flow.
```

---

## Step 2 — Order Confirmation Page

**Cursor prompt:**
```
Create src/app/orders/[id]/confirmation/page.tsx as a Server Component.

It receives `params` with the order id (on newer Next.js, `await params` then use `id`).

It should:
1. Fetch the order with its items and products using Prisma @src/lib/prisma.ts
2. Verify the order belongs to the logged-in user (use `getSession()` from @src/lib/auth.ts)
3. Show a success confirmation screen:
   - Big green checkmark or success icon
   - "Order Confirmed!" heading
   - Order ID
   - List of ordered items with quantities and prices
   - Order total
   - Estimated delivery (current date + 5 business days)
   - "Continue Shopping" button → /products
   - "View All Orders" button → /orders

Also: clear the cart by calling cartStore.clearCart() 
(this requires a Client Component wrapper — create a ClearCartOnMount.tsx client component 
that calls clearCart() in a useEffect on mount, then render it on this page).
```

---

## Step 3 — Order History Page

**Cursor prompt:**
```
Create src/app/orders/page.tsx as a Server Component.

It should:
1. Get the current user session from @src/lib/auth.ts
2. Fetch all orders for that user, ordered by createdAt desc, with their items and products
3. Show a list of orders, each displaying:
   - Order ID (short version: first 8 chars)
   - Date placed
   - Status badge (PENDING=yellow, PROCESSING=blue, SHIPPED=purple, DELIVERED=green)
   - Number of items
   - Order total
   - "View Details" link → /orders/[id]

If no orders: show empty state with "Start Shopping" link.

Create src/app/orders/[id]/page.tsx that shows full order details:
- All the same info as confirmation page
- Status timeline showing progress (Pending → Processing → Shipped → Delivered)
  with the current status highlighted
```

---

## Step 4 — Admin Dashboard

**Cursor prompt:**
```
Create src/app/admin/page.tsx as a Server Component.

It should:
1. Get session and verify role === "ADMIN" (redirect to / if not)
2. Fetch stats from DB using @src/lib/prisma.ts:
   - Total orders count
   - Total revenue (sum of all order totals)
   - Total products count
   - Total users count
3. Show a dashboard with:
   - 4 stat cards at the top (Orders, Revenue, Products, Users)
   - Recent orders table (last 10 orders) with columns:
     Order ID, Customer email, Items, Total, Status, Date
   - Each row has a "Update Status" dropdown (this needs a Server Action)

Create src/app/admin/actions.ts with updateOrderStatus(orderId, status) Server Action.
It should update the order status in DB and revalidatePath('/admin').
```

---

## Step 5 — Admin: Product Management

**Cursor prompt:**
```
Create src/app/admin/products/page.tsx as a Server Component.

It should:
1. Verify ADMIN role
2. Fetch all products from DB
3. Show a table with all products: image thumbnail, name, category, price, stock, actions
4. Each row has Edit and Delete buttons

Create src/app/admin/products/new/page.tsx with a form to add a new product:
- Name, Description, Price, Category (select), Stock, Image URL
- Submit calls a Server Action: createProduct() in src/app/admin/products/actions.ts
- On success, redirect to /admin/products

The createProduct Server Action should:
1. Validate all fields
2. Create product in DB
3. revalidatePath('/admin/products') and revalidatePath('/products')
4. Return success or error

Add a "Add Product" button on the products list page linking to /admin/products/new.
Also add "Products" link in the admin navigation.

Optional extension (implemented in this repo): `src/app/admin/products/[id]/edit/page.tsx` plus `updateProduct` / `deleteProduct` in `src/app/admin/products/actions.ts`.
```

---

## Step 6 — Make an Admin User

In your database, manually update a user's role to ADMIN. 

**Cursor prompt:**
```
Create a one-time script at scripts/make-admin.ts that:
1. Loads .env from the project root (e.g. dotenv) so DATABASE_URL is set before importing Prisma
2. Takes an email as a CLI argument
3. Updates that user's role to ADMIN in the database
4. Logs success or error and disconnects Prisma
```

Run it (this repo):
```bash
npm run make-admin -- your@email.com
```

Equivalent with `tsx` directly:
```bash
npx tsx scripts/make-admin.ts your@email.com
```

---

## ✅ Phase 3 Checkpoint

- [ ] Can complete checkout with a filled cart
- [ ] Order confirmation page shows and clears cart
- [ ] `/orders` shows all past orders
- [ ] `/orders/[id]` shows full order detail
- [ ] `/admin` is accessible only with ADMIN role
- [ ] Admin can see stats and recent orders
- [ ] Admin can update order status
- [ ] Admin can add a new product
- [ ] (Optional in this repo) Admin can edit/delete products

---

## 🎉 You Built a Full E-commerce App!

Your app now has (depending on earlier phases):
- Product catalog (categories; **search** is a good follow-up — see below)
- User authentication (Credentials + NextAuth; custom **register/login** pages if you completed Phase 2)
- Shopping cart (**Zustand**, in-memory in the browser)
- Full checkout flow
- Order history
- Admin dashboard with order management and product creation

---

## What to do next

**Deploy to Vercel (10 mins):**
```bash
npm install -g vercel
vercel
```
Add your `DATABASE_URL`, `NEXTAUTH_URL`, and `NEXTAUTH_SECRET` as environment variables in the Vercel dashboard.

**Improvements to try with Cursor:**
- Add product search (`?q=searchterm` in the products page)
- Add product images upload (Cloudinary or UploadThing)
- Add email confirmation on order (Resend.com)
- Add a wishlist feature
- Add product reviews/ratings

For any of these, just describe what you want to Cursor with the relevant file context.
