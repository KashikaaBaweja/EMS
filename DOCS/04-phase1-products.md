# 04 — Phase 1: Product Pages

> Build: Home page → Product listing → Product detail
> ⏱ ~1.5 hours

---

## Before you start — how this repo differs from the generic prompts

- **Prisma `Product`:** `price` is **`Decimal`**, not `Float`. In **`prisma/seed.ts`**, use `new Prisma.Decimal("29.99")` (import **`Prisma`** from `@/generated/prisma/client`). **`description`** and **`image`** are optional in the schema.
- **Cart / UI types:** `src/types/index.ts` uses **`imageUrl`** on **`Product`**. Map from DB with **`toCartProduct`** in **`src/lib/product-map.ts`** (`image` → `imageUrl`).
- **Existing pages:** This repo may already have a **minimal** `/products`, `/products/[id]`, **`AddToCartButton`**, and home links. Treat the steps below as **upgrade prompts** (category filters, **`ProductCard`**, **`next/image`**, **`generateStaticParams`**, full **Navbar** + marketing home) rather than starting from zero.
- **Dynamic routes:** On **Next.js 15+**, use **`const { id } = await params`** when the page receives **`params` as a Promise**.
- **Remote images:** If you use **`next/image`** with **picsum.photos**, add **`images.remotePatterns`** in **`next.config.ts`**, or keep using **`<img>`** for simplicity (as in the current minimal listing).

---

## What you'll build

- `/` — Home page with hero + featured products
- `/products` — Full product grid with category filter
- `/products/[id]` — Single product detail page

---

## Step 1 — Seed the Database with Products

Before building UI, you need data. Create `prisma/seed.ts`:

**Cursor prompt:**
```
Create prisma/seed.ts that seeds the database with 12 sample products.
Categories: "Electronics", "Clothing", "Books", "Home".
Each product needs: name, description, price, image (use placeholder URLs from 
https://picsum.photos/seed/{number}/400/400), category, stock.
Use the Product model from @prisma/schema.prisma.
```

Install a runner (if needed): `npm install -D tsx`

In **Prisma 7**, configure the seed command in **`prisma.config.ts`** (this repo uses `migrations.seed: "tsx prisma/seed.ts"`).

Then:
```bash
npx prisma db seed
```

You can also run **`npx tsx prisma/seed.ts`** once for a quick reset.

---

## Step 2 — Product Card Component

**Cursor prompt:**
```
Create src/components/features/ProductCard.tsx.

It receives a product of type Product from @src/types/index.ts.

It should show:
- Product image using next/image (fill the container, aspect-ratio square)
- Product name (bold, truncated to 1 line)
- Category (small gray text)
- Price using formatPrice from @src/lib/utils.ts
- An "Add to Cart" button

The whole card should be clickable and link to /products/[id].
The Add to Cart button should call addItem from @src/store/cartStore.ts.
Since it needs onClick and the cart store, make it a Client Component.

Style with Tailwind: white card, rounded corners, shadow, hover effect.
```

---

## Step 3 — Product Listing Page

**Cursor prompt:**
```
Create src/app/products/page.tsx as a Server Component.

It should:
1. Fetch all products from the database using @src/lib/prisma.ts
2. Get unique categories from the products
3. Accept a searchParams prop for ?category=Electronics filtering
4. Filter products by category if the param exists
5. Render a page with:
   - A title "All Products"
   - Category filter buttons (all + each unique category)
   - A responsive grid of ProductCard components from @src/components/features/ProductCard.tsx

The category filter buttons should be links that update the URL ?category= param.
Make the grid: 1 column mobile, 2 tablet, 3 desktop, 4 large.
```

---

## Step 4 — Product Detail Page

**Cursor prompt:**
```
Create src/app/products/[id]/page.tsx as a Server Component.

It receives `params` with the product id (on newer Next.js, `await params` first).

It should:
1. Fetch a single product by id using Prisma from @src/lib/prisma.ts
2. If product not found, call notFound() from next/navigation
3. Show a two-column layout (image left, details right) on desktop, stacked on mobile
4. Left: Large product image using next/image
5. Right: 
   - Category badge
   - Product name (large heading)
   - Price (large, prominent)
   - Stock status ("In Stock" green / "Out of Stock" red)
   - Description
   - Quantity selector (1-10, client component)
   - AddToCartButton client component that adds the product with selected quantity

Create the AddToCartButton as a separate file at:
src/components/features/AddToCartButton.tsx
It needs "use client" and uses @src/store/cartStore.ts

Optional: add **`generateStaticParams`** that returns all product IDs. If stock and catalog change often, you may prefer **dynamic** rendering instead.
```

---

## Step 5 — Update the Home Page

**Cursor prompt:**
```
Update src/app/page.tsx to be the home page of the EMS Store.

It should be a Server Component with:
1. A hero section: bold headline, subtitle, "Shop Now" button linking to /products
2. A "Featured Products" section showing 4 products (first 4 from DB, using @src/lib/prisma.ts)
3. A "Shop by Category" section with 4 category cards (Electronics, Clothing, Books, Home)
   each linking to /products?category=X

Import ProductCard from @src/components/features/ProductCard.tsx.
Style it to look like a real e-commerce homepage using Tailwind.
```

---

## Step 6 — Add a Navbar

**Cursor prompt:**
```
Create src/components/features/Navbar.tsx as a Client Component.

It should show:
- "EMS Store" logo/text on the left, links to /
- Navigation links: Home, Products
- Cart icon on the right showing item count from @src/store/cartStore.ts
  (use a badge like "3" when there are items)
- The cart icon should link to /cart

Use Tailwind. Make it sticky at the top (sticky top-0 z-50 bg-white shadow).
```

Then add it to `src/app/layout.tsx`:

**Cursor prompt:**
```
Update src/app/layout.tsx to:
1. Import and render the Navbar above the main content
2. Add a footer with "© 2026 EMS Store" (or the current year)
3. Wrap children in a max-w-7xl mx-auto px-4 container
Keep the existing metadata and font setup.
```

---

## ✅ Phase 1 Checkpoint

Test these before moving on:
- [ ] `/` — Home page loads with hero and featured products (upgrade if you still have the minimal link-only home)
- [ ] `/products` — Shows all products in a grid
- [ ] `/products?category=Electronics` — Filters correctly (add if not present yet)
- [ ] `/products/[any-id]` — Product detail page loads
- [ ] Cart item count updates in navbar when Add to Cart is clicked (requires **Navbar** + **`ProductCard`** / detail wired to the cart store)

If something is broken, paste the error into Cursor chat with the file reference.

---

Open `05-phase2-auth-cart.md` next.
