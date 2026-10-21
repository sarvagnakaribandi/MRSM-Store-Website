# MR SM Multi Brand Store — Professional Men's Wear Demo Web Application

A modern, responsive, and tailored e-commerce demo web application built for **MR SM Multi Brand Store**, a premier men's clothing store in Subedari, Hanamkonda.

Built using the **MERN Stack** (MongoDB, Express.js, React.js with Webpack 5 & Babel — **strictly non-Vite**, and Node.js) with a bespoke warm menswear colour palette.

---

## 1. Verified Store Profile

- **Store Name:** **MR SM Multi Brand Store**
- **Proprietor:** **Mr. Shiva Yadav**
- **Physical Address:** 1st Floor, 24-7-302/1, Opp. Royal Enfield Showroom, Beside A to Z Medicals, Subedari, Hanamkonda, Warangal, Telangana
- **Direct Calling Number:** `+91 8466007454`
- **WhatsApp Contact:** `+91 8332867454`
- **Showroom Hours (Demo Placeholder):** 10:00 AM – 9:30 PM (Open 7 Days a week)

---

## 2. Mandatory Brand Colour Palette

This project strictly adheres to the mandated 6-colour palette, codified as CSS custom properties in `frontend/src/styles/variables.css`:

| Colour Token | Hex Code | Purpose & Semantic Usage |
|---|---|---|
| **Espresso** | `#2B1D17` | Header, footer, primary buttons, high-contrast dark navigation |
| **Mocha** | `#6B4A3A` | Secondary section headers, accents, selected chips |
| **Caramel** | `#C48A5A` | Promotional badges, highlights, focus rings, call-to-actions |
| **Latte** | `#E7D6C1` | Soft background panels, banner backdrops, badge tints |
| **Cream** | `#FAF6F0` | Main global body background, clean neutral warmth |
| **White** | `#FFFFFF` | Product cards, form containers, dropdowns, modal surfaces |

---

## 3. Technology Stack & Architecture

- **Frontend:**
  - React 18 (`react`, `react-dom`)
  - Webpack 5 & Babel (`babel-loader`, `@babel/preset-env`, `@babel/preset-react`) — **Strictly zero Vite, zero Next.js**
  - React Router DOM v6
  - React Context API (`BagContext` with safe `localStorage` persistence)
  - Modular CSS with custom design tokens, CSS Grid, and Flexbox
- **Backend:**
  - Node.js runtime (v22.x LTS compatible)
  - Express.js 4.x
  - Centralized error handling, input validation, and CORS middleware
  - Proxy configuration in Webpack dev server (`/api` → `http://localhost:5000`)
- **Database & ODM:**
  - MongoDB
  - Mongoose 8.x
  - Idempotent seed script preloaded with 14 curated men's garments and 6 categories
  - Automatic fallback mode: serves demo catalog from memory if the database is not yet connected.

---

## 4. Project Directory Structure

```
DMRSM-Store-Website/
├── frontend/                     # React 18 Frontend
│   ├── public/
│   │   └── index.html            # HTML template with Google Fonts (Cormorant Garamond & Plus Jakarta Sans)
│   ├── src/
│   │   ├── assets/               # Brand vectors & images
│   │   ├── components/
│   │   │   ├── bag/              # BagItem.jsx, BagSummary.jsx
│   │   │   ├── common/           # Button.jsx, Badge.jsx, PriceDisplay.jsx, Icons.jsx, LoadingSpinner.jsx, EmptyState.jsx, ErrorMessage.jsx
│   │   │   ├── layout/           # Header.jsx, Footer.jsx, MobileNav.jsx, AnnouncementBar.jsx
│   │   │   └── product/          # ProductCard.jsx, ProductGrid.jsx, ProductFilters.jsx, SearchBar.jsx
│   │   ├── context/
│   │   │   └── BagContext.jsx    # Shopping bag state management & localStorage sync
│   │   ├── layouts/
│   │   │   └── MainLayout.jsx    # Application shell layout
│   │   ├── pages/
│   │   │   ├── HomePage.jsx      # Hero banner, category showcase, featured items, store intro
│   │   │   ├── ShopPage.jsx      # Dynamic catalogue with live search, filters, and sorting
│   │   │   ├── ProductDetailsPage.jsx # Multi-image gallery, size & colour picker, quantity stepper, add to bag
│   │   │   ├── NewArrivalsPage.jsx    # Curated newly stocked items
│   │   │   ├── OffersPage.jsx         # Special promotional sales items
│   │   │   ├── BagPage.jsx            # Line item review, calculations, demo checkout
│   │   │   ├── AboutPage.jsx          # MR SM brand heritage, 3 pillars, Mr. Shiva Yadav bio
│   │   │   ├── ContactPage.jsx        # Verified address, phone, WhatsApp link, inquiry form
│   │   │   └── NotFoundPage.jsx       # Branded 404 recovery screen
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx     # Route definitions
│   │   ├── services/
│   │   │   ├── api.js            # REST API service client with seamless fallback
│   │   │   └── sampleData.js     # Curated menswear sample catalog
│   │   ├── styles/
│   │   │   ├── variables.css     # Mandatory hex colour tokens & sizing scales
│   │   │   ├── reset.css         # Modern reset
│   │   │   ├── global.css        # Typography, grid, containers
│   │   │   └── components.css    # Reusable component styles
│   │   ├── App.jsx
│   │   └── index.js
│   ├── babel.config.js
│   ├── package.json
│   └── webpack.config.js
│
├── backend/                      # Node.js & Express REST API
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js             # Mongoose connection & timeout handling
│   │   ├── controllers/          # Products, Categories, Offers, Contact handlers
│   │   ├── middleware/           # Centralized errorHandler.js & notFoundHandler.js
│   │   ├── models/               # Product.js, Category.js, Inquiry.js schemas
│   │   ├── routes/               # Express REST route endpoints
│   │   ├── seeds/
│   │   │   ├── seed.js           # Database seeding CLI script
│   │   │   └── seedData.js       # Curated initial database records
│   │   └── app.js                # Express app setup, CORS, and route mounting
│   ├── server.js                 # Server entrypoint
│   ├── test-api.js               # Automated REST API test suite (10/10 tests)
│   ├── package.json
│   ├── .env                      # Local environment configuration
│   └── .env.example
│
├── docs/                         # Architectural & QA Documentation
│   ├── requirements.md
│   ├── roadmap.md
│   ├── sitemap.md
│   ├── api-specification.md
│   ├── data-model.md
│   └── test-plan.md
│
├── .gitignore
├── package.json                  # Root monorepo orchestrator scripts
└── README.md
```

---

## 5. Quick Start Guide

### Prerequisites
- **Node.js:** `v20.x` or `v22.x`
- **npm:** `v10.x` or higher

### Step 1: Install Dependencies
Run npm install in both `frontend` and `backend`:
```powershell
cd frontend
npm install
cd ../backend
npm install
cd ..
```

---

### Step 2: Configure MongoDB Connection

Open `backend/.env` (or copy from `backend/.env.example`):
```env
PORT=5000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:3000
MONGODB_URI=mongodb://127.0.0.1:27017/mrsm_store
```

#### How to Connect Your MongoDB Database:
- **Option A (MongoDB Atlas Cloud - Free & Recommended):**
  1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free shared cluster.
  2. Create a database user and allow your IP address in Network Access.
  3. Click **Connect** → **Drivers** (Node.js) and copy the connection string:
     ```env
     MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/mrsm_store?retryWrites=true&w=majority
     ```
  4. Paste this string into `backend/.env`.

- **Option B (Local MongoDB):**
  If MongoDB Community Server is installed locally on your computer:
  ```env
  MONGODB_URI=mongodb://127.0.0.1:27017/mrsm_store
  ```

#### Seed the Database:
Once your MongoDB connection string is set, populate the database with categories and products:
```powershell
npm run seed
# or: cd backend && npm run seed
```

> [!NOTE]
> Even if MongoDB is not connected yet, the backend and frontend run seamlessly using preloaded in-memory demo data, so you can test and demonstrate the entire storefront immediately!

---

### Step 3: Run the Application

You can start the backend and frontend in separate terminals:

**Terminal 1 — Express REST API (Port 5000):**
```powershell
npm run server
# or: cd backend && npm start
```

**Terminal 2 — React Webpack Dev Server (Port 3000):**
```powershell
npm run client
# or: cd frontend && npm start
```

Open your browser and navigate to:
👉 **`http://localhost:3000`**

---

## 6. Automated Testing

Run the automated API test suite:
```powershell
npm run test:api
# or: cd backend && node test-api.js
```

### Test Suite Results:
- `TC-API-01`: Health check endpoint returns HTTP 200 & healthy status.
- `TC-API-02`: Categories endpoint returns active men's wear categories.
- `TC-API-03`: Products endpoint returns menswear items with populated category.
- `TC-API-04`: Category filtering returns only matching clothing pieces.
- `TC-API-05`: Keyword search returns relevant products.
- `TC-API-06`: Price sorting verifies ascending/descending order.
- `TC-API-07`: Offers endpoint returns promotional items with compare-at price.
- `TC-API-08`: Contact form validates missing required fields (returns HTTP 400).
- `TC-API-09`: Valid contact inquiry records customer message (returns HTTP 201).
- `TC-API-10`: Unregistered routes are caught by 404 handler with structured error envelope.

---

## 7. Frontend Production Build

To compile an optimized, minified production bundle using Webpack 5:
```powershell
npm run build
# or: cd frontend && npm run build
```
Output is generated in `frontend/dist/`.

---

## 8. Demo Features vs Future Production Roadmap

| Feature | Current Demo Status | Production Roadmap |
|---|---|---|
| Store Branding & Verified Location | Active (Mr. Shiva Yadav, Subedari) | Physical showroom GPS beacon |
| Men's Clothing Catalogue | Active (14 products across 6 categories) | Live POS hardware inventory sync |
| Search, Filter & Sort | Fully Functional | Elasticsearch / Algolia integration |
| Variant Selection (Size & Colour) | Fully Functional with validation | Variant barcode scanning |
| Shopping Bag & Subtotal Math | Fully Functional (`localStorage`) | User cloud-synced carts across devices |
| Contact & Sizing Inquiries | Functional with DB/Demo storage | Automated SMS & WhatsApp notifications |
| Checkout & Payments | Simulated with Demo Disclaimer | Razorpay / UPI / Credit Card Gateway |
| User Accounts & Authentication | Deliberately omitted for demo | Phone OTP / Customer Profile Portal |

---

## 9. Store Inquiries & Client Presentation
For inquiries about **MR SM Multi Brand Store**, contact:
- **Mr. Shiva Yadav**
- 📞 Direct Call: `+91 8466007454`
- 💬 WhatsApp: `+91 8332867454`
- 📍 1st Floor, Opp. Royal Enfield Showroom, Beside A to Z Medicals, Subedari, Hanamkonda
