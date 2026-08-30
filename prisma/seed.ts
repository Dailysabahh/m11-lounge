import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const hours = [
  { day: "Monday – Thursday", hours: "4:00 PM – 2:00 AM" },
  { day: "Friday – Sunday", hours: "2:00 PM – 3:00 AM" },
];

export async function seedMenu() {
  const site = await prisma.siteSetting.findUnique({ where: { id: "site" } }).catch(() => null);
  if (site) {
    await prisma.siteSetting.update({
      where: { id: "site" },
      data: {
        address: site.address.replace(/Lagos/gi, "Osogbo"),
        aboutText: site.aboutText.replace(/Lagos/gi, "Osogbo"),
      },
    });
  }

  const productCount = await prisma.product.count().catch(() => 0);
  if (productCount > 0 && process.env.FORCE_SEED !== "1") {
    console.log("Menu already seeded — skipping.");
    return;
  }

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.extra.deleteMany();
  await prisma.promotion.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.siteSetting.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("M11Admin2026!", 10);

  await prisma.user.createMany({
    data: [
      {
        email: "admin@m11lounge.com",
        name: "M11 Owner",
        passwordHash,
        role: "SUPER_ADMIN",
      },
      {
        email: "staff@m11lounge.com",
        name: "M11 Floor Staff",
        passwordHash,
        role: "STAFF",
      },
    ],
  });

  const seafood = await prisma.category.create({
    data: {
      name: "Seafood Platters",
      slug: "seafood-platters",
      description:
        "Grilled whole fish and royal seafood plates — Ocean Fire, Royal Feast, and Street King.",
      image: "/menu/products/ocean-fire.jpg",
      sortOrder: 1,
    },
  });
  const meat = await prisma.category.create({
    data: {
      name: "Meat Platters",
      slug: "meat-platters",
      description: "Goat, beef, chicken, yam and plantain — built for the table.",
      image: "/menu/products/meat-platter.jpg",
      sortOrder: 2,
    },
  });
  const premium = await prisma.category.create({
    data: {
      name: "Premium Plates",
      slug: "premium-plates",
      description: "Signature combos, pasta, fried rice, and the Seafood Splender.",
      image: "/menu/products/combo-platter.jpg",
      sortOrder: 3,
    },
  });
  const traditional = await prisma.category.create({
    data: {
      name: "Traditional",
      slug: "traditional",
      description: "Egusi, okro, poundo — rich Nigerian comfort, lounge-style.",
      image: "/menu/products/semo-egusi.jpg",
      sortOrder: 4,
    },
  });
  const sides = await prisma.category.create({
    data: {
      name: "Extras & Sides",
      slug: "extras-sides",
      description: "Fries, jollof, plantain, sauces and garden salad.",
      image: "/menu/products/french-fries.jpg",
      sortOrder: 5,
    },
  });
  const shisha = await prisma.category.create({
    data: {
      name: "Shisha",
      slug: "shisha",
      description: "Premium coals, quality flavors, water change — smoke the M11 way.",
      image: "/menu/products/shisha-banner.jpg",
      sortOrder: 6,
    },
  });

  const products = [
    {
      name: "M11 Ocean Fire",
      slug: "m11-ocean-fire",
      description:
        "Succulent whole fish grilled to perfection and glazed with our signature pepper sauce. Served with jollof rice and creamy coleslaw.",
      ingredients: [
        "Grilled whole fish",
        "Signature pepper sauce",
        "Jollof rice",
        "Creamy coleslaw",
      ],
      price: 25000,
      image: "/menu/products/ocean-fire.jpg",
      featured: true,
      allowsExtras: true,
      sortOrder: 1,
      categoryId: seafood.id,
    },
    {
      name: "M11 Royal Feast",
      slug: "m11-royal-feast",
      description:
        "A royal platter of smoky grilled fish served with roasted yam, roasted plantain, signature sauce, ketchup and creamy coleslaw.",
      ingredients: [
        "Smoky grilled fish",
        "Roasted yam",
        "Roasted plantain",
        "Signature sauce",
        "Ketchup",
        "Creamy coleslaw",
      ],
      price: 28000,
      image: "/menu/products/royal-feast.jpg",
      featured: true,
      allowsExtras: true,
      sortOrder: 2,
      categoryId: seafood.id,
    },
    {
      name: "M11 Street King",
      slug: "m11-street-king",
      description:
        "Our signature BBQ fish served with Indomie stir-fry noodles, crispy fried yam and creamy coleslaw. Bold. Spicy. Satisfying.",
      ingredients: [
        "BBQ fish",
        "Indomie stir-fry",
        "Crispy fried yam",
        "Creamy coleslaw",
      ],
      price: 22000,
      image: "/menu/products/street-king.jpg",
      featured: true,
      allowsExtras: true,
      sortOrder: 3,
      categoryId: seafood.id,
    },
    {
      name: "Meat Platter",
      slug: "meat-platter",
      description:
        "A generous sharing platter of fried yam, goat meat, beef, chicken and plantain, finished with spring onions, carrot, green pepper and onions.",
      ingredients: [
        "Fried yam",
        "Goat meat",
        "Beef",
        "Chicken",
        "Plantain",
        "Spring onions",
        "Carrot",
        "Green pepper",
        "Onions",
      ],
      price: 32000,
      image: "/menu/products/meat-platter.jpg",
      featured: true,
      allowsExtras: true,
      sortOrder: 1,
      categoryId: meat.id,
    },
    {
      name: "M11 Combo Platter",
      slug: "m11-combo-platter",
      description:
        "Enjoy a combination of our best flavors in one premium platter — seafood and meat together, built for the table.",
      ingredients: [
        "Seafood selection",
        "Assorted meat",
        "Yam",
        "Plantain",
        "Garnish of spring onions, carrot, green pepper and onions",
      ],
      price: 45000,
      image: "/menu/products/combo-platter.jpg",
      featured: true,
      allowsExtras: true,
      sortOrder: 1,
      categoryId: premium.id,
    },
    {
      name: "Sea Food Splender",
      slug: "sea-food-splender",
      description:
        "A lavish silver platter of shrimp, calamari, prawns, fish, crabs and snail — lounge luxury, generously plated.",
      ingredients: ["Shrimp", "Calamari", "Prawns", "Fish", "Crabs", "Snail"],
      price: 40000,
      image: "/menu/products/seafood-splender.jpg",
      featured: true,
      allowsExtras: true,
      sortOrder: 2,
      categoryId: premium.id,
    },
    {
      name: "Spaghetti Bolognese",
      slug: "spaghetti-bolognese",
      description:
        "Classic bolognese tossed through spaghetti with cheese, onions, garlic, ginger and bell peppers.",
      ingredients: [
        "Sauce bolognese",
        "Cheese",
        "Onions",
        "Garlic",
        "Ginger",
        "Bell peppers",
      ],
      price: 15000,
      image: "/menu/products/spaghetti-bolognese.jpg",
      featured: false,
      allowsExtras: true,
      sortOrder: 3,
      categoryId: premium.id,
    },
    {
      name: "Chinese Fried Rice",
      slug: "chinese-fried-rice",
      description:
        "Dark soy fried rice with shrimp, chicken breast, sausage, bell pepper, carrot and onions.",
      ingredients: [
        "Shrimp",
        "Chicken breast",
        "Sausage",
        "Bell pepper",
        "Carrot",
        "Onions",
        "Dark soy sauce",
      ],
      price: 18000,
      image: "/menu/products/chinese-fried-rice.jpg",
      featured: false,
      allowsExtras: true,
      sortOrder: 4,
      categoryId: premium.id,
    },
    {
      name: "Semo & Egusi Soup",
      slug: "semo-egusi-soup",
      description:
        "Rich egusi soup cooked with assorted meat and vegetables, served with soft semo.",
      ingredients: ["Egusi soup", "Assorted meat", "Vegetables", "Semo"],
      price: 12000,
      image: "/menu/products/semo-egusi.jpg",
      featured: false,
      allowsExtras: true,
      sortOrder: 1,
      categoryId: traditional.id,
    },
    {
      name: "Sea Food Okro",
      slug: "sea-food-okro",
      description:
        "Flavorful okro soup loaded with seafood, cooked to perfection and served with swallow.",
      ingredients: ["Okro soup", "Prawns", "Calamari", "Swallow"],
      price: 20000,
      image: "/menu/products/seafood-okro.jpg",
      featured: false,
      allowsExtras: true,
      sortOrder: 2,
      categoryId: traditional.id,
    },
    {
      name: "Poundo Ham",
      slug: "poundo-ham",
      description:
        "Delicious pounded yam served with savory ham in a rich pepper sauce.",
      ingredients: ["Pounded yam", "Ham", "Pepper sauce"],
      price: 15000,
      image: "/menu/products/poundo-ham.jpg",
      featured: false,
      allowsExtras: true,
      sortOrder: 3,
      categoryId: traditional.id,
    },
    {
      name: "French Fries",
      slug: "french-fries",
      description: "Crispy golden fries, seasoned and served ready for dipping.",
      ingredients: ["Potatoes", "Seasoning"],
      price: 4000,
      image: "/menu/products/french-fries.jpg",
      featured: false,
      allowsExtras: false,
      sortOrder: 1,
      categoryId: sides.id,
    },
    {
      name: "Coleslaw",
      slug: "coleslaw",
      description: "Creamy house coleslaw with cabbage and carrot.",
      ingredients: ["Cabbage", "Carrot", "Creamy dressing"],
      price: 3000,
      image: "/menu/products/coleslaw.jpg",
      featured: false,
      allowsExtras: false,
      sortOrder: 2,
      categoryId: sides.id,
    },
    {
      name: "Garden Salad",
      slug: "garden-salad",
      description: "Fresh lettuce, cucumber, tomato and onion.",
      ingredients: ["Lettuce", "Cucumber", "Tomato", "Onion"],
      price: 4000,
      image: "/menu/products/garden-salad.jpg",
      featured: false,
      allowsExtras: false,
      sortOrder: 3,
      categoryId: sides.id,
    },
    {
      name: "Sauce",
      slug: "sauce",
      description: "House tomato-pepper sauce.",
      ingredients: ["Tomato", "Pepper", "Spices"],
      price: 1500,
      image: "/menu/products/sauce.jpg",
      featured: false,
      allowsExtras: false,
      sortOrder: 4,
      categoryId: sides.id,
    },
    {
      name: "Dipping Sauce",
      slug: "dipping-sauce",
      description: "Creamy lounge dipping sauce.",
      ingredients: ["House dip"],
      price: 1500,
      image: "/menu/products/dipping-sauce.jpg",
      featured: false,
      allowsExtras: false,
      sortOrder: 5,
      categoryId: sides.id,
    },
    {
      name: "Jollof Rice",
      slug: "jollof-rice",
      description: "Smoky party-style jollof, plated as a generous side.",
      ingredients: ["Jollof rice"],
      price: 5000,
      image: "/menu/products/jollof-rice.jpg",
      featured: false,
      allowsExtras: false,
      sortOrder: 6,
      categoryId: sides.id,
    },
    {
      name: "Fried Plantain",
      slug: "fried-plantain",
      description: "Caramelised fried plantain (dodo).",
      ingredients: ["Plantain"],
      price: 4000,
      image: "/menu/products/fried-plantain.jpg",
      featured: false,
      allowsExtras: false,
      sortOrder: 7,
      categoryId: sides.id,
    },
    {
      name: "Fried Yam",
      slug: "fried-yam",
      description: "Crispy golden fried yam cubes.",
      ingredients: ["Yam"],
      price: 4000,
      image: "/menu/products/fried-yam.jpg",
      featured: false,
      allowsExtras: false,
      sortOrder: 8,
      categoryId: sides.id,
    },
    {
      name: "Steamed Vegetables",
      slug: "steamed-vegetables",
      description: "Broccoli, carrot and green beans, lightly steamed.",
      ingredients: ["Broccoli", "Carrot", "Green beans"],
      price: 3500,
      image: "/menu/products/steamed-vegetables.jpg",
      featured: false,
      allowsExtras: false,
      sortOrder: 9,
      categoryId: sides.id,
    },
    {
      name: "M11 Classic Pot",
      slug: "m11-classic-pot",
      description: "Regular pot, blueberry mint, double coal refill.",
      ingredients: ["Blueberry mint", "Double coal refill"],
      price: 15000,
      image: "/menu/products/shisha-classic-pot.jpg",
      featured: true,
      allowsExtras: false,
      sortOrder: 1,
      categoryId: shisha.id,
    },
    {
      name: "M11 After Dark",
      slug: "m11-after-dark",
      description: "Grape mint, double pipe, triple coal refill.",
      ingredients: ["Grape mint", "Double pipe", "Triple coal refill"],
      price: 18000,
      image: "/menu/products/shisha-after-dark.jpg",
      featured: false,
      allowsExtras: false,
      sortOrder: 2,
      categoryId: shisha.id,
    },
    {
      name: "M11 Platinum",
      slug: "m11-platinum",
      description: "Blueberry watermelon, unlimited coal, single pipe.",
      ingredients: ["Blueberry watermelon", "Unlimited coal", "Single pipe"],
      price: 25000,
      image: "/menu/products/shisha-platinum.jpg",
      featured: false,
      allowsExtras: false,
      sortOrder: 3,
      categoryId: shisha.id,
    },
    {
      name: "M11 Smoke Away",
      slug: "m11-smoke-away",
      description: "4 hours of premium refill of fruit flavor, coal and water change.",
      ingredients: ["Fruit flavor", "Premium refill", "Coal", "Water change", "4 hours"],
      price: 50000,
      image: "/menu/products/shisha-smoke-away.jpg",
      featured: true,
      allowsExtras: false,
      sortOrder: 4,
      categoryId: shisha.id,
    },
    {
      name: 'M11 Signature Smoke — The Explorer',
      slug: "m11-signature-smoke",
      description: "The explorer — M11’s crowned signature smoke experience.",
      ingredients: ["Signature blend", "Premium coals"],
      price: 60000,
      image: "/menu/products/shisha-signature.jpg",
      featured: true,
      allowsExtras: false,
      sortOrder: 5,
      categoryId: shisha.id,
    },
    {
      name: "M11 Private Reserve",
      slug: "m11-private-reserve",
      description: "Orange mint, double pipe, double coal refill.",
      ingredients: ["Orange mint", "Double pipe", "Double coal refill"],
      price: 18000,
      image: "/menu/products/shisha-private-reserve.jpg",
      featured: false,
      allowsExtras: false,
      sortOrder: 6,
      categoryId: shisha.id,
    },
    {
      name: "M11 Arabian Night",
      slug: "m11-arabian-night",
      description: "Lady killer, single pipe, unlimited coal refill.",
      ingredients: ["Lady killer", "Single pipe", "Unlimited coal refill"],
      price: 25000,
      image: "/menu/products/shisha-arabian-night.jpg",
      featured: false,
      allowsExtras: false,
      sortOrder: 7,
      categoryId: shisha.id,
    },
  ];

  for (const p of products) {
    await prisma.product.create({
      data: {
        ...p,
        ingredients: JSON.stringify(p.ingredients),
      },
    });
  }

  const extraItems = [
    ["French Fries", 4000, "/menu/products/french-fries.jpg", 1],
    ["Coleslaw", 3000, "/menu/products/coleslaw.jpg", 2],
    ["Garden Salad", 4000, "/menu/products/garden-salad.jpg", 3],
    ["Sauce", 1500, "/menu/products/sauce.jpg", 4],
    ["Dipping Sauce", 1500, "/menu/products/dipping-sauce.jpg", 5],
    ["Jollof Rice", 5000, "/menu/products/jollof-rice.jpg", 6],
    ["Fried Plantain", 4000, "/menu/products/fried-plantain.jpg", 7],
    ["Fried Yam", 4000, "/menu/products/fried-yam.jpg", 8],
    ["Steamed Vegetables", 3500, "/menu/products/steamed-vegetables.jpg", 9],
  ] as const;

  await prisma.extra.createMany({
    data: extraItems.map(([name, price, image, sortOrder]) => ({
      name,
      price,
      image,
      sortOrder,
    })),
  });

  await prisma.siteSetting.create({
    data: {
      id: "site",
      restaurantName: "M11 Snooker & Shisha Lounge",
      tagline: "Play · Relax · Enjoy",
      phone: "0700 111 0011",
      email: "hello@m11lounge.com",
      address: "Osogbo, Nigeria",
      instagram: "@M11_LOUNGE",
      tiktok: "@M11_LOUNGE",
      hoursJson: JSON.stringify(hours),
      heroTitle: "M11 Lounge",
      heroSubtitle:
        "A premium snooker and shisha lounge serving royal platters, signature smoke, and unforgettable nights.",
      aboutText:
        "M11 is where Osogbo comes to play. Championship snooker, premium shisha, and a black-and-gold kitchen of platters, pasta, and traditional bowls — all under one roof. Good music. Good vibes. Great memories.",
      bannerText: "Reservations: 0700 111 0011  ·  Follow @M11_LOUNGE",
    },
  });

  await prisma.testimonial.createMany({
    data: [
      {
        name: "Tomi A.",
        quote:
          "The Royal Feast is ridiculous — smoky fish, perfect plantain, and the room feels like a private club.",
        rating: 5,
        sortOrder: 1,
      },
      {
        name: "Chinedu K.",
        quote:
          "Came for snooker, stayed for the shisha. Classic Pot and the lighting… M11 knows luxury.",
        rating: 5,
        sortOrder: 2,
      },
      {
        name: "Amara B.",
        quote:
          "Combo platter fed the whole table. Black and gold everywhere — it actually feels premium.",
        rating: 5,
        sortOrder: 3,
      },
    ],
  });

  await prisma.promotion.createMany({
    data: [
      {
        code: "WELCOME10",
        description: "10% off your first M11 order",
        type: "PERCENT",
        value: 10,
        active: true,
        featured: true,
      },
      {
        code: "NIGHT5",
        description: "₦5,000 off orders above ₦40,000",
        type: "FIXED",
        value: 5000,
        active: true,
        featured: true,
      },
    ],
  });
}

if (process.argv.some((arg) => arg.includes("seed.ts"))) {
  seedMenu()
    .then(async () => {
      console.log("Seeded M11 lounge database.");
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}
