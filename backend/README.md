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
* Event-driven workflows

---

## 🧱 Core Project Structure

```
backend/
├── unitTests/                             # Mirrors src/ for unit tests

└── src/
    ├── routes/                            # URL mapping and HTTP request handler
    │   ├── menuRoutes.js                  # Routes for menu CRUD operations
    │   ├── orderRoutes.js                 # Routes for order CRUD & status updates
    │   └── authRoutes.js                  # Routes for login, register, logout

    ├── middleware/                        # Functions that run between HTTP request and route handler
    │   ├── auth.js                        # JWT validation and user attach
    │   ├── adminOnly.js                   # Restrict access to admin endpoints
    │   └── errorHandler.js                # Catch and format errors consistently

    ├── model/
    │   ├── engine/                        # Pure business/domain logic
    │   │   ├── SushiEngine.js             # Facade to all domain engines
    │   │   ├── ComboEngine.js             # Validates combo rules (proteins, toppings)
    │   │   ├── PricingEngine.js           # Calculates price including discounts
    │   │   ├── DietaryEngine.js           # Checks allergen/diet restrictions
    │   │   └── OrderEngine.js             # Handles order state transitions

    │   └── database/                      # Repository layer (pure CRUD)
    │       ├── connection.js              # Creates and exports MySQL connection pool
    │       └── queries/
    │           ├── menuQueries.js         # CRUD for menu_items table
    │           ├── orderQueries.js        # CRUD for orders table
    │           └── userQueries.js         # CRUD for users table & rewards

    ├── services-controllers/              # Application service layer
    │   ├── orderService.js                # Orchestrates order creation & rewards
    │   ├── menuService.js                 # Handles menu CRUD operations via queries
    │   ├── authService.js                 # Login, registration, JWT handling
    │   └── trackingService.js             # Manages live order tracking & events
    │   └── integrations/                  # HSL and Mobilepay

    ├── restaurantMechanics.js             # Runtime orchestration: queue, events, state machine
    └── server.js                          # Entry point: register middleware, routes, start server

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
Routes (API Layer)
   ↓
Service Layer (Application Orchestration Logic) -> Middleware (Auth, Validation, Errors)
   ↓                                  ↓
Engine Layer (Domain Logic)   Repository Layer (Database)
                                      ↓
                                   Database
```

---

## 🔹 Layer Breakdown

### Routes (API Layer)

**Responsibility:** Handle HTTP requests and responses

* Parse request (`req`)
* Call service layer
* Return JSON response

Example endpoints:

```
GET    /api/menu
POST   /api/orders
POST   /api/auth/login
```

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
* Emits events and triggers side effects

Examples:

* `orderService`

  * Validates combo via engine
  * Saves order via repository
  * Emits `order.placed`
  * Handles rewards logic

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

* `SushiEngine` → Facade entry point
* `ComboEngine` → Combo validation rules
* `PricingEngine` → Pricing logic
* `DietaryEngine` → Allergen checks
* `OrderEngine` → Order state transitions

➡️ This is the **core domain model** of the system.

---

### Repository Layer (Database)

**Responsibility:** Data access only (CRUD)

```
queries/
├── menuQueries.js
├── orderQueries.js
└── userQueries.js
```

* No business logic
* No validation
* No orchestration

➡️ Each file maps to a database table.

---

### Runtime Mechanics

**File:** `restaurantMechanics.js`

Handles:

* Order queue
* State machine execution
* Event-driven workflows

➡️ Separates **runtime behavior** from **business rules**.

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

## Design Principles

### 1. Separation of Concerns

Each layer has a single responsibility:

* Routes → HTTP
* Services → orchestration
* Engine → business logic
* Repository → data

---

### 2. Dependency Direction

```
Routes → Services → Engine → Repository
```

Never:

* Engine → Database ❌
* Routes → Database ❌

---

### 3. Facade Pattern

`SushiEngine` provides a simplified interface:

```js
SushiEngine.validateCombo()
SushiEngine.calculatePrice()
```

---

### 4. Event-Driven Design

* Events like `order.placed`
* Reward triggers
* WebSocket-based live updates

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
