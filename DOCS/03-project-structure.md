# 03 — Project Structure

> Build this structure as you go. Don't create empty folders upfront.

---

## Final Structure (what you'll have by the end)

```
ems-store/
├── .cursorrules                ← AI behaviour rules (already created)
├── prisma/
│   └── schema.prisma           ← Database models
├── src/
│   ├── app/
│   │   ├── layout.tsx          ← Root layout (like WindowGroup in SwiftUI)
│   │   ├── page.tsx            ← Home page /
│   │   ├── (auth)/             ← Route group (no URL prefix)
│   │   │   ├── login/
│   │   │   │   └── page.tsx    ← /login
│   │   │   └── register/
│   │   │       └── page.tsx    ← /register
│   │   ├── products/
│   │   │   ├── page.tsx        ← /products (listing)
│   │   │   └── [id]/
│   │   │       └── page.tsx    ← /products/123 (detail)
│   │   ├── cart/
│   │   │   └── page.tsx        ← /cart
│   │   ├── orders/
│   │   │   ├── page.tsx        ← /orders (history)
│   │   │   └── [id]/
│   │   │       ├── page.tsx    ← /orders/[id] (detail)
│   │   │       └── confirmation/
│   │   │           └── page.tsx← /orders/[id]/confirmation
│   │   ├── admin/
│   │   │   ├── page.tsx        ← /admin (dashboard)
│   │   │   ├── actions.ts
│   │   │   └── products/       ← product CRUD (list, new, [id]/edit)
│   │   ├── checkout/
│   │   │   ├── page.tsx        ← /checkout
│   │   │   └── actions.ts      ← createOrder Server Action
│   │   └── api/
│   │       └── auth/
│   │           └── [...nextauth]/
│   │               └── route.ts ← NextAuth handler
│   ├── components/
│   │   ├── providers.tsx       ← SessionProvider (see layout)
│   │   ├── ui/                 ← Reusable building blocks
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Card.tsx
│   │   └── features/           ← Feature-specific components
│   │       ├── ProductCard.tsx
│   │       ├── ProductGrid.tsx
│   │       ├── CartItem.tsx
│   │       ├── Navbar.tsx
│   │       ├── AddToCartButton.tsx
│   │       └── ClearCartOnMount.tsx
│   ├── generated/
│   │   └── prisma/             ← Generated Prisma client (do not edit)
│   ├── lib/
│   │   ├── prisma.ts           ← Prisma 7 singleton + pg adapter
│   │   ├── auth.ts             ← NextAuth authOptions + getSession()
│   │   ├── utils.ts            ← e.g. formatPrice
│   │   ├── product-map.ts      ← DB Product → cart Product (image → imageUrl)
│   │   └── dates.ts            ← e.g. business-day helper (orders)
│   ├── store/
│   │   └── cartStore.ts        ← Zustand cart state
│   └── types/
│       ├── index.ts            ← Shared app types (Product, CartItem, …)
│       └── next-auth.d.ts      ← Session / JWT id + role
├── scripts/
│   └── make-admin.ts           ← CLI: promote user to ADMIN
├── middleware.ts               ← Route protection (when you add it)
├── prisma.config.ts            ← Prisma 7 config (loads .env)
└── .env                        ← DATABASE_URL, NEXTAUTH_*, … (never commit!)
```

---

## How this repo matches the structure (source of truth)

Do **not** paste older snippets that use `@prisma/client` in `src/lib/prisma.ts` or `Float` prices — they are outdated.

| Topic | Where it lives |
|--------|----------------|
| **Prisma schema** | `prisma/schema.prisma` — PostgreSQL, `Decimal` money, **NextAuth** models (`Account`, `Session`, `VerificationToken`), **Order** shipping + `subtotal` / `shipping` / `total` for checkout |
| **Prisma client** | Generated under **`src/generated/prisma/`**; singleton + **`@prisma/adapter-pg`** in **`src/lib/prisma.ts`** |
| **Env** | **Root `.env`** + **`prisma.config.ts`** (`import "dotenv/config"`) |
| **Auth** | **`src/lib/auth.ts`** (`authOptions`, **`getSession()`**), **`src/app/api/auth/[...nextauth]/route.ts`**, **`src/types/next-auth.d.ts`** |
| **Session in UI** | **`src/components/providers.tsx`** (`SessionProvider`) wrapped in **`src/app/layout.tsx`** |

After any schema change:

```bash
npx prisma migrate dev
npx prisma generate
```

---

## Cursor Prompt to Generate Foundation Files

Instead of typing all this manually, paste this into Cursor chat:

```
I need to set up the foundation files for my e-commerce project.

1. Create src/lib/prisma.ts with a singleton Prisma client
2. Create src/types/index.ts with types for Product, CartItem, and Order
3. Create src/store/cartStore.ts using Zustand with: 
   - items: CartItem[] 
   - addItem(product, quantity) 
   - removeItem(productId) 
   - updateQuantity(productId, quantity) 
   - clearCart() 
   - total (computed)
4. Create src/lib/utils.ts with a formatPrice(price: number) helper that returns "$XX.XX"

Use the types from @src/types/index.ts throughout.
```

---

Now open `04-phase1-products.md` to start building.
