import { Prisma } from "../src/generated/prisma/client";
import { prisma } from "../src/lib/prisma";

/** Unsplash CDN — real photos matched to category (demo use; unsplash.com/license). */
function unsplashPhoto(photoId: string) {
  return `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=600&h=600&q=80`;
}

const CATALOG: {
  category: "Electronics" | "Clothing" | "Books" | "Home";
  name: string;
  description: string;
  price: string;
  stock: number;
  image: string;
}[] = [
  {
    category: "Electronics",
    name: '65W GaN charger — dual USB-C',
    description:
      "Folds flat for travel. Runs cool under load; good for laptops and tablets from one outlet. Includes a 6 ft cable.",
    price: "34.99",
    stock: 42,
    image: unsplashPhoto("1558618666-fcd25c85cd64"),
  },
  {
    category: "Electronics",
    name: "USB-C hub — HDMI, SD, three USB-A",
    description:
      "Passthrough charging supported. HDMI does 4K at 60 Hz on most laptops. SD slot is UHS-I.",
    price: "49.50",
    stock: 28,
    image: unsplashPhoto("1625948515291-69613efd103f"),
  },
  {
    category: "Electronics",
    name: "Noise-canceling headphones — fold-flat",
    description:
      "20-hour battery with ANC on. Ear cups replaceable; case included. Not the lightest pair, but comfortable on long flights.",
    price: "129.00",
    stock: 15,
    image: unsplashPhoto("1505740420928-5e560c06d30e"),
  },
  {
    category: "Electronics",
    name: "NVMe SSD enclosure — USB 3.2 Gen 2",
    description:
      "Tool-free tray. Aluminum shell, gets warm under sustained writes—normal. Fits M.2 2280 drives only.",
    price: "27.95",
    stock: 60,
    image: unsplashPhoto("1597872200969-2b65d56bd16b"),
  },
  {
    category: "Clothing",
    name: "Oxford shirt — blue stripe, relaxed fit",
    description:
      "Midweight cotton. Runs slightly long in the body; size down if you’re between sizes. Machine wash cold, hang dry.",
    price: "58.00",
    stock: 34,
    image: unsplashPhoto("1594938298603-c8148c4dae35"),
  },
  {
    category: "Clothing",
    name: "Merino crew socks — two-pack, black",
    description:
      "Fine merino blend, not paper-thin. Good with boots; no itchy seams at the toe.",
    price: "22.00",
    stock: 80,
    image: unsplashPhoto("1586350977771-b3b0abd50c82"),
  },
  {
    category: "Clothing",
    name: "Canvas sneakers — unbleached canvas",
    description:
      "Rubber sole, runs half a size large. Laces included. Break in over a few wears.",
    price: "72.00",
    stock: 22,
    image: unsplashPhoto("1549298916-b41d501d3772"),
  },
  {
    category: "Clothing",
    name: "Wool beanie — heather gray",
    description:
      "Rib knit, not too tall. One size; stretches to fit most heads without going baggy.",
    price: "32.00",
    stock: 45,
    image: unsplashPhoto("1521572163474-6864f9cf17ab"),
  },
  {
    category: "Books",
    name: "All About Love — bell hooks",
    description:
      "Paperback reprint. Essays on love and community—reads fast, worth revisiting.",
    price: "16.99",
    stock: 50,
    image: unsplashPhoto("1544947950-fa07a98d237f"),
  },
  {
    category: "Books",
    name: "Station Eleven — Emily St. John Mandel",
    description:
      "Novel, not the show tie-in. Tight pacing; good for a long weekend.",
    price: "17.00",
    stock: 38,
    image: unsplashPhoto("1512820790803-83ca734da794"),
  },
  {
    category: "Books",
    name: "Salt, Fat, Acid, Heat — Samin Nosrat",
    description:
      "Cookbook that actually teaches taste. Illustrations throughout; stains easily if you cook from it—expected.",
    price: "35.00",
    stock: 12,
    image: unsplashPhoto("1556910103-1c02745aae4d"),
  },
  {
    category: "Books",
    name: "The Power Broker — Robert A. Caro",
    description:
      "Heavy. About Robert Moses and New York. Buy if you mean it; it’s a doorstop.",
    price: "26.00",
    stock: 8,
    image: unsplashPhoto("1481627834876-b7833e8f5570"),
  },
  {
    category: "Home",
    name: "Stainless chef’s knife — 8 inch",
    description:
      "German steel, full tang. Hand-wash and dry—don’t run it through the dishwasher.",
    price: "89.00",
    stock: 19,
    image: unsplashPhoto("1565557623262-b51c2513a641"),
  },
  {
    category: "Home",
    name: "Stoneware dinner plate — speckled sand glaze",
    description:
      "Dishwasher-safe. Slight variation plate to plate because of the glaze.",
    price: "14.50",
    stock: 64,
    image: unsplashPhoto("1578662996442-48f60103fc96"),
  },
  {
    category: "Home",
    name: "Linen napkin set — four pieces, natural",
    description:
      "Pre-washed so it doesn’t feel like cardboard. Wrinkles are part of the deal with linen.",
    price: "36.00",
    stock: 30,
    image: unsplashPhoto("1576566588028-4147f3842f27"),
  },
  {
    category: "Home",
    name: "Beeswax taper candles — pair, ivory",
    description:
      "Burn time roughly 8 hours each. Trim wick to ¼ inch. Stand sold separately.",
    price: "18.00",
    stock: 55,
    image: unsplashPhoto("1434389677669-e08b4cac3105"),
  },
];

async function main() {
  const reset = process.env.SEED_RESET === "true";

  if (reset) {
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    console.log("[seed] SEED_RESET=true — cleared orders and products.");
  } else {
    const existing = await prisma.product.count();
    if (existing > 0) {
      console.log(
        `[seed] Skip: ${existing} products already in the database. Set SEED_RESET=true to wipe and reseed (dev only).`,
      );
      return;
    }
  }

  const rows = CATALOG.map((p) => ({
    name: p.name,
    description: p.description,
    price: new Prisma.Decimal(p.price),
    image: p.image,
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
