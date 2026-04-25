# 🍣 Mursu Sushi Restaurant – Backend

A scalable Node.js backend for a modern sushi restaurant application, designed with **clean architecture principles**, **domain-driven design concepts**, and **clear separation of concerns**.

---

## Overview

This backend powers both:

* Customer ordering experience
* Admin management dashboard

It is structured to simulate a **real-world production system**, including:

* Modular architecture
* Real-time order tracking
* Role-based access control

---

## 🧱 Core Project Structure

```
src/
 ├─ utils/                              # Helper utilities
 │
 ├── middleware/                        # Express middlewares
 │   ├── auth.js                        # JWT validation
 │   ├── adminOnly.js                   # Role-based access control
 │   └── errorHandler.js                # Global error handling
 │
 ├── services/                          # Business logic (application layer)
 │   ├── dish.service.js
 │   ├── order.service.js           # order creation and status flow only
 │   ├── cart.service.js
 │   ├── user.service.js            # stamp progress and all related to users
 │   ├── auth.service.js
 │   ├── tracking.service.js
 │   └── integrations/
 │       ├── hsl.service.js
 │       └── payment.service.js     # MobilePay API Orchestration
 │
 ├─ controllers/                        # Calls services, returns DTOs
 │   ├── dish.controller.js
 │   ├── order.controller.js
 │   ├── cart.controller.js
 │   ├── user.controller.js
 │   ├── auth.controller.js
 │   └── admin.controller.js
 │
 ├─ models/
 │   ├─ engine/                         # Pure domain/business rules (no DB)
 │   │   ├── ComboEngine.js             # Combo builder rules
 │   │   ├── PricingEngine.js           # Pricing, discounts, totals
 │   │   ├── DietaryEngine.js           # Dietary restrictions logic
 │   │   └── OrderEngine.js             # Order state transitions
 │   │
 │   └── database/                      # Data access layer (repositories)
 │       ├── connection.js              # MySQL pool connection
 │       ├── db.js                      # Query wrapper/helper
 │       │
 │       └── repositories/              # Grouped by domain
 │
 │           ├── dish/
 │           │   ├── dish.repository.js             # dishes table CRUD
 │           │   ├── badge.repository.js            # badges table
 │           │   ├── dishBadge.repository.js        # dish_badges relation
 │           │   ├── dailySpecial.repository.js
 │           │   └── ingredient.repository.js       # ingredients
 │
 │           ├── order/
 │           │   ├── order.repository.js            # orders
 │           │   ├── orderItem.repository.js        # order_items
 │           │   ├── orderItemIngredient.repository.js
 │           │   ├── orderStatusHistory.repository.js
 │           │   └── payment.repository.js
 │
 │           ├── cart/
 │           │   ├── cart.repository.js             # carts
 │           │   └── cartItem.repository.js         # cart_items
 │
 │           ├── user/
 │           │   ├── user.repository.js             # users
 │           │   └── reward.repository.js           # user_rewards
 │
 │           └── favorite/
 │               └── favorite.repository.js        # user_favorite_dishes
 │
 ├─ types/
 │   ├── controllers/                           # Request/Response DTOs
 │   └─  database/                              # Database row shapes
 │
 ├─ routes.js                                  # Defines API endpoints (Express routers)
 └─ server.js

tests/
├── integration/                           # Multi-layer testing (API → Services → DB)
│   ├── menu.test.js                       # Tests menu endpoints with DB
│   ├── orders.test.js                     # Tests order placement end-to-end
│   └── auth.test.js                       # Tests login/register flows

└── e2e/                                   # Full browser-like tests
    ├── comboBuilder.test.js               # Customer builds and submits a combo
    ├── checkout.test.js                   # Customer completes checkout flow
    ├── adminOrders.test.js                # Staff views and updates order status
    └── menuManagement.test.js             # Staff manages menu items

.env                                       # Secret environment variables
.env.example                               # Template of required env vars
package.json                               # Dependencies and scripts
README.md                                  # Setup instructions & architecture overview
```

---

## 🏗 Architecture Overview

```
HTTP Request
   ↓
Middleware (Auth, Validation, Errors)
   ↓
routes.js to Controllers/ (API Layer - resquest/ response handlers)
                 ↓
Service Layer (Application Orchestration Logic)
   ↓                                  ↓
Engine Layer (Domain Logic)   Repository Layer (Database)

```

---

## 🔹 Layer Breakdown

➡️ Routes are intentionally **thin** and contain no business logic.

---

### Middleware

**Responsibility:** Cross-cutting concerns

* `auth.js` → Validates JWT, attaches user to request
* `adminOnly.js` → Restricts admin endpoints
* `errorHandler.js` → Standardizes error responses

➡️ Keeps logic reusable and centralized.

---

### Service Layer (Application Orchestration Layer)

**Responsibility:** Orchestrates use-cases

* Combines domain logic + database
* Controls application flow

Examples:

* `orderService`

  * Validates combo via engine
  * Saves order via repository
  * Handles rewards

* `authService`

  * Login/register flows
  * JWT generation

➡️ This is the **orchestration layer**, not the business rules layer.

---

### 🍣 Engine Layer (Domain Logic)

**Responsibility:** Pure business rules

* No HTTP knowledge
* No database access
* Fully testable

#### Components

* `ComboEngine` → Combo validation rules
* `PricingEngine` → Pricing logic
* `DietaryEngine` → Allergen checks
* `OrderEngine` → Order state transitions

➡️ This is the **core domain model** of the system.

---

### Repository Layer (Database)

**Responsibility:** Data access only (CRUD)

* No business logic
* No validation
* No orchestration

➡️ Each file maps to a database table.

---

### Server Entry Point

**File:** `server.js`

* Registers routes & middleware
* Initializes WebSocket connections
* Starts Express server

---

## Testing Strategy

### Unit Tests

* Located in `backend/unitTests/`
* Mirrors `src/`
* Focus: Engine & isolated modules

---

### Integration Tests

```
tests/integration/
```

* Test multiple layers together
* Uses real database

---

### End-to-End Tests

```
tests/e2e/
```

Simulates real user flows:

* Customer ordering sushi
* Checkout process
* Admin managing orders

---

## Getting Started

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm run dev
```

Server runs on:

```
http://localhost:5000
```

---

## 🏗 Build & Run

```bash
npm run build
npm start
```

---

## Environment Variables

Create a `.env` file:

```
PORT=5000
DB_CONNECTION=your_database_url
JWT_SECRET=your_secret
```

Use `.env.example` as reference.

---

## Deployment

This backend can be deployed to:

* AWS (EC2 / ECS)
* Google Cloud Run
* Azure
* Railway / Fly.io
* Docker-based platforms

---

Building with ❤️ for clean code and great sushi.
