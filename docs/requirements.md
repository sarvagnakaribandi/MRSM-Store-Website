# MR SM Multi Brand Store — System Requirements Document

## 1. Project Overview & Client Background

**Client Name:** Mr. Shiva Yadav  
**Store Name:** MR SM Multi Brand Store  
**Business Nature:** Single retail men's clothing store  
**Store Address:** 1st Floor, 24-7-302/1, Opp. Royal Enfield Showroom, Beside A to Z Medicals, Subedari, Hanamkonda, Warangal, Telangana  
**Verified Contact Numbers:**
- Direct Call: `+91 8466007454`
- WhatsApp: `+91 8332867454`

### Purpose of the Application
The purpose is to design, develop, and deliver a modern, premium, responsive demonstration web application for **MR SM Multi Brand Store**. The website will serve as an interactive digital storefront to showcase the store's men's wear collections, allow customers to browse, filter, inspect products, select variants (size, colour, quantity), manage a shopping bag with calculated subtotals, and locate/contact the physical store.

---

## 2. Information Audit: Verified vs. Assumptions & Missing Data

### Verified Client Information (Source: Client Store Board / Status Image)
- **Store Name:** MR SM Multi Brand Store
- **Store Proprietor:** Mr. Shiva Yadav
- **Physical Address:** 1st Floor, 24-7-302/1, Opp. Royal Enfield Showroom, Beside A to Z Medicals, Subedari, Hanamkonda, Warangal
- **Phone Number:** `+91 8466007454`
- **WhatsApp Contact:** `+91 8332867454`
- **Brand Emblem:** Shield emblem with crown and "SM" lettering in red & white tones.

### Assumptions & Sample/Placeholder Items (Clearly Labeled as Demo Data)
- **Store Operating Hours:** Assumed `10:00 AM – 9:30 PM (Monday – Sunday)` (Demo placeholder, editable).
- **Store Email Address:** `contact@mrsmstore.demo` (Demo placeholder).
- **Product Catalog & Inventory:** Sample catalog of premium men's clothing (Formal Shirts, Casual Shirts, Trousers & Chinos, Denim Jeans, Traditional Kurta Sets, Blazers & Jackets) with realistic pricing, sizes (S, M, L, XL, XXL), and colours.
- **Offers & Discounts:** Sample seasonal promotional discounts clearly labeled as demo promotional campaigns.
- **Brand Story / About Us:** Professional men's fashion narrative representing quality, multi-brand affordability, and curated men's styling tailored for Warangal/Hanamkonda clientele.

---

## 3. Technology Stack Requirements (Strict MERN Only)

### Frontend: React.js (Non-Vite Build)
- **Core Library:** React 18+
- **Bundler & Build Tool:** Webpack 5 + Babel (`babel-loader`, `@babel/preset-env`, `@babel/preset-react`) — **Strict adherence: Vite is NOT used.**
- **Routing:** React Router v6
- **State Management:** React Context API + Custom Hooks (`BagContext`, `ProductContext`)
- **Styling:** Modular CSS3 with CSS Custom Properties for design tokens, Flexbox, CSS Grid, and media queries.
- **Data Fetching:** Native `fetch` API communicating exclusively with the Express backend REST endpoints.

### Backend: Node.js + Express.js
- **Runtime:** Node.js (tested on v22.x LTS)
- **Framework:** Express.js 4.x
- **Architecture:** Layered REST API (Controllers, Services, Models, Routes, Middlewares, Validators)
- **Middleware:** `cors` (restricted to frontend origin), `express.json()`, custom error handling middleware, logging middleware.
- **Configuration:** `dotenv` with environment variable isolation.

### Database: MongoDB + Mongoose
- **ODM:** Mongoose 8.x
- **Schemas:** `Product`, `Category`
- **Seeding:** Automated idempotent seed script populating initial demo categories and products.
- **Fail-safe Connectivity:** Graceful error handling and retry notification if the database is unreachable, with clear documentation for MongoDB Atlas or local MongoDB instances.

---

## 4. Mandatory Brand Design System & Colour Palette

The website strictly follows the project-mandated colour palette:

| Token Name | Hex Code | Intended Semantic Usage |
|---|---|---|
| `--color-espresso` | `#2B1D17` | Main navigation, header, footer, primary high-emphasis buttons, dark text |
| `--color-mocha` | `#6B4A3A` | Secondary section headers, subheadings, subtle borders, secondary actions |
| `--color-caramel` | `#C48A5A` | Badges, accent highlights, promotional banners, active indicators |
| `--color-latte` | `#E7D6C1` | Soft background panels, banner backdrops, variant hover states |
| `--color-cream` | `#FAF6F0` | Main global body background, clean neutral warmth |
| `--color-white` | `#FFFFFF` | Product cards, modals, dropdown surfaces, form card containers |

### Visual Design Principles
- **Atmosphere:** Warm, sophisticated, tailored, masculine luxury without being unapproachable.
- **Typography:** Modern serif/sans-serif combination for editorial polish (e.g., Cormorant Garamond / Playfair Display paired with Inter / Plus Jakarta Sans).
- **Responsive Breakpoints:**
  - Mobile: `< 640px`
  - Tablet: `640px - 1024px`
  - Desktop: `> 1024px`
- **Accessibility:** Minimum contrast ratio 4.5:1 for normal text, clear focus rings, semantic HTML elements, accessible form labels.

---

## 5. Functional Requirements by Page

### Page 1: Home
- Store branding with MR SM logo and header navigation.
- Hero banner with headline, subline, and prominent "Shop Collection" call to action.
- Quick Category Carousel / Grid.
- Featured Collections section.
- New Arrivals showcase.
- Clear Store Introduction featuring verified location details and proprietor information.
- Footer with verified phone, WhatsApp, address, opening hours placeholder, and quick links.

### Page 2: Shop / Product Catalogue
- Dynamic product listing retrieved from `/api/products`.
- Live search query input with debounce.
- Category filtering with active category pills.
- Multi-option sorting (Price Low to High, Price High to Low, Name A-Z, Newest).
- Reset/Clear filters button.
- Comprehensive states: Skeleton loading, Empty state, No-results state, Error retry state.

### Page 3: Product Details
- Multi-image gallery with interactive thumbnail selection and zoom view.
- Product name, category tag, SKU, and price display (with optional compare-at price).
- Dynamic Size selector (e.g., S, M, L, XL, XXL) with validation.
- Dynamic Colour selector with visual swatches.
- Numeric Quantity stepper with validation (minimum 1, maximum available stock).
- "Add to Bag" button with immediate visual confirmation feedback.
- Detailed descriptions, fabric/care specifications, and related products recommendations.

### Page 4: Shopping Bag
- List of added bag items with thumbnail, title, selected size, selected colour, and unit price.
- Inline quantity increment/decrement controls.
- Remove item action with undo or confirmation.
- Financial breakdown: Items subtotal, estimated shipping calculation (demo free/standard rule), and total.
- Clear informational notice: "Demo Store: Order simulation only — no real financial transactions processed."
- Bag persistence using safe browser `localStorage` (only non-sensitive cart items).
- Responsive layout converting cleanly between table/cards on mobile.

### Page 5: New Arrivals
- Curated view filtering products flagged with `isNewArrival: true`.
- Reuses shared grid and filter components.

### Page 6: Offers & Promotions
- Curated view featuring products with active promotional discounts or bundle packages.
- Sample promotions clearly tagged as demo promotional campaigns.

### Page 7: About Store
- Narrative of MR SM Multi Brand Store located in Subedari, Hanamkonda.
- Values: Quality curation, multi-brand variety, customer-first service.
- Store location highlights and photographs/placeholders.

### Page 8: Contact & Store Visit
- Verified store address, phone numbers (`+91 8466007454`), and WhatsApp direct link (`https://wa.me/918332867454`).
- Interactive inquiry contact form with client-side & backend validation.
- Embedded Google Maps location placeholder for Subedari, Hanamkonda (Opp. Royal Enfield Showroom).

### Page 9: 404 Not Found
- Branded error screen with navigation links guiding users back to Home or Shop.

---

## 6. Scope Boundaries

### In Scope for Initial Demo:
1. Complete React 18 frontend built via Webpack 5 & Babel (no Vite).
2. Complete Express REST API with health check, products, categories, and offers endpoints.
3. MongoDB & Mongoose schemas, seed scripts, and connection handlers.
4. Functional variant selection and shopping bag with live calculations.
5. Exact 6-color palette implementation.
6. Responsive design for mobile, tablet, and desktop.
7. Verification tests and documentation.

### Out of Scope (Future Production Roadmap):
- Online credit card / payment gateway processing (Razorpay, Stripe, UPI auto-settlement).
- Customer account passwords / OAuth authentication.
- Real-time inventory sync with physical POS hardware.
- Automated courier tracking API integration.
