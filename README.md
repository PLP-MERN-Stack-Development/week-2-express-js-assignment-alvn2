# 🛒 Product API - Express.js

A simple RESTful API built with Express.js to manage products. It supports CRUD operations, authentication, custom middleware, filtering, pagination, search, and statistics.

---

## 📦 Project Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory based on the `.env.example` file:

```
API_KEY=your_secret_api_key
```

### 3. Start the Server

```bash
npm run dev
```

Server runs on: `http://localhost:3000`

---

## 🔐 Authentication

Some routes require an API key. You must include the following header in your requests:

```
x-api-key: your_secret_api_key
```

---

## 📡 API Endpoints

### `GET /api/products`

* Get all products
* Supports filtering, searching, and pagination

**Query Parameters:**

* `category` - filter by category
* `search` - search by product name or description
* `page` and `limit` - pagination controls

**Example:**

```
GET /api/products?category=electronics&page=1&limit=2&search=laptop
```

**Response:**

```json
{
  "page": 1,
  "limit": 2,
  "total": 1,
  "products": [
    {
      "id": "1",
      "name": "Laptop",
      "description": "High-performance laptop with 16GB RAM",
      "price": 1200,
      "category": "electronics",
      "inStock": true
    }
  ]
}
```

---

### `GET /api/products/:id`

* Get a product by its ID

**Example:**

```
GET /api/products/1
```

---

### `POST /api/products`

* Add a new product
* **Protected route** (requires `x-api-key`)

**Request Body:**

```json
{
  "name": "Headphones",
  "description": "Noise cancelling",
  "price": 199,
  "category": "electronics",
  "inStock": true
}
```

---

### `PUT /api/products/:id`

* Update an existing product
* **Protected route** (requires `x-api-key`)

---

### `DELETE /api/products/:id`

* Delete a product
* **Protected route** (requires `x-api-key`)

---

### `GET /api/products/stats`

* Returns product counts grouped by category

**Response:**

```json
{
  "stats": {
    "electronics": 2,
    "kitchen": 1
  }
}
```

---

## 🧪 Testing with Postman

Be sure to:

* Set `Content-Type: application/json` for POST/PUT
* Include `x-api-key` header where required

---

## 📁 Project Structure

```
project-folder/
├── middleware/
│   ├── auth.js
│   ├── logger.js
│   └── validateProduct.js
├── errors/
│   └── customErrors.js
├── server.js
├── .env
├── .env.example
└── README.md
```

---
