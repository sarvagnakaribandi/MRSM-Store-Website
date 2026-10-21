const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [140, 'Product name cannot exceed 140 characters']
    },
    slug: {
      type: String,
      required: [true, 'Product slug is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      maxlength: [3000, 'Description cannot exceed 3000 characters']
    },
    fabric: {
      type: String,
      default: '100% Premium Cotton'
    },
    fit: {
      type: String,
      default: 'Tailored Modern Fit'
    },
    careInstructions: {
      type: String,
      default: 'Machine wash cold with like colours'
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category reference is required']
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be a positive number']
    },
    compareAtPrice: {
      type: Number,
      default: null,
      validate: {
        validator: function (val) {
          return val === null || val === undefined || val >= this.price;
        },
        message: 'Compare-at price must be greater than or equal to selling price'
      }
    },
    sizes: {
      type: [String],
      required: [true, 'At least one size is required'],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: 'Product must offer at least one available size'
      }
    },
    colours: [
      {
        name: { type: String, required: true },
        hex: { type: String, required: true }
      }
    ],
    images: {
      type: [String],
      required: [true, 'At least one product image is required'],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: 'At least one product image URL is required'
      }
    },
    stock: {
      type: Number,
      default: 10,
      min: [0, 'Stock cannot be negative']
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    isNewArrival: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    },
    tags: [String]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual: isOnSale
productSchema.virtual('isOnSale').get(function () {
  return Boolean(this.compareAtPrice && this.compareAtPrice > this.price);
});

// Virtual: discountPercentage
productSchema.virtual('discountPercentage').get(function () {
  if (!this.compareAtPrice || this.compareAtPrice <= this.price) return 0;
  return Math.round(((this.compareAtPrice - this.price) / this.compareAtPrice) * 100);
});

// Indexes for high performance querying
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ isFeatured: 1, isActive: 1 });
productSchema.index({ isNewArrival: 1, isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);
