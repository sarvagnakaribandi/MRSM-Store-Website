const SEED_CATEGORIES = [
  {
    name: 'Formal Shirts',
    slug: 'formal-shirts',
    description: 'Executive cottons, tailored fits, and boardroom-ready classics.',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
    displayOrder: 1
  },
  {
    name: 'Casual Shirts & Polos',
    slug: 'casual-shirts',
    description: 'Relaxed linens, pique polos, and casual button-downs for daily wear.',
    image: 'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?auto=format&fit=crop&w=800&q=80',
    displayOrder: 2
  },
  {
    name: 'Trousers & Chinos',
    slug: 'trousers',
    description: 'Stretch cotton chinos, pleated formals, and clean tailored fits.',
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
    displayOrder: 3
  },
  {
    name: 'Denim Jeans',
    slug: 'jeans',
    description: 'Raw selvage, comfort stretches, and timeless vintage washes.',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80',
    displayOrder: 4
  },
  {
    name: 'Ethnic & Kurta Sets',
    slug: 'ethnic',
    description: 'Traditional kurtas, Bandhgalas, and festive celebration wear.',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    displayOrder: 5
  },
  {
    name: 'Blazers & Suits',
    slug: 'blazers',
    description: 'Sharp tailored single-breasted blazers and occasion jackets.',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
    displayOrder: 6
  }
];

const SEED_PRODUCTS = [
  {
    name: 'Classic Royal Oxford Cotton Shirt',
    slug: 'classic-royal-oxford-cotton-shirt',
    categorySlug: 'formal-shirts',
    description: 'Crafted from 100% two-ply long-staple combed cotton, this Royal Oxford weave shirt offers an immaculate finish and subtle textural weave. Designed with a structured English semi-spread collar, mother-of-pearl finish buttons, and single-button rounded cuffs. Ideal for formal meetings and corporate occasions.',
    fabric: '100% Combed Egyptian Cotton (120s Two-Ply)',
    fit: 'Contemporary Tailored Fit',
    careInstructions: 'Machine wash warm with like colours. Warm iron while slightly damp.',
    price: 1499,
    compareAtPrice: 1999,
    sizes: ['38 (S)', '40 (M)', '42 (L)', '44 (XL)', '46 (XXL)'],
    colours: [
      { name: 'Sky Blue', hex: '#87CEEB' },
      { name: 'Crisp White', hex: '#FFFFFF' },
      { name: 'Pale Rose Pink', hex: '#F4C2C2' }
    ],
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=80'
    ],
    stock: 18,
    isFeatured: true,
    isNewArrival: true,
    tags: ['formal', 'oxford', 'executive', 'shirt']
  },
  {
    name: 'Italian Cutaway Executive Crisp White Shirt',
    slug: 'italian-cutaway-executive-crisp-white-shirt',
    categorySlug: 'formal-shirts',
    description: 'The definitive formal essential. Featuring an Italian wide cutaway collar built to showcase medium-to-wide tie knots or stand sharp unbuttoned. Woven in a luminous white poplin weave that resists wrinkles throughout the day.',
    fabric: '100% Fine Poplin Cotton',
    fit: 'Slim Modern Fit',
    careInstructions: 'Machine wash delicate or professional dry clean.',
    price: 1699,
    compareAtPrice: 2299,
    sizes: ['40 (M)', '42 (L)', '44 (XL)', '46 (XXL)'],
    colours: [
      { name: 'Crisp White', hex: '#FFFFFF' },
      { name: 'French Navy', hex: '#0B1E38' }
    ],
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80'
    ],
    stock: 14,
    isFeatured: true,
    isNewArrival: false,
    tags: ['formal', 'white shirt', 'italian collar']
  },
  {
    name: 'Luxury Micro-Houndstooth Cotton Twill Shirt',
    slug: 'luxury-micro-houndstooth-cotton-twill-shirt',
    categorySlug: 'formal-shirts',
    description: 'A sophisticated patterned shirt woven with subtle micro-houndstooth twill. Perfect for transitioning effortlessly from daytime office hours into evening dinners.',
    fabric: '100% Compact Twill Cotton',
    fit: 'Regular Tailored Fit',
    careInstructions: 'Machine wash cold. Line dry in shade.',
    price: 1399,
    compareAtPrice: 1799,
    sizes: ['38 (S)', '40 (M)', '42 (L)', '44 (XL)'],
    colours: [
      { name: 'Steel Blue Check', hex: '#4682B4' },
      { name: 'Charcoal Houndstooth', hex: '#36454F' }
    ],
    images: [
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80'
    ],
    stock: 20,
    isFeatured: false,
    isNewArrival: true,
    tags: ['formal', 'patterned', 'twill']
  },
  {
    name: 'Pure Breathable Linen Resort Shirt',
    slug: 'pure-breathable-linen-resort-shirt',
    categorySlug: 'casual-shirts',
    description: 'An airy, relaxed-silhouette casual shirt made from 100% natural Normandy flax linen. Features a resort camp collar and pre-washed hand feel for warm-weather comfort.',
    fabric: '100% Pure Natural Linen',
    fit: 'Relaxed Resort Fit',
    careInstructions: 'Hand wash or gentle machine wash. Do not bleach.',
    price: 1899,
    compareAtPrice: 2499,
    sizes: ['M', 'L', 'XL', 'XXL'],
    colours: [
      { name: 'Natural Sand Beige', hex: '#D2B48C' },
      { name: 'Sage Olive', hex: '#708238' },
      { name: 'Warm Terracotta', hex: '#C05A46' }
    ],
    images: [
      'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&q=80'
    ],
    stock: 12,
    isFeatured: true,
    isNewArrival: true,
    tags: ['casual', 'linen', 'summer', 'resort']
  },
  {
    name: 'Signature Heavy Pique Cotton Polo',
    slug: 'signature-heavy-pique-cotton-polo',
    categorySlug: 'casual-shirts',
    description: 'Constructed from heavyweight 240 GSM honeycomb pique cotton. Ribbed collar that resists curling, ribbed sleeve bands, and dual-tone tipping.',
    fabric: '100% Combed Pique Cotton (240 GSM)',
    fit: 'Athletic Regular Fit',
    careInstructions: 'Machine wash warm. Tumble dry low.',
    price: 899,
    compareAtPrice: 1299,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colours: [
      { name: 'Mocha Espresso', hex: '#2B1D17' },
      { name: 'Forest Green', hex: '#1E4D2B' },
      { name: 'Burgundy Wine', hex: '#800020' }
    ],
    images: [
      'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?auto=format&fit=crop&w=900&q=80'
    ],
    stock: 25,
    isFeatured: true,
    isNewArrival: false,
    tags: ['casual', 'polo', 'pique', 't-shirt']
  },
  {
    name: 'Indigo Stonewashed Heavy Denim Overshirt',
    slug: 'indigo-stonewashed-heavy-denim-overshirt',
    categorySlug: 'casual-shirts',
    description: 'Rugged yet refined, this denim shacket serves as the ideal layering piece. Twin chest flap pockets, durable metal shank buttons, and authentic washed indigo fading.',
    fabric: '100% Cotton 9.5oz Denim',
    fit: 'Straight Layering Fit',
    careInstructions: 'Wash inside out with dark colours.',
    price: 1799,
    compareAtPrice: 2299,
    sizes: ['M', 'L', 'XL'],
    colours: [
      { name: 'Vintage Indigo', hex: '#2E4765' },
      { name: 'Charcoal Wash', hex: '#333333' }
    ],
    images: [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?auto=format&fit=crop&w=900&q=80'
    ],
    stock: 10,
    isFeatured: false,
    isNewArrival: true,
    tags: ['casual', 'denim', 'overshirt', 'shacket']
  },
  {
    name: 'Slim-Fit All-Season Stretch Chinos',
    slug: 'slim-fit-all-season-stretch-chinos',
    categorySlug: 'trousers',
    description: 'Engineered with 98% mercerised twill cotton and 2% elastane for unrestricted stretch. Clean flat-front styling, tailored waistband, and deep slant pockets for the modern gentleman.',
    fabric: '98% Mercerised Cotton, 2% Elastane',
    fit: 'Slim Tapered Fit',
    careInstructions: 'Machine wash cold. Turn inside out.',
    price: 1599,
    compareAtPrice: 1999,
    sizes: ['30', '32', '34', '36', '38'],
    colours: [
      { name: 'British Khaki', hex: '#C3B091' },
      { name: 'Navy Blue', hex: '#1B2A4A' },
      { name: 'Slate Olive', hex: '#556B2F' }
    ],
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=80'
    ],
    stock: 22,
    isFeatured: true,
    isNewArrival: false,
    tags: ['trousers', 'chinos', 'stretch', 'bottomwear']
  },
  {
    name: 'Pleated Formal Wool-Blend Dress Trousers',
    slug: 'pleated-formal-wool-blend-dress-trousers',
    categorySlug: 'trousers',
    description: 'Impeccable sartorial drape featuring forward single pleats, side buckle tab adjusters, and a clean unfinished hem for custom tailor lengthing.',
    fabric: '65% Polyester, 35% Merino Wool Blend',
    fit: 'Classic Tailored Fit with Single Pleat',
    careInstructions: 'Dry clean recommended.',
    price: 1899,
    compareAtPrice: 2599,
    sizes: ['30', '32', '34', '36', '38'],
    colours: [
      { name: 'Charcoal Grey', hex: '#36454F' },
      { name: 'Midnight Black', hex: '#1C1C1C' }
    ],
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=900&q=80'
    ],
    stock: 9,
    isFeatured: false,
    isNewArrival: true,
    tags: ['formal', 'trousers', 'wool blend', 'executive']
  },
  {
    name: 'Selvage Ring-Spun Comfort Stretch Jeans',
    slug: 'selvage-ring-spun-comfort-stretch-jeans',
    categorySlug: 'jeans',
    description: 'Crafted from 12.5oz Japanese shuttle-loom inspired denim. Deep indigo dye that develops unique fades with wear. Features reinforced rivets, chain-stitched hems, and authentic selvage ID.',
    fabric: '99% Ring-Spun Cotton, 1% Spandex',
    fit: 'Modern Straight Tapered',
    careInstructions: 'Wash sparingly inside-out in cold water.',
    price: 1999,
    compareAtPrice: 2799,
    sizes: ['30', '32', '34', '36', '38'],
    colours: [
      { name: 'Dark Raw Indigo', hex: '#102A45' },
      { name: 'Smoky Charcoal', hex: '#2D3134' }
    ],
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80'
    ],
    stock: 16,
    isFeatured: true,
    isNewArrival: true,
    tags: ['denim', 'jeans', 'selvage', 'indigo']
  },
  {
    name: 'Vintage Distressed Whisker Wash Jeans',
    slug: 'vintage-distressed-whisker-wash-jeans',
    categorySlug: 'jeans',
    description: 'Hand-sanded 3D whisker details and subtle abrasion marks for an authentic vintage worn-in aesthetic. High-recovery stretch denim ensuring all-day flexibility.',
    fabric: '98% Cotton, 2% Poly-Spandex',
    fit: 'Slim Fit',
    careInstructions: 'Machine wash cold.',
    price: 1699,
    compareAtPrice: 2299,
    sizes: ['30', '32', '34', '36'],
    colours: [
      { name: 'Medium Stonewash', hex: '#4A6984' }
    ],
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=80'
    ],
    stock: 15,
    isFeatured: false,
    isNewArrival: false,
    tags: ['jeans', 'denim', 'vintage wash']
  },
  {
    name: 'Raw Silk Festive Embroidered Kurta Set',
    slug: 'raw-silk-festive-embroidered-kurta-set',
    categorySlug: 'ethnic',
    description: 'Rich dupion raw-silk texture adorned with intricate threadwork around the mandarin collar and placket. Includes matching tailored churidar bottoms.',
    fabric: 'Art Dupion Silk Blend',
    fit: 'Traditional Regular Fit',
    careInstructions: 'Dry clean only.',
    price: 2999,
    compareAtPrice: 3999,
    sizes: ['38 (M)', '40 (L)', '42 (XL)', '44 (XXL)'],
    colours: [
      { name: 'Royal Mustard Gold', hex: '#DAA520' },
      { name: 'Deep Wine Maroon', hex: '#722F37' },
      { name: 'Pristine Ivory', hex: '#FFFFF0' }
    ],
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80'
    ],
    stock: 8,
    isFeatured: true,
    isNewArrival: true,
    tags: ['ethnic', 'kurta', 'wedding', 'festive']
  },
  {
    name: 'Textured Jute Blend Bandhgala Nehru Jacket',
    slug: 'textured-jute-blend-bandhgala-nehru-jacket',
    categorySlug: 'ethnic',
    description: 'A timeless Indian occasion wear layering piece. Structured mandarin collar, ornate antique brass buttons, and three exterior welt pockets.',
    fabric: 'Jute & Viscose Textured Blend',
    fit: 'Tailored Waistcoat Fit',
    careInstructions: 'Dry clean only.',
    price: 2299,
    compareAtPrice: 2899,
    sizes: ['38 (M)', '40 (L)', '42 (XL)', '44 (XXL)'],
    colours: [
      { name: 'Mocha Tan', hex: '#6B4A3A' },
      { name: 'Imperial Blue', hex: '#102A45' }
    ],
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=80'
    ],
    stock: 11,
    isFeatured: false,
    isNewArrival: true,
    tags: ['ethnic', 'nehru jacket', 'bandhgala', 'waistcoat']
  },
  {
    name: 'Single-Breasted Italian Hopsack Navy Blazer',
    slug: 'single-breasted-italian-hopsack-navy-blazer',
    categorySlug: 'blazers',
    description: 'An unstructured, semi-lined blazer woven in open-weave hopsack wool blend for natural stretch and breathability. Notch lapels, two-button closure, patch pockets, and kissing horn sleeve buttons.',
    fabric: '70% Wool, 30% Silk-Touch Viscose',
    fit: 'Modern Drop-7 Tailored Fit',
    careInstructions: 'Specialist dry clean only.',
    price: 4499,
    compareAtPrice: 5999,
    sizes: ['38 (M)', '40 (L)', '42 (XL)', '44 (XXL)'],
    colours: [
      { name: 'Midnight Navy Melange', hex: '#1B2A4A' },
      { name: 'Charcoal Tweed', hex: '#41424C' }
    ],
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80'
    ],
    stock: 7,
    isFeatured: true,
    isNewArrival: false,
    tags: ['blazer', 'formal', 'suit', 'hopsack', 'executive']
  },
  {
    name: 'Unstructured Summer Linen-Cotton Blazer',
    slug: 'unstructured-summer-linen-cotton-blazer',
    categorySlug: 'blazers',
    description: 'Effortless Mediterranean elegance tailored with soft shoulders and butterfly back lining. Pairs seamlessly with chinos or denim for smart-casual events.',
    fabric: '55% French Linen, 45% Combed Cotton',
    fit: 'Relaxed Tailored Fit',
    careInstructions: 'Dry clean only.',
    price: 3899,
    compareAtPrice: 4999,
    sizes: ['38 (M)', '40 (L)', '42 (XL)'],
    colours: [
      { name: 'Desert Sand Beige', hex: '#D2B48C' },
      { name: 'Ash Grey', hex: '#B2BEB5' }
    ],
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=900&q=80'
    ],
    stock: 6,
    isFeatured: false,
    isNewArrival: true,
    tags: ['blazer', 'linen', 'smart casual']
  }
];

module.exports = {
  SEED_CATEGORIES,
  SEED_PRODUCTS
};
