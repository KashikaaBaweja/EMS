import { Prisma } from "../src/generated/prisma/client";
import { prisma } from "../src/lib/prisma";

/**
 * Seed catalog: names and copy written like real shop listings—sizes, materials, author names.
 * Images use picsum with stable seeds so URLs stay consistent between runs.
 */
const CATALOG: {
  category: "Electronics" | "Clothing" | "Books" | "Home";
  name: string;
  description: string;
  price: string;
  stock: number;
  imageSeed: string;
}[] = [
  {
    category: "Electronics",
    name: '65W GaN charger — dual USB-C',
    description:
      "Folds flat for travel. Runs cool under load; good for laptops and tablets from one outlet. Includes a 6 ft cable.",
    price: "34.99",
    stock: 42,
    imageSeed: "ems-charger-gan",
  },
  {
    category: "Electronics",
    name: "USB-C hub — HDMI, SD, three USB-A",
    description:
      "Passthrough charging supported. HDMI does 4K at 60 Hz on most laptops. SD slot is UHS-I.",
    price: "49.50",
    stock: 28,
    imageSeed: "ems-usbc-hub",
  },
  {
    category: "Electronics",
    name: "Noise-canceling headphones — fold-flat",
    description:
      "20-hour battery with ANC on. Ear cups replaceable; case included. Not the lightest pair, but comfortable on long flights.",
    price: "129.00",
    stock: 15,
    imageSeed: "ems-headphones-anc",
  },
  {
    category: "Electronics",
    name: "NVMe SSD enclosure — USB 3.2 Gen 2",
    description:
      "Tool-free tray. Aluminum shell, gets warm under sustained writes—normal. Fits M.2 2280 drives only.",
    price: "27.95",
    stock: 60,
    imageSeed: "ems-ssd-enclosure",
  },
  {
    category: "Clothing",
    name: "Oxford shirt — blue stripe, relaxed fit",
    description:
      "Midweight cotton. Runs slightly long in the body; size down if you’re between sizes. Machine wash cold, hang dry.",
    price: "58.00",
    stock: 34,
    imageSeed: "ems-oxford-shirt",
  },
  {
    category: "Clothing",
    name: "Merino crew socks — two-pack, black",
    description:
      "Fine merino blend, not paper-thin. Good with boots; no itchy seams at the toe.",
    price: "22.00",
    stock: 80,
    imageSeed: "ems-merino-socks",
  },
  {
    category: "Clothing",
    name: "Canvas sneakers — unbleached canvas",
    description:
      "Rubber sole, runs half a size large. Laces included. Break in over a few wears.",
    price: "72.00",
    stock: 22,
    imageSeed: "ems-canvas-sneakers",
  },
  {
    category: "Clothing",
    name: "Wool beanie — heather gray",
    description:
      "Rib knit, not too tall. One size; stretches to fit most heads without going baggy.",
    price: "32.00",
    stock: 45,
    imageSeed: "ems-wool-beanie",
  },
  {
    category: "Books",
    name: "All About Love — bell hooks",
    description:
      "Paperback reprint. Essays on love and community—reads fast, worth revisiting.",
    price: "16.99",
    stock: 50,
    imageSeed: "ems-book-hooks",
  },
  {
    category: "Books",
    name: "Station Eleven — Emily St. John Mandel",
    description:
      "Novel, not the show tie-in. Tight pacing; good for a long weekend.",
    price: "17.00",
    stock: 38,
    imageSeed: "ems-book-mandel",
  },
  {
    category: "Books",
    name: "Salt, Fat, Acid, Heat — Samin Nosrat",
    description:
      "Cookbook that actually teaches taste. Illustrations throughout; stains easily if you cook from it—expected.",
    price: "35.00",
    stock: 12,
    imageSeed: "ems-book-nosrat",
  },
  {
    category: "Books",
    name: "The Power Broker — Robert A. Caro",
    description:
      "Heavy. About Robert Moses and New York. Buy if you mean it; it’s a doorstop.",
    price: "26.00",
    stock: 8,
    imageSeed: "ems-book-caro",
  },
  {
    category: "Home",
    name: "Stainless chef’s knife — 8 inch",
    description:
      "German steel, full tang. Hand-wash and dry—don’t run it through the dishwasher.",
    price: "89.00",
    stock: 19,
    imageSeed: "ems-chef-knife",
  },
  {
    category: "Home",
    name: "Stoneware dinner plate — speckled sand glaze",
    description:
      "Dishwasher-safe. Slight variation plate to plate because of the glaze.",
    price: "14.50",
    stock: 64,
    imageSeed: "ems-stoneware-plate",
  },
  {
    category: "Home",
    name: "Linen napkin set — four pieces, natural",
    description:
      "Pre-washed so it doesn’t feel like cardboard. Wrinkles are part of the deal with linen.",
    price: "36.00",
    stock: 30,
    imageSeed: "ems-linen-napkins",
  },
  {
    category: "Home",
    name: "Beeswax taper candles — pair, ivory",
    description:
      "Burn time roughly 8 hours each. Trim wick to ¼ inch. Stand sold separately.",
    price: "18.00",
    stock: 55,
    imageSeed: "ems-beeswax-candles",
  },
];

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();

  const rows = CATALOG.map((p) => ({
    name: p.name,
    description: p.description,
    price: new Prisma.Decimal(p.price),
    image: `https://picsum.photos/seed/${encodeURIComponent(p.imageSeed)}/600/600`,
    category: p.category,
    stock: p.stock,
  }));

  await prisma.product.createMany({ data: rows });

  console.log(`Seeded ${rows.length} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
