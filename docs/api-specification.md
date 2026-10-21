# REST API Specification — MR SM Multi Brand Store

## 1. Overview
The MR SM Multi Brand Store backend provides a RESTful JSON API implemented in Node.js and Express.js. All responses follow consistent formatting standards and appropriate HTTP status codes.

- **Base URL (Local Development):** `http://localhost:5000/api`
- **Content Type:** `application/json`
- **CORS Allowed Origins:** `http://localhost:3000` (React Webpack Dev Server)

---

## 2. Standard Response Envelope

### Successful Response Format
```json
{
  "success": true,
  "data": {},
  "message": "Operation description (optional)",
  "meta": {
    "count": 12,
    "total": 24,
    "page": 1,
    "limit": 12
  }
}
```

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Human readable error message"
  }
}
```

---

## 3. API Endpoints

### 3.1 Health Check
- **Endpoint:** `GET /api/health`
- **Description:** Verifies server runtime and database connectivity status.
- **Success Status:** `200 OK`
- **Response Body:**
```json
{
  "success": true,
  "status": "healthy",
  "database": "connected",
  "timestamp": "2026-10-21T14:00:00.000Z",
  "uptimeSeconds": 124.5
}
```

---

### 3.2 Products API

#### `GET /api/products`
Retrieves a list of active products with optional query filtering, searching, and sorting.

- **Query Parameters:**
  - `search` (string, optional): Search term matched against product title, tags, and description.
  - `category` (string, optional): Category slug or ID.
  - `sort` (string, optional): 
    - `price_asc` (Low to High)
    - `price_desc` (High to Low)
    - `name_asc` (Alphabetical A-Z)
    - `newest` (Most recently created first, default)
  - `featured` (boolean, optional): `true` to filter featured items.
  - `newArrival` (boolean, optional): `true` to filter new arrivals.
  - `onSale` (boolean, optional): `true` to filter promotional items.
  - `page` (integer, optional): Page number (default: 1).
  - `limit` (integer, optional): Items per page (default: 20).

- **Success Status:** `200 OK`
- **Response Body Sample:**
```json
{
  "success": true,
  "meta": {
    "total": 18,
    "count": 18,
    "page": 1,
    "limit": 20
  },
  "data": [
    {
      "_id": "67165cf4e4b0123456789abc",
      "name": "Classic Royal Oxford Cotton Shirt",
      "slug": "classic-royal-oxford-cotton-shirt",
      "description": "Tailored from 100% long-staple combed cotton...",
      "category": {
        "_id": "67165cf4e4b0123456789aaa",
        "name": "Formal Shirts",
        "slug": "formal-shirts"
      },
      "price": 1499,
      "compareAtPrice": 1999,
      "sizes": ["M", "L", "XL", "XXL"],
      "colours": [
        { "name": "Sky Blue", "hex": "#87CEEB" },
        { "name": "Pure White", "hex": "#FFFFFF" }
      ],
      "images": [
        "/assets/images/products/oxford-shirt-1.jpg",
        "/assets/images/products/oxford-shirt-2.jpg"
      ],
      "stock": 25,
      "isFeatured": true,
      "isNewArrival": true,
      "isActive": true
    }
  ]
}
```

#### `GET /api/products/:id`
Retrieves detailed information for a single product by MongoDB ObjectId or unique slug.

- **URL Parameters:**
  - `id` (string): Valid 24-character hexadecimal ObjectId or product slug.
- **Success Status:** `200 OK`
- **Error Status:** `404 Not Found` if product is not found or inactive; `400 Bad Request` if ID format is invalid.

---

### 3.3 Categories API

#### `GET /api/categories`
Retrieves all active men's wear categories.

- **Success Status:** `200 OK`
- **Response Body Sample:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "67165cf4e4b0123456789aaa",
      "name": "Formal Shirts",
      "slug": "formal-shirts",
      "description": "Executive and occasion wear shirts in premium cottons.",
      "image": "/assets/images/categories/formal-shirts.jpg",
      "productCount": 6
    },
    {
      "_id": "67165cf4e4b0123456789aab",
      "name": "Casual Shirts & Polos",
      "slug": "casual-shirts-polos",
      "description": "Weekend essentials and smart-casual button-downs.",
      "image": "/assets/images/categories/casual-shirts.jpg",
      "productCount": 5
    }
  ]
}
```

---

### 3.4 Offers API

#### `GET /api/offers`
Retrieves promotional offers, bundle discounts, and active sales campaigns clearly tagged with demo indicators.

- **Success Status:** `200 OK`

---

### 3.5 Contact & Inquiry API

#### `POST /api/contact`
Receives customer inquiries submitted through the contact page.

- **Request Body:**
```json
{
  "name": "Ramesh Kumar",
  "phone": "9876543210",
  "email": "ramesh@example.com",
  "subject": "Size availability inquiry",
  "message": "Do you have XXL in the royal oxford shirt in stock at the Hanamkonda store?"
}
```
- **Validation Rules:**
  - `name`: String, 2-60 characters, required.
  - `phone`: String, 10 digits, required.
  - `message`: String, 10-1000 characters, required.
- **Success Status:** `201 Created`
- **Response Body:**
```json
{
  "success": true,
  "message": "Thank you! Your message has been received by MR SM Store. We will call you shortly."
}
```
