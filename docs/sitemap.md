# Site Structure & Navigation Architecture — MR SM Multi Brand Store

## 1. Application Sitemap Hierarchy

```
MR SM Multi Brand Store
│
├── / (Home)
│   ├── Hero Banner & "Shop Collection" CTA
│   ├── Category Highlights Grid
│   ├── Featured Collections
│   ├── New Arrivals Preview
│   ├── Why Shop With MR SM (Quality, Multi-Brand, Best Pricing)
│   ├── Store Location & Visit Teaser
│   └── Brand Instagram/Social Gallery (Demo)
│
├── /shop (Shop / Full Catalogue)
│   ├── Search Bar & Active Filters
│   ├── Category Filters (All, Formal Shirts, Casual Shirts, Trousers, Jeans, Ethnic)
│   ├── Sort Selector (Price Low-High, Price High-Low, Newest, Name)
│   └── Product Grid with Live Results Count
│
├── /products/:id (Product Details)
│   ├── Image Gallery & Zoom
│   ├── Product Info, Price & Promotional Compare-at Price
│   ├── Size Selector (S, M, L, XL, XXL)
│   ├── Colour Selector Swatches
│   ├── Quantity Stepper
│   ├── Add to Bag CTA
│   ├── Fabric & Care Details
│   └── Related Products Suggestions
│
├── /new-arrivals (New Arrivals)
│   └── Filtered dynamic catalogue showing newly stocked items
│
├── /offers (Promotional Offers)
│   └── Filtered dynamic catalogue showing discounted items with demo discount badges
│
├── /bag (Shopping Bag)
│   ├── Itemized Bag Table / Cards (Thumb, Title, Size, Colour, Unit Price, Stepper, Remove)
│   ├── Order Summary (Subtotal, Demo Tax/Shipping, Total)
│   ├── Simulated Checkout Button with Demo Notice
│   └── Empty Bag State with "Return to Shop" CTA
│
├── /about (About Us)
│   ├── MR SM Store Story & Hanamkonda Heritage
│   ├── The Multi-Brand Promise (Quality, Variety, Fit)
│   ├── Store Atmosphere & Interior Preview
│   └── Message from Mr. Shiva Yadav
│
├── /contact (Contact & Visit Store)
│   ├── Verified Physical Address & Landmark Info (Subedari, Hanamkonda)
│   ├── Direct Call (`+91 8466007454`) & WhatsApp (`+91 8332867454`)
│   ├── Store Operating Hours (10:00 AM – 9:30 PM, Everyday)
│   ├── Google Maps Location Embed / Directions Button
│   └── Customer Inquiry & Feedback Form
│
└── /* (404 Not Found)
    └── Branded error page with return buttons
```

---

## 2. Global Navigation Matrix

| Link Label | Target Route | Visible In Desktop Header | Visible In Mobile Menu | Visible In Footer |
|---|---|:---:|:---:|:---:|
| Home | `/` | Yes | Yes | Yes |
| Shop | `/shop` | Yes | Yes | Yes |
| New Arrivals | `/new-arrivals` | Yes | Yes | Yes |
| Offers | `/offers` | Yes | Yes | Yes |
| About | `/about` | Yes | Yes | Yes |
| Contact | `/contact` | Yes | Yes | Yes |
| Shopping Bag | `/bag` | Yes (Bag Icon + Badge) | Yes (Bag Icon + Badge) | Yes |

---

## 3. UI Component Hierarchy

```
<App>
  <BagProvider>
    <BrowserRouter>
      <Header>
        <TopAnnouncementBar />
        <BrandLogo />
        <DesktopNavigation />
        <HeaderActions>
          <BagIconBadge />
          <MobileMenuToggle />
        </HeaderActions>
      </Header>
      <MobileNavigationDrawer />
      
      <main id="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />
          <Route path="/new-arrivals" element={<NewArrivalsPage />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/bag" element={<BagPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer>
        <FooterStoreBio />
        <FooterQuickLinks />
        <FooterCategories />
        <FooterVerifiedContact />
        <FooterCopyrightNotice />
      </Footer>
    </BrowserRouter>
  </BagProvider>
</App>
```
