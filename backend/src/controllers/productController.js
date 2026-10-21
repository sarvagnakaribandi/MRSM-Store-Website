const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');
const { isDatabaseConnected } = require('../config/db');
const { SEED_PRODUCTS, SEED_CATEGORIES } = require('../seeds/seedData');

/**
 * Persistent in-memory store for fallback demo mode
 */
let inMemoryProductsStore = null;

const getInMemoryProducts = () => {
  if (inMemoryProductsStore) {
    return inMemoryProductsStore;
  }

  const catMap = {};
  SEED_CATEGORIES.forEach((c, idx) => {
    catMap[c.slug] = {
      _id: `cat_${idx + 1}`,
      name: c.name,
      slug: c.slug
    };
  });

  inMemoryProductsStore = SEED_PRODUCTS.map((p, idx) => {
    const { categorySlug, ...rest } = p;
    return {
      _id: `prod_mem_${idx + 1}`,
      ...rest,
      category: catMap[categorySlug] || { name: categorySlug, slug: categorySlug },
      isOnSale: Boolean(p.compareAtPrice && p.compareAtPrice > p.price),
      discountPercentage: p.compareAtPrice && p.compareAtPrice > p.price
        ? Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100)
        : 0,
      createdAt: new Date().toISOString()
    };
  });

  return inMemoryProductsStore;
};

/**
 * GET /api/products
 * Retrieve products with search, category filtering, and sorting
 */
exports.getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      sort = 'newest',
      featured,
      newArrival,
      onSale,
      page = 1,
      limit = 50
    } = req.query;

    if (isDatabaseConnected()) {
      const filter = { isActive: true };

      if (category && category !== 'all') {
        const foundCategory = await Category.findOne({ slug: category });
        if (foundCategory) {
          filter.category = foundCategory._id;
        } else if (mongoose.Types.ObjectId.isValid(category)) {
          filter.category = category;
        }
      }

      if (featured === 'true') {
        filter.isFeatured = true;
      }

      if (newArrival === 'true') {
        filter.isNewArrival = true;
      }

      if (onSale === 'true') {
        filter.compareAtPrice = { $gt: 0 };
        filter.$expr = { $gt: ['$compareAtPrice', '$price'] };
      }

      if (search && search.trim()) {
        const regex = new RegExp(search.trim(), 'i');
        filter.$or = [
          { name: regex },
          { description: regex },
          { tags: regex }
        ];
      }

      let sortOptions = { createdAt: -1 };
      if (sort === 'price_asc') sortOptions = { price: 1 };
      else if (sort === 'price_desc') sortOptions = { price: -1 };
      else if (sort === 'name_asc') sortOptions = { name: 1 };

      const pageNum = Math.max(1, parseInt(page, 10));
      const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
      const skip = (pageNum - 1) * limitNum;

      const [total, products] = await Promise.all([
        Product.countDocuments(filter),
        Product.find(filter)
          .populate('category', 'name slug image')
          .sort(sortOptions)
          .skip(skip)
          .limit(limitNum)
      ]);

      return res.status(200).json({
        success: true,
        meta: {
          total,
          count: products.length,
          page: pageNum,
          limit: limitNum,
          database: 'connected'
        },
        data: products
      });
    }

    // Fallback: If DB is not connected yet, serve from memory seamlessly
    let list = [...getInMemoryProducts()];

    if (category && category !== 'all') {
      list = list.filter((p) => p.category?.slug === category || p.category?._id === category);
    }

    if (featured === 'true') {
      list = list.filter((p) => p.isFeatured);
    }

    if (newArrival === 'true') {
      list = list.filter((p) => p.isNewArrival);
    }

    if (onSale === 'true') {
      list = list.filter((p) => p.compareAtPrice && p.compareAtPrice > p.price);
    }

    if (search && search.trim()) {
      const term = search.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term) ||
          p.category?.name?.toLowerCase().includes(term) ||
          p.tags?.some((t) => t.toLowerCase().includes(term))
      );
    }

    if (sort === 'price_asc') list.sort((a, b) => a.price - b.price);
    else if (sort === 'price_desc') list.sort((a, b) => b.price - a.price);
    else if (sort === 'name_asc') list.sort((a, b) => a.name.localeCompare(b.name));

    return res.status(200).json({
      success: true,
      meta: {
        total: list.length,
        count: list.length,
        page: 1,
        limit: list.length,
        database: 'demo-fallback'
      },
      data: list
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/products/:idOrSlug
 * Retrieve a single product by ObjectId or slug
 */
exports.getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isDatabaseConnected()) {
      let query;
      if (mongoose.Types.ObjectId.isValid(id)) {
        query = Product.findById(id);
      } else {
        query = Product.findOne({ slug: id });
      }

      const product = await query.populate('category', 'name slug image');

      if (!product || !product.isActive) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'PRODUCT_NOT_FOUND',
            message: `Product with identifier "${id}" was not found.`
          }
        });
      }

      return res.status(200).json({
        success: true,
        data: product
      });
    }

    // In-memory fallback
    const list = getInMemoryProducts();
    const product = list.find((p) => p._id === id || p.slug === id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PRODUCT_NOT_FOUND',
          message: `Product with identifier "${id}" was not found.`
        }
      });
    }

    return res.status(200).json({
      success: true,
      data: product
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/products
 * Create a new product (Admin feature)
 */
exports.createProduct = async (req, res, next) => {
  try {
    const data = { ...req.body };

    if (!data.name || !data.price) {
      return res.status(400).json({
        success: false,
        error: { message: 'Product name and price are required.' }
      });
    }

    // Auto-generate slug if not provided
    if (!data.slug && data.name) {
      data.slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') + '-' + Date.now().toString().slice(-4);
    }

    // Ensure sizes and images arrays
    if (!Array.isArray(data.sizes) || data.sizes.length === 0) {
      data.sizes = ['M', 'L', 'XL'];
    }
    if (!Array.isArray(data.images) || data.images.length === 0) {
      data.images = ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80'];
    }

    if (isDatabaseConnected()) {
      // Find or create category if passed as slug or string
      if (typeof data.category === 'string' && !mongoose.Types.ObjectId.isValid(data.category)) {
        let cat = await Category.findOne({ slug: data.category });
        if (!cat) {
          cat = await Category.findOne(); // Fallback to first available category
        }
        if (cat) data.category = cat._id;
      }

      const created = await Product.create(data);
      const populated = await Product.findById(created._id).populate('category', 'name slug image');

      return res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: populated
      });
    }

    // In-memory fallback
    const list = getInMemoryProducts();
    const newProd = {
      _id: `prod_mem_${Date.now()}`,
      ...data,
      category: typeof data.category === 'object' ? data.category : { name: data.category || 'Menswear', slug: 'menswear' },
      createdAt: new Date().toISOString()
    };
    list.unshift(newProd);

    return res.status(201).json({
      success: true,
      message: 'Product created in demo inventory',
      data: newProd
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/products/:id
 * Update an existing product (Admin feature)
 */
exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (isDatabaseConnected() && mongoose.Types.ObjectId.isValid(id)) {
      const updated = await Product.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true
      }).populate('category', 'name slug image');

      if (!updated) {
        return res.status(404).json({
          success: false,
          error: { message: `Product with ID ${id} not found.` }
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        data: updated
      });
    }

    // In-memory fallback
    const list = getInMemoryProducts();
    const idx = list.findIndex((p) => p._id === id || p.slug === id);

    if (idx === -1) {
      return res.status(404).json({
        success: false,
        error: { message: `Product with identifier "${id}" not found.` }
      });
    }

    list[idx] = { ...list[idx], ...updates, updatedAt: new Date().toISOString() };

    return res.status(200).json({
      success: true,
      message: 'Product updated in demo inventory',
      data: list[idx]
    });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/products/:id
 * Remove a product (Admin feature)
 */
exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isDatabaseConnected() && mongoose.Types.ObjectId.isValid(id)) {
      const deleted = await Product.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: { message: `Product with ID ${id} not found.` }
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Product deleted successfully from database'
      });
    }

    // In-memory fallback
    const list = getInMemoryProducts();
    const idx = list.findIndex((p) => p._id === id || p.slug === id);

    if (idx === -1) {
      return res.status(404).json({
        success: false,
        error: { message: `Product with identifier "${id}" not found.` }
      });
    }

    list.splice(idx, 1);

    return res.status(200).json({
      success: true,
      message: 'Product deleted from demo inventory'
    });
  } catch (err) {
    next(err);
  }
};
