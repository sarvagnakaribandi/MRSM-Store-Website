const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Category = require('../models/Category');
const Product = require('../models/Product');
const { SEED_CATEGORIES, SEED_PRODUCTS } = require('./seedData');

const seedDatabase = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mrsm_store';

  console.log(`[Seed Script] Attempting connection to MongoDB at: ${uri}`);

  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('[Seed Script] Connected to MongoDB successfully.');

    // 1. Clear existing products and categories
    console.log('[Seed Script] Clearing existing collections...');
    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log('[Seed Script] Collections cleared.');

    // 2. Insert Categories
    console.log('[Seed Script] Inserting categories...');
    const insertedCategories = await Category.insertMany(SEED_CATEGORIES);
    console.log(`[Seed Script] Inserted ${insertedCategories.length} categories.`);

    // Create lookup map: slug -> _id
    const categoryMap = {};
    insertedCategories.forEach((cat) => {
      categoryMap[cat.slug] = cat._id;
    });

    // 3. Map products with valid category ObjectIds
    const preparedProducts = SEED_PRODUCTS.map((prod) => {
      const categoryId = categoryMap[prod.categorySlug];
      if (!categoryId) {
        throw new Error(`Category slug "${prod.categorySlug}" not found in inserted categories.`);
      }

      const { categorySlug, ...rest } = prod;
      return {
        ...rest,
        category: categoryId
      };
    });

    // 4. Insert Products
    console.log('[Seed Script] Inserting products...');
    const insertedProducts = await Product.insertMany(preparedProducts);
    console.log(`[Seed Script] Successfully seeded ${insertedProducts.length} menswear products.`);

    console.log('\n======================================================');
    console.log('✅ DATABASE SEEDING COMPLETED FOR MR SM MULTI BRAND STORE');
    console.log(`   Categories: ${insertedCategories.length}`);
    console.log(`   Products:   ${insertedProducts.length}`);
    console.log('======================================================\n');

    process.exit(0);
  } catch (error) {
    console.error(`\n❌ [Seed Script] Seeding failed: ${error.message}`);
    console.error('   Please check that your MongoDB database is running and MONGODB_URI is valid.\n');
    process.exit(1);
  }
};

seedDatabase();
