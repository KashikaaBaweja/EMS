# 01 — SwiftUI → Next.js Mental Model

> Don't memorize. Map what you already know.

---

## The Big Picture

| SwiftUI Concept | Next.js Equivalent |
|----------------|-------------------|
| `View` struct | React component (`.tsx` file) |
| `body: some View` | `return <div>...</div>` (JSX) |
| `@State` | `useState()` hook |
| `@ObservedObject` | Zustand store |
| `@EnvironmentObject` | React Context |
| `.onAppear` | `useEffect(() => {}, [])` |
| `NavigationLink` | `<Link href="/path">` |
| `List` | `array.map(item => <Component />)` |
| `NavigationStack` | App Router (folders = routes) |
| `TabView` | Navbar component |
| `AsyncImage` | `<Image>` from `next/image` |
| SPM package | npm package |

---

## Routing

In SwiftUI you push views programmatically. In Next.js, **folders are routes**.

```
app/
├── page.tsx          →  /
├── products/
│   ├── page.tsx      →  /products
│   └── [id]/
│       └── page.tsx  →  /products/123  (dynamic!)
├── cart/
│   └── page.tsx      →  /cart
└── checkout/
    └── page.tsx      →  /checkout
```

The `[id]` in brackets = dynamic parameter. Like `NavigationLink` with a value.

---

## Components

SwiftUI:
```swift
struct ProductCard: View {
    let product: Product
    var body: some View {
        VStack {
            Text(product.name)
            Text("$\(product.price)")
        }
    }
}
```

Next.js / React:
```tsx
type Props = {
  product: Product
}

export default function ProductCard({ product }: Props) {
  return (
    <div>
      <p>{product.name}</p>
      <p>${product.price}</p>
    </div>
  )
}
```

Almost identical structure. Props = parameters. JSX = `body`.

---

## Server vs Client Components

This is the most important Next.js concept. No SwiftUI equivalent — pay attention.

### Server Component (default)
- Runs on the **server** only
- Can fetch from DB directly
- Cannot use `useState`, `onClick`, browser APIs
- Faster, more secure

```tsx
// No "use client" at top = Server Component
// This runs on the server, user never sees this code
export default async function ProductsPage() {
  const products = await prisma.product.findMany() // direct DB access!
  return <ProductList products={products} />
}
```

### Client Component
- Runs in the **browser**
- Can use `useState`, `onClick`, etc.
- Add `"use client"` at the very top

```tsx
"use client"

import { useState } from "react"

export default function AddToCartButton({ productId }: { productId: string }) {
  const [added, setAdded] = useState(false)
  
  return (
    <button onClick={() => setAdded(true)}>
      {added ? "Added!" : "Add to Cart"}
    </button>
  )
}
```

**Rule of thumb:** Make everything a Server Component. Only add `"use client"` when you need clicks, state, or browser stuff.

---

## Data Fetching

SwiftUI (async/await):
```swift
func loadProducts() async {
    products = try await api.getProducts()
}
```

Next.js Server Component:
```tsx
// You fetch directly in the component, no useEffect needed
export default async function ProductsPage() {
  const res = await fetch('https://api.example.com/products')
  const products = await res.json()
  // or with Prisma: const products = await prisma.product.findMany()
  
  return <div>{products.map(p => <ProductCard key={p.id} product={p} />)}</div>
}
```

No loading state boilerplate. No useEffect. Just async/await in the component.

---

## Key Syntax Differences

| SwiftUI | React/Next.js |
|---------|--------------|
| `if condition { View() }` | `{condition && <View />}` |
| `ForEach(items) { item in }` | `{items.map(item => <Component key={item.id} />)}` |
| `HStack` | `<div className="flex flex-row">` |
| `VStack` | `<div className="flex flex-col">` |
| `Spacer()` | `<div className="flex-1" />` or `ml-auto` |
| `padding()` | `className="p-4"` (Tailwind) |
| `background(.blue)` | `className="bg-blue-500"` |

---

## Tailwind CSS = Inline Styling

No separate CSS files. Styles go directly in `className`:

```tsx
<div className="flex flex-col gap-4 p-6 bg-white rounded-xl shadow-md">
  <h1 className="text-2xl font-bold text-gray-900">Product Name</h1>
  <p className="text-gray-500">$29.99</p>
  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
    Add to Cart
  </button>
</div>
```

---

## ✅ Checkpoint

You now understand:
- Folders = routes
- Components look like SwiftUI views
- Server Components = fetch data directly (no useEffect)
- Client Components = use `"use client"` for interactivity
- Tailwind = inline CSS classes

Open `02-cursor-playbook.md` next.
