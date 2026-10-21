# Development Roadmap — MR SM Multi Brand Store

This roadmap outlines the systematic, phased implementation of the MR SM Multi Brand Store web application. Each phase must be completed, tested, and verified before advancing to subsequent stages.

```
+-----------------------------------------------------------------------------------+
|                            DEVELOPMENT ROADMAP                                    |
+-----------------------------------------------------------------------------------+
| [X] Phase 1: Workspace Inspection, Environment Audit & Requirements Confirmation  |
| [ ] Phase 2: UI/UX Design System, Design Tokens & Component Specifications        |
| [ ] Phase 3: React Frontend Foundation (Webpack 5 + Babel, React Router, Layouts) |
| [ ] Phase 4: Core Catalogue & Content Pages Implementation                        |
| [ ] Phase 5: Shopping Bag & Variant State Management                              |
| [ ] Phase 6: Node.js & Express REST API Architecture                              |
| [ ] Phase 7: MongoDB Database Integration, Mongoose Schemas & Data Seeding        |
| [ ] Phase 8: End-to-End Frontend & Backend API Integration                        |
| [ ] Phase 9: Automated Testing, Manual QA & Cross-Device Verification             |
| [ ] Phase 10: Client Review Preparation & Demo Presentation Package               |
| [ ] Phase 11: Project Documentation, Deployment Guides & Handover                 |
+-----------------------------------------------------------------------------------+
```

---

## Phase Details

### Phase 1: Workspace Inspection & Requirements Confirmation (CURRENT)
- [x] Check Node.js and npm runtime environment.
- [x] Inspect workspace directory and initialize Git repository.
- [x] Extract verified client details from uploaded image (Store name, owner, location, numbers).
- [x] Document assumptions for sample data and unconfirmed client details.
- [x] Define Webpack 5 + Babel build configuration (strictly eliminating Vite).
- [x] Prepare comprehensive requirements, roadmap, sitemap, API specs, data model, and test plan.
- [ ] Present Phase 1 summary to user for architectural approval.

### Phase 2: UI/UX Design System & Theme Foundations
- [ ] Configure CSS custom properties with the mandatory 6-colour palette:
  - Espresso (`#2B1D17`)
  - Mocha (`#6B4A3A`)
  - Caramel (`#C48A5A`)
  - Latte (`#E7D6C1`)
  - Cream (`#FAF6F0`)
  - White (`#FFFFFF`)
- [ ] Establish typography scale, container widths, responsive grid columns, and elevation shadows.
- [ ] Specify button variants, badge styles, inputs, card layouts, and modal designs.
- [ ] Validate accessibility standards (contrast ratios, focus states, mobile tap targets).

### Phase 3: React Frontend Foundation (Non-Vite Webpack Setup)
- [ ] Initialize `frontend/` directory with `package.json`.
- [ ] Configure Webpack 5 (`webpack.config.js`) with `html-webpack-plugin`, `css-loader`, `style-loader`, and Babel presets.
- [ ] Configure Babel (`babel.config.js`) supporting modern JSX and ES2022.
- [ ] Install React 18, React DOM, and React Router v6.
- [ ] Construct directory structure: `components`, `layouts`, `pages`, `context`, `services`, `styles`, `assets`.
- [ ] Implement base application shell with Header, Navigation, Footer, and responsive drawer menu.
- [ ] Verify local dev server compilation and routing.

### Phase 4: Catalogue & Static Pages Implementation
- [ ] Create Home page: Hero banner, category showcase, featured items, store intro, testimonials/values.
- [ ] Create Shop / Catalogue page: Responsive product grid, live search bar, category pill filters, sort selector.
- [ ] Create Product Details page: Image gallery with thumbnail picker, size/colour variant selector, quantity stepper, description tabs.
- [ ] Create New Arrivals page: Filtered catalogue for latest seasonal arrivals.
- [ ] Create Offers page: Promotional deals with sample demo savings badges.
- [ ] Create About page: Brand story of MR SM Multi Brand Store, Hanamkonda roots, quality craftsmanship narrative.
- [ ] Create Contact page: Verified store address, direct phone & WhatsApp links, interactive inquiry form.
- [ ] Create 404 Not Found page: Branded error recovery page.

### Phase 5: Shopping Bag & Variant State Management
- [ ] Implement `BagContext` with React Context API and custom hook `useBag`.
- [ ] Model variant uniqueness: combinations of Product ID + Size + Colour create unique bag items.
- [ ] Implement add-to-bag, quantity modification, and item removal functions.
- [ ] Compute subtotal, taxes (demo breakdown), and estimated total with dynamic updates.
- [ ] Provide safe `localStorage` persistence and hydration.
- [ ] Construct empty bag state with intuitive call to action.
- [ ] Add explicit demo disclaimer that financial transactions are simulated.

### Phase 6: Node.js & Express REST API Architecture
- [ ] Initialize `backend/` directory with `package.json`.
- [ ] Create Express application structure: `controllers/`, `routes/`, `middleware/`, `models/`, `config/`.
- [ ] Implement CORS configuration allowing frontend origin.
- [ ] Build `/api/health` health check endpoint.
- [ ] Build REST endpoints for `/api/products`, `/api/products/:id`, `/api/categories`, `/api/offers`.
- [ ] Implement robust request validation, 404 route handling, and centralized error handling middleware.

### Phase 7: MongoDB Integration & Mongoose Schemas
- [ ] Define Mongoose connection module with environment-driven URI and retry logic.
- [ ] Create `Product` schema with name, slug, description, category, price, compareAtPrice, sizes, colours, images, stock, and flags.
- [ ] Create `Category` schema with name, slug, description, and status.
- [ ] Author database seed script (`backend/src/seeds/seed.js`) preloaded with realistic men's clothing items and verified store info.
- [ ] Provide comprehensive setup instructions for local MongoDB and MongoDB Atlas cloud connections.

### Phase 8: Frontend-Backend Integration
- [ ] Create frontend API client in `frontend/src/services/api.js`.
- [ ] Connect Shop page, New Arrivals, and Offers pages to backend REST APIs.
- [ ] Connect Product Details page to single-product endpoint.
- [ ] Implement comprehensive loading skeletons, error alerts with retry buttons, and empty result states.
- [ ] Verify that no database credentials or backend secrets exist in frontend bundles.

### Phase 9: Testing & Quality Assurance
- [ ] Author API integration tests for health, products, categories, and error cases using Jest / Supertest.
- [ ] Author frontend component tests for BagContext, ProductCard, and PriceDisplay.
- [ ] Conduct manual QA across Chrome, Firefox, Edge, and mobile viewports (iPhone, Android, iPad).
- [ ] Document test cases and verification results in `docs/test-plan.md`.

### Phase 10: Client Presentation Package
- [ ] Conduct comprehensive end-to-end user walkthrough.
- [ ] Label all sample products and simulated promotions clearly.
- [ ] Prepare client demonstration script highlighting how Mr. Shiva Yadav's store benefits from the web presence.

### Phase 11: Documentation & Handover
- [ ] Write detailed `README.md` with installation, environment configuration, database seeding, and start commands.
- [ ] Document API endpoints in `docs/api-specification.md`.
- [ ] Outline future production enhancement roadmap (Admin CMS, Razorpay/UPI checkout, automated inventory sync).
