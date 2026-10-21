const Product = require('../models/Product');
const { isDatabaseConnected } = require('../config/db');
const { SEED_PRODUCTS, SEED_CATEGORIES } = require('../seeds/seedData');

/**
 * GET /api/offers
 * Retrieve explicitly discounted products
 */
exports.getOffers = async (req, res, next) => {
  try {
    if (isDatabaseConnected()) {
      const offers = await Product.find({
        isActive: true,
        compareAtPrice: { $gt: 0 },
        $expr: { $gt: ['$compareAtPrice', '$price'] }
      })
        .populate('category', 'name slug image')
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        meta: {
          count: offers.length,
          database: 'connected'
        },
        data: offers
      });
    }

    // In-memory fallback
    const catMap = {};
    SEED_CATEGORIES.forEach((c, idx) => {
      catMap[c.slug] = { _id: `cat_${idx + 1}`, name: c.name, slug: c.slug };
    });

    const offers = SEED_PRODUCTS
      .filter((p) => p.compareAtPrice && p.compareAtPrice > p.price)
      .map((p, idx) => ({
        _id: `offer_mem_${idx + 1}`,
        ...p,
        category: catMap[p.categorySlug] || { name: p.categorySlug, slug: p.categorySlug },
        isOnSale: true,
        discountPercentage: Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100)
      }));

    return res.status(200).json({
      success: true,
      meta: {
        count: offers.length,
        database: 'demo-fallback'
      },
      data: offers
    });
  } catch (err) {
    next(err);
  }
};
