const Category = require('../models/Category');
const { isDatabaseConnected } = require('../config/db');
const { SEED_CATEGORIES } = require('../seeds/seedData');

/**
 * GET /api/categories
 * Retrieve all active men's clothing categories
 */
exports.getCategories = async (req, res, next) => {
  try {
    if (isDatabaseConnected()) {
      const categories = await Category.find({ isActive: true }).sort({ displayOrder: 1, name: 1 });
      return res.status(200).json({
        success: true,
        data: categories
      });
    }

    // In-memory fallback
    const categories = SEED_CATEGORIES.map((c, i) => ({
      _id: `cat_${i + 1}`,
      name: c.name,
      slug: c.slug,
      description: c.description,
      image: c.image,
      displayOrder: c.displayOrder,
      isActive: true
    }));

    return res.status(200).json({
      success: true,
      data: categories
    });
  } catch (err) {
    next(err);
  }
};
