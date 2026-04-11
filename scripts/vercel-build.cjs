/**
 * Vercel build: always generate Prisma client; run migrations only when DATABASE_URL is set.
 * If migrate is skipped, set DATABASE_URL in Vercel (Production + Preview) and redeploy.
 */
require("dotenv/config");

const { execSync } = require("node:child_process");

function run(cmd) {
  execSync(cmd, { stdio: "inherit", env: process.env });
}

/** True if the host is only reachable on the same machine (invalid for Vercel’s build servers). */
function isLocalDatabaseHost(databaseUrl) {
  if (!databaseUrl) return false;
  try {
    const u = new URL(databaseUrl);
    const h = u.hostname.toLowerCase();
    return h === "localhost" || h === "127.0.0.1" || h === "::1";
  } catch {
    return /\/\/(localhost|127\.0\.0\.1)([:/?]|$)/i.test(databaseUrl);
  }
}

run("npx prisma generate");

const dbUrl = process.env.DATABASE_URL;
if (process.env.VERCEL && dbUrl && isLocalDatabaseHost(dbUrl)) {
  console.error(
    [
      "[vercel-build] DATABASE_URL uses localhost — Vercel cannot reach your computer’s Postgres.",
      "In Vercel → Project → Settings → Environment Variables, set DATABASE_URL to a hosted Postgres URL",
      "(e.g. Neon, Supabase). Do not paste your local .env connection string.",
    ].join("\n"),
  );
  process.exit(1);
}

if (dbUrl) {
  run("npx prisma migrate deploy");
  // Idempotent: only inserts when the catalog is empty (does not wipe orders on redeploys).
  run("npx tsx prisma/seed.ts");
} else {
  console.warn(
    "[vercel-build] DATABASE_URL is unset — skipping prisma migrate deploy. Add it in Vercel → Settings → Environment Variables, then redeploy.",
  );
}

run("npx next build");
