import { config } from "dotenv";
import { resolve } from "node:path";

config({ path: resolve(process.cwd(), ".env") });

const email = process.argv[2]?.trim();

async function main() {
  if (!email) {
    console.error("Usage: npx tsx scripts/make-admin.ts user@email.com");
    process.exit(1);
  }

  const { prisma } = await import("../src/lib/prisma");

  const result = await prisma.user.updateMany({
    where: { email },
    data: { role: "ADMIN" },
  });

  if (result.count === 0) {
    console.error(`No user found with email: ${email}`);
    process.exit(1);
  }

  console.log(`User ${email} is now ADMIN.`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
