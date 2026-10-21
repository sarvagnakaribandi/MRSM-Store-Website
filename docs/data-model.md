# Database Schema & Data Models — MR SM Multi Brand Store

## 1. Design Principles & Pricing Model

### Pricing Strategy
- Currency is Indian Rupee (INR - `₹`).
- `price`: Current selling price (mandatory, non-negative number).
- `compareAtPrice`: Optional original retail/MRP price.
- **Discount rule:** A product is considered "On Sale" if and only if `compareAtPrice > price`.
- `discountPercentage`: Computed virtually on read as `Math.round(((compareAtPrice - price) / compareAtPrice) * 100)`.

### Variant Consistency
- Products define available sizes (`['S', 'M', 'L', 'XL', 'XXL']` or waist sizes `['30', '32', '34', '36', '38']`).
- Products define available colours (`[{ name: 'Navy Blue', hex: '#1B2A4A' }]`).
- In the demo, stock is tracked at the product level (`stock`), while variant selections are validated in the UI and stored uniquely in the shopping bag.

---

## 2. Mongoose Schemas

### 2.1 Category Schema (`models/Category.js`)

```javascript
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      maxlength: [60, 'Category name cannot exceed 60 characters'],
      unique: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    description: {
      type: String,
      maxlength: [300, 'Description cannot exceed 300 characters'],
      default: ''
    },
    image: {
      type: String,
      default: ''
    },
    isActive: {
      type: Boolean,
      default: true
    },
    displayOrder: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

// Indexes
categorySchema.index({ slug: 1 });
categorySchema.index({ isActive: 1, displayOrder: 1 });
```

---

### 2.2 Product Schema (`models/Product.js`)

```javascript
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [120, 'Product name cannot exceed 120 characters']
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Product category is required']
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
        validator: function(value) {
          return value === null || value === undefined || value >= this.price;
        },
        message: 'Compare-at price must be greater than or equal to current price'
      }
    },
    sizes: {
      type: [String],
      required: [true, 'At least one size must be specified'],
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: 'Product must have at least one size'
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
      required: [true, 'At least one product image is required']
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

// Virtual: isDiscounted
productSchema.virtual('isOnSale').get(function() {
  return Boolean(this.compareAtPrice && this.compareAtPrice > this.price);
});

// Virtual: discountPercentage
productSchema.virtual('discountPercentage').get(function() {
  if (!this.compareAtPrice || this.compareAtPrice <= this.price) return 0;
  return Math.round(((this.compareAtPrice - this.price) / this.compareAtPrice) * 100);
});

// Compound Indexes for fast sorting and filtering
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ isFeatured: 1, isActive: 1 });
productSchema.index({ isNewArrival: 1, isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
```

---

### 2.3 Contact Inquiry Schema (`models/Inquiry.js`)

```javascript
const inquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, default: '' },
    subject: { type: String, default: 'General Inquiry' },
    message: { type: String, required: true, trim: true },
    isRead: { type: Boolean, default: false }
  },
  { timestamps: true }
);
```

---

## 3. Shopping Bag Data Structure (Client State & LocalStorage)

In the frontend React application, the shopping bag state is modeled as follows:

```typescript
interface BagItem {
  id: string;             // Unique composite key: `${productId}_${size}_${colourName}`
  productId: string;      // Product MongoDB ObjectId
  name: string;           // Product title
  slug: string;           // Product URL slug
  image: string;          // Selected variant or primary image
  price: number;          // Current unit price in INR
  compareAtPrice?: number;// Original MRP in INR
  size: string;           // Selected size (e.g., 'XL')
  colour: {               // Selected colour
    name: string;
    hex: string;
  };
  quantity: number;       // Positive integer (1..maxAvailableStock)
  maxStock: number;       // Upper bound for quantity
}

interface BagState {
  items: BagItem[];
  itemCount: number;      // Total units in bag
  subtotal: number;       // Sum of (item.price * item.quantity)
  savings: number;        // Total money saved vs compareAtPrice
}
```
