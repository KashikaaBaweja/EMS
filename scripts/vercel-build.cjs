/**
 * Vercel build: always generate Prisma client; run migrations only when DATABASE_URL is set.
 * If migrate is skipped, set DATABASE_URL in Vercel (Production + Preview) and redeploy.
 */
require("dotenv/config");

const { execSync } = require("node:child_process");

function run(cmd) {
  execSync(cmd, { stdio: "inherit", env: process.env });
}

run("npx prisma generate");

if (process.env.DATABASE_URL) {
  run("npx prisma migrate deploy");
} else {
  console.warn(
    "[vercel-build] DATABASE_URL is unset — skipping prisma migrate deploy. Add it in Vercel → Settings → Environment Variables, then redeploy.",
  );
}

run("npx next build");
