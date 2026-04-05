# 02 — Cursor Playbook

> The 5 Cursor skills that will make you dangerous.

---

## Your Cursor Cheat Sheet

| Shortcut | What it does |
|----------|-------------|
| `Cmd+L` (Mac) / `Ctrl+L` | Open Chat panel |
| `Cmd+K` (Mac) / `Ctrl+K` | Inline edit (highlight code first) |
| `Cmd+I` (Mac) / `Ctrl+I` | Agent mode (multi-file edits) |
| `@filename` | Add a specific file to context |
| `@codebase` | Search your whole project |

---

## Skill 1 — Chat Mode (`Cmd+L`)

Use this to ask questions and generate new code.

**Always start with context:**
```
@app/products/page.tsx — I want to add a search bar to this page.
Walk me through how to do it step by step.
```

**Use SwiftUI analogies when stuck:**
```
In SwiftUI I'd use @State to track a text field value.
What's the equivalent pattern in Next.js for a search input?
```

**Ask WHY, not just what:**
```
You added "use client" to this component. Explain why it's needed here
and when I would NOT need it.
```

---

## Skill 2 — Inline Edit (`Cmd+K`)

1. Highlight a block of code
2. Press `Cmd+K`
3. Type what you want changed

Examples:
- `"Add loading skeleton while data fetches"`
- `"Refactor to use TypeScript generics"`
- `"Add error handling"`
- `"Make this responsive for mobile"`

This is your fastest tool for small targeted changes.

---

## Skill 3 — Agent Mode (`Cmd+I`)

Use this for bigger features that span multiple files.

Example prompts:
```
Create a complete product reviews feature:
- New Prisma model: Review (id, productId, userId, rating, comment, createdAt)
- Add the relation to the Product model
- Create a ReviewForm client component
- Create a ReviewList server component
- Add both to the product detail page
```

Agent mode will edit `schema.prisma`, create new component files, and update existing pages — all in one go.

**Warning:** Always review what it changes before accepting. Press `Accept All` only when you've read through the diff.

---

## Skill 4 — The `.cursorrules` File (Already set up in `00-setup.md`)

This is your permanent project context. Every Cursor conversation automatically knows:
- Your tech stack
- Your coding rules
- Your project structure

You never have to re-explain "I'm using Next.js App Router with Prisma" every time.

**Add to it as your project grows.** For example, after you build auth:
```
Auth is set up with NextAuth.js. Session is available via getServerSession(authOptions).
Protected routes use middleware in middleware.ts.
```

---

## Skill 5 — Debugging with Cursor

When you hit an error:

1. Copy the **full error message** from the terminal or browser console
2. Open Cursor chat (`Cmd+L`)
3. Use this template:

```
I got this error:
[paste full error here]

Here's the relevant code:
@src/app/products/page.tsx

What's wrong and why? Then tell me how to fix it.
```

The "why" part is critical — you'll understand the fix instead of just copying it.

---

## Prompt Templates to Bookmark

### Generate a new page:
```
Create a new page at app/[route]/page.tsx.
It should [describe what it does].
Use the same patterns as @app/products/page.tsx.
Make it a Server Component unless it needs interactivity.
```

### Generate a component:
```
Create a component at components/[name].tsx.
It receives these props: [describe props].
It should [describe what it renders].
Use Tailwind for styling. Keep it consistent with @components/ProductCard.tsx.
```

### Refactor existing code:
```
@src/app/cart/page.tsx
Refactor this component to:
- Split the cart item into its own CartItem.tsx component
- Move the total calculation to a helper function in lib/cart.ts
- Keep the same visual output
```

### Add a Prisma model:
```
Add a new Prisma model called [ModelName] to @prisma/schema.prisma with these fields:
- [field list]
Then generate the migration command I need to run.
```

---

## The Golden Rule

> **Cursor is fastest when you give it context + constraints.**

| Quality | Example |
|---------|---------|
| ❌ Vague | `"make a product page"` |
| ✅ Specific | `"Create app/products/[id]/page.tsx. Fetch the product by ID using Prisma server-side. Show image, name, price, description. Add an AddToCartButton client component below."` |

The more specific you are, the less you have to fix afterward.

---

## What NOT to do

- ❌ Don't accept code you don't understand — ask Cursor to explain it
- ❌ Don't let Cursor build 5 features at once — one at a time
- ❌ Don't ignore TypeScript errors — ask Cursor to fix them immediately
- ❌ Don't skip reading the diffs in Agent mode

---

Open `03-project-structure.md` next.
