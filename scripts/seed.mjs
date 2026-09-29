import { Pool } from "pg";

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://postgres:postgres@127.0.0.1:5432/app_db",
});

const P = (id) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200`;

const IMG = {
  jollof: P(13915043),
  jollofFlat: P(13994299),
  naijaPlate: P(8166269),
  chefServing: P(28736727),
  buffet: P(28736731),
  cookingRice: P(36707697),
  suya: P(28160385),
  beefSkewer: P(37080266),
  skewerTray: P(29244073),
  egusi: P(37648018),
  vegSoup: P(5041490),
  broth: P(9397205),
  fufuPrep: P(35305066),
  ugali: P(37100094),
  soupFire: P(5869655),
  spicySoup: P(5865239),
  tilapiaGrill: P(8352785),
  fishHerbs: P(36378583),
  fishRice: P(16627892),
  fishVeg: P(31029753),
  plantain: P(27556970),
  plantain2: P(27556971),
  plantainRice: P(27556972),
  puffpuff: P(37324435),
  akara: P(34943603),
  assorted: P(8804847),
  yamGrill: P(36756598),
  salad: P(16047586),
  chicken: P(37081053),
  chickenSkewer: P(36869539),
  zobo: P(34566507),
  jamaica: P(34567239),
  redDrink: P(26633747),
  hibiscusRed: P(34467117),
  lemonade: P(30591640),
  candle: P(37968303),
  bamboo: P(11669581),
};

const categories = [
  {
    name: "Small Chops",
    slug: "small-chops",
    tagline: "Street-style bites & finger food",
    icon: "🍢",
  },
  {
    name: "Rice & Jollof",
    slug: "rice-and-jollof",
    tagline: "Smoky party jollof & rice favourites",
    icon: "🍚",
  },
  {
    name: "Soups & Swallow",
    slug: "soups-and-swallow",
    tagline: "Rich pots served with your choice of swallow",
    icon: "🥣",
  },
  {
    name: "Grills & Suya",
    slug: "grills-and-suya",
    tagline: "Charcoal-grilled meats & fish",
    icon: "🔥",
  },
  {
    name: "Peppersoup & Broth",
    slug: "peppersoup-and-broth",
    tagline: "Warm, peppery, restorative",
    icon: "🍲",
  },
  {
    name: "Sides",
    slug: "sides",
    tagline: "Dodo, moi moi & friends",
    icon: "🍌",
  },
  {
    name: "Drinks",
    slug: "drinks",
    tagline: "Chapman, zobo & more",
    icon: "🥤",
  },
];

const items = [
  // Small Chops
  {
    cat: "small-chops",
    name: "Beef Suya",
    slug: "beef-suya",
    description:
      "Thin-sliced beef coated in smoky yaji spice, grilled over charcoal and served with fresh onions, tomatoes and extra suya spice.",
    price: 2500,
    image: IMG.suya,
    tags: ["spicy", "signature"],
    spice: 3,
    chef: true,
    prep: 15,
  },
  {
    cat: "small-chops",
    name: "Asun (Peppered Goat Meat)",
    slug: "asun-goat-meat",
    description:
      "Smoky goat meat tossed in a fiery scotch-bonnet pepper sauce with onions and seasoning.",
    price: 3500,
    image: IMG.skewerTray,
    tags: ["spicy"],
    spice: 3,
    prep: 20,
  },
  {
    cat: "small-chops",
    name: "Akara (Bean Cakes)",
    slug: "akara-bean-cakes",
    description:
      "Crispy golden bean cakes, deep-fried to order. Served with our signature pepper sauce.",
    price: 1200,
    image: IMG.akara,
    tags: ["vegetarian"],
    spice: 1,
    prep: 12,
  },
  {
    cat: "small-chops",
    name: "Puff Puff",
    slug: "puff-puff",
    description:
      "Soft, fluffy fried dough balls dusted with sugar. A Nigerian classic, made fresh.",
    price: 1000,
    image: IMG.puffpuff,
    tags: ["vegetarian"],
    spice: 0,
    prep: 10,
  },
  {
    cat: "small-chops",
    name: "Gizdodo",
    slug: "gizdodo",
    description:
      "Diced gizzard and fried plantain simmered in a rich pepper and tomato sauce.",
    price: 2200,
    image: IMG.plantain2,
    tags: ["spicy"],
    spice: 2,
    prep: 18,
  },
  {
    cat: "small-chops",
    name: "Moi Moi",
    slug: "moi-moi",
    description:
      "Steamed bean pudding with peppers, onions and a boiled egg, wrapped and cooked in leaves.",
    price: 1500,
    image: IMG.assorted,
    tags: ["vegetarian", "gluten-free"],
    spice: 1,
    prep: 15,
  },
  {
    cat: "small-chops",
    name: "Peppered Snails",
    slug: "peppered-snails",
    description:
      "Giant snails sautéed in a hot pepper glaze with onions and green peppers.",
    price: 3000,
    image: IMG.beefSkewer,
    tags: ["spicy"],
    spice: 3,
    prep: 15,
  },
  // Rice & Jollof
  {
    cat: "rice-and-jollof",
    name: "Smoky Party Jollof Rice",
    slug: "party-jollof-rice",
    description:
      "Our signature firewood-smoked jollof, slow-cooked with tomatoes, peppers and spices. Served with your choice of beef, chicken or fish.",
    price: 2500,
    image: IMG.jollof,
    tags: ["signature", "gluten-free"],
    spice: 1,
    chef: true,
    prep: 22,
  },
  {
    cat: "rice-and-jollof",
    name: "Nigerian Fried Rice",
    slug: "nigerian-fried-rice",
    description:
      "Colourful stir-fried rice with mixed vegetables, liver and prawns, seasoned the Naija way.",
    price: 2800,
    image: IMG.jollofFlat,
    tags: ["gluten-free"],
    spice: 0,
    prep: 20,
  },
  {
    cat: "rice-and-jollof",
    name: "Coconut Rice",
    slug: "coconut-rice",
    description:
      "Fragrant rice simmered in fresh coconut milk, served with sweet plantain and grilled fish.",
    price: 2300,
    image: IMG.naijaPlate,
    tags: ["gluten-free"],
    spice: 0,
    prep: 20,
  },
  {
    cat: "rice-and-jollof",
    name: "Ofada Rice & Ayamase",
    slug: "ofada-rice-ayamase",
    description:
      "Local Ofada rice with a rich green pepper (ayamase) sauce, assorted meat and boiled egg.",
    price: 3200,
    image: IMG.chefServing,
    tags: ["spicy", "signature"],
    spice: 3,
    prep: 25,
  },
  {
    cat: "rice-and-jollof",
    name: "Jollof & Grilled Chicken",
    slug: "jollof-grilled-chicken",
    description:
      "A full plate of smoky jollof topped with a char-grilled peppered chicken quarter.",
    price: 4000,
    image: IMG.chicken,
    tags: ["gluten-free"],
    spice: 2,
    chef: true,
    prep: 25,
  },
  // Soups & Swallow
  {
    cat: "soups-and-swallow",
    name: "Egusi Soup",
    slug: "egusi-soup",
    description:
      "Rich ground melon-seed soup loaded with assorted meat, stockfish and smoked fish. Served with your choice of swallow.",
    price: 2000,
    image: IMG.egusi,
    tags: ["gluten-free", "signature"],
    spice: 1,
    prep: 20,
  },
  {
    cat: "soups-and-swallow",
    name: "Efo Riro",
    slug: "efo-riro",
    description:
      "Vibrant vegetable soup with spinach, peppers and palm oil, with assorted meat and dry fish.",
    price: 2000,
    image: IMG.vegSoup,
    tags: ["gluten-free"],
    spice: 2,
    prep: 20,
  },
  {
    cat: "soups-and-swallow",
    name: "Afang Soup",
    slug: "afang-soup",
    description:
      "South-south favourite of afang leaves and waterleaf, with assorted meat and stockfish.",
    price: 2500,
    image: IMG.ugali,
    tags: ["gluten-free"],
    spice: 1,
    prep: 22,
  },
  {
    cat: "soups-and-swallow",
    name: "Okra Soup",
    slug: "okra-soup",
    description:
      "Fresh-cut okra with assorted meat, fish and crayfish, drawn to perfection.",
    price: 1800,
    image: IMG.spicySoup,
    tags: ["gluten-free"],
    spice: 1,
    prep: 18,
  },
  {
    cat: "soups-and-swallow",
    name: "Ogbono Soup",
    slug: "ogbono-soup",
    description:
      "Thick, rich ogbono with assorted meat and stockfish, a favourite for good reason.",
    price: 2000,
    image: IMG.soupFire,
    tags: ["gluten-free"],
    spice: 0,
    prep: 18,
  },
  {
    cat: "soups-and-swallow",
    name: "Pounded Yam",
    slug: "pounded-yam",
    description: "Smooth, stretchy pounded yam — the perfect partner for any soup.",
    price: 800,
    image: IMG.fufuPrep,
    tags: ["vegetarian", "gluten-free"],
    spice: 0,
    prep: 15,
  },
  {
    cat: "soups-and-swallow",
    name: "Eba (Garri)",
    slug: "eba-garri",
    description: "Yellow garri eba, firm and freshly made.",
    price: 500,
    image: IMG.fufuPrep,
    tags: ["vegetarian", "gluten-free"],
    spice: 0,
    prep: 10,
  },
  {
    cat: "soups-and-swallow",
    name: "Amala",
    slug: "amala",
    description: "Smooth yam-flour amala, served steaming hot.",
    price: 600,
    image: IMG.fufuPrep,
    tags: ["vegetarian", "gluten-free"],
    spice: 0,
    prep: 10,
  },
  {
    cat: "soups-and-swallow",
    name: "Semovita",
    slug: "semovita",
    description: "Soft, fine semovita swallow.",
    price: 600,
    image: IMG.ugali,
    tags: ["vegetarian", "gluten-free"],
    spice: 0,
    prep: 10,
  },
  {
    cat: "soups-and-swallow",
    name: "Fufu (Akpu)",
    slug: "fufu-akpu",
    description: "Classic cassava fufu, stretchy and smooth.",
    price: 500,
    image: IMG.fufuPrep,
    tags: ["vegetarian", "gluten-free"],
    spice: 0,
    prep: 10,
  },
  // Grills & Suya
  {
    cat: "grills-and-suya",
    name: "Whole Grilled Catfish",
    slug: "grilled-catfish",
    description:
      "Whole catfish marinated in pepper spice and char-grilled over charcoal, served with pepper sauce.",
    price: 6500,
    image: IMG.fishRice,
    tags: ["signature", "gluten-free"],
    spice: 2,
    chef: true,
    prep: 30,
  },
  {
    cat: "grills-and-suya",
    name: "Grilled Croaker Fish",
    slug: "grilled-croaker",
    description: "Sweet croaker fish, peppered and grilled until the skin crisps.",
    price: 5000,
    image: IMG.fishHerbs,
    tags: ["gluten-free"],
    spice: 2,
    prep: 25,
  },
  {
    cat: "grills-and-suya",
    name: "Peppered Chicken (Half)",
    slug: "peppered-chicken-half",
    description: "Half chicken tossed in hot pepper sauce and char-grilled to order.",
    price: 4500,
    image: IMG.chicken,
    tags: ["spicy", "gluten-free"],
    spice: 3,
    prep: 25,
  },
  {
    cat: "grills-and-suya",
    name: "Grilled Tilapia",
    slug: "grilled-tilapia",
    description: "Whole tilapia basted in spice and grilled over open flame.",
    price: 5500,
    image: IMG.tilapiaGrill,
    tags: ["gluten-free"],
    spice: 1,
    prep: 28,
  },
  {
    cat: "grills-and-suya",
    name: "Suya Platter",
    slug: "suya-platter",
    description:
      "A generous platter of beef and chicken suya with fresh onions, tomatoes and extra yaji — perfect to share.",
    price: 6000,
    image: IMG.beefSkewer,
    tags: ["spicy", "signature"],
    spice: 3,
    chef: true,
    prep: 20,
  },
  // Peppersoup & Broth
  {
    cat: "peppersoup-and-broth",
    name: "Catfish Peppersoup",
    slug: "catfish-peppersoup",
    description: "Peppery, aromatic broth with fresh catfish and native spices.",
    price: 2500,
    image: IMG.broth,
    tags: ["spicy", "gluten-free"],
    spice: 3,
    prep: 20,
  },
  {
    cat: "peppersoup-and-broth",
    name: "Goat Meat Peppersoup",
    slug: "goat-meat-peppersoup",
    description: "Rich goat meat peppersoup with uziza and scent leaves.",
    price: 3200,
    image: IMG.soupFire,
    tags: ["spicy", "gluten-free"],
    spice: 3,
    prep: 25,
  },
  {
    cat: "peppersoup-and-broth",
    name: "Chicken Peppersoup",
    slug: "chicken-peppersoup",
    description: "Comforting chicken peppersoup with fresh peppers and herbs.",
    price: 2200,
    image: IMG.broth,
    tags: ["spicy", "gluten-free"],
    spice: 2,
    prep: 20,
  },
  {
    cat: "peppersoup-and-broth",
    name: "Cow Foot Peppersoup",
    slug: "cow-foot-peppersoup",
    description: "Slow-cooked cow foot in a warming, peppery broth.",
    price: 2800,
    image: IMG.soupFire,
    tags: ["spicy", "gluten-free"],
    spice: 2,
    prep: 30,
  },
  // Sides
  {
    cat: "sides",
    name: "Fried Plantain (Dodo)",
    slug: "fried-plantain-dodo",
    description: "Sweet, golden-fried ripe plantain.",
    price: 1000,
    image: IMG.plantain,
    tags: ["vegetarian", "gluten-free"],
    spice: 0,
    prep: 10,
  },
  {
    cat: "sides",
    name: "Coleslaw",
    slug: "coleslaw",
    description: "Creamy, crunchy vegetable slaw.",
    price: 800,
    image: IMG.salad,
    tags: ["vegetarian", "gluten-free"],
    spice: 0,
    prep: 5,
  },
  {
    cat: "sides",
    name: "Yam Fries",
    slug: "yam-fries",
    description: "Crispy yam wedges with a sprinkle of spice.",
    price: 1000,
    image: IMG.yamGrill,
    tags: ["vegetarian", "gluten-free"],
    spice: 0,
    prep: 12,
  },
  {
    cat: "sides",
    name: "Boiled Yam & Egg Sauce",
    slug: "boiled-yam-egg-sauce",
    description: "Soft boiled yam with a rich, peppery egg and tomato sauce.",
    price: 1500,
    image: IMG.yamGrill,
    tags: ["vegetarian", "gluten-free"],
    spice: 1,
    prep: 15,
  },
  // Drinks
  {
    cat: "drinks",
    name: "Chapman",
    slug: "chapman",
    description: "The classic Nigerian mocktail — citrus, grenadine and bitters over ice.",
    price: 1500,
    image: IMG.redDrink,
    tags: ["vegetarian", "gluten-free"],
    spice: 0,
    prep: 5,
  },
  {
    cat: "drinks",
    name: "Zobo (Hibiscus Drink)",
    slug: "zobo",
    description: "Chilled hibiscus drink with ginger, pineapple and a touch of spice.",
    price: 800,
    image: IMG.zobo,
    tags: ["vegetarian", "gluten-free"],
    spice: 0,
    prep: 5,
  },
  {
    cat: "drinks",
    name: "Kunu (Millet Drink)",
    slug: "kunu",
    description: "Creamy, lightly spiced millet drink served chilled.",
    price: 800,
    image: IMG.jamaica,
    tags: ["vegetarian", "gluten-free"],
    spice: 0,
    prep: 5,
  },
  {
    cat: "drinks",
    name: "Palm Wine",
    slug: "palm-wine",
    description: "Fresh, naturally sweet palm wine tapped to order.",
    price: 1200,
    image: IMG.hibiscusRed,
    tags: ["vegetarian", "gluten-free"],
    spice: 0,
    prep: 5,
  },
  {
    cat: "drinks",
    name: "Soft Drink / Malt",
    slug: "soft-drink-malt",
    description: "Your choice of chilled soft drink or malt.",
    price: 500,
    image: IMG.lemonade,
    tags: ["vegetarian", "gluten-free"],
    spice: 0,
    prep: 3,
  },
];

function ymd(offsetDays) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

function code(prefix) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 5; i += 1) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return `${prefix}-${out}`;
}

const demoReservations = [
  {
    guestName: "Adaeze Obi",
    email: "adaeze.obi@example.com",
    phone: "0803 123 4567",
    partySize: 4,
    slotDate: ymd(0),
    slotTime: "19:00",
    seating: "patio",
    occasion: "birthday",
    notes: "Celebrating a birthday — please add a candle to the puff puff.",
    status: "confirmed",
  },
  {
    guestName: "Tunde Bakare",
    email: "tunde.bakare@example.com",
    phone: "0812 555 0188",
    partySize: 2,
    slotDate: ymd(0),
    slotTime: "20:00",
    seating: "chef-counter",
    occasion: "anniversary",
    notes: "Would love seats at the grill counter if available.",
    status: "pending",
  },
  {
    guestName: "Chidinma Nwosu",
    email: "chidinma.nwosu@example.com",
    phone: "0906 555 0110",
    partySize: 6,
    slotDate: ymd(1),
    slotTime: "18:00",
    seating: "dining-room",
    occasion: "family gathering",
    notes: "Two children in the party.",
    status: "confirmed",
  },
  {
    guestName: "Ibrahim Musa",
    email: "ibrahim.musa@example.com",
    phone: "0704 555 0177",
    partySize: 3,
    slotDate: ymd(2),
    slotTime: "21:00",
    seating: "bar",
    occasion: "",
    notes: "",
    status: "pending",
  },
  {
    guestName: "Funke Adeyemi",
    email: "funke.adeyemi@example.com",
    phone: "0805 555 0133",
    partySize: 8,
    slotDate: ymd(3),
    slotTime: "19:00",
    seating: "private-room",
    occasion: "celebration",
    notes: "Private room for an owambe-style celebration.",
    status: "confirmed",
  },
];

const demoOrders = [
  {
    fulfillment: "pickup",
    status: "preparing",
    customerName: "Kelechi Umeh",
    email: "kelechi.u@example.com",
    phone: "0803 555 0121",
    address: "",
    notes: "Extra suya spice on the side please.",
    items: [
      ["party-jollof-rice", 2],
      ["beef-suya", 1],
      ["fried-plantain-dodo", 1],
    ],
    tipPct: 10,
  },
  {
    fulfillment: "delivery",
    status: "out_for_delivery",
    customerName: "Ngozi Okafor",
    email: "ngozi.o@example.com",
    phone: "0812 555 0188",
    address: "12 Ibara Housing Estate, Abeokuta, Ogun State",
    notes: "Call on arrival, gate code 4421.",
    items: [
      ["egusi-soup", 1],
      ["pounded-yam", 2],
      ["grilled-catfish", 1],
      ["chapman", 2],
    ],
    tipPct: 15,
  },
  {
    fulfillment: "pickup",
    status: "ready",
    customerName: "Dayo Ogunlesi",
    email: "dayo.o@example.com",
    phone: "0906 555 0155",
    address: "",
    notes: "",
    items: [
      ["ofada-rice-ayamase", 1],
      ["suya-platter", 1],
      ["zobo", 2],
    ],
    tipPct: 10,
  },
  {
    fulfillment: "delivery",
    status: "completed",
    customerName: "Amara Eze",
    email: "amara.e@example.com",
    phone: "0705 555 0166",
    address: "5 Kuforiji Olubi Drive, Oke-Ilewo, Abeokuta, Ogun State",
    notes: "",
    items: [
      ["jollof-grilled-chicken", 2],
      ["puff-puff", 1],
      ["moi-moi", 1],
    ],
    tipPct: 15,
  },
];

async function main() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const existing = await client.query(
      "select count(*)::int as c from categories",
    );
    if (existing.rows[0].c > 0) {
      console.log("Seed skipped: data already present.");
      await client.query("ROLLBACK");
      return;
    }

    const catIds = {};
    for (const [i, c] of categories.entries()) {
      const res = await client.query(
        "insert into categories (name, slug, tagline, icon, sort_order) values ($1,$2,$3,$4,$5) returning id",
        [c.name, c.slug, c.tagline, c.icon, i],
      );
      catIds[c.slug] = res.rows[0].id;
    }

    for (const [i, item] of items.entries()) {
      await client.query(
        `insert into menu_items
         (category_id, name, slug, description, price_cents, image_url, tags, spice_level, prep_minutes, is_chef_pick, is_available, sort_order)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,true,$11)`,
        [
          catIds[item.cat],
          item.name,
          item.slug,
          item.description,
          item.price,
          item.image,
          item.tags,
          item.spice,
          item.prep,
          item.chef ?? false,
          i,
        ],
      );
    }

    for (const r of demoReservations) {
      await client.query(
        `insert into reservations
         (code, guest_name, email, phone, party_size, slot_date, slot_time, seating, occasion, notes, status)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
        [
          code("RES"),
          r.guestName,
          r.email,
          r.phone,
          r.partySize,
          r.slotDate,
          r.slotTime,
          r.seating,
          r.occasion,
          r.notes,
          r.status,
        ],
      );
    }

    for (const o of demoOrders) {
      const lines = [];
      for (const [slug, qty] of o.items) {
        const single = await client.query(
          "select id, name, price_cents from menu_items where slug = $1",
          [slug],
        );
        if (single.rows.length) {
          const row = single.rows[0];
          lines.push({ id: row.id, name: row.name, price: row.price_cents, qty });
        }
      }
      const subtotal = lines.reduce((sum, l) => sum + l.price * l.qty, 0);
      const delivery = o.fulfillment === "delivery" ? 1500 : 0;
      const tax = Math.round(subtotal * 0.075);
      const tip = Math.round(subtotal * (o.tipPct / 100));
      const total = subtotal + delivery + tax + tip;
      const orderCode = code("ORD");

      const ins = await client.query(
        `insert into orders
         (code, fulfillment, status, customer_name, email, phone, address, notes,
          subtotal_cents, delivery_fee_cents, tax_cents, tip_cents, total_cents, eta_minutes)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) returning id`,
        [
          orderCode,
          o.fulfillment,
          o.status,
          o.customerName,
          o.email,
          o.phone,
          o.address,
          o.notes,
          subtotal,
          delivery,
          tax,
          tip,
          total,
          o.fulfillment === "delivery" ? 45 : 25,
        ],
      );
      for (const l of lines) {
        await client.query(
          "insert into order_items (order_id, menu_item_id, name, unit_price_cents, quantity) values ($1,$2,$3,$4,$5)",
          [ins.rows[0].id, l.id, l.name, l.price, l.qty],
        );
      }
    }

    await client.query("COMMIT");
    console.log(
      `Seeded ${categories.length} categories, ${items.length} menu items, ${demoReservations.length} reservations, ${demoOrders.length} orders.`,
    );
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
