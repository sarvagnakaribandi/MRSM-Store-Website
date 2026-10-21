# Test Plan & Quality Assurance Strategy — MR SM Multi Brand Store

## 1. Test Strategy Overview
This test plan defines the testing scope, test cases, execution criteria, and quality standards for the MR SM Multi Brand Store demonstration web application.

Testing covers:
1. **API & Backend Logic:** Route health, status codes, query filtering, data validation, and error handling.
2. **Frontend UI & State:** React component rendering, navigation routing, dynamic catalogue filtering, shopping bag arithmetic, and variant tracking.
3. **Responsive Design & Accessibility:** Viewport verification on Mobile (375px/390px), Tablet (768px/820px), and Desktop (1280px+), keyboard focus, and colour contrast.
4. **Data Integrity & Palette Adherence:** Verification that all 6 exact hex colours are correctly applied and no unwanted libraries (e.g., Vite) are present.

---

## 2. Test Cases Specification

### 2.1 Backend & REST API Test Cases

| Test ID | Module | Description | Inputs / Action | Expected Result | Pass/Fail |
|---|---|---|---|---|:---:|
| **TC-API-01** | Health Check | Verify backend is alive and reports DB status | `GET /api/health` | Returns HTTP 200, `{ success: true, status: "healthy" }` | **PASS** |
| **TC-API-02** | Products List | Retrieve paginated products | `GET /api/products` | Returns HTTP 200, array of product objects with category populated | **PASS** |
| **TC-API-03** | Product Search | Filter products by keyword | `GET /api/products?search=cotton` | Returns only products matching keyword "cotton" in title/description | **PASS** |
| **TC-API-04** | Product Sort | Sort products by price ascending | `GET /api/products?sort=price_asc` | Returns products ordered from lowest price to highest | **PASS** |
| **TC-API-05** | Single Product | Retrieve valid product by ID | `GET /api/products/:validId` | Returns HTTP 200 with complete product details | **PASS** |
| **TC-API-06** | Invalid Product | Request non-existent or malformed ID | `GET /api/products/invalid999` | Returns HTTP 404 or 400 with structured JSON error; no server crash | **PASS** |
| **TC-API-07** | Categories | Retrieve list of all categories | `GET /api/categories` | Returns HTTP 200 with list of active categories | **PASS** |
| **TC-API-08** | Contact Validation | Submit empty contact inquiry | `POST /api/contact` with `{}` | Returns HTTP 400 with validation messages for missing fields | **PASS** |
| **TC-API-09** | Contact Submit | Submit valid contact message | `POST /api/contact` with valid payload | Returns HTTP 201 with success confirmation message | **PASS** |
| **TC-API-10** | 404 Handling | Request unregistered endpoint | `GET /api/unknown` | Returns HTTP 404 with structured error envelope | **PASS** |

---

### 2.2 Frontend Functional & State Test Cases

| Test ID | Module | Description | Action / Precondition | Expected Result | Pass/Fail |
|---|---|---|---|---|:---:|
| **TC-FE-01** | Navigation | All routes open smoothly | Click Home, Shop, New Arrivals, Offers, About, Contact, Bag | URL updates, corresponding page renders with zero console errors | **PASS** |
| **TC-FE-02** | 404 Routing | Unregistered route URL | Navigate to `/non-existent-page` | Branded 404 page renders with button to return to Shop | **PASS** |
| **TC-FE-03** | Filter & Search | Live search & category filtering on Shop | Type search term, click category pill | Catalogue list updates dynamically; empty state if no matches | **PASS** |
| **TC-FE-04** | Variant Validation | Attempt Add to Bag without size/colour | Click "Add to Bag" on Product Details without picking size | Alert/message prompts user to select a size; item is NOT added | **PASS** |
| **TC-FE-05** | Add to Bag | Add item with selected size and colour | Select size 'L', colour 'Navy', click "Add to Bag" | Item added to bag; bag badge counter increments | **PASS** |
| **TC-FE-06** | Duplicate Variant | Add identical product & variant again | Add same size 'L' & 'Navy' item again | Line item quantity increments by 1; does not create duplicate row | **PASS** |
| **TC-FE-07** | Subtotal Calculation | Verify shopping bag arithmetic | Bag contains 2 items @ ₹1499 and 1 item @ ₹1999 | Subtotal correctly displays ₹4,997 | **PASS** |
| **TC-FE-08** | Bag Persistence | Refresh browser with items in bag | Press F5 / browser reload | Bag items, quantities, and selections remain intact | **PASS** |
| **TC-FE-09** | Empty Bag | Remove all items from bag | Click remove on all items | Empty bag illustration displays with "Start Shopping" button | **PASS** |
| **TC-FE-10** | Demo Disclaimer | Bag & checkout transparency | Inspect shopping bag and checkout trigger | Clear notice confirms demo environment; no real card charged | **PASS** |

---

### 2.3 Visual Design & Compliance Test Cases

| Test ID | Module | Verification Item | Standard | Pass/Fail |
|---|---|---|---|:---:|
| **TC-UX-01** | Brand Palette | Espresso (`#2B1D17`) | Used for Header, Footer, primary high-contrast buttons | **PASS** |
| **TC-UX-02** | Brand Palette | Mocha (`#6B4A3A`) | Used for subheaders, secondary tags, warm accents | **PASS** |
| **TC-UX-03** | Brand Palette | Caramel (`#C48A5A`) | Used for sale badges, highlight chips, focus indicators | **PASS** |
| **TC-UX-04** | Brand Palette | Latte (`#E7D6C1`) | Used for soft card/panel backgrounds | **PASS** |
| **TC-UX-05** | Brand Palette | Cream (`#FAF6F0`) | Used for primary background canvas | **PASS** |
| **TC-UX-06** | Brand Palette | White (`#FFFFFF`) | Used for product cards and modal clean surfaces | **PASS** |
| **TC-UX-07** | Non-Vite Setup | Frontend bundler check | Uses Webpack 5 + Babel; no `@vitejs` or `vite` packages | **PASS** |
| **TC-UX-08** | Mobile Viewport | Navigation and layout on 375px | Hamburger drawer opens cleanly, no horizontal scrolling | **PASS** |

---

## 3. Reporting & Defect Resolution
Any failed test case must be documented with the offending component, reproduction steps, console output, and resolved prior to final client handover.
