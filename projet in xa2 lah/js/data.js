/* HRH COLLECTION - Initial Luxury Products Catalog */
const INITIAL_PRODUCTS = [
  // --- PARFUMS FEMME ---
  {
    id: "hrh-pf-01",
    name: "HRH Royal Rose Imperiale (Femme)",
    category: "Parfums Femme",
    gender: "Femme",
    price: 1850,
    promoPrice: 1390,
    stock: 8, // < 10 triggers low stock badge
    images: [
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Une fragrance haute couture d'une élégance absolue. Notes de Rose de Grasse, Bois d'Oud Or 24K et Ambre Doré d'Orient.",
    rating: 5.0,
    reviewsCount: 42,
    isNew: true,
    isPromo: true
  },
  {
    id: "hrh-pf-02",
    name: "HRH Elixir de Jasmine & Vanille",
    category: "Parfums Femme",
    gender: "Femme",
    price: 1600,
    promoPrice: 1250,
    stock: 14,
    images: [
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Sillage envoûtant mêlant Jasmine Sambac sauvage et gousse de vanille de Madagascar. Le flacon hexagonal monogrammé HRH.",
    rating: 4.9,
    reviewsCount: 28,
    isNew: false,
    isPromo: true
  },

  // --- PARFUMS HOMME ---
  {
    id: "hrh-ph-01",
    name: "HRH Black Diamond Musk (Homme)",
    category: "Parfums Homme",
    gender: "Homme",
    price: 1950,
    promoPrice: 1490,
    stock: 4, // < 5 triggers RED admin alert
    images: [
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Le parfum du conquérant moderne. Cuir sombre, Bergamote de Calabre et Musc Noir impérial. Puissance et charisme balmain-style.",
    rating: 5.0,
    reviewsCount: 65,
    isNew: true,
    isPromo: true
  },
  {
    id: "hrh-ph-02",
    name: "HRH Vainqueur Amber & Smoke",
    category: "Parfums Homme",
    gender: "Homme",
    price: 1750,
    promoPrice: 1350,
    stock: 9,
    images: [
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Un accord boisé fumé sublimé par l'Ambre Gris et le Vétiver. Idéal pour l'homme de caractère.",
    rating: 4.8,
    reviewsCount: 19,
    isNew: true,
    isPromo: true
  },

  // --- FEMME: MAQUILLAGE ---
  {
    id: "hrh-fm-01",
    name: "HRH Poudre d'Or 24K Illuminatrice",
    category: "Maquillage",
    gender: "Femme",
    price: 850,
    promoPrice: 650,
    stock: 6,
    images: [
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Highlighter compact infusé aux micro-particules d'or pur. Offre un teint éclatant et sculpté façon podium Balmain.",
    rating: 4.9,
    reviewsCount: 37,
    isNew: true,
    isPromo: true
  },
  {
    id: "hrh-fm-02",
    name: "HRH Rouge Velours Mat Absolu",
    category: "Maquillage",
    gender: "Femme",
    price: 590,
    promoPrice: 420,
    stock: 12,
    images: [
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Rouge à lèvres haute pigmentation avec étui métallique doré graver du logo HRH.",
    rating: 4.7,
    reviewsCount: 51,
    isNew: false,
    isPromo: true
  },

  // --- FEMME: SOIN VISAGE ---
  {
    id: "hrh-fs-01",
    name: "HRH Sérum Régénérant Caviar & Or",
    category: "Soin Visage",
    gender: "Femme",
    price: 2400,
    promoPrice: 1890,
    stock: 3, // < 5 Red alert
    images: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Le soin ultime anti-âge à l'extrait de Caviar Beluga et pépites d'or 24K. Redensifie et illumine la peau dès la première application.",
    rating: 5.0,
    reviewsCount: 84,
    isNew: true,
    isPromo: true
  },
  {
    id: "hrh-fs-02",
    name: "HRH Crème Nuit Diamant Noir",
    category: "Soin Visage",
    gender: "Femme",
    price: 2100,
    promoPrice: 1650,
    stock: 15,
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Soin de nuit réparateur intense enrichi en peptides rares et extrait de truffe noire.",
    rating: 4.9,
    reviewsCount: 22,
    isNew: false,
    isPromo: true
  },

  // --- FEMME: CHEVEUX ---
  {
    id: "hrh-fc-01",
    name: "HRH Huile d'Argan & Or Soie Cheveux",
    category: "Cheveux",
    gender: "Femme",
    price: 780,
    promoPrice: 590,
    stock: 7,
    images: [
      "https://images.unsplash.com/photo-1608248597359-0e6930ca9994?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Élixir capillaire nourrissant qui apporte brillance miroir et toucher soie sans alourdir.",
    rating: 4.8,
    reviewsCount: 30,
    isNew: true,
    isPromo: true
  },

  // --- HOMME: CHAUSSETTES FOOT ---
  {
    id: "hrh-hf-01",
    name: "HRH Pro Grip Socks Football Gold Edition",
    category: "Chaussettes Foot",
    gender: "Homme",
    price: 350,
    promoPrice: 249,
    stock: 2, // Red alert
    images: [
      "https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Chaussettes antidérapantes Pro Grip avec crampons en silicone brevetés et détails dorés HRH. Adhérence maximale f le terrain.",
    rating: 5.0,
    reviewsCount: 110,
    isNew: true,
    isPromo: true
  },
  {
    id: "hrh-hf-02",
    name: "HRH Compression Sock Black Titanium",
    category: "Chaussettes Foot",
    gender: "Homme",
    price: 290,
    promoPrice: 199,
    stock: 18,
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Chaussettes de compression pro pour maintien musculaire et récupération accélérée des footballeurs exigeants.",
    rating: 4.9,
    reviewsCount: 45,
    isNew: false,
    isPromo: true
  },

  // --- HOMME: BANDEAUX CHEVEUX SPORT ---
  {
    id: "hrh-hb-01",
    name: "HRH Sweat-Tech Sport Headband Onyx",
    category: "Bandeaux Cheveux Sport",
    gender: "Homme",
    price: 220,
    promoPrice: 149,
    stock: 5,
    images: [
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Bandeau élastique de sport haute respirabilité avec broderie monogramme HRH Gold. Anti-transpiration intense.",
    rating: 4.7,
    reviewsCount: 68,
    isNew: true,
    isPromo: true
  },

  // --- HOMME: ACCESSOIRES FOOTBALL ---
  {
    id: "hrh-ha-01",
    name: "HRH Protège-Tibias Carbon Ultra-Light",
    category: "Accessoires Football",
    gender: "Homme",
    price: 650,
    promoPrice: 490,
    stock: 6,
    images: [
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Protège-tibias en véritable fibre de carbone moulée ultra-résistante avec gravure dorée HRH COLLECTION.",
    rating: 5.0,
    reviewsCount: 54,
    isNew: true,
    isPromo: true
  },
  {
    id: "hrh-ha-02",
    name: "HRH Sac de Sport Luxe Leather & Gold",
    category: "Accessoires Football",
    gender: "Homme",
    price: 2800,
    promoPrice: 2190,
    stock: 3, // Red alert
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Sac de vestiaire en cuir véritable pleine fleur avec finitions dorées et compartiment isolé pour crampons.",
    rating: 5.0,
    reviewsCount: 31,
    isNew: true,
    isPromo: true
  }
];
