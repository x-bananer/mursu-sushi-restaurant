# Core Project Structure

├── backend/
    ├── unitTests/                          mirrors src/ exactly — only .test.js files
    │  
    └── src/                              all NodeJs backend source code
        ├── routes/                           URL mapping and HTTP request handler — reads req, sends res - Endpoint JSON return could represent the view in MVC.
        │   ├── menuRoutes.js                 GET /api/menu · GET /api/menu/:id · POST /api/menu · PUT /api/menu/:id · DELETE /api/menu/:id
        │   ├── orderRoutes.js                GET /api/orders · GET /api/orders/:id · POST /api/orders · PUT /api/orders/:id/status · DELETE /api/orders/:id
        │   └── authRoutes.js                 POST /api/auth/login · POST /api/auth/register · POST /api/auth/logout 
        │
        ├── middleware/                     functions that run between HTTP request and route handler
        │   ├── auth.js                       validates JWT token, attaches user to req, blocks unauthorised requests
        │   ├── adminOnly.js                  checks req.user.role === admin, blocks non-adm from admin endpoints
        │   └── errorHandler.js               catches all unhandled errors, formats consistent JSON error response
        │
        ├── model/  
        ├── engine/                          Domain Model sushi domain logic — knows nothing about HTTP or SQL - Model in MVC - engine defines the rules used in the controllers.
        │   ├── SushiEngine.js                 facade — sole public interface to the engine layer  [Facade pattern for ComboEngine + PricingEngine + DietaryEngine and OrderEngine.]
        │   ├── ComboEngine.js                 validates combo selections — base required, 1-3 proteins, max 4 toppings, hot+salad rule
        │   ├── PricingEngine.js               calculates set price — base price + protein extras + day-of-week discounts
        │   ├── DietaryEngine.js               cross-checks selections against allergen and dietary restriction rules
        │   └── OrderEngine                 order rules (state transitions)
        ├── database/                        Repository layer pure CRUD — no business logic, no HTTP
        │   ├── connection.js                  creates and exports the SQL connection pool used by all query files
        │   └── queries/                     one file per table — each file is pure CRUD, no business decisions
        │       ├── menuQueries.js             SELECT INSERT UPDATE DELETE for menu_items table
        │       ├── orderQueries.js            SELECT INSERT UPDATE DELETE for orders table
        │       └── userQueries.js             SELECT INSERT UPDATE DELETE for users table including its rewards
        │
        ├── services-controller/                        Application Service layer orchestrates engine and database — no SQL, no HTTP - services drive the flow, most symilar layer in MVC would be the controllers.
        │   ├── orderService.js                validate combo via SushiEngine → save via queries - emit order.placed via EventBus, tell if reward shall be given or not (DB query).
        │   ├── menuService.js                 orchestrates menu CRUD operations using menuQueries
        │   ├── authService.js                 login flow, register flow, JWT generation and refresh
        │   └── trackingService.js             manages live order state, calculates distances, pushes via WebSocket
triggers rewards
        │
        ├── restaurantMechanics.js           orchastrate runtime mechanics: queue + state machine + events - Keeps runtime workflow separate from pure business rules.
        └── server.js                        entry point — registers all routes, middleware, WebSocket, starts Express on port 5000

├── tests/                                 (cross-layer automated tests)
│   ├── integration/                       (tests that verify multiple layers working together)
│   │   ├── menu.test.js                   (tests menu API endpoints with real database)
│   │   ├── orders.test.js                 (tests order placement through full backend stack)
│   │   └── auth.test.js                   (tests login and register flow end to end)
│   │
│   └── e2e/                               (tests that drive a real browser like a real user)
│       ├── comboBuilder.test.js           (customer builds and submits a combo)
│       ├── checkout.test.js               (customer completes full order flow)
│       ├── adminOrders.test.js            (staff views and updates order status)
│       └── menuManagement.test.js         (staff adds and edits menu items)
│
│
├── .env                                   (secret config, DB password, JWT secret, HSL key)
├── .env.example                           (safe template showing which env vars are needed)
├── .gitignore                             (tells git to ignore node_modules, .env, build/)
├── package.json                           (project dependencies and npm scripts)
└── README.md                              (setup instructions, architecture explanation)