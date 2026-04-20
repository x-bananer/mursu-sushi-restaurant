# 🍣 Mursu Sushi Restaurant - Frontend

## <p> A modern, responsive sushi restaurant web application built with Vite React + React Router in js mode. Designed to simulate a real-world restaurant system with a modular, scalable component architecture.<p>

## Features

### Customer

- Browse menu
- Build custom combos
- Cart & checkout
- Order live tracker
- Optional user account for rewards and saving favorits.
- Responsive navigation (top + bottom nav)

### Admin

- Dashboard
- Live orders
- Menu editor
- Customer management
- Sidebar navigation + mobile bottom nav

---

## 🧱 Project Structure

```
app/
├── styles/
├── context/
├── services/ -> files here will match same one we will have in the backend services-controllers.
├── hooks/
├── components/
│
│   ├── shared/                # Reusable across entire app
│   │   ├── nav/               # Base navigation system
│   │   │   ├── NavBase.tsx
│   │   │   ├── BottomNavBase.tsx
│   │   │   ├── icons.tsx
│   │   │   └── nav.css
│   │   ├── loading.tsx
│   │   ├── modal.tsx
│   │   └── ...other shared UI
│
│   ├── customer/             # Customer-specific UI
│   │   ├── nav/
│   │   │   ├── NavBar.tsx
│   │   │   └── BottomNav.tsx
│   │   ├── order-tracker/
│   │   └── ... the remaining pages
│
│   └── adm/                  # Admin-specific UI
│       ├── nav/
│       │   ├── AdmNavbar.tsx
│       │   ├── AdmBottomNav.tsx
│       │   └── AdmSideNav.tsx
│       ├── live-orders/
│       ├── menu-editor/
│       ├── customers/
│       ├── reviews/
│       ├── settings/
│       └── form/
│
├── routes/                   # Route definitions split by role
│   ├── customer/
│   └── adm/
│
├── App.jsx                   # Central route configuration
└── main.jsx                  # App root

public/
```

## 📦 Tech Stack

- React
- React Router
- JavaScript
- CSS (custom, no framework)
- Vite (dev server and build tool)

## Design Decisions

- Split layouts instead of role-checking (isAdmin)
- Reusable nav components instead of duplicated HTML
- Centralized icons for consistency
- Responsive-first navigation (bottom nav on mobile)

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Division of tasks
Database is priority. Let's start with our repositories first.

- Veikka
Login page + Register page (auth + user endpoints + middleware)
auth.service.js - service
auth.controller.js - controller
user.repository.js - repository
auth.js - middleware
adminOnly.js - middleware
errorHandler.js - middleware
user.service.js - service
user.controller.js - controller

- Unna
Menu page + User profile page
dish.service.js - service
dish.controller.js - controller
dish.repository.js - repository
badge.repository.js - repository
dishBadge.repository.js - repository
dailySpecial.repository.js - repository
favorite.repository.js - repository
reward.repository.js - repository
DietaryEngine.js - engine

- Ksenia
Cart + Combo builder
cart.service.js - service
payment.service.js - service
cart.controller.js - controller
cart.repository.js - repository
cartItem.repository.js - repository
orderItemIngredient.repository.js - repository
ingredient.repository.js - repository
payment.repository.js - repository
ComboEngine.js - engine
PricingEngine.js - engine

- Luara
Admin dashboard + Order tracker
order.service.js - service
tracking.service.js - service
order.controller.js - controller
admin.controller.js - controller
order.repository.js - repository
orderItem.repository.js - repository
orderStatusHistory.repository.js - repository
OrderEngine.js - engine
hsl.service.js - integration

This is a initial proposal if you think should be different please say it, we could also add more controllers to promote more division

📌 Future Implementations

- Authentication & authorization context layer
- HTML pages refactor into modularized react components
- Backend API integration
- Real-time updates via WebSockets
- Testing (unit + integration)

---

Building with ❤️ for clean code and great sushi.
